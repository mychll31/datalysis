from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import h2o
from h2o.automl import H2OAutoML
import pandas as pd
import numpy as np
import logging
import json
import requests
from scipy.stats import pearsonr, pointbiserialr, f_oneway
from collections import defaultdict
from scipy import stats
from urllib.parse import urlparse

# Initialize H2O
h2o.init()

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def load_data(file_obj, file_type):
    """Load data from either CSV or JSON source"""
    try:
        if file_type == 'csv':
            file_path = default_storage.save("temp.csv", file_obj)
            data = h2o.import_file(file_path)
            df = data.as_data_frame()
            default_storage.delete(file_path)
            return df
        elif file_type == 'json':
            if hasattr(file_obj, 'read'):  # File upload
                json_data = json.load(file_obj)
            else:  # JSON string
                json_data = json.loads(file_obj)
            return pd.DataFrame(json_data)
        return None
    except Exception as e:
        logging.error(f"Error loading {file_type} data: {str(e)}")
        raise

def process_pie_chart(df, target_column):
    """Process data for pie chart visualization"""
    if target_column not in df.columns:
        raise ValueError(f"Column '{target_column}' not found")
    
    col = df[target_column]
    value_counts = col.value_counts().to_dict()
    
    return {
        'labels': list(value_counts.keys()),
        'values': list(value_counts.values())
    }

