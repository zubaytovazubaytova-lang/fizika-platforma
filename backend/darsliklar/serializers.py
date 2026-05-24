from rest_framework import serializers
from .models import Darslik, Mavzu


class MavzuSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Mavzu
        fields = ['mavzu', 'bet', 'bob']


class DarslikSerializer(serializers.ModelSerializer):
    mavzular = serializers.SerializerMethodField()

    def get_mavzular(self, obj):
        qs = obj.mavzu_set.all()
        if qs.exists():
            return [{'mavzu': m.mavzu, 'bet': m.bet, 'pdf': m.pdf_file.url if m.pdf_file else None} for m in qs]
        return obj.mavzular  # eski JSONField fallback

    class Meta:
        model  = Darslik
        fields = [
            'id', 'grade', 'subject', 'subtitle', 'icon',
            'color', 'accent', 'formulas', 'chapters', 'pages',
            'mavzular', 'is_published', 'order',
        ]
