import random
from datetime import timedelta
from django.core.mail import send_mail
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from .models import PasswordResetCode
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def send_reset_code(request):
    try:
        # Parse JSON from request body
        data = json.loads(request.body.decode("utf-8"))
        email = data.get("email")  # Get email from JSON
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "No account found with this email"}, status=404)
    
    # Generate a 6-digit reset code
    reset_code = random.randint(100000, 999999)

    # Save the code in the database
    PasswordResetCode.objects.create(
        user=user, code=str(reset_code), expires_at=now() + timedelta(minutes=10)
    )

    # Send email with the reset code
    send_mail(
        "Your Password Reset Code",
        f"Your password reset code is: {reset_code}",
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

    return JsonResponse({"message": "Reset code sent successfully!"})
    

@csrf_exempt
def verify_reset_code(request):
    try:
        # Load JSON from request body
        data = json.loads(request.body.decode("utf-8"))
        email = data.get("email")
        code = data.get("code")

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    if not email or not code or len(code) != 6:
        return JsonResponse({"error": "Please check your code"}, status=400)

    user = get_object_or_404(User, email=email)
    reset_entry = PasswordResetCode.objects.filter(user=user, code=code).first()

    if not reset_entry or reset_entry.is_expired():
        return JsonResponse({"error": "Invalid or expired code"}, status=400)

    reset_entry.delete()

    return JsonResponse({"message": "Correct Code!"})


@csrf_exempt
def set_newpassword(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        email = data.get("email")
        new_password = data.get("new_password")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    if not email or not new_password:
        return JsonResponse({"error": "Email and new password are required"}, status=400)

    user = get_object_or_404(User, email=email)
    
    # Set the new password securely
    user.set_password(new_password)
    user.save()

    send_mail(
        "Reset Password",
        f"Hi {email}! You have successfully reset your password. If you did not request this change, please contact us immediately.",
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

    return JsonResponse({"message": "Password updated successfully!"})