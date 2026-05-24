from django import forms
from django.contrib import admin
from .models import Darslik, Mavzu


class DarslikAdminForm(forms.ModelForm):
    formulas_text = forms.CharField(
        label='Formulalar (har qatorga bitta)',
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'F = ma\nv = v₀ + at\nE = mgh'}),
        required=False,
        help_text='Har qatorga bitta formula yozing',
    )
    mavzular_text = forms.CharField(
        label='Mavzular (mavzu nomi | bet raqami)',
        widget=forms.Textarea(attrs={
            'rows': 10,
            'placeholder': (
                'Mexanika asoslari | 5\n'
                'Tezlik va tezlanish | 12\n'
                'Nyuton qonunlari | 24\n'
                'Energiya va ish | 38\n'
                'Tortishish kuchi | 52'
            ),
            'style': 'font-family: monospace; font-size: 13px;',
        }),
        required=False,
        help_text='Har qatorga: Mavzu nomi | bet raqami',
    )

    class Meta:
        model = Darslik
        exclude = ['formulas', 'mavzular']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            if self.instance.formulas:
                self.fields['formulas_text'].initial = '\n'.join(self.instance.formulas)
            if self.instance.mavzular:
                lines = [f"{m.get('mavzu','')} | {m.get('bet','')}" for m in self.instance.mavzular]
                self.fields['mavzular_text'].initial = '\n'.join(lines)

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Formulalar
        text = self.cleaned_data.get('formulas_text', '')
        instance.formulas = [f.strip() for f in text.splitlines() if f.strip()]
        # Mavzular
        mavzular = []
        for line in self.cleaned_data.get('mavzular_text', '').splitlines():
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 2:
                try:
                    mavzular.append({'mavzu': parts[0], 'bet': int(parts[1])})
                except ValueError:
                    mavzular.append({'mavzu': parts[0], 'bet': parts[1]})
            elif parts[0]:
                mavzular.append({'mavzu': parts[0], 'bet': '—'})
        instance.mavzular = mavzular
        if commit:
            instance.save()
        return instance


@admin.register(Darslik)
class DarslikAdmin(admin.ModelAdmin):
    form          = DarslikAdminForm
    list_display  = ['grade', 'subject', 'mavzu_soni', 'chapters', 'pages', 'is_published', 'order']
    list_editable = ['is_published', 'order']
    list_filter   = ['is_published', 'grade']
    ordering      = ['grade', 'order']
    fieldsets = [
        (None,        {'fields': ['grade', 'subject', 'subtitle', 'icon']}),
        ('Rang',      {'fields': ['color', 'accent']}),
        ('Tafsilot',  {'fields': ['formulas_text', 'chapters', 'pages']}),
        ('Mavzular',  {'fields': ['mavzular_text'],
                       'description': 'Kitob ichidagi mavzular va ularning boshlanadigan bet raqamlari'}),
        ('Fayl',      {'fields': ['pdf_file']}),
        ('Sozlamalar',{'fields': ['is_published', 'order']}),
    ]

    def mavzu_soni(self, obj):
        n = obj.mavzu_set.count() or (len(obj.mavzular) if obj.mavzular else 0)
        return f'{n} ta' if n else '—'
    mavzu_soni.short_description = 'Mavzular'


@admin.register(Mavzu)
class MavzuAdmin(admin.ModelAdmin):
    list_display  = ['darslik', 'bob', 'mavzu', 'bet', 'order']
    list_editable = ['bob', 'bet', 'order']
    list_filter   = ['darslik__grade', 'bob']
    search_fields = ['mavzu']
    ordering      = ['darslik__grade', 'bob', 'order', 'bet']
    list_per_page = 50

    list_display  = ['darslik', 'bob', 'mavzu', 'bet', 'fayl_bor', 'order']

    fieldsets = [
        (None,         {'fields': ['darslik', 'mavzu', 'bet']}),
        ('PDF fayl',   {'fields': ['pdf_file']}),
        ('Qo\'shimcha',{'fields': ['bob', 'order'],
                        'classes': ['collapse'],
                        'description': 'Bob va tartib raqami (ixtiyoriy)'}),
    ]

    def fayl_bor(self, obj):
        return '✅' if obj.pdf_file else '—'
    fayl_bor.short_description = 'PDF'

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['darslik'].label_from_instance = lambda o: f"{o.grade}-sinf — {o.subject}"
        return form
