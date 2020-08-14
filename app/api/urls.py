from django.urls import path
from .views import *

urlpatterns = [
    path('keywords/', KeywordsApiView.as_view()),
    path('validate/', ValidatorApiView.as_view()),
    path('search/', SearchApiView.as_view())
]
