from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model

User = get_user_model()

#view for user credentials
@login_required
def user_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated',}, status=401)
    return JsonResponse({'username': request.user.username})