"""
Umumiy Fizika kursi — to'liq maruza matnlarini import qilish.
Course → Topic → Lesson (content=maruza matni) modellariga yozadi.

Ishlatish:
    python import_umumiy_fizika_maruza.py   (backend/ papkasida)
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Course, Category, Topic, Lesson

User = get_user_model()

# ── Admin foydalanuvchini topish ─────────────────────────────────────────────
teacher = User.objects.filter(is_superuser=True).first()
if not teacher:
    teacher = User.objects.first()
if not teacher:
    print("❌ Foydalanuvchi topilmadi. Avval superuser yarating.")
    sys.exit(1)

# ── Kategoriya ───────────────────────────────────────────────────────────────
cat, _ = Category.objects.get_or_create(
    slug='umumiy-fizika',
    defaults={'name': 'Umumiy Fizika'},
)

# ── Kurs ─────────────────────────────────────────────────────────────────────
course, created = Course.objects.get_or_create(
    slug='umumiy-fizika-universiteti',
    defaults={
        'title':       'Umumiy Fizika',
        'description': (
            "Universitetning 1-4 semestrlari uchun to'liq umumiy fizika kursi.\n"
            "Mexanika, Termodinamika, Elektr va magnit, Optika, Kvant va Yadro fizikasi."
        ),
        'category':    cat,
        'teacher':     teacher,
        'level':       Course.Level.ADVANCED,
        'is_published': True,
    }
)
if not created:
    print(f"ℹ️  Mavjud kurs: {course.title}")
    course.topics.all().delete()
    print("   Eski bo'limlar o'chirildi.")
else:
    print(f"✅ Yangi kurs yaratildi: {course.title}")

# ═══════════════════════════════════════════════════════════════════════════════
#  MARUZA MATNLARI
#  Har bir element: (topic_sarlavha, [ (dars_sarlavha, maruza_matni), ... ])
# ═══════════════════════════════════════════════════════════════════════════════

KURS_TUZILMASI = [

# ══════════════════════════════════════════════════════════════════════════════
# I BOB — MEXANIKA
# ══════════════════════════════════════════════════════════════════════════════
(
  "I BOB. Kinematika",
  [
    (
      "1. Kirish. Fizikaning predmeti va tadqiqot metodlari",
      """\
FIZIKANING PREDMETI VA TADQIQOT METODLARI
==========================================

1.1 Fizika nima?
-----------------
Fizika — tabiat fanlari orasida eng asosiysi bo'lib, moddaning tuzilishi,
xossalari va harakati qonunlarini o'rganadi. "Fizika" so'zi yunoncha
"physis" — tabiat so'zidan olingan.

Fizika ikki katta sohaga bo'linadi:
  • Klassik fizika  — XVII–XIX asrlarda yaratilgan (mexanika, termodinamika,
    elektrodinamika, optika)
  • Zamonaviy fizika — XX asrdan (kvant mexanikasi, nisbiylik nazariyasi,
    yadro va elementar zarralar fizikasi)

1.2 Fizikaning tadqiqot metodlari
-----------------------------------
  1) Kuzatish — tabiat hodisalarini bevosita kuzatish
  2) Tajriba (eksperiment) — sun'iy sharoitda hodisani tekshirish
  3) Nazariy tahlil — matematik modellar va qonunlar yaratish
  4) Kompyuter modellashtirish — murakkab tizimlarni hisoblash

1.3 O'lchov va SI sistemasi
-----------------------------
Fizik kattalikni o'lchash — uni standart birlik bilan taqqoslash:
    x = n · [x]
bu yerda n — son qiymati, [x] — o'lchov birligi.

Xalqaro birliklar sistemasi (SI) 7 ta asosiy birlikka ega:

  Kattaik          Birlik       Belgi
  ─────────────────────────────────────
  Uzunlik          metr          m
  Massa            kilogram      kg
  Vaqt             sekund        s
  Tok kuchi        amper         A
  Harorat          kelvin        K
  Modda miqdori    mol           mol
  Yorug'lik kuchi  kandela       cd

1.4 O'lchov xatoliklari
------------------------
Har qanday o'lchov ma'lum xatolikka ega:
  • Absolut xatolik:  Δx = |x_o'lchangan − x_haqiqiy|
  • Nisbiy xatolik:   δ = Δx / x × 100%

Xatolik manbalari: asbob aniqligi, muhit ta'siri, kuzatuvchi xatosi.

Nazorat savollari:
  1. Fizikaning boshqa fanlardan farqi nimada?
  2. SI sistemasining 7 ta asosiy birligini keltiring.
  3. Absolut va nisbiy xatolik nima?
""",
    ),
    (
      "2. Moddiy nuqta kinematikasi. Koordinatalar sistemasi",
      """\
MODDIY NUQTA KINEMATIKASI
===========================

2.1 Moddiy nuqta tushunchasi
------------------------------
Moddiy nuqta — o'lchamlari masala shartida e'tiborga olinmaydigan jism.
Masalan, Yer Quyosh atrofida aylanishida Yer moddiy nuqta sifatida qarash mumkin.

2.2 Koordinatalar sistemasi
------------------------------
Harakatni tasvirlash uchun:
  • Tayanch jism (sanash sistemasi)
  • Koordinatalar sistemasi
  • Vaqtni o'lchash usuli kerak

Dekart koordinatalar sistemasi:
    Nuqta holati: r = (x, y, z)
    Masalan:  A(2, 3, 5) — A nuqta x=2m, y=3m, z=5m da joylashgan

2.3 Radius-vektor va ko'chish
------------------------------
Radius-vektor — koordinatalar boshidan nuqtaga tortilgan vektor:
    r⃗ = x·î + y·ĵ + z·k̂

Ko'chish (displacement) — boshlang'ich va oxirgi holat farqi:
    Δr⃗ = r⃗₂ − r⃗₁

Muhim: yo'l |Δr⃗| dan katta yoki teng bo'ladi (s ≥ |Δr⃗|)

2.4 Vaqt va harakat tenglamasi
-------------------------------
Nuqtaning koordinatalar vaqt bo'yicha o'zgarishi harakat tenglamasi:
    x = x(t),  y = y(t),  z = z(t)

Masalan, parabolik harakat:
    x = v₀·t
    y = h − ½·g·t²

Nazorat savollari:
  1. Moddiy nuqtaning qanday sharoitda qo'llaniladi?
  2. Ko'chish va yo'lning farqini misolda ko'rsating.
  3. Harakat tenglamasi nima?
""",
    ),
    (
      "3. Tezlik va tezlanish vektorlari",
      """\
TEZLIK VA TEZLANISH VEKTORLARI
================================

3.1 O'rtacha tezlik
--------------------
O'rtacha tezlik — ko'chishning vaqtga nisbati:
    v⃗_ort = Δr⃗ / Δt     [m/s]

O'rtacha yo'l tezligi:
    <v> = s / Δt

3.2 Lahzaviy tezlik
--------------------
Δt → 0 da o'rtacha tezlikning chegarasi:
    v⃗ = dr⃗/dt = lim(Δt→0) Δr⃗/Δt

Tashkil etuvchilari:
    vₓ = dx/dt,  v_y = dy/dt,  v_z = dz/dt

Tezlik moduli:
    v = √(vₓ² + v_y² + v_z²)

Yo'nalishi — traektoriyaga urinma bo'ylab.

3.3 Tezlanish
--------------
Tezlanish — tezlikning vaqt bo'yicha o'zgarishi:
    a⃗ = dv⃗/dt = d²r⃗/dt²     [m/s²]

Tashkil etuvchilari:
    aₓ = dvₓ/dt,  a_y = dv_y/dt,  a_z = dv_z/dt

3.4 Tezlanishning normal va tangens tashkil etuvchilari
---------------------------------------------------------
Egri chiziqli harakatda tezlanish ikkiga bo'linadi:

  Tangens (o'q bo'ylab):  aτ = dv/dt
    Tezlik modulini o'zgartiradi

  Normal (markazga):  aₙ = v²/R
    Tezlik yo'nalishini o'zgartiradi (R — egrilik radiusi)

To'liq tezlanish:
    a = √(aτ² + aₙ²)

Misal: Avtomobil R=100m li burilishda v=20m/s tezlikda aₙ = 20²/100 = 4 m/s²

Nazorat savollari:
  1. O'rtacha va lahzaviy tezlikning farqi?
  2. Tekis aylana harakatda aτ va aₙ qanday bo'ladi?
  3. Tezlanish qanday birliklarda o'lchanadi?
""",
    ),
    (
      "4. To'g'ri chiziqli tekis va tekis o'zgaruvchan harakat",
      """\
TO'G'RI CHIZIQLI TEKIS VA TEKIS O'ZGARUVCHAN HARAKAT
======================================================

4.1 Tekis harakat (a = 0)
--------------------------
Tezlik doimiy: v = const

Harakat tenglamalari:
    x(t) = x₀ + v·t
    v = const

Grafik:
  v-t grafigi — gorizontal to'g'ri chiziq
  x-t grafigi — qiya to'g'ri chiziq (egilish burchagi = v)

4.2 Tekis tezlanuvchan harakat
--------------------------------
Tezlanish doimiy: a = const

Asosiy formulalar:
    v(t) = v₀ + a·t
    x(t) = x₀ + v₀·t + ½·a·t²
    v² = v₀² + 2·a·(x − x₀)

O'rtacha tezlik:
    v_ort = (v₀ + v) / 2   (faqat a = const uchun)

4.3 Erkin tushish
------------------
Tortishish kuchi tezlanishi: g ≈ 9.81 m/s² (yerda)
    g = 9.78 m/s² (ekvator)  →  g = 9.83 m/s² (qutb)

