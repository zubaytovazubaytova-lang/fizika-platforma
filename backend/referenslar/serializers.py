from rest_framework import serializers
from .models import Formula, FizikKattaik, FizikBirlik


class FormulaSerializer(serializers.ModelSerializer):
    kategoriya_display = serializers.CharField(source='get_kategoriya_display', read_only=True)

    class Meta:
        model  = Formula
        fields = ('id', 'title', 'formula', 'description', 'kategoriya',
                  'kategoriya_display', 'image', 'order')


class FizikKattaikSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FizikKattaik
        fields = ('id', 'nomi', 'belgi', 'olchov_birligi', 'description', 'order')


class FizikBirlikSerializer(serializers.ModelSerializer):
    sistema_display = serializers.CharField(source='get_sistema_display', read_only=True)

    class Meta:
        model  = FizikBirlik
        fields = ('id', 'nomi', 'belgi', 'sistema', 'sistema_display', 'description', 'order')
