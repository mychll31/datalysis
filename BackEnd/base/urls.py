# backend/base/urls.py

from django.contrib import admin
from django.urls import path, include

from .views import (
    csrf_token_view,
    login_view,
    signup_view,
    logout_view,
)
from signup.views import send_email_code, verify_signup_code
from user_management.views import user_info
from csv_upload.views import analyze_data

urlpatterns = [
    path("admin/", admin.site.urls),

    # CSRF & Auth
    path("api/csrf/", csrf_token_view, name="api-csrf"),
    path("api/login/", login_view, name="api-login"),
    path("api/logout/", logout_view, name="api-logout"),

    # Signup & OTP
    path("api/signup/", signup_view, name="api-signup"),
    path("api/send_email_code/", send_email_code, name="api-send-email-code"),
    path("api/verify_signup_code/", verify_signup_code, name="api-verify-signup-code"),

    # Other endpoints
    path("api/user-info/", user_info, name="api-user-info"),
    path("api/upload_csv/", analyze_data, name="api-upload-csv"),
    path("api/csv/", include("csv_upload.urls")),
]