Vertikal tushish (boshlang'ich tezlik nol):
    v(t) = g·t
    h(t) = ½·g·t²
    v²   = 2·g·h

Yuqoriga otilish:
    Eng yuqori nuqtada: v = 0  →  t_max = v₀/g
    Maksimal balandlik: H = v₀²/(2g)

Misollar:
  a) 20 m balandlikdan tushib kelgan jismning tezligi:
     v = √(2·9.8·20) = √392 ≈ 19.8 m/s

  b) Yerdan v₀=15 m/s yuqoriga otildi. Maksimal balandlik:
     H = 15²/(2·9.8) = 225/19.6 ≈ 11.5 m

Nazorat savollari:
  1. Tekis harakat va tekis tezlanuvchan harakatning farqi?
  2. Erkin tushishda t=3s da tezlik va bosib o'tilgan yo'l?
  3. v²=v₀²+2ax formulasini qachon ishlatish qulay?
""",
    ),
    (
      "5. Qiya otish kinematikasi",
      """\
QIYA OTISH KINEMATIKASI
========================

5.1 Harakat tenglamalari
-------------------------
Gorizontalga α burchak ostida v₀ bilan otilgan jism:

Tashkil etuvchilar bo'yicha:
    vₓ = v₀·cos α  = const
    v_y(t) = v₀·sin α − g·t

Koordinatalar:
    x(t) = v₀·cos α · t
    y(t) = v₀·sin α · t − ½·g·t²

5.2 Asosiy parametrlar
-----------------------
Parvoz vaqti (y=0 dagi ikkinchi vaqt):
    T = 2·v₀·sin α / g

Maksimal balandlik:
    H = v₀²·sin²α / (2g)

Uchish masofasi:
    L = v₀²·sin(2α) / g

Eng katta masofa α = 45° da:
    L_max = v₀² / g

5.3 Traektoriya tenglamasi
---------------------------
t ni x dan ifodalab y(x) topiladi:
    y = x·tan α − g·x² / (2·v₀²·cos²α)

Bu — parabolaning tenglamasi.

Misollar:
  a) v₀=20 m/s, α=30°:
     H = 400·sin²30° / 19.6 = 400·0.25 / 19.6 ≈ 5.1 m
     L = 400·sin60° / 9.8 = 400·0.866 / 9.8 ≈ 35.4 m

  b) Futbol to'pi v₀=15 m/s, α=45°:
     L = 225 / 9.8 ≈ 23 m

Nazorat savollari:
  1. Qiya otishda uchish masofasi maksimal bo'lishi uchun α nechaga teng?
  2. Parvoz vaqti qaysi parametrga bog'liq?
  3. Traektoriya qanday egri chiziq?
""",
    ),
    (
      "6. Aylana bo'ylab harakat. Burchak tezligi",
      """\
AYLANA BO'YLAB HARAKAT
=======================

6.1 Asosiy tushunchalar
------------------------
Burchak ko'chish (rad):    φ
Burchak tezligi (rad/s):   ω = dφ/dt
Burchak tezlanish (rad/s²): β = dω/dt

Tekis aylana harakatda: ω = const = 2π/T = 2π·ν

6.2 Chiziqli va burchak kattaliklar bog'liqligi
-------------------------------------------------
    v   = ω·R        (chiziqli tezlik)
    aₙ  = ω²·R = v²/R  (normal tezlanish)
    aτ  = β·R        (tangens tezlanish)

6.3 Tekis o'zgaruvchan aylana harakat
---------------------------------------
    ω(t) = ω₀ + β·t
    φ(t) = φ₀ + ω₀·t + ½·β·t²
    ω²  = ω₀² + 2·β·φ

6.4 Velosipedning g'ildiragi misoli
-------------------------------------
R=0.35 m, v=10 m/s bo'lsa:
  ω = v/R = 10/0.35 ≈ 28.6 rad/s
  T = 2π/ω = 2π/28.6 ≈ 0.22 s
  aₙ = v²/R = 100/0.35 ≈ 286 m/s²

Nazorat savollari:
  1. ω va v orasidagi bog'liqlik formulasini keltiring.
  2. Normal va tangens tezlanishlarning fizik ma'nosi?
  3. Soat mili uchun ω ni hisoblang.
""",
    ),
    (
      "7. Nisbiy harakat. Galiley almashtirishlari",
      """\
NISBIY HARAKAT VA GALILEY ALMASHTIRISHLARI
==========================================

7.1 Sanash sistemalari
-----------------------
Inersial sanash sistemasi — tashqi kuchsiz jism tekis chiziqli harakat
qiladigan (yoki tinch turadigan) sistema.

Galiley printsipi: barcha inersial sistemalarda mexanika qonunlari bir xil.

7.2 Galiley almashtirishlari
------------------------------
K' sistema K ga nisbatan Ox o'qi bo'ylab V tezlikda harakatlansin:

    x' = x − V·t
    y' = y
    z' = z
    t' = t    (mutlaq vaqt)

Tezlik qo'shilishi:
    v'ₓ = vₓ − V
    v'_y = v_y

Vektoral ko'rinishda:
    v⃗' = v⃗ − V⃗

7.3 Misollar
--------------
Yomg'ir tomchisi vertikal v_y=5 m/s tushmoqda. Gorizontal v_x=3 m/s
shamol esmoqda. Tomchi tezligi:
    v = √(5² + 3²) = √34 ≈ 5.8 m/s

Poyezd ichidagi yo'lovchi V=20 m/s, oldinga v'=5 m/s yursa:
Yerga nisbatan: v = 25 m/s

Nazorat savollari:
  1. Galiley almashtirish formulalarini yozing.
  2. Nisbiy tezlik qanday topiladi?
  3. Inersial sanash sistemasi deganda nima tushuniladi?
""",
    ),
  ]
),

(
  "II BOB. Dinamika",
  [
    (
      "8. Nyutonning qonunlari",
      """\
NYUTONNING QONUNLARI
=====================

8.1 Nyutonning birinchi qonuni (inersiya qonuni)
-------------------------------------------------
"Tashqi kuchlar ta'sir etmasa yoki ularning natijasi nol bo'lsa,
jism tinch turadi yoki tekis chiziqli harakatlanishda davom etadi."

    ΣF⃗ = 0  →  v⃗ = const

Inersiya — jismning harakatini o'zgartirmaslikka intilishi.

8.2 Nyutonning ikkinchi qonuni
--------------------------------
"Jism tezlanishi unga ta'sir etuvchi kuchlar yig'indisiga to'g'ri,
massasiga teskari proporsional."

    F⃗ = m·a⃗     [N = kg·m/s²]

Tashkil etuvchilar bo'yicha:
    Fₓ = m·aₓ
    F_y = m·a_y
    F_z = m·a_z

Muhim: F — natijaviy kuch (barcha kuchlar vektoral yig'indisi)

8.3 Nyutonning uchinchi qonuni
--------------------------------
"Har bir ta'sirga teng va qarama-qarshi yo'nalishli kuch bilan
javob beriladi."

    F⃗₁₂ = −F⃗₂₁

Diqqat: bu ikki kuch turli jismlarga ta'sir etadi!

8.4 Massa va og'irlik farqi
-----------------------------
  Massa m — inersiya o'lchovi (kg) — joyga bog'liq emas
  Og'irlik W = m·g — yerning tortish kuchi (N) — joyga bog'liq

  Yer yuzida: g = 9.8 m/s²
  Oyda: g = 1.6 m/s²  →  W_oy = m·1.6 (massa o'zgarmaydi!)

Misollar:
  a) m=5 kg jismga F=20 N ta'sir etsa:  a = F/m = 20/5 = 4 m/s²
  b) Lift tezlanadi a=2 m/s²:
     Og'irlik apparatida ko'rsatma = m(g+a) = 70·11.8 = 826 N

Nazorat savollari:
  1. Nyutonning 1-qonunini formulalang.
  2. Massa va og'irlik farqi?
  3. Liftda og'irliksizlik hodisasi qachon yuzaga keladi?
""",
    ),
    (
      "9. Tortishish qonuni. Gravitatsiya maydoni",
      """\
TORTISHISH QONUNI
==================

9.1 Umumjahon tortishish qonuni
---------------------------------
Newton (1687): Har ikki jism o'rtasidagi tortishish kuchi ularning
massalariga to'g'ri va oraliq kvadratiga teskari proporsional:

    F = G · (m₁·m₂) / r²

    G = 6.674 × 10⁻¹¹ N·m²/kg²  — gravitatsion doimiy

9.2 Erkin tushish tezlanishi
-----------------------------
Yerning tortish kuchi: F = G·M_Z·m / R_Z²

    g = G·M_Z / R_Z²

    M_Z = 5.97 × 10²⁴ kg
    R_Z = 6.37 × 10⁶ m
    g = 6.674·10⁻¹¹ · 5.97·10²⁴ / (6.37·10⁶)² ≈ 9.8 m/s²

Balandlikda:  g(h) = G·M_Z / (R_Z + h)²

9.3 Sun'iy yo'ldosh harakat tezligi
-------------------------------------
Aylana orbitadagi sun'iy yo'ldosh uchun:
    m·v²/R = G·M·m/R²
    v = √(G·M/R)

Yer yuzida birinchi kosmik tezlik:
    v₁ = √(g·R_Z) = √(9.8 · 6.37·10⁶) ≈ 7.9 km/s

9.4 Og'irliksizlik
-------------------
Erkin tushayotgan sistemada gravitatsiya ta'sirini his etmaydi.
  • Kosmik kemada astronavt og'irliksizlik holatida
  • Bunga sabab — kema va astronavt bir xil tezlanish bilan tushadi

Nazorat savollari:
  1. G ning SI dagi birligi?
  2. g balandlik ortishi bilan qanday o'zgaradi?
  3. Birinchi kosmik tezlik nimani anglatadi?
""",
    ),
    (
      "10. Impuls. Impuls saqlanish qonuni",
      """\
IMPULS VA IMPULS SAQLANISH QONUNI
==================================

10.1 Impuls tushunchasi
------------------------
Jism impulsi — massa va tezlik ko'paytmasi:
    p⃗ = m·v⃗     [kg·m/s]

Nyutonning ikkinchi qonuni impuls orqali:
    F⃗ = dp⃗/dt

