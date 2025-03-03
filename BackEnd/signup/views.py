from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
import json


from django.contrib.auth.models import User  # Import User model

# Create your views here.
def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)  # ✅ Parse JSON request body
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        login_view(request, user)  # ✅ Automatically log in the user
        
        return JsonResponse({"message": "User created successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)