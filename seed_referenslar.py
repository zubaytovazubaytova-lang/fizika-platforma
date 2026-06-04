"""Formulalar va fizik birliklarni bazaga qo'shish."""
import sys, os
sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
import django; django.setup()
from referenslar.models import Formula, FizikBirlik

# ─── FORMULALAR ─────────────────────────────────────────────────────────────
FORMULAS = [
    # Mexanika
    ('Nyuton II qonuni', 'F = ma', 'Kuch = massa × tezlanish', 'mexanika'),
    ('Tezlik', 'v = v₀ + at', 'Tezlik vaqt funksiyasi', 'mexanika'),
    ("Ko'chish", 's = v₀t + ½at²', "Ko'chish formulasi", 'mexanika'),
    ("Yo'l", 'v² = v₀² + 2as', "Vaqtsiz kinematik formula", 'mexanika'),
    ('Tortishish kuchi', 'F = Gm₁m₂/r²', 'Nyuton tortishish qonuni', 'mexanika'),
    ('Og\'irlik kuchi', 'W = mg', "Og'irlik kuchi", 'mexanika'),
    ('Ishqalanish kuchi', 'F_tr = μN', 'Ishqalanish qonuni', 'mexanika'),
    ('Kinetik energiya', 'Ek = mv²/2', 'Kinetik energiya formulasi', 'mexanika'),
    ('Potensial energiya', 'Ep = mgh', 'Tortishish potensial energiyasi', 'mexanika'),
    ('Mexanik ish', 'A = Fs·cosα', 'Kuch bajargan ish', 'mexanika'),
    ('Quvvat', 'P = A/t = Fv', 'Mexanik quvvat', 'mexanika'),
    ('Impuls', 'p = mv', "Jism impulsi", 'mexanika'),
    ('Impuls o\'zgarishi', 'Δp = FΔt', "Impuls o'zgarishi", 'mexanika'),
    ('Matematik mayatnik davri', 'T = 2π√(L/g)', 'Matematik mayatnik tebranish davri', 'mexanika'),
    ('Arximed qonuni', 'F_A = ρgV', 'Arximed kuchi', 'mexanika'),
    ('Paskal qonuni', 'p = F/S', 'Gidrostatik bosim', 'mexanika'),
    # Termodinamika
    ('Ideal gaz holat tenglamasi', 'pV = nRT', 'Ideal gaz holat tenglamasi', 'termodinamika'),
    ('Gay-Lyussak qonuni', 'p₁/T₁ = p₂/T₂', 'Izokor jarayon', 'termodinamika'),
    ('Boyl-Mariott qonuni', 'p₁V₁ = p₂V₂', 'Izotermik jarayon', 'termodinamika'),
    ('Termodinamika I qonuni', 'ΔU = Q - A', 'Termodinamikaning birinchi qonuni', 'termodinamika'),
    ('Issiqlik miqdori', 'Q = cmΔT', 'Isitish uchun issiqlik miqdori', 'termodinamika'),
    ('Issiqlik miqdori (bug\'lanish)', 'Q = Lm', 'Bug\'lanish uchun issiqlik miqdori', 'termodinamika'),
    ('Issiqlik miqdori (erish)', 'Q = λm', 'Erish uchun issiqlik miqdori', 'termodinamika'),
    ('KPD', 'η = A/Q = 1 - T₂/T₁', "Issiqlik mashinasi KPD si", 'termodinamika'),
    # Elektr
    ('Om qonuni', 'I = U/R', "Om qonuni — tok, kuchlanish, qarshilik bog'liqligi", 'elektr'),
    ('Elektr quvvati', 'P = UI = I²R', "Elektr quvvati", 'elektr'),
    ('Elektr ish', 'A = Pt = UIt', "Elektr toki bajargan ish", 'elektr'),
    ('Kulon qonuni', 'F = kq₁q₂/r²', "Elektrostatik o'zaro ta'sir kuchi", 'elektr'),
    ('Elektr maydon kuchlanganligi', 'E = F/q = kq/r²', "Elektr maydon kuchlanganligi", 'elektr'),
    ('Kondensator sig\'imi', 'C = q/U', "Kondensator elektr sig'imi", 'elektr'),
    ('Faradey qonuni', 'ε = -ΔΦ/Δt', "Elektromagnit induksiya EYuK i", 'elektr'),
    ('Ohm qonuni (to\'liq)', 'I = ε/(R+r)', "To'liq zanjir uchun Om qonuni", 'elektr'),
    # Optika
    ('Nur sinishi qonuni', 'n₁sinα = n₂sinβ', "Snell-Dekart qonuni", 'optika'),
    ('Yupqa linza formulasi', '1/f = 1/d + 1/d\'', "Yupqa linza formulasi", 'optika'),
    ('Optik kuch', 'D = 1/f', "Linzaning optik kuchi (dioptriya)", 'optika'),
    ('Nur tarqalish tezligi', 'c = λν', "Nur to'lqin uzunligi va chastota bog'liqligi", 'optika'),
    # Kvant
    ('Plank formulasi', 'E = hν', "Kvantning energiyasi", 'kvant'),
    ('Eynshteyn formulasi', 'E = mc²', "Massa va energiya ekvivalentligi", 'kvant'),
    ('De Broyl to\'lqin uzunligi', 'λ = h/mv', "Zarrachaning to'lqin uzunligi", 'kvant'),
    ('Fotoeffekt', 'hν = A + Ek', "Fotoeffekt uchun Eynshteyn tenglamasi", 'kvant'),
]

