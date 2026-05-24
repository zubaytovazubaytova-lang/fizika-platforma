from django.contrib import admin
from django.utils.html import format_html
from .models import Kashfiyot, IxtirolarProxy, TajribalarProxy, SanalarProxy, OlimlarProxy, RekordlarProxy


class KashfiyotBaseAdmin(admin.ModelAdmin):
    kategoriya_value = None

    list_display    = ('title', 'is_published', 'order', 'rasm_preview', 'created_at')
    list_filter     = ('is_published',)
    search_fields   = ('title', 'description')
    list_editable   = ('is_published', 'order')
    ordering        = ('order', '-created_at')
    readonly_fields = ('rasm_preview', 'created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('title', 'description'),
        }),
        ('Rasm', {
            'fields': ('image', 'rasm_preview'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
        }),
        ('Vaqt', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.kategoriya_value:
            return qs.filter(kategoriya=self.kategoriya_value)
        return qs

    def save_model(self, request, obj, form, change):
        if self.kategoriya_value:
            obj.kategoriya = self.kategoriya_value
        super().save_model(request, obj, form, change)

    def rasm_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;object-fit:cover;" />',
                obj.image.url,
            )
        return '—'
    rasm_preview.short_description = 'Rasm'


@admin.register(Kashfiyot)
class KashfiyotAdmin(KashfiyotBaseAdmin):
    list_display = ('title', 'kategoriya', 'is_published', 'order', 'rasm_preview', 'created_at')
    list_filter  = ('kategoriya', 'is_published')


@admin.register(IxtirolarProxy)
class IxtirolarAdmin(KashfiyotBaseAdmin):
    kategoriya_value = Kashfiyot.Kategoriya.IXTIROLAR


@admin.register(TajribalarProxy)
class TajribalarAdmin(KashfiyotBaseAdmin):
    kategoriya_value = Kashfiyot.Kategoriya.TAJRIBALAR


@admin.register(SanalarProxy)
class SanalarAdmin(KashfiyotBaseAdmin):
    kategoriya_value = Kashfiyot.Kategoriya.SANALAR


@admin.register(OlimlarProxy)
class OlimlarAdmin(KashfiyotBaseAdmin):
    kategoriya_value = Kashfiyot.Kategoriya.OLIMLAR


@admin.register(RekordlarProxy)
class RekordlarAdmin(KashfiyotBaseAdmin):
    kategoriya_value = Kashfiyot.Kategoriya.REKORDLAR
