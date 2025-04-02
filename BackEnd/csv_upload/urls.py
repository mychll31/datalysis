# csv_upload/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload-csv/', views.analyze_data, name='upload_csv'),
]