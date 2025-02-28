from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
import json

from django.contrib.auth.models import User  # Import User model

def csrf_token_view(request):
    """Returns the CSRF token to the frontend."""
    return JsonResponse({"csrfToken": get_token(request)})

def login_view(request):
    """Handles user login."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Get username from email
            try:
                user = User.objects.get(email=email)
                username = user.username
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

            # Authenticate user
            user = authenticate(username=username, password=password)

            if user is not None:
                return JsonResponse({"message": "Login successful"}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid request"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
