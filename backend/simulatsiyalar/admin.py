from django.contrib import admin
from django.utils.html import format_html
from .models import Simulatsiya


@admin.register(Simulatsiya)
class SimulatsiyaAdmin(admin.ModelAdmin):
    list_display       = ('title', 'kategoriya', 'slug', 'status_badge', 'is_published', 'order')
    list_display_links = ('title',)
    list_filter        = ('kategoriya', 'tez_orada', 'is_published')
    search_fields      = ('title', 'description', 'slug')
    list_editable      = ('is_published', 'order')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('order', 'title')
    readonly_fields = ('created_at', 'updated_at', 'parametrlar_namuna')

    fieldsets = (
        ('Asosiy', {
            'fields': ('title', 'slug', 'description', 'kategoriya'),
        }),
        ('Fizika', {
            'fields': ('formula', 'info_text'),
        }),
        ('Parametrlar', {
            'fields': ('parametrlar', 'parametrlar_namuna'),
            'description': (
                'Har bir parametr uchun: '
                '<code>{"kalit": {"label": "Ko\'rsatma", "min": 0, "max": 10, "default": 1, "step": 0.1}}</code>'
            ),
        }),
        ('Ko\'rinish', {
            'fields': ('icon_name', 'color'),
        }),
        ('Holat', {
            'fields': ('tez_orada', 'is_published', 'order'),
        }),
        ('Vaqt', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def status_badge(self, obj):
        if obj.tez_orada:
            return format_html(
                '<span style="background:#374151;color:#9CA3AF;'
                'padding:2px 8px;border-radius:999px;font-size:11px;">Tez orada</span>'
            )
        if obj.is_published:
            return format_html(
                '<span style="background:#D1FAE5;color:#065F46;'
                'padding:2px 8px;border-radius:999px;font-size:11px;">Faol</span>'
            )
        return format_html(
            '<span style="background:#FEE2E2;color:#991B1B;'
            'padding:2px 8px;border-radius:999px;font-size:11px;">Yashirin</span>'
        )
    status_badge.short_description = 'Holat'

    def parametrlar_namuna(self, obj):
        return format_html(
            '<pre style="background:#F3F4F6;padding:10px;border-radius:6px;'
            'font-size:12px;max-width:500px;overflow:auto;">{}</pre>',
            '''{
  "uzunlik": {"label": "Uzunlik (m)", "min": 0.5, "max": 3.0, "default": 1.0, "step": 0.1},
  "burchak":  {"label": "Burchak (°)", "min": 5,   "max": 45,  "default": 30,  "step": 1  },
  "massa":    {"label": "Massa (kg)",  "min": 0.1,  "max": 5.0, "default": 1.0, "step": 0.1}
}''',
        )
    parametrlar_namuna.short_description = 'Namuna format'
