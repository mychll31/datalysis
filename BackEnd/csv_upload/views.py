from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

import h2o
from h2o.automl import H2OAutoML
from h2o.exceptions import H2OStartupError

import pandas as pd
import numpy as np
import logging
import json
import requests
from scipy.stats import pearsonr, pointbiserialr, f_oneway, chi2_contingency
from collections import defaultdict
from urllib.parse import urlparse


def ensure_h2o():
    """
    Initialize H2O only when needed.
    Raises H2OStartupError if Java/JRE is missing.
    """
    try:
        # If a cluster is already running, this returns True
        if not h2o.cluster().is_running():
            h2o.init()
    except Exception:
        # Try one more time, then bubble up startup errors
        try:
            h2o.init()
        except H2OStartupError as e:
            logging.error(f"H2O failed to start: {e}")
            raise


def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def load_data(file_obj, file_type):
    """
    Load data from either a CSV upload or JSON (upload/string).
    Returns a pandas.DataFrame.
    """
    try:
        if file_type == 'csv':
            # Save temp file to default storage
            file_path = default_storage.save("temp.csv", file_obj)
            h2o_frame = h2o.import_file(file_path)
            df = h2o_frame.as_data_frame()
            default_storage.delete(file_path)
            return df

        elif file_type == 'json':
            # Uploaded file-like or a raw JSON string
            if hasattr(file_obj, 'read'):
                json_data = json.load(file_obj)
            else:
                json_data = json.loads(file_obj)
            return pd.DataFrame(json_data)

        return None

    except Exception as e:
        logging.error(f"Error loading {file_type} data: {e}")
        raise


def process_pie_chart(df, target_column):
    """
    Build label/value dict for a pie chart on a single column.
    """
    if target_column not in df.columns:
        raise ValueError(f"Column '{target_column}' not found")

    col = df[target_column]
    counts = col.value_counts().to_dict()
    return {
        'labels': list(counts.keys()),
        'values': list(counts.values())
    }


