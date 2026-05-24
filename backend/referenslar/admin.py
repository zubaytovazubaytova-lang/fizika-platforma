from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Formula, FormulaMexanika, FormulaElektr, FormulaOptika,
    FormulaTermodinamika, FormulaKvant,
    FizikKattaik,
    FizikBirlik, FizikBirlikSI, FizikBirlikCGS,
)


# ── Formula ───────────────────────────────────────────────────────────────────

class FormulaBaseAdmin(admin.ModelAdmin):
    kategoriya_value = None

    list_display       = ('title', 'formula_display', 'is_published', 'order')
    list_display_links = ('title',)
    list_filter        = ('is_published',)
    search_fields      = ('title', 'formula', 'description')
    list_editable      = ('is_published', 'order')
    ordering           = ('order', 'title')
    readonly_fields    = ('rasm_preview',)

    fieldsets = (
        (None, {
            'fields': ('title', 'formula', 'description'),
        }),
        ('Rasm', {
            'fields': ('image', 'rasm_preview'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
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

    def formula_display(self, obj):
        return format_html(
            '<code style="background:#F3F4F6;padding:2px 10px;border-radius:4px;font-size:13px;">{}</code>',
            obj.formula,
        )
    formula_display.short_description = 'Formula'

    def rasm_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;object-fit:cover;" />',
                obj.image.url,
            )
        return '—'
    rasm_preview.short_description = 'Rasm'


@admin.register(Formula)
class FormulaAdmin(FormulaBaseAdmin):
    list_display  = ('title', 'formula_display', 'kategoriya', 'is_published', 'order')
    list_filter   = ('kategoriya', 'is_published')

    fieldsets = (
        (None, {
            'fields': ('title', 'formula', 'description', 'kategoriya'),
        }),
        ('Rasm', {
            'fields': ('image', 'rasm_preview'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
        }),
    )


@admin.register(FormulaMexanika)
class FormulaMexanikaAdmin(FormulaBaseAdmin):
    kategoriya_value = Formula.Kategoriya.MEXANIKA

@admin.register(FormulaElektr)
class FormulaElektrAdmin(FormulaBaseAdmin):
    kategoriya_value = Formula.Kategoriya.ELEKTR

@admin.register(FormulaOptika)
class FormulaOptikaAdmin(FormulaBaseAdmin):
    kategoriya_value = Formula.Kategoriya.OPTIKA

@admin.register(FormulaTermodinamika)
class FormulaTermodinamikaAdmin(FormulaBaseAdmin):
    kategoriya_value = Formula.Kategoriya.TERMODINAMIKA

@admin.register(FormulaKvant)
class FormulaKvantAdmin(FormulaBaseAdmin):
    kategoriya_value = Formula.Kategoriya.KVANT


# ── Fizik kattaliklar ─────────────────────────────────────────────────────────

@admin.register(FizikKattaik)
class FizikKattaikAdmin(admin.ModelAdmin):
    list_display       = ('nomi', 'belgi_display', 'olchov_birligi', 'is_published', 'order')
    list_display_links = ('nomi',)
    search_fields      = ('nomi', 'belgi', 'description')
    list_editable      = ('is_published', 'order')
    ordering           = ('order', 'nomi')

    fieldsets = (
        (None, {
            'fields': ('nomi', 'belgi', 'olchov_birligi', 'description'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
        }),
    )

    def belgi_display(self, obj):
        return format_html(
            '<span style="font-style:italic;font-size:15px;font-weight:700;color:#0d6efd;">{}</span>',
            obj.belgi,
        )
    belgi_display.short_description = 'Belgisi'


# ── Fizik birliklar ───────────────────────────────────────────────────────────

class FizikBirlikBaseAdmin(admin.ModelAdmin):
    sistema_value = None

    list_display       = ('nomi', 'belgi_display', 'is_published', 'order')
    list_display_links = ('nomi',)
    list_filter        = ('is_published',)
    search_fields      = ('nomi', 'belgi', 'description')
    list_editable      = ('is_published', 'order')
    ordering           = ('order', 'nomi')

    fieldsets = (
        (None, {
            'fields': ('nomi', 'belgi', 'description'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.sistema_value:
            return qs.filter(sistema=self.sistema_value)
        return qs

    def save_model(self, request, obj, form, change):
        if self.sistema_value:
            obj.sistema = self.sistema_value
        super().save_model(request, obj, form, change)

    def belgi_display(self, obj):
        return format_html(
            '<span style="font-style:italic;font-size:15px;font-weight:700;color:#6f42c1;">{}</span>',
            obj.belgi,
        )
    belgi_display.short_description = 'Belgisi'


@admin.register(FizikBirlik)
class FizikBirlikAdmin(FizikBirlikBaseAdmin):
    list_display  = ('nomi', 'belgi_display', 'sistema', 'is_published', 'order')
    list_filter   = ('sistema', 'is_published')

    fieldsets = (
        (None, {
            'fields': ('nomi', 'belgi', 'sistema', 'description'),
        }),
        ('Sozlamalar', {
            'fields': ('is_published', 'order'),
        }),
    )

@admin.register(FizikBirlikSI)
class FizikBirlikSIAdmin(FizikBirlikBaseAdmin):
    sistema_value = FizikBirlik.Sistema.SI

@admin.register(FizikBirlikCGS)
class FizikBirlikCGSAdmin(FizikBirlikBaseAdmin):
    sistema_value = FizikBirlik.Sistema.CGS
