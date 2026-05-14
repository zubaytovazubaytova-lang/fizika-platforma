import os
import json
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Conversation, Message


@login_required
def conversation_list(request):
    conversations = request.user.conversations.all()
    return render(request, 'ai_tutor/list.html', {'conversations': conversations})


@login_required
def conversation_detail(request, pk):
    conversation = get_object_or_404(Conversation, pk=pk, user=request.user)
    messages_qs = conversation.messages.all()
    return render(request, 'ai_tutor/chat.html', {
        'conversation': conversation,
        'messages': messages_qs,
    })


@login_required
def new_conversation(request):
    conversation = Conversation.objects.create(user=request.user)
    return redirect('ai_tutor:chat', pk=conversation.pk)


@login_required
@require_POST
def send_message(request, pk):
    conversation = get_object_or_404(Conversation, pk=pk, user=request.user)
    try:
        data = json.loads(request.body)
        user_text = data.get('message', '').strip()
    except (json.JSONDecodeError, AttributeError):
        user_text = request.POST.get('message', '').strip()

    if not user_text:
        return JsonResponse({'error': 'Xabar bo\'sh bo\'lishi mumkin emas'}, status=400)

    Message.objects.create(conversation=conversation, role=Message.Role.USER, content=user_text)

    ai_reply = _get_ai_response(conversation, user_text)
    Message.objects.create(conversation=conversation, role=Message.Role.ASSISTANT, content=ai_reply)

    conversation.save()

    return JsonResponse({'reply': ai_reply})


def _get_ai_response(conversation, user_text: str) -> str:
    """
    Haqiqiy AI javobini olish uchun bu funksiyani Anthropic/OpenAI SDK bilan ulang.
    Hozircha oddiy placeholder qaytaradi.
    """
    api_key = os.environ.get('ANTHROPIC_API_KEY') or os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return (
            "AI Tutor hali ulangani yo'q. "
            "ANTHROPIC_API_KEY yoki OPENAI_API_KEY muhit o'zgaruvchisini o'rnating."
        )

    # Bu yerda Anthropic yoki OpenAI SDK orqali haqiqiy javob olinadi.
    # Misol: anthropic.Anthropic().messages.create(...)
    return f"[AI Tutor] Savolingiz: «{user_text[:100]}» — tez orada javob beriladi."
