# backend/base/views.py

import json
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth import authenticate, login, logout, get_user_model

from signup.views import send_email_code  # your email‐OTP flow

User = get_user_model()


@ensure_csrf_cookie
def csrf_token_view(request):
    """
    GET /api/csrf/
    Returns { csrfToken } & sets the 'csrftoken' cookie.
    """
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_exempt
def login_view(request):
    """
    POST /api/login/
    Body: { email, password }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    if not user_obj.is_active:
        return JsonResponse(
            {
                "error": "Please Activate your account",
                "requires_verification": True,
                "email": email,
            },
            status=400,
        )

    user = authenticate(username=user_obj.username, password=password)
    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"message": "Login successful", "username": user.username})


@csrf_exempt
def signup_view(request):
    """
    POST /api/signup/
    Body: { username, email, password }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not all([username, email, password]):
        return JsonResponse({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already taken"}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already in use"}, status=400)

    user = User.objects.create_user(
        username=username, email=email, password=password, is_active=False
    )
    # kick off your OTP‐email flow
    return send_email_code(request)


@csrf_exempt
def logout_view(request):
    """
    POST /api/logout/
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    logout(request)
    resp = JsonResponse({"message": "Logged out successfully"})
    resp.delete_cookie("sessionid")
    return resp
