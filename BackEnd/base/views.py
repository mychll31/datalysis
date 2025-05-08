from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import login

from django.contrib.auth.models import User  # Import User model

from django.contrib.auth import logout
from signup.views import send_email_code

@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        response = JsonResponse({"message": "Logged out successfully"})
        response.delete_cookie("sessionid")  # ✅ Delete session cookie
        return response
    return JsonResponse({"error": "Invalid request method"}, status=405)


def csrf_token_view(request):
    """Returns the CSRF token to the frontend."""
    token = get_token(request)
    print("Generated CSRF Token:", token)  # ✅ Debugging
    return JsonResponse({"csrfToken": token})


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

                if not user.is_active:
                        print("Account is not active")
                        return JsonResponse({"error": "Please Activate your account",
                                             "requires_verification": True,
                                             "email": email}, status=400)
                    
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

            # Authenticate user
            user = authenticate(username=username, password=password)

            if user is not None:
                
                login(request, user)
                return JsonResponse({"message": "Login successful", "username": user.username}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid request"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

#handles signup
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
        user.save() 
        
        #login(request, user) need to remove this line
        send_email_code(request)
        

        # return JsonResponse({"message": "User created successfully"}, status=201)
        return JsonResponse({"message": "Please Verify your email"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)