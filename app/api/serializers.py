
from rest_framework import serializers
from ..models import *

class FieldTestingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldTesting
        fields = ['tpt_id_key']
