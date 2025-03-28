from django.contrib import admin
from django.urls import path, include
from .views import login_view, csrf_token_view, signup # Import csrf_token_view
from django.http import JsonResponse
from django.middleware.csrf import get_token
from user_management.views import user_info
from csv_upload.views import analyze_data
from .views import logout_view


urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),  # Add logout endpoint
    path("api/csrf/", csrf_token_view, name="csrf_token"),
    path("api/signup/", signup, name="signup"),  # Add CSRF token endpoint
    path('api/user-info/', user_info, name='user_info'), #This user info endpoint
    path('upload-csv/', analyze_data, name='upload_csv'),
    path('admin/', admin.site.urls),
    path('csv/', include('csv_upload.urls')), #This is the upload_csv endpoint
]