@csrf_exempt
def analyze_data(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        # 1. Validate input
        data_source = None
        file_type = None
        output_type = request.POST.get('output_type', 'relationship').strip()
        
        # Check for file upload
        if 'file' in request.FILES:
            file_obj = request.FILES['file']
            if file_obj.name.lower().endswith('.csv'):
                file_type = 'csv'
            elif file_obj.name.lower().endswith('.json'):
                file_type = 'json'
            else:
                return JsonResponse({'error': 'Unsupported file type. Please upload CSV or JSON'}, status=400)
            data_source = file_obj
            
        # Check for JSON URL
        elif 'json_url' in request.POST:
            url = request.POST['json_url'].strip()
            if not is_valid_url(url):
                return JsonResponse({'error': 'Invalid URL provided'}, status=400)
            try:
                response = requests.get(url)
                response.raise_for_status()
                data_source = response.text
                file_type = 'json'
            except requests.RequestException as e:
                return JsonResponse({'error': f'Failed to fetch JSON from URL: {str(e)}'}, status=400)
                
        # Check for direct JSON data
        elif 'json_data' in request.POST:
            data_source = request.POST['json_data']
            file_type = 'json'
            
        else:
            return JsonResponse({'error': 'No data source provided. Please upload a file, provide JSON URL, or paste JSON data'}, status=400)

        target_column1 = request.POST.get('target_column1', '').strip()
        target_column2 = request.POST.get('target_column2', '').strip()
        
        # 2. Validate columns based on output type
        if output_type == 'pie':
            if not target_column1:
                return JsonResponse({'error': 'Target column must be specified for pie chart'}, status=400)
        else:
            if not target_column1 or not target_column2:
                return JsonResponse({'error': 'Both target columns must be specified'}, status=400)

        # 3. Process data
        df = load_data(data_source, file_type)
        if df is None:
            return JsonResponse({'error': 'Failed to process data'}, status=400)

        # 4. Handle different output types
        if output_type == 'pie':
            # Pie chart processing
            if target_column1 not in df.columns:
                return JsonResponse({
                    'error': f'Column "{target_column1}" not found. Available: {list(df.columns)}'
                }, status=400)
            
            pie_data = process_pie_chart(df, target_column1)
            col = df[target_column1]
            is_numeric = pd.api.types.is_numeric_dtype(col)
            
            response = {
                'status': 'success',
                'data_source_type': file_type,
                'output_type': 'pie',
                'plot_data': pie_data,
                'column_names': [target_column1],
                'column_stats': {
                    target_column1: {
                        'type': 'numeric' if is_numeric else 'categorical',
                        'unique_values': int(col.nunique()),
                        'null_count': int(col.isnull().sum())
                    }
                }
            }
            
            return JsonResponse(response)
        
        # Original relationship analysis for other output types
        # Validate columns exist
        for col in [target_column1, target_column2]:
            if col not in df.columns:
                return JsonResponse({
                    'error': f'Column "{col}" not found. Available: {list(df.columns)}'
                }, status=400)

        # Prepare columns and determine types
        col1 = pd.to_numeric(df[target_column1], errors='ignore')
        col2 = pd.to_numeric(df[target_column2], errors='ignore')
        
        col1_numeric = pd.api.types.is_numeric_dtype(col1)
        col2_numeric = pd.api.types.is_numeric_dtype(col2)

        relationship_type = (
            "numeric-numeric" if col1_numeric and col2_numeric else
            "numeric-categorical" if col1_numeric else
            "categorical-numeric" if col2_numeric else
            "categorical-categorical"
        )

        # Initialize response structure
        plot_data = {
            'x': [],
            'y': [],
            'predicted': None,
            'confidence_interval': None,
            'group_means': None
        }
        correlation = None
        stats_results = None
        model_perf = None

        # Handle each relationship type
        if relationship_type == "numeric-numeric":
            valid_mask = col1.notna() & col2.notna()
            if sum(valid_mask) > 1:
                correlation = pearsonr(col1[valid_mask], col2[valid_mask])[0]
            
            train_frame = h2o.H2OFrame(df[[target_column1, target_column2]].dropna())
            
            if abs(correlation) < 0.3:
                train_frame['x_squared'] = train_frame[target_column1]**2
                features = [target_column1, 'x_squared']
            else:
                features = [target_column1]
            
            aml = H2OAutoML(
                max_models=3, 
                seed=42, 
                max_runtime_secs=30,
                stopping_metric="RMSE",
                stopping_tolerance=0.01
            )
            aml.train(x=features, y=target_column2, training_frame=train_frame)
            
            preds = aml.leader.predict(train_frame)
            preds_df = preds.as_data_frame()
            
            residuals = col2[valid_mask] - preds_df['predict']
            std_err = np.std(residuals)
            ci = 1.96 * std_err
            
            plot_data = {
                'x': col1.tolist(),
                'y': col2.tolist(),
                'predicted': preds_df['predict'].tolist(),
                'confidence_interval': {
                    'upper': (preds_df['predict'] + ci).tolist(),
                    'lower': (preds_df['predict'] - ci).tolist()
                }
            }
            
            model_perf = {
                'model_type': str(aml.leader),
                'r2': aml.leader.r2(),
                'rmse': aml.leader.rmse(),
                'mae': aml.leader.mae()
            }

        elif relationship_type == "numeric-categorical":
            categories = col2.astype(str)
            valid_mask = col1.notna() & categories.notna()
            
            if sum(valid_mask) > 1:
                unique_cats = categories[valid_mask].nunique()
                if unique_cats == 2:
                    cat_codes = pd.factorize(categories[valid_mask])[0]
                    correlation = pointbiserialr(col1[valid_mask], cat_codes)[0]
                elif unique_cats > 2:
                    groups = defaultdict(list)
                    for cat, num in zip(categories[valid_mask], col1[valid_mask]):
                        groups[cat].append(num)
                    
                    f_val, p_val = f_oneway(*groups.values())
                    stats_results = {
                        'anova': {
                            'f_statistic': f_val,
                            'p_value': p_val,
                            'effect_size': np.sqrt(f_val/(f_val + (len(col1[valid_mask]) - len(groups))))
                        }
                    }
            
            group_means = col1.groupby(categories).mean().to_dict()
            plot_data = {
                'x': categories.tolist(),
                'y': col1.tolist(),
                'group_means': group_means
            }

        elif relationship_type == "categorical-numeric":
            categories = col1.astype(str)
            valid_mask = col2.notna() & categories.notna()
            
            if sum(valid_mask) > 1:
                unique_cats = categories[valid_mask].nunique()
                if unique_cats == 2:
                    cat_codes = pd.factorize(categories[valid_mask])[0]
                    correlation = pointbiserialr(col2[valid_mask], cat_codes)[0]
                elif unique_cats > 2:
                    groups = defaultdict(list)
                    for cat, num in zip(categories[valid_mask], col2[valid_mask]):
                        groups[cat].append(num)
                    
                    f_val, p_val = f_oneway(*groups.values())
                    stats_results = {
                        'anova': {
                            'f_statistic': f_val,
                            'p_value': p_val,
                            'effect_size': np.sqrt(f_val/(f_val + (len(col2[valid_mask]) - len(groups))))
                        }
                    }
            
            group_means = col2.groupby(categories).mean().to_dict()
            plot_data = {
                'x': categories.tolist(),
                'y': col2.tolist(),
                'group_means': group_means
            }

        else:  # categorical-categorical
            from scipy.stats import chi2_contingency
            contingency = pd.crosstab(col1.astype(str), col2.astype(str))
            if contingency.size > 0:
                chi2, p, dof, _ = chi2_contingency(contingency)
                stats_results = {
                    'chi_square': {
                        'statistic': chi2,
                        'p_value': p,
                        'degrees_of_freedom': dof
                    }
                }
            
            plot_data = {
                'x': col1.astype(str).tolist(),
                'y': col2.astype(str).tolist()
            }

        # Build final response for relationship charts
        response = {
            'status': 'success',
            'data_source_type': file_type,
            'output_type': output_type,
            'relationship_type': relationship_type,
            'correlation': correlation,
            'plot_data': plot_data,
            'column_names': [target_column1, target_column2],
            'column_stats': {
                target_column1: {
                    'type': 'numeric' if col1_numeric else 'categorical',
                    'unique_values': int(col1.nunique()),
                    'null_count': int(col1.isnull().sum())
                },
                target_column2: {
                    'type': 'numeric' if col2_numeric else 'categorical',
                    'unique_values': int(col2.nunique()),
                    'null_count': int(col2.isnull().sum())
                }
            },
            'statistical_tests': stats_results,
            'model_performance': model_perf
        }

        return JsonResponse(response)

    except Exception as e:
        logging.exception("Processing error")
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def upload_csv(request):
    """Legacy endpoint that forwards to analyze_data"""
    return analyze_data(request)