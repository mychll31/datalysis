import * as htmlToImage from 'html-to-image';
const API_BASE_URL = "https://datalysis.onrender.com";
console.log("ALL ENV:", import.meta.env);
console.log("API base URL:", API_BASE_URL)
// Helper function to convert data URL to blob
const dataURLtoBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

export const handleGeneratePDF = async (chartElements, companyName, csvMetaData = {}) => {
  console.log("Generating PDF with:", {
    charts: chartElements.length,
    csvMetaData
  });
  
  
  // 1. Validate input
  if (!chartElements || chartElements.length === 0) {
    const errorMsg = "No charts available for PDF generation";
    console.error(errorMsg);
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    // Process all chart elements
    const chartImages = [];
    
    for (const [index, chartElement] of chartElements.entries()) {
      // Skip if element is invalid or not in DOM
      if (!chartElement || !document.body.contains(chartElement)) {
        console.warn(`Skipping chart ${index} - invalid or not in DOM`);
        continue;
      }

      try {
        // Convert chart to image
        const dataUrl = await htmlToImage.toPng(chartElement, {
          quality: 1,
          pixelRatio: 3,
          backgroundColor: '#ffffff',
          style: {
            padding: '20px', // Add padding for better appearance
            borderRadius: '8px'
          }
        });
        chartImages.push(dataUrl);
      } catch (error) {
        console.error(`Error converting chart ${index} to image:`, error);
        continue;
      }
    }

    if (chartImages.length === 0) {
      throw new Error("No valid charts were converted to images");
    }

    // Prepare form data with all charts
    const formData = new FormData();
    
    chartImages.forEach((imgData, index) => {
      const blob = dataURLtoBlob(imgData);
      formData.append(`chart_${index}`, blob, `chart_${index}.png`);
    });
    
    formData.append('companyName', companyName);
    formData.append('chartCount', chartImages.length.toString());

    //Metadata for CSV
    formData.append('fileName', csvMetaData.fileName || 'data.csv');
    formData.append('fileType', 'CSV');
    formData.append('rowsCount', csvMetaData.rowCount?.toString() || '0');
    formData.append('columnsCount', csvMetaData.columnCount?.toString() || '0');
    formData.append('dataPointsCount', 
      (csvMetaData.rowCount * csvMetaData.columnCount)?.toString() || '0');
    
    if (csvMetaData.columnNames) {
      formData.append('columnNames', 
        Array.isArray(csvMetaData.columnNames) 
          ? csvMetaData.columnNames.join(',') 
          : csvMetaData.columnNames);
    }

    // 3. Send to backend
    const response = await fetch(`${API_BASE_URL}/api/pdf/generate-report/`, {
      method: "POST",
      body: formData
    });

    // 4. Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "PDF generation failed");
    }

    // 5. Get the PDF blob directly
    const pdfBlob = await response.blob();
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // 6. Create and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${companyName.replace(/\s+/g, '_')}_report_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();

    // 7. Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    }, 100);

    return { success: true, url: pdfUrl };

  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert(error.message || "Failed to generate PDF"); 
    return { success: false, error: error.message };
  }
};