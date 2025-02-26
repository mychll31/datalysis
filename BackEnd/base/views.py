from django.contrib.auth import authenticate, login
from django.http import JsonResponse
import json
import logging

# Set up logging
logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Log the received data for debugging
            logger.debug(f"Received login request: email={email}, password={password}")

            # Authenticate user
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                logger.debug(f"User {email} logged in successfully")
                return JsonResponse({"message": "Login successful"}, status=200)
            else:
                logger.warning(f"Invalid credentials for email: {email}")
                return JsonResponse({"error": "Invalid credentials"}, status=400)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({"error": "Something went wrong"}, status=500)
    else:
        logger.warning(f"Invalid request method: {request.method}")
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)