Kuch impulsi:
    J⃗ = F⃗·Δt = Δp⃗

10.2 Impuls saqlanish qonuni
------------------------------
Tashqi kuchlar ta'sir etmasa (yoki tashqi kuchlar nol):
    ΣF⃗_tashqi = 0  →  ΣP⃗ = const

    p⃗₁ + p⃗₂ + ... = const

10.3 To'qnashuv turlari
------------------------
Elastik to'qnashuv — kinetik energiya saqlanadi:
    ½m₁v₁² + ½m₂v₂² = ½m₁u₁² + ½m₂u₂²
    m₁v₁ + m₂v₂ = m₁u₁ + m₂u₂

  Tenг massali to'qnashuv:  u₁ = v₂,  u₂ = v₁  (tezliklar almashadi)

Absolyut noelastik to'qnashuv — jismlar birlashib ketadi:
    (m₁+m₂)·u = m₁v₁ + m₂v₂
    u = (m₁v₁ + m₂v₂) / (m₁+m₂)

10.4 Raketa harakati (Mesherskiy tenglamasi)
---------------------------------------------
    M·dv = −u·dM

Tsiolkovskiy formulasi:
    Δv = u · ln(M₀/M_k)

    u — gazning chiqish tezligi
    M₀ — boshlang'ich massa
    M_k — oxirgi massa

Misollar:
  a) 2 kg, 3 m/s jism to'xtab turgan 3 kg jism bilan to'qnashdi (noelastik):
     u = (2·3 + 3·0) / (2+3) = 6/5 = 1.2 m/s

Nazorat savollari:
  1. Impuls va kuch impulsi farqi?
  2. Elastik to'qnashuvda qanday kattaliklar saqlanadi?
  3. Raketaning harakat prinsipi nima?
""",
    ),
    (
      "11. Mexanik ish va energiya. Saqlanish qonuni",
      """\
MEXANIK ISH VA ENERGIYA
========================

11.1 Mexanik ish
-----------------
    A = F⃗ · s⃗ = F·s·cos α     [J = N·m]

    α = 0°:   A = F·s     (maks ish)
    α = 90°:  A = 0       (ishqalanish yo'q)
    α = 180°: A = −F·s    (qarshilik kuchi ishi)

O'zgaruvchan kuch ishi:
    A = ∫F·dx

11.2 Kinetik energiya
----------------------
    E_k = ½·m·v²     [J]

Ish — kinetik energiya teoremasi:
    A_natija = ΔE_k = ½m·v₂² − ½m·v₁²

11.3 Potensial energiya
------------------------
Yerning tortishiga qarshi ish:
    E_p = m·g·h

Elastik deformatsiya:
    E_p = ½·k·x²  (k — Guk koeffitsienti)

11.4 Mexanik energiya saqlanish qonuni
----------------------------------------
Konservativ kuchlar tizimida:
    E_k + E_p = const
    ½m·v² + m·g·h = const

Misollar:
  a) h=20 m dan tushayotgan jismning tezligi:
     ½mv² = mgh  →  v = √(2gh) = √(2·9.8·20) ≈ 19.8 m/s

  b) Prujina k=500 N/m, x=0.1 m qisilib, m=0.5 kg jism uchirib yuborildi:
     ½kx² = ½mv²
     v = x√(k/m) = 0.1·√(500/0.5) = 0.1·√1000 ≈ 3.16 m/s

11.5 Quvvat
-----------
    P = A/t = F·v·cos α     [W = J/s]

Nazorat savollari:
  1. Konservativ kuch nima?
  2. Mexanik energiya qachon saqlanadi?
  3. 100 W quvvat 10 s da qancha ish bajaradi?
""",
    ),
  ]
),

(
  "III BOB. Mexanik tebranishlar va to'lqinlar",
  [
    (
      "12. Erkin garmonik tebranishlar",
      """\
ERKIN GARMONIK TEBRANISHLAR
============================

12.1 Tebranish tenglamasi
--------------------------
Garmonik tebranish — koordinata sinusoidal o'zgaruvchi harakat:
    x(t) = A·cos(ω₀·t + φ₀)

bu yerda:
    A  — amplituda (maksimal og'ish) [m]
    ω₀ — sikllik chastota [rad/s]
    φ₀ — boshlang'ich faza [rad]
    T  = 2π/ω₀ — davr [s]
    ν  = 1/T — chastota [Hz]

Differensial tenglama:
    ẍ + ω₀²·x = 0

12.2 Prujinali mayatnik
------------------------
    ω₀ = √(k/m)      T = 2π√(m/k)

    k — prujina qattiqligi [N/m]
    m — jism massasi [kg]

Davr massaga bog'liq, amplitudaga bog'liq emas!

12.3 Matematik mayatnik
------------------------
    ω₀ = √(g/L)      T = 2π√(L/g)

Faqat kichik og'ishlarda (α < 5°) to'g'ri.

    g = 4π²L/T²   (g ni tajribada aniqlash formulasi)

12.4 Tebranish energiyasi
--------------------------
    E = ½m·ω₀²·A²  = const

Kinetik:   E_k = ½mω₀²A²·sin²(ω₀t+φ₀)
Potensial: E_p = ½mω₀²A²·cos²(ω₀t+φ₀)

Misollar:
  a) m=0.2 kg, k=80 N/m:
     T = 2π√(0.2/80) = 2π·0.05 ≈ 0.314 s
     ν = 1/T ≈ 3.18 Hz

  b) L=1 m mayatnik:
     T = 2π√(1/9.8) ≈ 2.01 s

Nazorat savollari:
  1. Garmonik tebranish amplitudasi nimalarga bog'liq?
  2. Matematik mayatnik davri nimaga bog'liq?
  3. Prujinali mayatnikda energiya qanday o'zgaradi?
""",
    ),
    (
      "13. So'nuvchi va majburiy tebranishlar. Rezonans",
      """\
SO'NUVCHI TEBRANISHLAR VA REZONANS
====================================

13.1 So'nuvchi tebranishlar
-----------------------------
Muhit qarshiligi tufayli amplituda kamayib boradi:
    x(t) = A₀·e^(−β·t)·cos(ω·t + φ)

    β — so'nish koeffitsienti
    ω = √(ω₀² − β²) — so'nuvchi tebranish chastotasi

So'nish dekrementi:
    δ = β·T = ln(Aₙ/Aₙ₊₁)

Sifat ko'rsatkichi:
    Q = π/(β·T) = ω₀/(2β)

    Q katta → sekin so'nadi

13.2 Majburiy tebranishlar
---------------------------
Tashqi davriy kuch F = F₀·cos(Ωt) ta'sirida:
    ẍ + 2β·ẋ + ω₀²·x = (F₀/m)·cos(Ωt)

Statsionar rejimda amplituda:
    A(Ω) = (F₀/m) / √((ω₀²−Ω²)² + 4β²Ω²)

13.3 Rezonans
--------------
Rezonans chastotasi: Ω_r = √(ω₀² − 2β²)

β → 0 da:  Ω_r → ω₀  va  A → ∞  (rezonansda amplituda maksimal)

Q katta bo'lsa rezonans keskin, kichik bo'lsa tekis.

13.4 Rezonans amalda
---------------------
  ✅ Foydali: radio qabul qilish, MRT asboblari, gitara rezonatori
  ❌ Zararli: ko'prik rezonans (Tacoma tor'i, 1940), turbina tebranishi

Nazorat savollari:
  1. So'nish dekrementi nima?
  2. Q faktorini oshirish uchun nima qilish kerak?
  3. Rezonans qanday amaliy qo'llaniladi?
""",
    ),
    (
      "14. Mexanik to'lqinlar. Tovush",
      """\
MEXANIK TO'LQINLAR VA TOVUSH
==============================

14.1 To'lqin tarqalishi
------------------------
To'lqin — muhitda energiyaning ko'chishsiz tarqalishi.

Turlari:
  • Ko'ndalang (transvers): tebranish v⃗ ga perpendikulyar (ip to'lqini)
  • Bo'ylama (longitüdinal): tebranish v⃗ bilan parallel (tovush)

To'lqin tenglamasi:
    ξ(x, t) = A·cos(ωt − kx)

    k = 2π/λ — to'lqin soni
    λ = v·T  — to'lqin uzunligi

To'lqin tezligi: v = λ·ν = ω/k

