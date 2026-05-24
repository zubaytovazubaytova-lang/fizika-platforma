import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """DRF xatolarini standart formatga keltiradi."""
    response = exception_handler(exc, context)

    if response is not None:
        view = context.get('view', None)
        logger.warning(
            'API xato: %s | view: %s | status: %s',
            exc, view.__class__.__name__ if view else '—', response.status_code,
        )
        # Barcha xatolar bir xil formatda: { "detail": "...", "code": "..." }
        if not isinstance(response.data, dict):
            response.data = {'detail': response.data}
        if 'detail' not in response.data:
            response.data = {'detail': response.data}
    else:
        # Kutilmagan server xatosi (500)
        logger.exception('Server xatosi: %s', exc)

    return response


# ── HTML so'rovlar uchun 404 / 500 ───────────────────────────────────────────

def handler404(request, exception=None):
    return JsonResponse(
        {'detail': 'Sahifa topilmadi.', 'code': 'not_found'},
        status=404,
    )


def handler500(request):
    return JsonResponse(
        {'detail': 'Server ichki xatosi yuz berdi.', 'code': 'server_error'},
        status=500,
    )
