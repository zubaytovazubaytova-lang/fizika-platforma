from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Formula, FizikKattaik, FizikBirlik
from .serializers import FormulaSerializer, FizikKattaikSerializer, FizikBirlikSerializer


class FormulaListView(generics.ListAPIView):
    serializer_class   = FormulaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Formula.objects.filter(is_published=True)
        kategoriya = self.request.query_params.get('kategoriya')
        if kategoriya:
            qs = qs.filter(kategoriya=kategoriya)
        return qs


class FizikKattaikListView(generics.ListAPIView):
    serializer_class   = FizikKattaikSerializer
    permission_classes = [AllowAny]
    queryset           = FizikKattaik.objects.filter(is_published=True)


class FizikBirlikListView(generics.ListAPIView):
    serializer_class   = FizikBirlikSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = FizikBirlik.objects.filter(is_published=True)
        sistema = self.request.query_params.get('sistema')
        if sistema:
            qs = qs.filter(sistema=sistema)
        return qs
