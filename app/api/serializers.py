
from rest_framework import serializers
from ..models import *

class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldTesting
        fields = '__all__'

class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldTesting
        fields = ['tpt_id_key']