14.2 Tovush to'lqinlari
------------------------
Tovush — gazda bo'ylama to'lqin (bosim va zichlik o'zgarishi).

Havoda tovush tezligi:
    v_tovush = √(γ·P/ρ)  ≈ 340 m/s (20°C da)

    Harorat ortishi bilan v ortadi: v ≈ 331 + 0.6·t [m/s]

Suvda: ≈ 1500 m/s
Temirda: ≈ 5000 m/s

14.3 Tovush intensivligi va sathi
-----------------------------------
    I = P/S   [W/m²]

Decibel shkalasi:
    L = 10·lg(I/I₀)   [dB]
    I₀ = 10⁻¹² W/m²  (eshitish chegarasi)

  Shivirlaش: ~30 dB
  Suhbat: ~60 dB
  Samolyot: ~120 dB (og'riq chegarasi)

14.4 Doppler effekti
---------------------
Manba yoki kuzatuvchi harakatlanayotganda chastota o'zgaradi:
    ν' = ν₀ · (v ± v_kuzatuvchi) / (v ∓ v_manba)

    "+" — yaqinlashayotganda,  "−" — uzoqlashayotganda

Nazorat savollari:
  1. Ko'ndalang va bo'ylama to'lqin farqi?
  2. Tovush tezligi nimaga bog'liq?
  3. Doppler effektini misol bilan tushuntiring.
""",
    ),
  ]
),

(
  "IV BOB. Molekulyar fizika va termodinamika",
  [
    (
      "15. Ideal gaz modeli. MKN asoslari",
      """\
IDEAL GAZ VA MOLEKULYAR KINETIK NAZARIYA
=========================================

15.1 Molekulyar-kinetik nazariya postulatlari
----------------------------------------------
  1. Barcha moddalar molekulalardan iborat
  2. Molekulalar tinmay harakat qiladi
  3. Molekulalar bir-biri bilan va idish devorlari bilan to'qnashadi

15.2 Ideal gaz modeli
----------------------
Ideal gaz — molekulalar o'lchami e'tiborga olinmaydigan, ular
orasida faqat to'qnashuv bo'ladigan gaz modeli.

Holat tenglamasi (Mendeleev–Klapeyron):
    PV = νRT

    P — bosim [Pa]
    V — hajm [m³]
    ν — modda miqdori [mol]
    R = 8.314 J/(mol·K)
    T — mutlaq harorat [K]

Bir molekula uchun:
    PV = NkT
    k = R/Nₐ = 1.38 × 10⁻²³ J/K  (Bolsman konstantasi)
    Nₐ = 6.022 × 10²³ mol⁻¹ (Avogadro soni)

15.3 Bosim va kinetik energiya bog'liqligi
-------------------------------------------
    P = ⅓·n·m₀·<v²> = ⅔·n·<E_k>

    n — molekulalar soni zichligi (m⁻³)

O'rtacha kinetik energiya:
    <E_k> = ½m₀<v²> = 3kT/2

Shunday qilib:
    P = n·k·T

15.4 Energiyaning taqsimlanish teoremasi
------------------------------------------
Har bir erkinlik darajasiga kT/2 energiya to'g'ri keladi:
    E = (i/2)·kT

    i — erkinlik darajasi soni:
    Bir atomli gaz: i = 3
    Ikki atomli:    i = 5
    Ko'p atomli:    i = 6

Misollar:
  a) T=300 K da He atomi kinetik energiyasi:
     E = 3/2 · 1.38·10⁻²³ · 300 = 6.21 × 10⁻²¹ J

  b) STP da havo bosimi: P = 101325 Pa, n ni top:
     n = P/(kT) = 101325/(1.38·10⁻²³·273) = 2.68 × 10²⁵ m⁻³

Nazorat savollari:
  1. Ideal gazning real gazdan farqi?
  2. Harorat ortganda o'rtacha kinetik energiya qanday o'zgaradi?
  3. Erkinlik darajasi nima?
""",
    ),
    (
      "16. Termodinamikaning birinchi qonuni",
      """\
TERMODINAMIKANING BIRINCHI QONUNI
==================================

16.1 Ichki energiya
--------------------
Tizimning barcha mikroskopik kinetik va potensial energiyalari yig'indisi:
    U — ichki energiya [J]

Ideal gaz ichki energiyasi (faqat kinetik):
    U = (i/2)·νRT = (i/2)·NkT

16.2 Birinchi qonun
--------------------
Energiya saqlanish qonunining termodinamikadagi ko'rinishi:
    ΔU = Q − A

    Q — tizimga berilgan issiqlik
    A — tizim bajargan ish
    ΔU — ichki energiya o'zgarishi

Differensial ko'rinish:
    dU = δQ − δA    (δ — nointegral differensial)

16.3 Ideal gaz ishi
--------------------
    dA = P·dV

    A = ∫P dV (P-V diagrammada maydon)

Izoprotsesslar:
  Izoxor (V=const):   A = 0,  Q = ΔU = νCᵥΔT
  Izobar (P=const):   A = PΔV = νRΔT,  Q = νCₚΔT
  Izoterm (T=const):  ΔU = 0,  Q = A = νRT·ln(V₂/V₁)
  Adiabat (Q=0):      ΔU = −A,  A = −νCᵥΔT

16.4 Issiqlik sig'imlari
------------------------
    Cᵥ = (i/2)·R       (hajm doimiy)
    Cₚ = (i/2+1)·R    (bosim doimiy)
    γ = Cₚ/Cᵥ = (i+2)/i

  Bir atomli: γ = 5/3 ≈ 1.67
  Ikki atomli: γ = 7/5 = 1.4
  Ko'p atomli: γ = 8/6 = 4/3

Nazorat savollari:
  1. ΔU = Q − A formulasini fizik ma'nosini tushuntiring.
  2. Adiabatik jarayonda qanday shart bajariladi?
  3. Cₚ > Cᵥ bo'lishining sababi?
""",
    ),
    (
      "17. Termodinamikaning ikkinchi qonuni. Entropiya",
      """\
TERMODINAMIKANING IKKINCHI QONUNI VA ENTROPIYA
===============================================

17.1 Ikkinchi qonunning formulanmalari
---------------------------------------
  • Kelvin formulasi: issiqlikni to'liq ish ga aylantirib bo'lmaydi
    (boshqa o'zgarishsiz)
  • Clausius formulasi: issiqlik o'zi-o'zicha sovuq jismdan
    issiq jismga o'ta olmaydi

17.2 Karnot sikli
------------------
Eng yuqori FIK ga ega ideal issiqlik mashina sikli:
    η_Karnot = 1 − T₂/T₁

    T₁ — qizdiruvchi harorati
    T₂ — sovutuvchi harorati

Amaliy mashinalar: η < η_Karnot

Misol: T₁=600K, T₂=300K:
    η_max = 1 − 300/600 = 0.5 = 50%

17.3 Entropiya
---------------
Qaytmas jarayon o'lchovi:
    dS = δQ_qaytish / T     [J/K]

Clausius munosabati (qaytmas jarayon):
    dS > δQ/T

Termodinamikaning 2-qonuni entropiya orqali:
    Yopiq tizimda S faqat ortadi yoki doimiy qoladi:
    ΔS ≥ 0

17.4 Statistik talqin (Bolsman)
---------------------------------
    S = k·ln W

    W — termodinamik ehtimollik (mikroholatlar soni)
    k — Bolsman konstantasi

Entropiya — tartibsizlik o'lchovi.

Misol: Ideal gaz izoterm kengayishi:
    ΔS = νR·ln(V₂/V₁) > 0  (V₂ > V₁ bo'lsa)

Nazorat savollari:
  1. Karnot FIK qanday oshiriladi?
  2. Entropiyaning statistik ma'nosi nima?
  3. Yopiq tizimda S qanday o'zgaradi?
""",
    ),
  ]
),

(
  "V BOB. Elektrostatika",
  [
    (
      "18. Kulon qonuni. Elektr maydon",
      """\
KULON QONUNI VA ELEKTR MAYDON
==============================

18.1 Elektr zaryad
-------------------
    q — elektr zaryad [Kl (Kulon)]

Elementar zaryad: e = 1.6 × 10⁻¹⁹ Kl
  Proton:   +e
  Elektron: −e

Zaryadning saqlanish qonuni:
    Yopiq tizimda umumiy zaryad o'zgarmaydi.

18.2 Kulon qonuni
------------------
    F = k · |q₁·q₂| / r²

    k = 1/(4πε₀) = 9 × 10⁹ N·m²/Kl²
    ε₀ = 8.85 × 10⁻¹² Kl²/(N·m²)

Superpozitsiya prinsipi: kuchlar vektoral qo'shiladi.

18.3 Elektr maydon
-------------------
Maydon kuchlanganlik vektori:
    E⃗ = F⃗/q₀     [V/m = N/Kl]

Nuqtaviy zaryadning maydoni:
    E = k·|q| / r²

E⃗ yo'nalishi: musbat zaryaddan uzoqlashadi,
manfiy zaryadga yaqinlashadi.

18.4 Gauss teoremasi
---------------------
    ∮ E⃗ · dS⃗ = Q_ichki / ε₀

Qo'llanilishi:
  Tekis kondensator: E = σ/ε₀
  Sferik qobiq tashqarisida: E = q/(4πε₀r²)
  Sferik qobiq ichida: E = 0

18.5 Elektr maydon potensiali
------------------------------
    φ = A_{∞→r} / q₀ = k·q/r     [V]

Potensiallar farqi = kuchlanish:
    U = φ₁ − φ₂ = A₁₂/q₀

    E = −∂φ/∂x  (bir o'lchov)

Misollar:
  a) 2 μC zaryaddan 0.3 m masofada kuchlanganlik:
     E = 9·10⁹·2·10⁻⁶/0.09 = 2·10⁵ V/m

  b) Ikki qarama-qarshi zaryad orasida potensial:
     φ = k·q/r₁ + k·(−q)/r₂

Nazorat savollari:
  1. Kulon qonunini Gauss teoremasi asosida qanday ifodalash mumkin?
  2. Elektr maydon ichida o'tkazgich qanday xususiyatga ega?
  3. Ekvipotensial sirt va maydon chiziqlarining o'zaro munosabati?
""",
    ),
    (
      "19. Kondensatorlar. Elektr energiyasi",
      """\
KONDENSATORLAR VA ELEKTR ENERGIYASI
=====================================

19.1 Elektr sig'im
-------------------
    C = q/U     [F = Kl/V]  (Farad)

Amalda: μF (10⁻⁶F), nF (10⁻⁹F), pF (10⁻¹²F)

19.2 Tekis kondensator
-----------------------
    C = ε·ε₀·S/d

    ε — dielektrik singuvchanligi
    S — plastina yuzasi [m²]
    d — plastinalar orasidagi masofa [m]

Maydon: E = U/d

19.3 Kondensatorlar ulanishi
------------------------------
Ketma-ket:
    1/C = 1/C₁ + 1/C₂ + ...
    Zaryad: q = const

Parallel:
    C = C₁ + C₂ + ...
    Kuchlanish: U = const

19.4 Kondensator energiyasi
-----------------------------
    W = q²/(2C) = CU²/2 = qU/2    [J]

Maydon energiya zichligi:
    w = ε·ε₀·E²/2    [J/m³]

19.5 Dielektriklar
-------------------
Dielektrik qo'yilsa:
  • C → ε·C  (ε > 1)
  • E → E/ε (ε karra kamayadi)

ε qiymatlari:
  Vakuum: 1
  Havo: ~1
  Shisha: 5-10
  Suv: 80
  Barium titanat: ~1000

Misollar:
  a) C=100 pF, U=100 V kondensator energiyasi:
     W = ½·100·10⁻¹²·10⁴ = 5·10⁻⁷ J = 0.5 μJ

  b) S=0.01 m², d=1mm, ε=2 kondensator sig'imi:
     C = 2·8.85·10⁻¹²·0.01/10⁻³ = 177 pF

