import random
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
import json

from allauth.account.utils import send_email_confirmation
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User  # Import User model

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.contrib.auth import get_user_model
from .models import UserVerification  

from django.utils import timezone
from datetime import timedelta

User = get_user_model()
# Create your views here.
#this is not working go to the base/views.py meow
def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return JsonResponse({"error": "All fields are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "User with this email already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_active = False
        # login(request, user)
        user.save()

        send_email_confirmation(request, user)

        return JsonResponse({"message": "User created successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
#until here 

@csrf_exempt
def send_email_code(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        print("1. Received request")  # Debug point 1
        
        data = json.loads(request.body)
        email = data.get("email")
        print(f"2. Email extracted: {email}")  # Debug point 2

        if not email:
            return JsonResponse({"error": "Email required"}, status=400)

        user = get_object_or_404(User, email=email)
        verification, created = UserVerification.objects.get_or_create(user=user)
        print(f"3. Verification record: {verification.id}, created: {created}")  # Debug point 3
        
        verification_code = str(random.randint(100000, 999999))
        print(f"4. Generated code: {verification_code}")  # Debug point 4
        
        verification.verification_code = verification_code
        verification.code_expires = timezone.now() + timedelta(minutes=15)
        verification.save()
        print("5. Code saved to database")  # Debug point 5

        html_message = render_to_string('registration/email_confirmation.html', {
            'username': user.username,
            'verification_code': verification_code
        })
        print("6. Email template rendered")  # Debug point 6
        
        # Test email in console first
        print("\n=== EMAIL CONTENT ===")
        print(strip_tags(html_message))
        print("====================\n")
        
        send_mail(
            "Your Verification Code",
            strip_tags(html_message),
            settings.EMAIL_HOST_USER,
            [email],
            html_message=html_message,
            fail_silently=False,
        )
        print("7. Email send attempted")  # Debug point 7

        return JsonResponse({"message": "Verification code sent successfully."})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Debug point ERROR
        return JsonResponse({"error": str(e)}, status=500)({"error": str(e)}, status=500)

@csrf_exempt
def verify_signup_code(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        code = data.get("code")

        if not email or not code:
            return JsonResponse({"error": "Email and code required"}, status=400)

        user = get_object_or_404(User, email=email)
        verification = get_object_or_404(UserVerification, user=user)

        # Check code validity
        if verification.verification_code != code:
            return JsonResponse({"error": "Invalid code"}, status=400)
        if timezone.now() > verification.code_expires:
            return JsonResponse({"error": "Code expired"}, status=400)

        # Activate user
        user.is_active = True
        user.save()

        # Clear verification data
        verification.verification_code = None
        verification.code_expires = None
        verification.save()

        return JsonResponse({"message": "User verified successfully"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

#calls a resend email function to resend the verification code
@csrf_exempt
def resend_verification_code(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            
            # Simply call your existing function
            return send_email_code(request)  # The request already contains the email
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "POST request required"}, status=405)