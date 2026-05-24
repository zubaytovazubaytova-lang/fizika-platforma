from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from .models import Darslik
from .serializers import DarslikSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """Faqat admin yoza oladi, boshqalar faqat o'qiy oladi."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or getattr(request.user, 'role', '') == 'admin'
        )


class DarslikListCreateView(generics.ListCreateAPIView):
    serializer_class   = DarslikSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Darslik.objects.all()
        if not (self.request.user.is_authenticated and (
            self.request.user.is_staff or getattr(self.request.user, 'role', '') == 'admin'
        )):
            qs = qs.filter(is_published=True)

        q = self.request.query_params.get('search', '').strip()
        if q:
            from django.db.models import Q
            words = q.split()
            condition = Q()
            for word in words:
                word_q = Q(subject__icontains=word) | Q(subtitle__icontains=word)
                try:
                    word_q |= Q(grade=int(word))
                except ValueError:
                    pass
                condition |= word_q
            qs = qs.filter(condition)
        return qs


class DarslikDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Darslik.objects.all()
    serializer_class   = DarslikSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]
