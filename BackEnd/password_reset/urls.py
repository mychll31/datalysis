from django.urls import path
from .views import send_reset_code, verify_reset_code, set_newpassword

urlpatterns = [
    path('send-code/', send_reset_code, name='send_reset_code'),
    path("verify-code/", verify_reset_code, name="verify_reset_code"),
    path("set-newpassword/", set_newpassword, name="reset_password"),
]