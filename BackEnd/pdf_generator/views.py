import os
import time
import threading
from PIL import Image
from django.http import JsonResponse, FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageTemplate, Frame, Image as PlatypusImage
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
            
# Custom canvas for adding watermark and page number
class DetailForCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_watermark()
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_watermark(self):
        self.setFillColorRGB(0.5, 0.5, 0.5, alpha=0.5)
        self.setFont("Helvetica-Bold", 60)
        self.saveState()
        self.translate(100 * mm, 150 * mm)
        self.rotate(30)
        self.drawCentredString(0, 0, "DATALYSIS")
        self.restoreState()

    def draw_page_number(self, page_count):
        self.setFont("Helvetica", 8)
        self.setFillColorRGB(0.5, 0.5, 0.5, alpha=1)
        footer_text = f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}"
        self.drawString(20 * mm, 10 * mm, footer_text)
        page_num = self.getPageNumber()
        page_info = f"Page {page_num} of {page_count}"
        self.drawRightString(190 * mm, 10 * mm, page_info)

@csrf_exempt
def pdf_generator_view(request):
    # Debug logging
    print("\n=== PDF GENERATION REQUEST ===")
    print("Method:", request.method)
    print("Content-Type:", request.content_type)
    print("POST data:", dict(request.POST))
    print("FILES data:", dict(request.FILES))

    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    try:
        # Extract and validate data
        company_name = request.POST.get('companyName', 'Unnamed_Report')
        chart_count = int(request.POST.get('chartCount', 0))
        calculations = request.POST.get('calculations', request.POST.get('calculation'))  # Handle both field names
        variables = request.POST.get('variables', request.POST.get('variable'))  # Handle both field names
        
        # Debug logging
        print(f"Company: {company_name} | Charts: {chart_count} | Calculations: {bool(calculations)}")

        # Validate at least one content type exists
        if chart_count == 0 and not calculations:
            error_msg = "No content provided (neither charts nor calculations)"
            print(error_msg)
            return JsonResponse({'error': error_msg}, status=400)

        # Extract CSV metadata
        csv_metadata = {
            'file_name': request.POST.get('fileName', ''),
            'rows': request.POST.get('rowsCount', ''),
            'columns': request.POST.get('columnsCount', ''),
            'data_points': request.POST.get('dataPointsCount', ''),
        }
        print("CSV Metadata:", csv_metadata)

        # PDF Setup
        timestamp = int(time.time())
        pdf_filename = f"{company_name.replace(' ', '_')}_{timestamp}.pdf"
        pdf_path = os.path.join(settings.PDF_TEMP_ROOT, pdf_filename)
        
        doc = SimpleDocTemplate(
            pdf_path, 
            pagesize=A4, 
            leftMargin=20*mm, 
            rightMargin=20*mm, 
            topMargin=20*mm, 
            bottomMargin=25*mm
        )
        styles = getSampleStyleSheet()
        normal_style = styles['Normal']
        title_style = styles['Title']
        heading2_style = styles['Heading2']
        heading3_style = styles['Heading3']
            
        center_style = normal_style.clone('CenterStyle')
        center_style.alignment = 1  

        story = []

        # ===== HEADER SECTION =====
        story.append(Paragraph(company_name, title_style))
        story.append(Spacer(1, 12))
        
        # Dynamic subtitle based on content
        subtitle = "Data Analysis Report"
        if calculations and chart_count == 0:
            subtitle = "Calculations Report"

        elif calculations and chart_count > 0:
            subtitle = "Full Analysis Report"
        story.append(Paragraph(subtitle, heading2_style))
        story.append(Spacer(1, 24))

        # ===== DATASET INFORMATION =====
        if csv_metadata['file_name']:  # Only show if we have file info
            story.append(Paragraph("Dataset Information", heading2_style))
            story.append(Spacer(1, 12))
            
            dataset_info = [
                ["File Name", "Total Rows", "Total Columns", "Total Data Points"],
                [
                    csv_metadata['file_name'],
                    str(csv_metadata['rows']),
                    str(csv_metadata['columns']),
                    str(csv_metadata['data_points'])
                ]
            ]
            
            dataset_table = Table(dataset_info, colWidths=[45*mm] * 4)
            dataset_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LINEBELOW', (0, 0), (-1, 0), 1, colors.grey),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ('PADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(dataset_table)
            story.append(Spacer(1, 24))

        # ===== CALCULATIONS SECTION =====
        if calculations or variables != '[]':
            try:
                # Combine both calculations and variables into one section
                story.append(Paragraph("Calculations", heading2_style))
                story.append(Spacer(1, 12))
                
                # First process saved variables (if any)
                if variables and variables != '[]':
                    vars_data = json.loads(variables)
                    print(f"Processing {len(vars_data)} variables")
                    
                    for var in vars_data:
                        value = var.get('value', '')
                        if isinstance(value, list):
                            value = ', '.join(map(str, value))
                        elif isinstance(value, (int, float)):
                            value = f"{value:.2f}" if isinstance(value, float) else str(value)
                        
                        # Format variable as a calculation-like entry
                        story.append(Paragraph(f"<b>Variable:</b> {var.get('name', '')} = {value}", styles['Normal']))
                        story.append(Paragraph(f"<i>From column: {var.get('column', '')} ({var.get('type', '')})</i>", styles['Italic']))
                        story.append(Spacer(1, 12))
                
                # Then process actual calculations (if any)
                if calculations:
                    calc_data = json.loads(calculations)
                    print(f"Processing {len(calc_data)} calculations")
                    
                    for calc in calc_data:
                        # Formula
                        formula_text = f"<b>Formula:</b> {calc.get('formula', '')}"
                        story.append(Paragraph(formula_text, styles['Normal']))
                        
                        # Result with formatting
                        result = calc.get('result', '')
                        if isinstance(result, (int, float)):
                            result = f"{result:.2f}" if isinstance(result, float) else str(result)
                        story.append(Paragraph(f"<b>Result:</b> {result}", styles['Normal']))
                        
                        # Timestamp
                        story.append(Paragraph(f"<i>Calculated at: {calc.get('timestamp', '')}</i>", styles['Italic']))
                        story.append(Spacer(1, 12))
                
                story.append(Spacer(1, 24))
                
            except json.JSONDecodeError as e:
                print(f"Error parsing data: {str(e)}")
                story.append(Paragraph("Error: Could not process calculations/variables", styles['Normal']))
                story.append(Spacer(1, 24))

        # ===== CHARTS SECTION =====
        if chart_count > 0:
            print(f"Processing {chart_count} charts")

            # Summary Section
            story.append(Paragraph("Analysis Summary", heading2_style))
            story.append(Spacer(1, 12))
            
            # Dynamic summary based on the data
            summary_text = f"""
            This report analyzes the dataset containing {csv_metadata['rows']} records with {csv_metadata['columns']} variables. 
            The analysis includes {chart_count} visualizations showing key relationships and patterns in the data.
            """
            story.append(Paragraph(summary_text, normal_style))
            story.append(Spacer(1, 24))

            story.append(Paragraph("Data Visualizations", styles['Heading2']))
            story.append(Spacer(1, 12))
            
            processed_charts = 0
            for i in range(chart_count):
                chart_file = request.FILES.get(f'chart_{i}')
                if not chart_file:
                    print(f"Chart {i} not found in files")
                    continue

                try:
                    # Save temporary image
                    image_filename = f"chart_{i}_{timestamp}.png"
                    image_path = os.path.join(settings.IMAGE_TEMP_ROOT, image_filename)
                    
                    with open(image_path, 'wb+') as destination:
                        for chunk in chart_file.chunks():
                            destination.write(chunk)

                    # Add to PDF
                    chart_title = request.POST.get(f'chartTitle_{i}', f'Chart {i+1}')
                    story.append(Paragraph(chart_title, styles['Heading3']))
                    story.append(Spacer(1, 8))
                    
                    img = PlatypusImage(image_path)
                    img_width, img_height = Image.open(image_path).size
                    
                    # Scale to fit page
                    available_width = A4[0] - 40 * mm
                    available_height = A4[1] - 80 * mm
                    scale = min(available_width / img_width, available_height / img_height)
                    
                    img.drawHeight = img_height * scale
                    img.drawWidth = img_width * scale
                    story.append(img)
                    story.append(Spacer(1, 24))
                    
                    # Add insights if available
                    chart_insights = request.POST.get(f'chartInsights_{i}', '')
                    if chart_insights:
                        story.append(Paragraph("Key Insights:", styles['Normal']))
                        story.append(Spacer(1, 4))
                        story.append(Paragraph(chart_insights, styles['Normal']))
                        story.append(Spacer(1, 24))
                    
                    # Schedule cleanup
                    delete_temp_file(image_path, delay=60)
                    processed_charts += 1
                    
                except Exception as e:
                    print(f"Error processing chart {i}: {str(e)}")
                    continue
            
            print(f"Successfully processed {processed_charts}/{chart_count} charts")

        # ===== BUILD PDF =====
        print("Building PDF document...")
        doc.build(story, canvasmaker=DetailForCanvas)
        delete_temp_file(pdf_path, delay=60)
        print("PDF generation successful!")
        
        return FileResponse(
            open(pdf_path, 'rb'),
            as_attachment=True,
            filename=pdf_filename,
            headers={
                'X-PDF-URL': f'/pdfmedia/{pdf_filename}',
                'X-Filename': pdf_filename
            }
        )

    except Exception as e:
        print(f"PDF generation failed: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    

#function to delete temp files after a delay
def delete_temp_file(file_path, delay=60): #1 mins to delete the file NO FOR PRODUCTION
    def delete_file():
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")
    threading.Timer(delay, delete_file).start()