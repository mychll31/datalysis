from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta

class UserVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6, null=True)
    code_expires = models.DateTimeField(null=True)

    @property
    def is_valid(self):
            return (
                self.verification_code and 
                self.code_expires and 
                timezone.now() < self.code_expires
            )