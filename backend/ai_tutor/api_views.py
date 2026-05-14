import os
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import (
    ConversationSerializer, ConversationDetailSerializer,
    MessageSerializer, SendMessageSerializer,
)


class ConversationListView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConversationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message(request, pk):
    conversation = generics.get_object_or_404(Conversation, pk=pk, user=request.user)
    serializer = SendMessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user_text = serializer.validated_data['message']
    Message.objects.create(conversation=conversation, role=Message.Role.USER, content=user_text)

    ai_text = _call_ai(conversation, user_text)
    ai_msg = Message.objects.create(conversation=conversation, role=Message.Role.ASSISTANT, content=ai_text)

    conversation.save()
    return Response(MessageSerializer(ai_msg).data, status=status.HTTP_201_CREATED)


def _call_ai(conversation: Conversation, user_text: str) -> str:
    """Claude API bilan ulanish. ANTHROPIC_API_KEY env o'zgaruvchisi kerak."""
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        return (
            "AI Tutor hali sozlanmagan. "
            "Administrator ANTHROPIC_API_KEY o'rnatishi kerak."
        )

    try:
        import anthropic
        history = conversation.messages.all().order_by('created_at')
        messages = [
            {'role': m.role, 'content': m.content}
            for m in history
        ]
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model='claude-sonnet-4-6',
            max_tokens=1024,
            system=(
                "Siz fizika fanidan ixtisoslashgan AI o'qituvchisiz. "
                "O'zbek tilida tushuntiring. Formulalarni LaTeX formatida yozing. "
                "Har doim aniq, qisqa va tushunarli javob bering."
            ),
            messages=messages,
        )
        return response.content[0].text
    except Exception as e:
        return f"Xatolik yuz berdi: {str(e)}"