Nazorat savollari:
  1. Ketma-ket va parallel ulangan kondensatorlarda nima saqlanadi?
  2. Dielektrik kiritilganda C qanday o'zgaradi?
  3. Kondensator energiyasi formulalarini keltiring.
""",
    ),
  ]
),

(
  "VI BOB. O'zgarmas tok",
  [
    (
      "20. Om qonuni. Kircxoff qoidalari",
      """\
OM QONUNI VA KIRCXOFF QOIDALARI
================================

20.1 Elektr tok
----------------
    I = dq/dt = q/t     [A]

Tok zichligi: j = I/S     [A/m²]

20.2 Om qonuni (zanjir qismi)
-------------------------------
    U = I·R     (yoki I = U/R)

    R — qarshilik [Ω]

Materialning xususiy qarshiligi:
    R = ρ·l/S

    ρ — solishtirma qarshilik [Ω·m]
    l — o'tkazgich uzunligi [m]
    S — kesim yuzasi [m²]

Haroratga bog'liqligi:
    R(T) = R₀·(1 + α·ΔT)
    α — haroriy koeffitsient

20.3 To'liq zanjir uchun Om qonuni (EYuK bilan)
-------------------------------------------------
    I = ε / (R + r)

    ε — EYuK (elektr yurituvchi kuch)
    r — manba ichki qarshiligi
    R — tashqi qarshilik

Terminal kuchlanish:
    U_tashqi = ε − I·r = I·R

20.4 Kircxoff qoidalari
------------------------
1-qoida (tugunlar): Tugunga kirayotgan va chiqayotgan toklar yig'indisi nol:
    ΣI_k = 0

2-qoida (konturlar): Yopiq konturda barcha EYuK va kuchlanishlar yig'indisi nol:
    ΣEYuK = ΣI·R

20.5 Elektr quvvati
--------------------
    P = U·I = I²·R = U²/R     [W]

Joule–Lens qonuni:
    Q = I²·R·t     [J]

Misollar:
  a) ε=12V, r=1Ω, R=5Ω:
     I = 12/(5+1) = 2 A
     U_tashqi = 12 − 2·1 = 10 V
     P = 2²·5 = 20 W

Nazorat savollari:
  1. EYuK va kuchlanishning farqi?
  2. Kircxoff qoidalarini qachon ishlatish kerak?
  3. Rezistorlarni ketma-ket va parallel ulashning farqi?
""",
    ),
  ]
),

(
  "VII BOB. Magnit maydon",
  [
    (
      "21. Magnit maydon. Bio–Savar–Laplas qonuni",
      """\
MAGNIT MAYDON VA BIO–SAVAR–LAPLAS QONUNI
=========================================

21.1 Magnit maydon
-------------------
Tokli o'tkazgich yoki harakatlanuvchi zaryadlar atrofida magnit maydon hosil bo'ladi.

Magnit induksiya vektori B⃗  [T = Vb/m²]

21.2 Bio–Savar–Laplas qonuni
------------------------------
dl o'tkazgich kesmasi hosil qilgan dB:
    dB⃗ = (μ₀/4π) · I·dl⃗ × r̂ / r²

    μ₀ = 4π × 10⁻⁷ H/m  (magnit doimiy)

Tugun o'tkazgich uchun:
    B = μ₀·I / (2π·r)

Solenoid ichida:
    B = μ₀·n·I     (n — birikmalar soni/m)

21.3 Amper qonuni
------------------
dl uzunlikdagi o'tkazgichga ta'sir kuch:
    dF⃗ = I·dl⃗ × B⃗

To'g'ri o'tkazgich uchun:
    F = B·I·l·sin α

