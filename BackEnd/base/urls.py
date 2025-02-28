from django.urls import path
from .views import login_view, csrf_token_view  # Import csrf_token_view
from django.http import JsonResponse
from django.middleware.csrf import get_token

urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/csrf/", csrf_token_view, name="csrf_token"),  # Add CSRF token endpoint
]

def csrf_token_view(request):
    """Returns the CSRF token to the frontend."""
    return JsonResponse({"csrfToken": get_token(request)})
