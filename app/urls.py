# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path, re_path
from .views import *

urlpatterns = [

    # The home page
    path('', HomeView.as_view(), name='home'),

    path('view', ViewView.as_view(), name='view'),
    path('upload', UploadView.as_view(), name='upload'),


]
