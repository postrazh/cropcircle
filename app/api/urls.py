from django.urls import path
from .views import *

urlpatterns = [
    path('search/', SearchApiView.as_view()),
    path('validate/', ValidatorView.as_view())
]