@csrf_exempt
def analyze_data(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    # Ensure H2O cluster is up (or return clean JSON error)
    try:
        ensure_h2o()
    except H2OStartupError:
        return JsonResponse(
            {'error': 'Server mis-configured: could not start H2O (Java missing?)'},
            status=500
        )

    try:
        # 1. Determine data source
        file_type = None
        data_source = None
        output_type = request.POST.get('output_type', 'relationship').strip()

        if 'file' in request.FILES:
            f = request.FILES['file']
            if f.name.lower().endswith('.csv'):
                file_type = 'csv'
            elif f.name.lower().endswith('.json'):
                file_type = 'json'
            else:
                return JsonResponse({'error': 'Unsupported file type. Use CSV or JSON.'}, status=400)
            data_source = f

        elif 'json_url' in request.POST:
            url = request.POST['json_url'].strip()
            if not is_valid_url(url):
                return JsonResponse({'error': 'Invalid URL provided'}, status=400)
            resp = requests.get(url)
            resp.raise_for_status()
            data_source = resp.text
            file_type = 'json'

        elif 'json_data' in request.POST:
            data_source = request.POST['json_data']
            file_type = 'json'
        else:
            return JsonResponse({
                'error': 'No data source provided. Upload file, JSON URL, or JSON data.'
            }, status=400)

        # 2. Validate required form fields
        col1 = request.POST.get('target_column1', '').strip()
        col2 = request.POST.get('target_column2', '').strip()
        if output_type == 'pie' and not col1:
            return JsonResponse({'error': 'Must specify target_column1 for pie chart'}, status=400)
        if output_type != 'pie' and (not col1 or not col2):
            return JsonResponse({'error': 'Must specify both target columns'}, status=400)

        # 3. Load into pandas DataFrame
        df = load_data(data_source, file_type)
        if df is None:
            return JsonResponse({'error': 'Failed to load data'}, status=400)

        # 4. Pie chart logic
        if output_type == 'pie':
            if col1 not in df.columns:
                return JsonResponse({
                    'error': f'Column "{col1}" not found. Available: {list(df.columns)}'
                }, status=400)

            pie = process_pie_chart(df, col1)
            series = df[col1]
            is_num = pd.api.types.is_numeric_dtype(series)

            return JsonResponse({
                'status': 'success',
                'data_source_type': file_type,
                'output_type': 'pie',
                'plot_data': pie,
                'column_names': [col1],
                'column_stats': {
                    col1: {
                        'type': 'numeric' if is_num else 'categorical',
                        'unique_values': int(series.nunique()),
                        'null_count': int(series.isnull().sum())
                    }
                }
            })

        # 5. Relationship analysis
        for c in [col1, col2]:
            if c not in df.columns:
                return JsonResponse({
                    'error': f'Column "{c}" not found. Available: {list(df.columns)}'
                }, status=400)

        s1 = pd.to_numeric(df[col1], errors='ignore')
        s2 = pd.to_numeric(df[col2], errors='ignore')
        n1 = pd.api.types.is_numeric_dtype(s1)
        n2 = pd.api.types.is_numeric_dtype(s2)

        rel_type = (
            "numeric-numeric" if n1 and n2 else
            "numeric-categorical" if n1 else
            "categorical-numeric" if n2 else
            "categorical-categorical"
        )

        plot_data = {'x': [], 'y': [], 'predicted': None, 'confidence_interval': None, 'group_means': None}
        correlation = None
        stats_res = None
        model_perf = None

        # -- Numeric vs Numeric
        if rel_type == "numeric-numeric":
            mask = s1.notna() & s2.notna()
            if mask.sum() > 1:
                correlation = pearsonr(s1[mask], s2[mask])[0]

            hf = h2o.H2OFrame(df[[col1, col2]].dropna())
            # feature engineering if low correlation
            features = [col1]
            if abs(correlation or 0) < 0.3:
                hf['x2'] = hf[col1] ** 2
                features.append('x2')

            aml = H2OAutoML(max_models=3, seed=42, max_runtime_secs=30,
                            stopping_metric="RMSE", stopping_tolerance=0.01)
            aml.train(x=features, y=col2, training_frame=hf)

            preds = aml.leader.predict(hf).as_data_frame()['predict']
            residuals = s2[mask] - preds
            se = np.std(residuals)
            ci = 1.96 * se

            plot_data = {
                'x': s1.tolist(),
                'y': s2.tolist(),
                'predicted': preds.tolist(),
                'confidence_interval': {
                    'upper': (preds + ci).tolist(),
                    'lower': (preds - ci).tolist()
                }
            }

            model_perf = {
                'model_type': str(aml.leader),
                'r2': aml.leader.r2(),
                'rmse': aml.leader.rmse(),
                'mae': aml.leader.mae()
            }

        # -- Numeric vs Categorical
        elif rel_type == "numeric-categorical":
            cats = s2.astype(str)
            mask = s1.notna() & cats.notna()
            if mask.sum() > 1:
                uc = cats[mask].nunique()
                if uc == 2:
                    codes = pd.factorize(cats[mask])[0]
                    correlation = pointbiserialr(s1[mask], codes)[0]
                elif uc > 2:
                    groups = defaultdict(list)
                    for cat, val in zip(cats[mask], s1[mask]):
                        groups[cat].append(val)
                    f, p = f_oneway(*groups.values())
                    stats_res = {
                        'anova': {'f_statistic': f, 'p_value': p,
                                  'effect_size': np.sqrt(f / (f + (len(s1[mask]) - len(groups))))}
                    }
            gm = s1.groupby(cats).mean().to_dict()
            plot_data = {'x': cats.tolist(), 'y': s1.tolist(), 'group_means': gm}

        # -- Categorical vs Numeric
        elif rel_type == "categorical-numeric":
            cats = s1.astype(str)
            mask = s2.notna() & cats.notna()
            if mask.sum() > 1:
                uc = cats[mask].nunique()
                if uc == 2:
                    codes = pd.factorize(cats[mask])[0]
                    correlation = pointbiserialr(s2[mask], codes)[0]
                elif uc > 2:
                    groups = defaultdict(list)
                    for cat, val in zip(cats[mask], s2[mask]):
                        groups[cat].append(val)
                    f, p = f_oneway(*groups.values())
                    stats_res = {
                        'anova': {'f_statistic': f, 'p_value': p,
                                  'effect_size': np.sqrt(f / (f + (len(s2[mask]) - len(groups))))}
                    }
            gm = s2.groupby(cats).mean().to_dict()
            plot_data = {'x': cats.tolist(), 'y': s2.tolist(), 'group_means': gm}

        # -- Categorical vs Categorical
        else:
            tab = pd.crosstab(s1.astype(str), s2.astype(str))
            if tab.size:
                chi2, p, dof, _ = chi2_contingency(tab)
                stats_res = {'chi_square': {'statistic': chi2, 'p_value': p, 'degrees_of_freedom': dof}}
            plot_data = {'x': s1.astype(str).tolist(), 'y': s2.astype(str).tolist()}

        # Final JSON response
        return JsonResponse({
            'status': 'success',
            'data_source_type': file_type,
            'output_type': output_type,
            'relationship_type': rel_type,
            'correlation': correlation,
            'plot_data': plot_data,
            'column_names': [col1, col2],
            'column_stats': {
                col1: {
                    'type': 'numeric' if n1 else 'categorical',
                    'unique_values': int(s1.nunique()),
                    'null_count': int(s1.isnull().sum())
                },
                col2: {
                    'type': 'numeric' if n2 else 'categorical',
                    'unique_values': int(s2.nunique()),
                    'null_count': int(s2.isnull().sum())
                }
            },
            'statistical_tests': stats_res,
            'model_performance': model_perf
        })

    except Exception as e:
        logging.exception("Processing error")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def upload_csv(request):
    """Legacy alias endpoint—just forward to analyze_data."""
    return analyze_data(request)