21.4 Lorens kuchi
------------------
Zaryadli zarra magnit maydonda:
    F⃗ = q·v⃗ × B⃗
    |F| = q·v·B·sin α

  Lorens kuchi ish bajarmaydi! (F⊥v bo'lgani uchun)

Aylana bo'ylab harakat radiusi:
    r = m·v / (q·B)

21.5 Magnit oqimi
-----------------
    Φ = B·S·cos α     [Vb (Veber)]

Nazorat savollari:
  1. Lorens kuchi nega ish bajarmaydi?
  2. Solenoid ichida B qanday hisoblanadi?
  3. Amper va Lorens kuchlarining farqi?
""",
    ),
  ]
),

(
  "VIII BOB. Optika",
  [
    (
      "22. Yorug'likning interferensiyasi",
      """\
YORUG'LIK INTERFERENSIYASI
============================

22.1 Yorug'likning elektromagnit tabiati
-----------------------------------------
Yorug'lik — elektromagnit to'lqin:
    c = 3 × 10⁸ m/s (vakuumda)
    λ — to'lqin uzunligi [nm]

Ko'rinadigan spektr: 380–760 nm
  Qizil: 620–760 nm
  Ko'k:  440–490 nm

22.2 Kogerentlik
-----------------
Interferensiya uchun to'lqinlar kogerent bo'lishi kerak:
  • Bir xil chastota
  • Doimiy faza farqi

22.3 Interferensiya shartlari
------------------------------
Yo'l farqi: Δ = r₂ − r₁

Kuchaytirish (maksimum):
    Δ = m·λ,   m = 0, ±1, ±2, ...

So'nish (minimum):
    Δ = (m + ½)·λ

22.4 Yung tajribasi
--------------------
Ikki tirqishli interferensiya:
    Yon tasmalar kengligi: Δx = λ·L / d

    L — ekran masofasi
    d — tirqishlar oralig'i

Misol: λ=550nm, L=2m, d=0.5mm:
    Δx = 550·10⁻⁹·2 / 0.5·10⁻³ = 2.2 mm

22.5 Nyuton halqalari
----------------------
Yupqa linza va tekis shisha orasida:
    Yorug' halqalar: r = √((m − ½)·λ·R)
    Qora halqalar:   r = √(m·λ·R)

Nazorat savollari:
  1. Kogerentlik sharti nima?
  2. Yung tajribasida tasmalar kengligi qanday oshiriladi?
  3. Interferensiya va difraksiya farqi?
""",
    ),
    (
      "23. Fotoeffekt. Planck formulasi",
      """\
KVANT OPTIKA: FOTOEFFEKT VA PLANCK FORMULASI
=============================================

23.1 Issiqlik nurlanishi
------------------------
Qora jism nurlanishi — Plank formulasi (1900):
    B(ν, T) = (2hν³/c²) / (e^(hν/kT) − 1)

    h = 6.626 × 10⁻³⁴ J·s  (Plank konstantasi)

Stefan–Bolsman: R = σ·T⁴,   σ = 5.67 × 10⁻⁸ W/(m²K⁴)
Vin ko'chishi:  λ_max·T = b = 2.898 × 10⁻³ m·K

23.2 Fotoeffekt
----------------
Yorug'lik metalga tushganda elektronlar chiqadi (Hertz, 1887).

Einstein tenglamasi (1905):
    hν = A + ½m·v²_max

    hν — foton energiyasi
    A  — chiqish ishi
    ½mv² — chiqqan elektronning maksimal kinetik energiyasi

Qizil chegarasi: ν₀ = A/h  (bu chastotadan past — fotoeffekt yo'q)

Foton impulsi: p = h/λ = hν/c

23.3 Komptonlar sochilishi
---------------------------
Rentgen nurlarining elektronlarda sochilishida to'lqin uzunligi ortadi:
    Δλ = (h/m₀c)·(1 − cos θ)

    Λ_K = h/(m₀c) = 2.43 pm — Kompton to'lqin uzunligi

23.4 To'lqin-zarracha dualizmi
-------------------------------
De Broyl (1924): har qanday zarracha to'lqin xususiyatiga ega:
    λ = h/p = h/(mv)

Misol: E=100 eV elektronning de Broyl to'lqin uzunligi:
    p = √(2mE) = √(2·9.1·10⁻³¹·1.6·10⁻¹⁷) ≈ 5.4·10⁻²⁴ kg·m/s
    λ = h/p = 6.63·10⁻³⁴ / 5.4·10⁻²⁴ ≈ 0.123 nm

Nazorat savollari:
  1. Fotoeffektda yorug'lik intensivligi oshirilganda nima o'zgaradi?
  2. De Broyl to'lqin uzunligi formulasini keltiring.
  3. Qizil chegara deganda nima tushuniladi?
""",
    ),
  ]
),

(
  "IX BOB. Yadro fizikasi",
  [
    (
      "24. Atom yadrosi. Radioaktiv yemirilish",
      """\
ATOM YADROSI VA RADIOAKTIV YEMIRILISH
======================================

24.1 Yadro tuzilishi
---------------------
Atom yadrosi proton (Z) va neytronlardan (N) iborat.
    A = Z + N  (mass soni)

Yadro xossalari:
    Radius: R = R₀·A^(1/3),  R₀ ≈ 1.2 fm
    Zichlik: ρ ≈ 2.3 × 10¹⁷ kg/m³ (barcha yadrolar uchun deyarli bir xil!)

Izotoplar: Z bir xil, N (va A) har xil

24.2 Yadro bog'lanish energiyasi
---------------------------------
    ΔE = Δm·c²

    Δm = Z·m_p + N·m_n − M_yadro   (massa defekti)

Bir nuklonga to'g'ri keladigan bog'lanish energiyasi:
    ε = ΔE/A  ≈ 7–8.8 MeV (eng barqaror: Fe, Ni)

24.3 Radioaktiv yemirilish
---------------------------
Yadro o'ziga xos zarrachalarni chiqarib boshqa yadro hosil qilishi.

Yemirilish qonuni:
    N(t) = N₀·e^(−λt)

    λ — yemirilish doimiysi
    T₁/₂ = ln2/λ = 0.693/λ  (yarim yemirilish davri)

24.4 Yemirilish turlari
------------------------
  α-yemirilish:  ₂⁴He chiqaradi
    ₉₂²³⁸U → ₉₀²³⁴Th + ₂⁴He

  β⁻-yemirilish: elektron va antineytrinо
    n → p + e⁻ + ν̄_e

  β⁺-yemirilish: pozitron va neytrinо
    p → n + e⁺ + ν_e

  γ-nurlanish: qo'zg'algan yadrodan foton

24.5 Yadro reaksiyalari
------------------------
    Q = (m_boshlang'ich − m_oxirgi)·c²

    Q > 0 — ekzoterm (energiya ajraladi)
    Q < 0 — endoterm (energiya yutiladi)

Uran bo'linishi: Q ≈ 200 MeV
Vodorod sintezi: Q ≈ 17.6 MeV (D+T → He+n)

Misollar:
  a) T₁/₂ = 5730 yil (¹⁴C):
     λ = 0.693/5730 = 1.21 × 10⁻⁴ yil⁻¹

  b) 100 g radiy (T₁/₂=1600 yil) da 500 yildan keyin:
     N/N₀ = e^(−λt) = e^(−0.693·500/1600) ≈ 0.805
     Qoldi: 80.5 g

Nazorat savollari:
  1. Mass soni va tartib raqami nima?
  2. Yarim yemirilish davri va yemirilish doimiysi bog'liqligi?
  3. α, β, γ nurlanishlarning farqlarini keltiring.
""",
    ),
  ]
),

(
  "X BOB. Elektromagnit induksiya va o'zgaruvchan tok",
  [
    (
      "25. Elektromagnit induksiya. Faraday qonuni",
      """\
ELEKTROMAGNIT INDUKSIYA
========================

25.1 Faraday qonuni
--------------------
1831 yilda Faraday: o'zgaruvchi magnit oqimi kontorda EYuK hosil qiladi.

    ε = −dΦ/dt     [V]

    Φ = B·S·cos α  — magnit oqimi [Vb]

Lenz qoidasi: induksiya toki o'z magnit oqimi bilan asosiy oqimga qarshilik ko'rsatadi (manfiy ishora).

25.2 Harakat qiluvchi o'tkazgich EYuK
--------------------------------------
Magnit maydonda v tezlik bilan harakat qiluvchi l uzunlikdagi o'tkazgich:
    ε = B·l·v·sin α

Burch misol: samolyot qanoti l=20m, v=250m/s, B=5·10⁻⁵T:
    ε = 5·10⁻⁵·20·250 = 0.25 V

25.3 O'zinduksiya
-----------------
Kontordagi tok o'zgarganda o'z magnit oqimi hosil qilishi:
    Φ = L·I
    ε_oi = −L·dI/dt

    L — induktivlik [Gn = H]

Solenoid induktivligi:
    L = μ₀·n²·V  (n — birikmalar soni/m, V — hajm)

O'zinduksiyada to'plangan energiya:
    W = L·I²/2

25.4 O'zaro induksiya
---------------------
Ikki g'altakda o'zaro induksiya:
    ε₂ = −M·dI₁/dt

    M — o'zaro induktivlik [H]
    M ≤ √(L₁·L₂)   (teng bo'lganda — to'liq bog'lanish)

Transformator (ideal):
    U₁/U₂ = N₁/N₂ = I₂/I₁

Misol: 220V/12V transformator nisbati = 220/12 ≈ 18.3

Nazorat savollari:
  1. Lenz qoidasini formulalang.
  2. O'zinduksiya EYuK qachon katta bo'ladi?
  3. Ideal transformatorda qanday kattalik o'zgarmaydi?
""",
    ),
    (
      "26. O'zgaruvchan tok. RLC zanjiri va rezonans",
      """\
O'ZGARUVCHAN TOK
================

26.1 O'zgaruvchan tok asoslari
-------------------------------
    e(t) = E₀·cos(ωt)
    i(t) = I₀·cos(ωt − φ)

    E₀, I₀ — amplitudalar
    ω = 2πν — sikllik chastota
    φ — faza siljishi

O'rtacha kvadrat (RMS) qiymatlar:
    U_rms = U₀/√2 ≈ 0.707·U₀
    I_rms = I₀/√2

Uy tarmog'i: U₀ = 220·√2 ≈ 311 V

26.2 R, L, C elementlar reaktansi
-----------------------------------
Rezistor R:   U va I bir fazada,  reaktans yo'q
Katushka L:   U tok oldida π/2,   X_L = ωL
Kondensator C: U tok ortida π/2,  X_C = 1/(ωC)

26.3 Ketma-ket RLC zanjiri
---------------------------
To'la impedans (qarshilik):
    Z = √(R² + (X_L − X_C)²)

Faza burchagi:
    tan φ = (X_L − X_C)/R

Tok amplitudasi:
    I₀ = U₀/Z

26.4 Rezonans
--------------
X_L = X_C  sharti:
    ωL = 1/(ωC)
    ω₀ = 1/√(LC)  — rezonans chastota

Rezonansda:
  • Z = R (minimal)
  • I₀ = U₀/R (maksimal)
  • φ = 0 (U va I bir fazada)

Sifat ko'rsatkichi: Q = ω₀L/R = 1/(ω₀CR)

26.5 O'zgaruvchan tok quvvati
------------------------------
    P = U_rms·I_rms·cos φ    [W]
    cos φ — quvvat koeffitsienti (1 ga yaqin bo'lishi yaxshi)

Misol: U=220V, I=5A, cos φ=0.8:
    P = 220·5·0.8 = 880 W

Nazorat savollari:
  1. Rezonans chastotasi formulasi?
  2. Q faktorini oshirish uchun nima qilish kerak?
  3. Nega cos φ = 1 bo'lishi qulay?
""",
    ),
    (
      "27. Maksvell tenglamalari. Elektromagnit to'lqinlar",
      """\
MAKSVELL TENGLAMALARI VA ELEKTROMAGNIT TO'LQINLAR
==================================================

27.1 Maksvell tenglamalari (integral ko'rinish)
------------------------------------------------
1. Gauss (elektr):    ∮E·dS = Q_ich/ε₀
2. Gauss (magnit):    ∮B·dS = 0     (magnit monopol yo'q)
3. Faraday:           ∮E·dl = −dΦ_B/dt
4. Amper–Maksvell:    ∮B·dl = μ₀(I + ε₀·dΦ_E/dt)

Ko'chma tok: j_k = ε₀·∂E/∂t  (Maksvell qo'shgan)

27.2 Elektromagnit to'lqin
---------------------------
Maksvell tenglamalaridan to'lqin tenglamasi kelib chiqadi:
    ∂²E/∂x² = μ₀ε₀·∂²E/∂t²

To'lqin tezligi:
    c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s  — yorug'lik tezligi!

EMT xossalari:
  • Ko'ndalang to'lqin (E⃗ ⊥ B⃗ ⊥ v⃗)
  • E va B bir fazada harakat qiladi
  • c = E₀/B₀
  • Energiya va impuls tashiydi

27.3 Elektromagnit spektr
--------------------------
    Radio to'lqinlar:  > 1 mm
    Mikroto'lqinlar:   1 mm – 1 m
    Infraqizil:        700 nm – 1 mm
    Ko'rinadigan:      380 – 760 nm
    Ultrabinafsha:     10 – 380 nm
    Rentgen:           0.01 – 10 nm
    Gamma:             < 0.01 nm

27.4 Umov–Poyinting vektori
----------------------------
Energiya oqimi zichligi:
    S⃗ = (1/μ₀)·E⃗ × B⃗  = c·w  [W/m²]

    w = ε₀E²/2 + B²/(2μ₀) — energiya zichligi

Nazorat savollari:
  1. Ko'chma tok nima va uni kim kiritdi?
  2. Elektromagnit to'lqin ko'ndalang ekanligini isbotlang.
  3. Yorug'lik tezligi qaysi konstantalardan kelib chiqadi?
""",
    ),
  ]
),

(
  "XI BOB. Maxsus nisbiylik nazariyasi",
  [
    (
      "28. Nisbiylik nazariyasining postulatlari",
      """\
MAXSUS NISBIYLIK NAZARIYASI — POSTULATLARI
===========================================

28.1 Klassik mexanikaning muammolari
--------------------------------------
  • Maykelson–Morli tajribasi (1887): efir topilmadi
  • Yorug'lik tezligi barcha sistemalarda bir xil

28.2 Eynshteynning postulatlari (1905)
----------------------------------------
  1. NISBIYLIK PRINSIPI: Barcha inersial sistemalarda fizika qonunlari bir xil.
  2. YORUG'LIK TEZLIGI DOIMIYSI: Yorug'lik tezligi c barcha sistemalarda bir xil
     (manbaga va kuzatuvchiga bog'liq emas).

28.3 Lorens almashtirishlari
------------------------------
K' sistema K ga nisbatan V tezlikda harakat qilsa:
    x' = γ(x − Vt)
    t' = γ(t − Vx/c²)
    y' = y,  z' = z

    γ = 1/√(1 − β²)  — Lorens gammasi
    β = V/c

28.4 Vaqt kengayishi
---------------------
Harakatlanuvchi soat sekinroq boradi:
    Δt = γ·Δt₀  ≥ Δt₀

    Δt₀ — o'z vaqti (jism bilan birgalikda)
    Δt  — laboratoriya vaqti

Misol: β=0.6 da  γ = 1/√(1−0.36) = 1/0.8 = 1.25
  Zarracha hayot davri 1.25 marta uzayadi.

28.5 Uzunlikning qisqarishi
-----------------------------
Harakatlanuvchi jism harakatdagi yo'nalishda qisqaradi:
    l = l₀/γ  ≤ l₀

    l₀ — to'g'ri uzunlik

Misol: β=0.8,  γ=1/0.6=1.667
  1 m uzunlik → 1/1.667 ≈ 0.6 m ga qisqaradi.

28.6 Tezliklarni qo'shish
--------------------------
Klassik v₁+v₂ o'rniga:
    u = (v₁ + v₂) / (1 + v₁v₂/c²)

Misol: v₁=v₂=0.9c:
    u = 1.8c / (1 + 0.81) = 1.8c/1.81 ≈ 0.994c < c  ✓

Nazorat savollari:
  1. Eynshteynning ikki postulatini keltiring.
  2. Ikki voqea bir vaqtda bo'lishi nisbiy ekanligini tushuntiring.
  3. Vaqt kengayishi tajribada qanday tasdiqlangan?
""",
    ),
    (
      "29. Nisbiy dinamika. E = mc²",
      """\
NISBIY DINAMIKA
================

29.1 Relyativistik impuls
--------------------------
    p⃗ = γ·m₀·v⃗

    m₀ — tinchlik massasi
    γ = 1/√(1−v²/c²)

v → c bo'lganda p → ∞  (to kuch bilan ham c ga etib bo'lmaydi)

29.2 Energiya-impuls munosabati
--------------------------------
To'liq energiya:
    E = γ·m₀·c²

Tinchlik energiyasi:
    E₀ = m₀·c²

Kinetik energiya:
    E_k = E − E₀ = (γ−1)·m₀·c²

v << c da klassik formulaga keladi: E_k ≈ ½m₀v²

29.3 Energiya-impuls invarianti
---------------------------------
    E² − (pc)² = (m₀c²)²

Foton uchun m₀=0:
    E = pc = hν  ✓

29.4 Massa-energiya ekvivalentligi
------------------------------------
    E₀ = m₀c²

    c² = 9 × 10¹⁶ J/kg

1 kg massani to'liq energiyaga:
    E = 1 · 9·10¹⁶ = 9 × 10¹⁶ J  (25 milliard kWh!)

Yadro energiyasi manbai: massa defekti → E = Δm·c²
  Uran bo'linishida: ~0.1% massa energiyaga aylanadi.

29.5 Misol: elektron tezlatgichda
----------------------------------
E_k = 1 MeV = 1.6×10⁻¹³ J elektron uchun:
    m₀c² = 0.511 MeV
    γ = (E₀ + E_k)/E₀ = (0.511 + 1)/0.511 ≈ 2.96
    v = c·√(1 − 1/γ²) = c·√(1 − 0.114) ≈ 0.941c

Nazorat savollari:
  1. Tinchlik energiyasi nima?
  2. Foton uchun m₀=0 bo'lsa, impulsi bormi?
  3. Yadro reaksiyasida qanday energiya ajraladi?
""",
    ),
  ]
),

(
  "XII BOB. Kvant mexanikasi asoslari",
  [
    (
      "30. Geyzenberg noaniqlik munosabati. Shnedinger tenglamasi",
      """\
KVANT MEXANIKASI ASOSLARI
==========================

30.1 Geyzenberg noaniqlik munosabati
--------------------------------------
Koordinata va impulsni bir vaqtda aniq bilish mumkin emas:
    Δx · Δpₓ ≥ ℏ/2

    ℏ = h/(2π) = 1.055 × 10⁻³⁴ J·s

Energiya va vaqt:
    ΔE · Δt ≥ ℏ/2

Noaniqlik prinsipi — bu o'lchov qurilmasining kamchiligi emas,
balki tabiatning fundamental xususiyati!

Misol: elektron 0.1 nm o'lchamli atom ichida:
    Δpₓ ≥ ℏ/(2·0.1·10⁻⁹) = 5.3·10⁻²⁵ kg·m/s
    Δv  ≥ 5.8·10⁵ m/s  (katta noaniqlik!)

30.2 To'lqin funksiyasi
------------------------
Kvant holatni Ψ(x,t) — to'lqin funksiyasi tasvirlaydi.

    |Ψ|² = ρ(x,t) — zarrachani x nuqtada topish ehtimolligi zichligi

Normalashtirish sharti:
    ∫|Ψ|² dV = 1

30.3 Shnedinger tenglamasi (vaqtga bog'liq)
---------------------------------------------
    iℏ·∂Ψ/∂t = Ĥ·Ψ

    Ĥ = −ℏ²/(2m)·∇² + V(r)  — Gamilton operatori

Statsionar holat (E = const):
    Ĥ·ψ = E·ψ

30.4 Kvadrat to'siq. Tunel effekti
-------------------------------------
Klassik zarracha E < U₀ bo'lsa to'siqdan o'ta olmaydi.
Kvant zarracha — o'tishi mumkin! (tunel effekti)

Tunel ehtimolligi:
    T ≈ e^(−2κa)
    κ = √(2m(U₀−E))/ℏ
    a — to'siq eni

Amalda: α-yemirilish, tunnel diod, STM mikroskop, flash xotira.

30.5 Cheksiz chuqur quduq
--------------------------
0 < x < a chegarasida:
    E_n = n²π²ℏ²/(2ma²)  — ruxsat etilgan energiyalar (diskret!)
    ψ_n = √(2/a)·sin(nπx/a)

n=1 — asosiy holat (eng kichik energiya, nol emas!)

Nazorat savollari:
  1. Noaniqlik prinsipi klassik fizikadan nima bilan farqlanadi?
  2. To'lqin funksiyasining fizik ma'nosi?
  3. Energiya kvantlanganligi nimani anglatadi?
""",
    ),
    (
      "31. Atom Bohr modeli. Kvant sonlar",
      """\
ATOM FIZIKASI
==============

31.1 Rezerford tajribasi (1911)
---------------------------------
Alpha zarralar oltin folga orqali:
  • Ko'pchiligi o'tib ketdi (atom — bo'sh)
  • Bir qismi katta burchakda qaytdi
  → Atom markazi — kichik, og'ir, musbat yadro

31.2 Bohr modeli (1913)
------------------------
Postulatlari:
  1. Elektron faqat ma'lum orbitalar (stasionar holatlar) da aylanadi
  2. Stasionar holatda energiya nurlanmaydi
  3. Foton orbitalar orasida o'tishda chiqariladi/yutiladi

Orbita sharti:
    m·v·r = n·ℏ   (n = 1, 2, 3, ...)

Vodorod atomi energiyasi:
    E_n = −13.6/n²  [eV]

    E₁ = −13.6 eV — asosiy holat
    E_∞ = 0       — ionizatsiya

31.3 Spektral seriyalar
------------------------
    hν = E_n₂ − E_n₁ = 13.6·(1/n₁² − 1/n₂²) eV

  Layman (n₁=1):    UV sohasida
  Balmer (n₁=2):    Ko'rinadigan (Hα=656nm qizil, Hβ=486nm ko'k-yashil)
  Pashen (n₁=3):    IR sohasida

31.4 Kvant sonlar
-----------------
    n  = 1, 2, 3, ...        (asosiy)
    l  = 0, 1, ..., n-1      (orbital)
    mₗ = −l, ..., 0, ..., +l (magnit)
    ms = ±½                  (spin)

Orbital nomlar: l=0→s, l=1→p, l=2→d, l=3→f

31.5 Pauli prinsipi
--------------------
"Bir atomda bir xil to'rt kvant soni bo'lgan ikki elektron bo'la olmaydi."

Natija: elektronlarning qatlamlarda joylashishi:
    n=1 (K): 2 elektron
    n=2 (L): 8 elektron
    n=3 (M): 18 elektron

Davriy sistema → elektron konfiguratsiyalari orqali tushuntiririladi.

31.6 Lazer
-----------
Induktsiyalangan nurlanish → kuchaytirilgan, kogerent yorug'lik.
    Inversiya: quyi darajada kam, yuqorida ko'p elektron.
    Rezonator: oynalar orasida ko'paytirish.

Qo'llanilishi: CD/DVD, ko'z operatsiyasi, telekommunikatsiya, litografiya.

Nazorat savollari:
  1. Bohr postulatlarini keltiring.
  2. Balmer seriyasi nimaga mos keladi?
  3. Lazer klasik yorug'lik manbalaridan nimasi bilan farq qiladi?
""",
    ),
  ]
),

(
  "XIII BOB. Qattiq jism fizikasi",
  [
    (
      "32. Zolalar nazariyasi. Metallar, yarimo'tkazgichlar, dielektriklar",
      """\
QATTIQ JISM FIZIKASI — ZOLALAR NAZARIYASI
==========================================

32.1 Kristall panjaralar
-------------------------
Qattiq jismda atomlar tartibli joylashadi (davriy panjara).
  • Metallar: Na, Cu, Fe — metall bog'lanish
  • Ion kristallar: NaCl — ion bog'lanish
  • Kovalent: olmos — kovalent bog'lanish
  • Molekulyar: muz — Van-der-Vaals kuch

Bragg difraktsiyasi:
    2d·sin θ = n·λ   (panjaradan rentgen difraksiyasi)

32.2 Zolalar nazariyasi
------------------------
Kristalda elektron energiyalari ruxsat etilgan zolagalar (band) va taqiqlangan sohalarga ajraladi.

Valentlik zolasi   — to'ldirilgan
O'tkazuvchanlik zolasi — bo'sh
Taqiqlangan zona   — oralig'i Eg

Moddalar tasnifi:
  Metallar:        Eg=0  (zolalar tutashgan yoki qoplashadi)
  Yarimo'tkazgich: Eg ~ 1 eV  (Si: 1.12 eV, Ge: 0.67 eV)
  Dielektrik:      Eg > 3 eV  (SiO₂: 9 eV)

32.3 Intrinsik yarimo'tkazgich
-------------------------------
T ortganda elektronlar valentlik zolagasidan o'tkazuvchanlik zolagasiga o'tadi:
    n = p = nᵢ ∝ T^(3/2)·e^(−Eg/2kT)

Si da T=300K:  nᵢ ≈ 1.5×10¹⁰ cm⁻³

Solishtirma qarshilik kamayadi (metall aksiga):
    ρ ~ e^(Eg/2kT)

32.4 Aralashma yarimo'tkazgich
-------------------------------
n-tipli (donor):  P, As Si ga qo'shilsa → qo'shimcha elektron
p-tipli (akseptor): B, Al Si ga qo'shilsa → kovak

p-n o'tish:
  • Depletion zone hosil bo'ladi
  • Potensial to'siq: φ₀ ≈ Eg/e
  • To'g'ri o'tkazish: to'siq pasayadi, tok katta
  • Teskari o'tkazish: to'siq ortadi, tok kichik (diod!)

32.5 Tranzistor
----------------
Ikki p-n o'tish: PNP yoki NPN.
Kichik baza toki katta kollektor tokini boshqaradi.
Kuchaytirish koeffitsienti β = I_c/I_b ≈ 50–500.

32.6 Supero'tkazuvchanlik
--------------------------
Ba'zi materiallar T_c dan pastda qarshilik = 0:
    R = 0  (T < T_c)

  Simob: T_c = 4.2 K
  YBCO: T_c = 92 K (yuqori haroratli)

Meysner effekti: magnit maydon supero'tkazgichdan siqib chiqariladi.

Qo'llanilishi: MRI magnit, maglev poyezd, LHC da magnit linzalar.

Nazorat savollari:
  1. Metall va yarimo'tkazgich zolalar tuzilishi farqi?
  2. p-n o'tish to'g'ri va teskari o'tkazishda nima bo'ladi?
  3. Meysner effekti nima?
""",
    ),
    (
      "33. Metallar klassik va kvant nazariyasi. Fermi energiyasi",
      """\
METALLAR ELEKTRON NAZARIYASI
=============================

33.1 Druye klassik modeli (1900)
---------------------------------
Metallar — erkin elektron gazi:
  • Elektronlar ideal gaz kabi harakat qiladi
  • Ionlar bilan to'qnashadi (τ — o'rtacha erkin yugurish vaqti)

Elektr o'tkazuvchanlik:
    σ = n·e²·τ/m

Muammolar: Lorentz soni, issiqlik sig'imi — klassik model noto'g'ri natija beradi.

33.2 Kvant modeli. Fermi-Dirak taqsimoti
------------------------------------------
Elektronlar — Fermi zarralar (Pauli prinsipi):
    f(E) = 1 / (e^((E−E_F)/kT) + 1)

    E_F — Fermi energiyasi

T=0 da:
    f(E) = 1 (E < E_F)
    f(E) = 0 (E > E_F)

33.3 Fermi energiyasi
---------------------
    E_F = (ℏ²/2m)·(3π²n)^(2/3)

  Mis (Cu): E_F ≈ 7 eV
  Natriy (Na): E_F ≈ 3.2 eV

T=0 da ham elektronlar katta kinetik energiyaga ega! (kvant effekti)

33.4 Issiqlik o'tkazuvchanlik va Wiedemann-Frans qonuni
---------------------------------------------------------
    κ/σ = L₀·T

    L₀ = π²k²/(3e²) = 2.44×10⁻⁸ W·Ω/K²  — Lorens soni

Bu klassik model bilan mos kelmaydi, kvant nazariya tushuntiradi.

Nazorat savollari:
  1. Fermi energiyasining fizik ma'nosi?
  2. Fermi-Dirak taqsimotini Bolsman taqsimotidan farqi?
  3. Metalda elektronlar T=0 da nima uchun harakatlanadi?
""",
    ),
  ]
),

(
  "XIV BOB. Yadro reaksiyalari va elementar zarralar",
  [
    (
      "34. Yadro reaksiyalari. Bo'linish va sintez",
      """\
YADRO REAKSIYALARI
===================

34.1 Yadro reaksiyalari umumiy qonuniyatlari
----------------------------------------------
Yadro reaksiyasida saqlanadi:
  • Zaryad soni (Z)
  • Nuklonlar soni (A)
  • Energiya va impuls
  • Spin va boshqa kvant sonlar

Q-qiymat (energiya effekti):
    Q = (m_boshlang'ich − m_oxirgi)·c²   [MeV]

    Q > 0 — ekzoterm (energiya ajraladi)
    Q < 0 — endoterm (energiya yutiladi)

34.2 Uran bo'linishi
---------------------
    ₉₂²³⁵U + n → ₅₆¹⁴¹Ba + ₃₆⁹²Kr + 3n + 200 MeV

Zanjirli reaksiya:
  • Har bo'linishda 2–3 neytron hosil bo'ladi
  • Ular boshqa ₂₃₅U ni bo'ladi
  • Kritik massa: 50 kg (boyitilmagan), ~5 kg (boyitilgan) ₂³⁵U

Atom reaktori:
  • Sekinlashtiruvchi (grafit, suv): neytronlarni sekinlashtiradi
  • Nazorat tayoqchalari (B, Cd): neytron so'radi
  • Sovutuvchi: issiqlikni olib ketadi

Atom elektrostansiyasi FIK ≈ 33%

34.3 Termoyadro sintezi
------------------------
Vodorod izotoplari sintezi:
    ₁²H + ₁³H → ₂⁴He + n + 17.6 MeV

Shartlar: T > 10⁷ K (plazma), zichlik, konfinement vaqti.
Lawson sharti: n·τ > 10²⁰ s/m³

Tokamak — toroid magnit kamerasi (ITER loyihasi).
Inersial sintez — lazer nurlanishi bilan.

Quyoshda:
    4·₁¹H → ₂⁴He + 2e⁺ + 2ν + 26.7 MeV

34.4 Radioaktiv foydalanish
----------------------------
  Tibbiyot:  PET-skaner (¹⁸F), davolash (¹³¹I qalqonsimon bez)
  Arxeologiya: ¹⁴C usuli bilan yosh aniqlash
  Sanoat:  γ-nurlanish bilan material nazorati
  Energetika: AES

Dozimetriya birliklari:
    Grей (Gy) = 1 J/kg   — yutilgan doza
    Zivert (Sv) = H·Gy   — ekvivalent doza (H — sifat koeffitsienti)

Nazorat savollari:
  1. Q-qiymat qanday hisoblanadi?
  2. Atom reaktor va atom bombaning farqi?
  3. Termoyadro sintezi uchun nima kerak?
""",
    ),
    (
      "35. Elementar zarralar. Standart model",
      """\
ELEMENTAR ZARRALAR VA STANDART MODEL
======================================

35.1 Zarralar tasnifi
----------------------
Baryon (og'ir): proton, neytron, Λ, Σ, ... (3 kvarkdan)
Mezon: π, K, η, ... (kvark + antikvaridan)
Lepton: e, μ, τ, ν_e, ν_μ, ν_τ (elementar)
Foton: elektromagnit ta'sir tashuvchisi

Antimoddalar: har zarraning antizarrasi bor (zaryad teskari).

35.2 Fundamental ta'sir turlari
---------------------------------
Kuchli:           Kuchsiz:          EM:          Gravitatsion:
quarks orasida    β-yemirilish      zaryadlar    massalar
tashuvchi: gluon  tashuvchi: W,Z    tashuvchi:γ  tashuvchi:graviton?
Uzunlik: ~10⁻¹⁵m  ~10⁻¹⁸m          ∞            ∞

35.3 Kvarklar
--------------
6 xil kvark: u, d, s, c, b, t
    u (up):    zaryad +2/3
    d (down):  zaryad −1/3

Proton: uud  → zaryad = 2/3+2/3−1/3 = +1  ✓
Neytron: udd → zaryad = 2/3−1/3−1/3 = 0   ✓

Rang zaryadi (rang kuchlanishi):
    R, G, B  va  R̄, Ḡ, B̄
    Hadronlar "rangsiz" (baryon: RGB, mezon: RR̄)

35.4 Standart model
--------------------
Qurilish bloklari:
    6 kvark × 3 rang = 18 kvark
    6 lepton
    4 ta ta'sir tashuvchisi (γ, g, W±, Z⁰)
    + Higgs bozoni (massa beruvchi)

Higgs bosoni — 2012 yil LHC da topildi! (126 GeV)

35.5 Standart modelning cheklovlari
-------------------------------------
  • Gravitatsiya kirmaydi
  • Nima uchun 3 avlod lepton?
  • Qorong'u modda va energiya tushuntirilmagan
  • Barion-antibarion assimetriya

Zamonaviy izlanishlar:
  • Supersimmetriya (SUSY)
  • Qo'shimcha o'lchamlar
  • Ip nazariyasi (String theory)
  • Kvant gravitatsiya

Nazorat savollari:
  1. Protonning kvark tarkibini keltiring.
  2. 4 ta fundamental ta'sir turini miqdori va uzunligi bo'yicha solishtiring.
  3. Standart modelning qaysi muammolari hal etilmagan?
""",
    ),
  ]
),

]  # KURS_TUZILMASI tugadi

# ═══════════════════════════════════════════════════════════════════════════════
#  DATABASE GA YOZISH
# ═══════════════════════════════════════════════════════════════════════════════

print("\nMaruza matnlari import qilinmoqda...")
print("=" * 70)

total_topics  = 0
total_lessons = 0

for topic_order, (topic_title, lessons) in enumerate(KURS_TUZILMASI):
    topic = Topic.objects.create(
        course=course,
        title=topic_title,
        order=topic_order,
    )
    total_topics += 1
    print(f"\n  📗 Bo'lim {topic_order+1}: {topic_title}")

    for lesson_order, (lesson_title, content) in enumerate(lessons):
        Lesson.objects.create(
            topic=topic,
            title=lesson_title,
            content=content.strip(),
            lesson_type=Lesson.LessonType.TEXT,
            order=lesson_order,
            is_free_preview=(lesson_order == 0),
        )
        total_lessons += 1
        print(f"     [{total_lessons:03d}] {lesson_title[:65]}")

print()
print("=" * 70)
print(f"✅ Bo'limlar: {total_topics} ta")
print(f"✅ Darslar:   {total_lessons} ta")
print(f"📚 Kurs ID:   {course.id}")
print()
print("Frontend da ko'rish:")
print(f"  http://localhost:3000/courses/{course.id}")
