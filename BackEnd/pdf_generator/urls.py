from django.urls import path
from .views import pdf_generator_view


urlpatterns = [
    path('generate-report/', pdf_generator_view, name='pdf_generator_view'),
]
