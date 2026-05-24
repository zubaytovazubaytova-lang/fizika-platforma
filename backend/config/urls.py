from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from config.exceptions import handler404, handler500

# Custom error handlers
handler404 = handler404  # noqa: F811
handler500 = handler500  # noqa: F811

# Admin panelni himoyalash
admin.site.site_header  = 'Fizika Platform Admin'
admin.site.site_title   = 'Fizika Admin'
admin.site.index_title  = 'Boshqaruv paneli'

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth API
    path('api/auth/',        include('users.api_urls')),

    # Content API
    path('api/courses/',     include('courses.api_urls')),
    path('api/tests/',       include('tests.api_urls')),
    path('api/ai/',          include('ai_tutor.api_urls')),
    path('api/darsliklar/',  include('darsliklar.api_urls')),
    path('api/referenslar/', include('referenslar.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
