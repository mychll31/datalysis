from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

#view for user credentials
@login_required
def user_info(request):
    user = request.user
    user_obj = User.objects.get(email = user.email) #setting  a variable to get the username details 
    return JsonResponse({
        'username': user_obj.username,
    })