added = 0
for i, (title, formula, desc, kat) in enumerate(FORMULAS):
    if not Formula.objects.filter(title=title).exists():
        Formula.objects.create(title=title, formula=formula, description=desc, kategoriya=kat, order=i)
        added += 1

print(f"Formulalar: {added} ta qo'shildi. Jami: {Formula.objects.count()}")

# ─── FIZIK BIRLIKLAR (SI) ───────────────────────────────────────────────────
SI_UNITS = [
    ('Metr', 'm', 'Uzunlik o\'lchov birligi', 'SI'),
    ('Kilogramm', 'kg', 'Massa o\'lchov birligi', 'SI'),
    ('Sekund', 's', 'Vaqt o\'lchov birligi', 'SI'),
    ('Amper', 'A', 'Elektr toki o\'lchov birligi', 'SI'),
    ('Kelvin', 'K', 'Termodinamik temperatura', 'SI'),
    ('Mol', 'mol', "Modda miqdori o'lchov birligi", 'SI'),
    ('Kandela', 'cd', "Yorug'lik kuchi o'lchov birligi", 'SI'),
    ('Nyuton', 'N', 'Kuch o\'lchov birligi (kg·m/s²)', 'SI'),
    ('Joul', 'J', 'Energiya o\'lchov birligi (N·m)', 'SI'),
    ('Vatt', 'W', 'Quvvat o\'lchov birligi (J/s)', 'SI'),
    ('Paskal', 'Pa', 'Bosim o\'lchov birligi (N/m²)', 'SI'),
    ('Kulon', 'C', 'Elektr zaryad o\'lchov birligi', 'SI'),
    ('Volt', 'V', 'Elektr kuchlanish o\'lchov birligi', 'SI'),
    ('Om', 'Ω', 'Elektr qarshilik o\'lchov birligi', 'SI'),
    ('Farad', 'F', "Sig'im o'lchov birligi", 'SI'),
    ('Genri', 'H', 'Induktivlik o\'lchov birligi', 'SI'),
    ('Veber', 'Wb', 'Magnit oqim o\'lchov birligi', 'SI'),
    ('Tesla', 'T', 'Magnit induksiya o\'lchov birligi', 'SI'),
    ('Gerts', 'Hz', 'Chastota o\'lchov birligi (1/s)', 'SI'),
    ('Bekerel', 'Bq', 'Radioaktivlik o\'lchov birligi', 'SI'),
]

CGS_UNITS = [
    ('Santimetr', 'cm', 'Uzunlik', 'CGS'),
    ('Gramm', 'g', 'Massa', 'CGS'),
    ('Sekund', 's', 'Vaqt', 'CGS'),
    ('Erg', 'erg', 'Energiya (1 erg = 10⁻⁷ J)', 'CGS'),
    ('Din', 'dyn', 'Kuch (1 dyn = 10⁻⁵ N)', 'CGS'),
    ('Poise', 'P', 'Dinamik qovushqoqlik', 'CGS'),
    ('Stokes', 'St', 'Kinematik qovushqoqlik', 'CGS'),
    ('Gauss', 'G', 'Magnit induksiya', 'CGS'),
    ('Eрsted', 'Oe', 'Magnit maydon kuchlanganligi', 'CGS'),
]

added_b = 0
for i, (nomi, belgi, desc, sis) in enumerate(SI_UNITS + CGS_UNITS):
    if not FizikBirlik.objects.filter(nomi=nomi, sistema=sis).exists():
        FizikBirlik.objects.create(nomi=nomi, belgi=belgi, sistema=sis, description=desc, order=i)
        added_b += 1

print(f"Birliklar: {added_b} ta qo'shildi. Jami: {FizikBirlik.objects.count()}")
