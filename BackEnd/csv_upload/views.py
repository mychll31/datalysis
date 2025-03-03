from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

@csrf_exempt
def upload_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES['file']
        if not csv_file:
            return JsonResponse({'Error': 'No file upload'}, status=400)
        
        try:
            df = pd.read_csv(csv_file)
              #this is just a sample it should not return anything in the inspect mode 
            richest_country = df['Company Name'].max() if 'Company Name' in df.columns else None
            return JsonResponse({
                'riches_country': richest_country,
                'message': 'File processed successfully'
            }) #this is just a sample it should not return anything in the inspect mode 
        except Exception as e:
            return JsonResponse({'error': str(e)} , status=400)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)