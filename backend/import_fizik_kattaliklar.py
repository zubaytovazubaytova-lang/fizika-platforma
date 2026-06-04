"""
Fizik kattaliklar bazaga import qilish
Ishlatish: python import_fizik_kattaliklar.py  (backend/ papkasida)
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from referenslar.models import FizikKattaik

# (nomi, belgi, olchov_birligi, description)
KATTALIKLAR = [
    # ── I BOB: MEXANIKA ──────────────────────────────────────────────
    ("Yo'l (masofa)",          "s",      "m",          "Jism bosib o'tgan masofa. Skalyar kattalik. s = v·t"),
    ("Ko'chish",               "Δr",     "m",          "Boshlang'ich va oxirgi nuqta orasidagi to'g'ri chiziq. Vektoral kattalik"),
    ("Tezlik",                 "v",      "m/s",        "Birlik vaqtda bosib o'tilgan yo'l. v = s/t"),
    ("O'rtacha tezlik",        "v_o",    "m/s",        "Umumiy yo'lning umumiy vaqtga nisbati. v = Δs/Δt"),
    ("Tezlanish",              "a",      "m/s²",       "Tezlikning vaqt birligidagi o'zgarishi. a = Δv/Δt"),
    ("Massa",                  "m",      "kg",         "Jismning inersiyasi va tortishish xususiyatini ifodalovchi skalyar kattalik"),
    ("Zichlik",                "ρ",      "kg/m³",      "Birlik hajmga to'g'ri keladigan massa. ρ = m/V"),
    ("Hajm",                   "V",      "m³",         "Jism egallagan fazoviy o'lcham"),
    ("Kuch",                   "F",      "N",          "Jismga ta'sir etuvchi mexanik ta'sir. F = m·a. 1N = 1kg·m/s²"),
    ("Tortishish kuchi",       "F_t",    "N",          "Ikki jism orasidagi gravitatsion tortishish kuchi. F = G·Mm/r²"),
    ("Elastiklik kuchi",       "F_el",   "N",          "Cho'zilgan yoki siqilgan jismning tiklanish kuchi. F = k·x (Guk qonuni)"),
    ("Ishqalanish kuchi",      "F_ish",  "N",          "Sirtlar orasidagi harakatga qarshilik kuchi. F = μ·N"),
    ("Bosim",                  "p",      "Pa",         "Birlik yuzaga perpendikulyar ta'sir etuvchi kuch. p = F/S. 1Pa = N/m²"),
    ("Ish",                    "A",      "J",          "Kuchning siljish yo'nalishidagi tashkil etuvchisiga ko'paytmasi. A = F·s·cosα"),
    ("Quvvat",                 "P",      "W",          "Birlik vaqtda bajarilgan ish. P = A/t. 1W = J/s"),
    ("Kinetik energiya",       "E_k",    "J",          "Jismning harakati tufayli ega bo'lgan energiyasi. Ek = mv²/2"),
    ("Potensial energiya",     "E_p",    "J",          "Jismning holati tufayli ega bo'lgan energiyasi. Ep = mgh"),
    ("Impuls",                 "p",      "kg·m/s",     "Massa va tezlik ko'paytmasi. Vektoral kattalik. p = m·v"),
    ("Burchak tezligi",        "ω",      "rad/s",      "Aylanma harakatda burchak o'zgarish tezligi. ω = 2π/T"),
    ("Aylanish davri",         "T",      "s",          "To'liq bir aylanishga ketadigan vaqt. T = 1/ν"),
    ("Chastota",               "ν",      "Hz",         "Birlik vaqtdagi to'liq aylanishlar soni. ν = 1/T. 1Hz = 1/s"),
    ("Tortishish doimiysi",    "G",      "N·m²/kg²",   "Universal gravitatsion doimiy. G = 6.674×10⁻¹¹ N·m²/kg². Konstanta"),
    ("Erkin tushish tezlanishi","g",     "m/s²",       "Yer tortishi tezlanishi. g ≈ 9.8 m/s². Konstanta"),

    # ── II BOB: TERMODINAMIKA ──────────────────────────────────────────
    ("Harorat (Kelvin)",       "T",      "K",          "Absolyut harorat. T = t + 273 K. Issiqlik harakatining o'lchovi"),
    ("Harorat (Celsius)",      "t",      "°C",         "Celsius shkalasdagi harorat. t = T − 273"),
    ("Moddaning miqdori",      "ν",      "mol",        "Modda miqdorini ifodalovchi kattalik. ν = m/M"),
    ("Molyar massa",           "M",      "kg/mol",     "1 mol moddaning massasi"),
    ("Avogadro soni",          "N_A",    "1/mol",      "1 moldagi zarralar soni. N_A = 6.022×10²³ mol⁻¹. Konstanta"),
    ("Bolsman konstantasi",    "k_B",    "J/K",        "Molekulalar kinetik energiyasini harorat bilan bog'lovchi. k = 1.38×10⁻²³ J/K. Konstanta"),
    ("Universal gaz doimiysi", "R",      "J/(mol·K)",  "Ideal gaz qonunidagi doimiy. R = 8.314 J/(mol·K). Konstanta"),
    ("Ichki energiya",         "U",      "J",          "Sistemaning barcha molekulalari energiyasi yig'indisi. ΔU = Q − A"),
    ("Issiqlik miqdori",       "Q",      "J",          "Issiqlik almashinuvidagi energiya. Q = c·m·Δt"),
    ("Solishtirma issiqlik",   "c",      "J/(kg·K)",   "1 kg moddani 1 K ga qizdirish uchun kerak issiqlik miqdori"),
    ("Bug'lanish issiqligi",   "L",      "J/kg",       "1 kg suyuqlikni bug'ga aylantirish uchun kerak issiqlik. Q = L·m"),
    ("Erish issiqligi",        "λ",      "J/kg",       "1 kg qattiq jismni eritish uchun kerak issiqlik. Q = λ·m"),
    ("Foydali ish koeffitsienti","η",    "%",          "Foydali ish va sarflangan energiya nisbati. η = A/Q × 100%"),

    # ── III BOB: ELEKTR ────────────────────────────────────────────────
    ("Elektr zaryad",          "q",      "Kl (C)",     "Zarrachaning elektr xususiyati. 1 Kl = 1 A·s"),
    ("Elektron zaryadi",       "e",      "Kl",         "Eng kichik elementar zaryad. e = 1.6×10⁻¹⁹ Kl. Konstanta"),
    ("Tok kuchi",              "I",      "A",          "Birlik vaqtda o'tuvchi zaryad. I = q/t"),
    ("Kuchlanish",             "U",      "V",          "Elektr maydonining ish qilish qobiliyati. U = A/q"),
    ("Elektr qarshilik",       "R",      "Ω",          "O'tkazgichning tok o'tkazishga qarshiligi. R = U/I (Om qonuni)"),
    ("O'ziga xos qarshilik",   "ρ",      "Ω·m",        "Moddaning elektr o'tkazuvchanlik xususiyati. R = ρl/S"),
    ("Elektr yurg. kuch",      "ε",      "V",          "Tok manbaida zaryad harakatini ta'minlovchi kuch. EYuK"),
    ("Sig'im",                 "C",      "F",          "Kondensatorning zaryad to'plash qobiliyati. C = q/U. 1F = C/V"),
    ("Elektr maydon kuchlanganligi","E", "V/m",        "Birlik zaryadga ta'sir etuvchi elektr kuchi. E = F/q"),
    ("Elektr quvvati",         "P",      "W",          "Birlik vaqtdagi elektr ishi. P = U·I = I²·R"),
    ("Kondensator energiyasi", "W",      "J",          "Zaryadlangan kondensatorda to'plangan energiya. W = C·U²/2"),

    # ── MAGNIT MAYDON ──────────────────────────────────────────────────
    ("Magnit induksiya",       "B",      "T",          "Magnit maydonining kuch xarakteristikasi. B = F/(I·l). 1T = 1Vb/m²"),
    ("Magnit oqimi",           "Φ",      "Vb",         "Magnit maydoni chiziqlarining yuz bo'ylab o'tishi. Φ = B·S·cosα"),
    ("Induktivlik",            "L",      "Gn",         "G'altakning o'zinduksiya hodisasi xarakteristikasi. L = Φ/I"),
    ("Lorens kuchi",           "F_L",    "N",          "Magnit maydonida zaryadlangan zarrachaga ta'sir etuvchi kuch. F = q·v·B·sinα"),
    ("Amper kuchi",            "F_A",    "N",          "Magnit maydonida tok o'tuvchi o'tkazgichga ta'sir etuvchi kuch. F = B·I·l·sinα"),
    ("Induksiya EYuK",         "ε",      "V",          "Magnit oqimi o'zgarganda hosil bo'luvchi EYuK. ε = −ΔΦ/Δt (Faraday qonuni)"),

    # ── IV BOB: OPTIKA ─────────────────────────────────────────────────
    ("Yorug'lik tezligi",      "c",      "m/s",        "Vakuumdagi yorug'lik tezligi. c = 3×10⁸ m/s. Konstanta"),
    ("To'lqin uzunligi",       "λ",      "m, nm",      "Ikki qo'shni tebranishli nuqta orasidagi masofa. λ = c/ν"),
    ("Yorug'lik chastotasi",   "ν",      "Hz",         "Yorug'lik to'lqinining bir sekunddagi tebranishi. ν = c/λ"),
    ("Sindirish ko'rsatkichi", "n",      "—",          "Vakuumdagi va moddadagi yorug'lik tezligi nisbati. n = c/v. O'lchamsiz"),
    ("Yorug'lik oqimi",        "Φ",      "lm",         "Manba chiqarayotgan yorug'lik miqdori. lm (lyumen)"),
    ("Yoritilganlik",          "E",      "lk",         "Birlik yuzga tushadigan yorug'lik oqimi. E = Φ/S. 1lk = lm/m²"),
    ("Linza kuchi",            "D",      "Dioptri",    "Linzaning nur sindirish qobiliyati. D = 1/f"),
    ("Fokus masofasi",         "f",      "m",          "Linza markazidan fokus nuqtasigacha bo'lgan masofa. 1/f = 1/d₀ + 1/dᵢ"),

    # ── V BOB: KVANT VA ATOM FIZIKASI ──────────────────────────────────
    ("Planck konstantasi",     "h",      "J·s",        "Kvant fizikasining asosiy konstantasi. h = 6.626×10⁻³⁴ J·s. Konstanta"),
    ("Foton energiyasi",       "E",      "J",          "Foton (yorug'lik kvanti) energiyasi. E = h·ν = hc/λ"),
    ("Foton impulsi",          "p",      "kg·m/s",     "Fotonning mexanik impulsi. p = h/λ"),
    ("Chiqish ishi",           "A",      "J, eV",      "Fotoeffektda elektronni metaldan chiqarish uchun ketadigan minimal energiya. A = h·ν₀"),
    ("Elektron-volt",          "eV",     "J",          "Kichik energiyalar birligi. 1 eV = 1.6×10⁻¹⁹ J"),
    ("Massa-energiya",         "E",      "J",          "Massaning energiyaga ekvivalentligi. E = m·c² (Eynshteyn qonuni)"),
    ("Proton massasi",         "m_p",    "kg",         "Proton zarrachasi massasi. m_p = 1.673×10⁻²⁷ kg. Konstanta"),
    ("Neytron massasi",        "m_n",    "kg",         "Neytron zarrachasi massasi. m_n = 1.675×10⁻²⁷ kg. Konstanta"),
    ("Elektron massasi",       "m_e",    "kg",         "Elektron zarrachasi massasi. m_e = 9.109×10⁻³¹ kg. Konstanta"),
    ("Yarim yemirilish davri", "T₁/₂",   "s",          "Radioaktiv moddaning yarmisi yemirilishi uchun ketadigan vaqt. T = ln2/λ"),
    ("Yemirilish doimiysi",    "λ",      "1/s",        "Radioaktiv yemirilish tezligini ifodalovchi doimiy. ΔN = −λ·N·Δt"),
    ("Mass soni",              "A",      "—",          "Atom yadrosidagi barcha nuklonlar soni. A = Z + N"),
    ("Atom (tartib) raqami",   "Z",      "—",          "Atom yadrosidagi protonlar soni. Davriy sistemadagi o'rni"),
    ("Yadro energiyasi",       "Q",      "J, MeV",     "Yadro reaksiyasida ajraladigan/yutiluvchi energiya. Q = Δm·c²"),
]

print("Fizik kattaliklar import qilinmoqda...")
print("=" * 55)

# Eski ma'lumotlarni o'chirib yangilash
deleted = FizikKattaik.objects.all().delete()
print(f"Eski yozuvlar o'chirildi: {deleted[0]} ta")

ok = 0
for i, (nomi, belgi, birlik, desc) in enumerate(KATTALIKLAR):
    FizikKattaik.objects.create(
        nomi=nomi,
        belgi=belgi,
        olchov_birligi=birlik,
        description=desc,
        is_published=True,
        order=i + 1,
    )
    print(f"  ✅ [{i+1:02d}] {nomi:<30} {belgi:<8} {birlik}")
    ok += 1

print()
print("=" * 55)
print(f"✅ Jami kiritildi: {ok} ta kattalik")
print(f"📊 Baza tekshiruvi: {FizikKattaik.objects.count()} ta yozuv")
