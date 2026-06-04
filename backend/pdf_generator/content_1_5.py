# pdf_generator/content_1_5.py
# I–V BOB maruza matnlari

from .builder import (
    spacer, hr, formula_box, example_box,
    note_box, data_table, lecture_header,
    questions_block, summary_box, cover_page,
)
from reportlab.platypus import Paragraph, PageBreak
from reportlab.lib import colors


def build_bob1(st):
    """I BOB — KINEMATIKA"""
    elems = []
    elems += cover_page(
        bob_num=1,
        bob_title="KINEMATIKA",
        subtitle="Moddiy nuqta harakati — tezlik, tezlanish, traektoriya",
        lessons=[
            "Fizikaning predmeti. O'lchov va SI sistemasi",
            "Moddiy nuqta kinematikasi. Koordinatalar sistemasi",
            "Tezlik va tezlanish vektorlari",
            "To'g'ri chiziqli tekis va tekis o'zgaruvchan harakat",
            "Erkin tushish va qiya otish",
            "Aylana bo'ylab harakat. Burchak tezligi",
            "Nisbiy harakat. Galiley almashtirishlari",
        ],
        st=st,
    )

    # ── 1-MARUZA ────────────────────────────────────────────────────────────
    elems.append(lecture_header(1, "Fizikaning predmeti. O'lchov va SI sistemasi", 1, st))

    elems.append(Paragraph("1.1  Fizika nima?", st["h2"]))
    elems.append(Paragraph(
        "Fizika — tabiat fanlari orasida eng fundamental bo'lib, moddaning tuzilishi, "
        "xossalari va harakati qonunlarini o'rganadi. «Fizika» so'zi yunoncha <i>physis</i> "
        "— tabiat so'zidan olingan. Fizika barcha tabiiy fanlarning asosi sanaladi, chunki "
        "kimyo, biologiya, geologiya va astronomiya hodisalarining eng chuqur tavsifi oxir-oqibat "
        "fizik qonunlarga tayanadi.", st["body"]))
    elems.append(Paragraph(
        "Zamonaviy fizika ikki yirik sohaga bo'linadi: <b>klassik fizika</b> (XVII–XIX asrlar: "
        "mexanika, termodinamika, elektrodinamika, optika) va <b>zamonaviy fizika</b> "
        "(XX asr va undan keyin: kvant mexanikasi, maxsus va umumiy nisbiylik nazariyasi, "
        "yadro va elementar zarralar fizikasi, qattiq jism fizikasi).", st["body"]))

    elems.append(Paragraph("1.2  Tadqiqot metodlari", st["h2"]))
    rows = [
        ["Kuzatish", "Tabiiy hodisalarni bevosita kuzatish va qayd qilish"],
        ["Tajriba", "Sun'iy yaratilgan sharoitda hodisani nazorat ostida tekshirish"],
        ["Nazariy tahlil", "Matematik modellar, differensial tenglamalar yordamida qonunlar yaratish"],
        ["Kompyuter modellashtirish", "Murakkab tizimlarni raqamli integratsiya orqali hisoblash"],
    ]
    elems.append(data_table(
        ["Metod", "Tavsif"], rows, st,
        col_widths=[120, 330],
    ))

    elems.append(Paragraph("1.3  Fizik kattalik va o'lchov", st["h2"]))
    elems.append(Paragraph(
        "Fizik kattaliklarni o'lchash — ularni standart birlik bilan taqqoslashdir. "
        "Har qanday o'lchov natijasi ikki qismdan iborat: son qiymati va birlik.", st["body"]))
    elems.append(formula_box(
        ["x = n · [x]"],
        st,
        desc_lines=[
            "n — son qiymati (masalan, 3.5)",
            "[x] — o'lchov birligi (masalan, metr, kilogram)",
        ],
    ))

    elems.append(Paragraph("1.4  SI — Xalqaro birliklar sistemasi", st["h2"]))
    rows_si = [
        ["Uzunlik",         "l",  "metr",     "m",   "Işiqning 1/299 792 458 sekunddagi yo'li"],
        ["Massa",           "m",  "kilogram",  "kg",  "Plank konstantasidan aniqlanadi"],
        ["Vaqt",            "t",  "sekund",   "s",   "Cs-133 atomining 9 192 631 770 tebranishi"],
        ["Tok kuchi",       "I",  "amper",    "A",   "Elementar zaryadga asoslanadi"],
        ["Harorat",         "T",  "kelvin",   "K",   "Suvning uch nuqtasi 273.16 K"],
        ["Modda miqdori",   "ν",  "mol",      "mol", "Avogadro soni = 6.022×10²³"],
        ["Yorug'lik kuchi", "Iᵥ", "kandela",  "cd",  "555 nm monoxromatik nurlanish"],
    ]
    elems.append(data_table(
        ["Kattaik", "Belgi", "Birlik", "Symbol", "Ta'rif"],
        rows_si, st,
        col_widths=[80, 40, 70, 55, 205],
    ))

    elems.append(Paragraph("1.5  O'lchov xatoliklari", st["h2"]))
    elems.append(Paragraph(
        "Hech qanday o'lchov mutlaqo aniq bo'la olmaydi. Xatolik manbalari: "
        "asbob aniqligi cheklanganligi, muhit ta'siri, kuzatuvchi subektivligi va "
        "o'lchov metodining o'zi. Xatoliklarni to'g'ri baholash ilmiy tajribaning "
        "ajralmas qismidir.", st["body"]))
    elems.append(formula_box(
        [
            "Absolut xatolik:  Δx = |xo'lchangan − xhaqiqiy|",
            "Nisbiy xatolik:  δ = (Δx / x) × 100%",
            "Standart og'ish:  σ = √( Σ(xᵢ − x̄)² / (n−1) )",
        ],
        st,
        desc_lines=["x̄ — o'rtacha qiymat,  n — o'lchovlar soni"],
    ))
    elems.append(note_box(
        "Tajribada o'lchov natijasi odatda  x = x̄ ± Δx  ko'rinishida yoziladi. "
        "Masalan: l = (2.34 ± 0.02) m  →  nisbiy xatolik 0.9%.", st, "info",
    ))
    elems.append(example_box(
        "1-misol: O'lchov xatoligini hisoblash",
        "Uzunlik 5 marta o'lchandi: 2.31, 2.34, 2.33, 2.36, 2.31 m. "
        "O'rtacha qiymat va absolut xatolikni toping.",
        [
            "x̄ = (2.31+2.34+2.33+2.36+2.31)/5 = 2.33 m",
            "Og'ishlar: |−0.02|, |+0.01|, |0|, |+0.03|, |−0.02|",
            "Δx = (0.02+0.01+0+0.03+0.02)/5 = 0.016 ≈ 0.02 m",
            "Javob: l = (2.33 ± 0.02) m;  δ = 0.02/2.33 × 100% = 0.86%",
        ],
        st,
    ))

    # ── 2-MARUZA ────────────────────────────────────────────────────────────
    elems.append(lecture_header(2, "Moddiy nuqta kinematikasi. Koordinatalar sistemasi", 1, st))

    elems.append(Paragraph("2.1  Kinematika nima?", st["h2"]))
    elems.append(Paragraph(
        "Kinematika mexanikaning bir bo'limi bo'lib, jismlar harakatini harakat "
        "sabablarini (kuchlarni) hisobga olmagan holda o'rganadi. Kinematikada "
        "quyidagi savolga javob axtariladi: jism qayerda, qachon va qanday "
        "tezlikda bo'ladi?", st["body"]))

    elems.append(Paragraph("2.2  Moddiy nuqta", st["h2"]))
    elems.append(Paragraph(
        "<b>Moddiy nuqta</b> — o'lchamlari masala shartida e'tiborga olinmaydigan jism. "
        "Bu — ideallashtirish bo'lib, jism o'lchamlari harakat masshtabiga nisbatan juda "
        "kichik bo'lganda qo'llaniladi.", st["body"]))
    rows_mn = [
        ["Yer → Quyosh atrofida",   "Yer radiusi (6 371 km) << Yer-Quyosh masofasi (150 mln km)"],
        ["Futbol to'pi → maydonda", "To'p diametri (22 cm) << maydon o'lchami (100 m)"],
        ["Elektron → atomda",       "Elektron o'lchami ~ 10⁻¹⁸ m << atom radiusi ~ 10⁻¹⁰ m"],
        ["Avtobus → shahar bo'ylab","Avtobus uzunligi (12 m) << marshrut (10 km)"],
    ]
    elems.append(data_table(
        ["Holat", "Asoslash"], rows_mn, st, col_widths=[180, 270],
    ))

    elems.append(Paragraph("2.3  Sanash sistemasi va koordinatalar", st["h2"]))
    elems.append(Paragraph(
        "Harakatni tasvirlash uchun <b>sanash sistemasi</b> (tayanch jism + koordinatalar + "
        "soat) tanlanadi. Nuqtaning holati radius-vektor bilan beriladi:", st["body"]))
    elems.append(formula_box(
        [
            "r⃗ = x · î + y · ĵ + z · k̂",
            "|r⃗| = √(x² + y² + z²)",
        ],
        st,
        desc_lines=[
            "î, ĵ, k̂ — Ox, Oy, Oz o'qlarining birlik vektorlari",
            "x, y, z — koordinatalar [m]",
        ],
    ))

    elems.append(Paragraph("2.4  Ko'chish va yo'l", st["h2"]))
    elems.append(Paragraph(
        "Ko'chish (displacement) — boshlang'ich va oxirgi holatlar orasidagi to'g'ri "
        "chiziq vektori. Yo'l (distance) — jism bosib o'tgan traektoriyaning uzunligi. "
        "Ikki tushunchaning farqi muhim:", st["body"]))
    elems.append(formula_box(
        ["Δr⃗ = r⃗₂ − r⃗₁", "|Δr⃗| ≤ s   (tenlik faqat to'g'ri chiziqli harakatda)"],
        st,
    ))
    elems.append(example_box(
        "2-misol: Ko'chish va yo'lni farqlash",
        "Sportchi 400 m li oval trekning yarmini yuguradi "
        "(boshlang'ich va oxirgi nuqta qarama-qarshi). Ko'chish va yo'lni toping.",
        [
            "Yo'l: s = 200 m  (traektoriya bo'ylab)",
            "Ko'chish: |Δr⃗| = diametr = 400/π ≈ 127 m",
            "Xulosa: s > |Δr⃗|  — egri chiziqli harakatda har doim shunday.",
        ],
        st,
    ))

    # ── 3-MARUZA ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(3, "Tezlik va tezlanish vektorlari", 1, st))

    elems.append(Paragraph("3.1  O'rtacha va lahzaviy tezlik", st["h2"]))
    elems.append(Paragraph(
        "O'rtacha tezlik ko'chishning vaqtga nisbati sifatida aniqlanadi. "
        "Lekin harakat tafsilotlarini bilish uchun lahzaviy tezlik kerak — "
        "u Δt → 0 limiti sifatida aniqlanadi:", st["body"]))
    elems.append(formula_box(
        [
            "v⃗ort = Δr⃗ / Δt",
            "v⃗ = lim(Δt→0) Δr⃗/Δt = dr⃗/dt",
            "vₓ = dx/dt,   vy = dy/dt,   vz = dz/dt",
            "|v⃗| = √(vₓ² + vy² + vz²)   [m/s]",
        ],
        st,
        desc_lines=[
            "Lahzaviy tezlik yo'nalishi — traektoriyaga urinma bo'ylab.",
            "O'rtacha yo'l tezligi: <v> = s/Δt  (skalyar, yo'ldan hisoblanadi)",
        ],
    ))

    elems.append(Paragraph("3.2  Tezlanish", st["h2"]))
    elems.append(Paragraph(
        "Tezlanish tezlikning vaqt bo'yicha o'zgarishini ifodalaydi. "
        "Tezlanish ham vektoral kattaik:", st["body"]))
    elems.append(formula_box(
        [
            "a⃗ = dv⃗/dt = d²r⃗/dt²   [m/s²]",
            "aₓ = dvₓ/dt,   ay = dvy/dt,   az = dvz/dt",
        ],
        st,
    ))

    elems.append(Paragraph("3.3  Tangens va normal tezlanish", st["h2"]))
    elems.append(Paragraph(
        "Egri chiziqli harakatda tezlanish ikki tashkil etuvchiga ajratiladi. "
        "Har biri alohida fizik ma'noga ega:", st["body"]))
    rows_acc = [
        ["Tangens  aτ = dv/dt",  "Traektoriya bo'ylab", "Tezlik modulini o'zgartiradi"],
        ["Normal   aₙ = v²/R",   "Markazga yo'nalgan",  "Tezlik yo'nalishini o'zgartiradi"],
        ["To'liq   a = √(aτ²+aₙ²)", "Umumiy vektor",   "To'liq o'zgarish"],
    ]
    elems.append(data_table(
        ["Tezlanish", "Yo'nalish", "Ta'sir"], rows_acc, st,
        col_widths=[145, 135, 170],
    ))
    elems.append(note_box(
        "Tekis aylana harakatda: aτ = 0 (v = const), lekin aₙ = v²/R ≠ 0. "
        "Ya'ni jism tezlanadi (yo'nalishi o'zgaradi), lekin tezligi o'zgarmaydi!", st, "warning",
    ))
    elems.append(example_box(
        "3-misol: Aylana harakatda tezlanish",
        "Velosiped g'ildiragi R = 0.35 m, v = 10 m/s tezlikda aylanyapti. "
        "Normal tezlanishni va bir aylanish davrini toping.",
        [
            "aₙ = v²/R = 10²/0.35 = 100/0.35 ≈ 286 m/s²",
            "Aylanish davri: T = 2πR/v = 2π·0.35/10 ≈ 0.22 s",
            "Burchak tezligi: ω = v/R = 10/0.35 ≈ 28.6 rad/s",
        ],
        st,
    ))

    # ── 4-MARUZA ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(4, "To'g'ri chiziqli tekis va tekis o'zgaruvchan harakat", 1, st))

    elems.append(Paragraph("4.1  Tekis harakat (a = 0)", st["h2"]))
    elems.append(formula_box(
        [
            "v = const",
            "x(t) = x₀ + v·t",
            "s = v·t",
        ],
        st,
        desc_lines=["v-t grafigi — gorizontal to'g'ri chiziq; x-t grafigi — qiya to'g'ri chiziq"],
    ))

    elems.append(Paragraph("4.2  Tekis tezlanuvchan harakat (a = const)", st["h2"]))
    elems.append(Paragraph(
        "Bu eng ko'p uchraydigan harakat turi. Tezlanish doimiy bo'lganda uchta "
        "kinetik tenglamadan istalganini qo'llash mumkin:", st["body"]))
    elems.append(formula_box(
        [
            "v(t) = v₀ + a·t",
            "x(t) = x₀ + v₀·t + ½·a·t²",
            "v² = v₀² + 2·a·(x − x₀)",
            "vort = (v₀ + v) / 2   (faqat a = const uchun)",
        ],
        st,
    ))

    elems.append(Paragraph("4.3  Erkin tushish", st["h2"]))
    elems.append(Paragraph(
        "Havo qarshiligi e'tiborga olinmaganda barcha jismlar bir xil "
        "tezlanish bilan tushadi. Bu Galiley (1638) tajribasida isbotlangan.", st["body"]))
    elems.append(formula_box(
        [
            "g = 9.80665 m/s²  (standart qiymat)",
            "v(t) = g·t   (boshlang'ich tezlik nol bo'lsa)",
            "h(t) = ½·g·t²",
            "v² = 2·g·h",
        ],
        st,
        desc_lines=[
            "g qiymatlari: ekvator 9.780 m/s², qutb 9.832 m/s², Toshkent ~9.80 m/s²",
        ],
    ))
    elems.append(example_box(
        "4-misol: Erkin tushish",
        "Bino tepasidan tosh tashlanadi. 3 s dan keyin tosh yerga yetib keldi. "
        "Bino balandligi va yerga tegishidagi tezlikni toping.",
        [
            "h = ½·g·t² = ½·9.8·9 = 44.1 m",
            "v = g·t = 9.8·3 = 29.4 m/s ≈ 106 km/soat",
            "Tekshirish: v² = 2·9.8·44.1 = 864.36  →  v = 29.4 m/s  ✓",
        ],
        st,
    ))
    elems.append(example_box(
        "5-misol: Yuqoriga otish",
        "To'p vertikal ravishda v₀ = 20 m/s tezlik bilan yuqoriga otildi. "
        "Maksimal balandlik va yer yuziga qaytish vaqtini toping.",
        [
            "Eng yuqori nuqtada v = 0:  0 = v₀ − g·t  →  t_max = v₀/g = 20/9.8 ≈ 2.04 s",
            "Maksimal balandlik: H = v₀²/(2g) = 400/19.6 ≈ 20.4 m",
            "Yerga qaytish vaqti (simmetriya): T = 2·t_max = 4.08 s",
        ],
        st,
    ))

    # ── 5-MARUZA ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(5, "Qiya otish kinematikasi", 1, st))

    elems.append(Paragraph("5.1  Harakatni tashkil etuvchilarga ajratish", st["h2"]))
    elems.append(Paragraph(
        "Gorizontalga α burchak ostida v₀ tezlik bilan otilgan jism "
        "ikkita mustaqil harakat superpozitviyasini amalga oshiradi: "
        "gorizontal bo'yicha tekis harakat va vertikal bo'yicha tezlanuvchan harakat.", st["body"]))
    elems.append(formula_box(
        [
            "vₓ = v₀·cos α  = const",
            "vy(t) = v₀·sin α − g·t",
            "x(t) = v₀·cos α · t",
            "y(t) = v₀·sin α · t − ½·g·t²",
        ],
        st,
    ))

    elems.append(Paragraph("5.2  Asosiy formulalar", st["h2"]))
    elems.append(formula_box(
        [
            "Parvoz vaqti:    T = 2·v₀·sin α / g",
            "Maksimal balandlik:  H = v₀²·sin²α / (2g)",
            "Uchish masofasi:  L = v₀²·sin(2α) / g",
            "Optimal burchak:  α = 45°  →  Lmax = v₀²/g",
        ],
        st,
        desc_lines=["Traektoriya tenglamasi:  y = x·tanα − g·x² / (2v₀²·cos²α)  — parabola"],
    ))
    elems.append(example_box(
        "6-misol: Top otish masalasi",
        "Topxona to'pi v₀ = 400 m/s, α = 45° burchak ostida otildi "
        "(havo qarshiligi hisobga olinmaydi). Maksimal masofa va balandlikni toping.",
        [
            "Lmax = v₀²/g = 400²/9.8 = 160 000/9.8 ≈ 16 327 m ≈ 16.3 km",
            "H = v₀²·sin²45°/(2g) = 160000·0.5/19.6 = 4082 m ≈ 4.1 km",
            "Parvoz vaqti: T = 2·400·sin45°/9.8 = 2·400·0.707/9.8 ≈ 57.7 s",
        ],
        st,
    ))
    elems.append(note_box(
        "Haqiqatda havo qarshiligi tufayli optimal burchak 45° dan kichik bo'ladi "
        "(taxminan 30°–40°). Artilleriyada bu farq juda muhim.", st, "warning",
    ))

    # ── 6-MARUZA ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(6, "Aylana bo'ylab harakat. Burchak tezligi", 1, st))

    elems.append(Paragraph("6.1  Burchak kattaliklar", st["h2"]))
    elems.append(formula_box(
        [
            "Burchak ko'chish:   dφ  [rad]",
            "Burchak tezligi:    ω = dφ/dt   [rad/s]",
            "Burchak tezlanish:  β = dω/dt = d²φ/dt²  [rad/s²]",
            "Tekis aylana:   ω = 2π/T = 2π·ν",
        ],
        st,
    ))

    elems.append(Paragraph("6.2  Chiziqli va burchak kattaliklar bog'liqligi", st["h2"]))
    elems.append(formula_box(
        [
            "v  = ω·R    (chiziqli tezlik)",
            "aτ = β·R    (tangens tezlanish)",
            "aₙ = ω²·R = v²/R  (normal tezlanish)",
        ],
        st,
        desc_lines=["R — aylana radiusi [m]"],
    ))

    elems.append(Paragraph("6.3  Tekis o'zgaruvchan aylana harakat", st["h2"]))
    elems.append(formula_box(
        [
            "ω(t) = ω₀ + β·t",
            "φ(t) = φ₀ + ω₀·t + ½·β·t²",
            "ω² = ω₀² + 2·β·φ",
        ],
        st,
        desc_lines=["To'g'ri chiziqli harakat formulalari bilan to'liq analogiya!"],
    ))
    elems.append(example_box(
        "7-misol: Turbina",
        "Dvigatel turbinasi ishga tushganda 0 dan 3000 ayl/min ga "
        "10 s da yetdi. Burchak tezlanish va 10 s da qancha aylanganini toping.",
        [
            "ω₀ = 0,  ω = 3000 ayl/min = 3000·2π/60 = 100π rad/s ≈ 314 rad/s",
            "β = Δω/Δt = 314/10 = 31.4 rad/s²",
            "φ = ½·β·t² = ½·31.4·100 = 1570 rad = 1570/(2π) ≈ 250 aylanish",
        ],
        st,
    ))

    # ── 7-MARUZA ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(7, "Nisbiy harakat. Galiley almashtirishlari", 1, st))

    elems.append(Paragraph("7.1  Sanash sistemalari", st["h2"]))
    elems.append(Paragraph(
        "<b>Inersial sanash sistemasi</b> — tashqi kuchlar ta'sir etmasa (yoki kuchlar "
        "balansda bo'lsa) jism tinch turadi yoki tekis chiziqli harakatlanadi. "
        "Bunday sistema birortasi inersial bo'lsa, unga nisbatan tekis chiziqli "
        "harakatlanuvchi har qanday sistema ham inersialdir.", st["body"]))

    elems.append(Paragraph("7.2  Galiley almashtirishlari", st["h2"]))
    elems.append(Paragraph(
        "K' sistema K ga nisbatan Ox o'qi bo'ylab V tezlikda harakatlansin:", st["body"]))
    elems.append(formula_box(
        [
            "x' = x − V·t",
            "y' = y,   z' = z,   t' = t  (mutlaq vaqt!)",
            "v'ₓ = vₓ − V,   v'y = vy",
            "a' = a  (tezlanish o'zgarmaydi — inersial sistemalarda)",
        ],
        st,
        desc_lines=["Galiley almashtirishlari v << c bo'lganda to'g'ri. Relativistik holatda Lorens almashtirishlari kerak."],
    ))
    elems.append(example_box(
        "8-misol: Sel harakati",
        "Daryo qirg'og'iga nisbatan oqim tezligi u = 2 m/s (sharqqa). "
        "Qayiqchi o'z kuchiga ko'ra v = 3 m/s (shimolga) suzadi. "
        "Qirg'oqqa nisbatan qayiqchi tezligi va yo'nalishini toping.",
        [
            "v⃗nati = v⃗qayiq + u⃗ = (0, 3) + (2, 0) = (2, 3) m/s",
            "|v⃗nati| = √(4+9) = √13 ≈ 3.61 m/s",
            "Burchak: tanθ = 2/3  →  θ ≈ 33.7° (shimol-sharqqa)",
        ],
        st,
    ))

    # Bob xulosasi
    elems.append(summary_box([
        "Moddiy nuqta — o'lchamlari masalada e'tiborga olinmaydigan jism",
        "v⃗ = dr⃗/dt,   a⃗ = dv⃗/dt = d²r⃗/dt²",
        "Tekis o'zgaruvchan:  v = v₀+at,  x = x₀+v₀t+½at²,  v² = v₀²+2ax",
        "Qiya otish: L = v₀²·sin(2α)/g,  α = 45° da Lmax = v₀²/g",
        "Aylana: v = ωR,  aₙ = v²/R = ω²R,  aτ = βR",
        "Galiley: v' = v − V (klassik tezliklar qo'shilishi)",
    ], st))

    elems.append(questions_block([
        "Yo'l va ko'chishning farqini geometrik jihatdan tushuntiring.",
        "O'rtacha va lahzaviy tezlik qachon teng bo'ladi?",
        "Vertikal yuqoriga otilgan tosh eng yuqori nuqtada nima uchun tezlanishga ega?",
        "Qiya otishda uchish masofasi α = 30° va α = 60° da teng bo'ladimi? Isbotlang.",
        "Tekis aylana harakatda tezlanish bormi? Qaysi yo'nalishda?",
        "Avtomobil v₀ = 72 km/soat dan t = 5 s da to'xtadi. Tezlanish va yo'lni toping.",
        "Ikkita jism bir vaqtda bir nuqtadan: biri gorizontal v₁ = 10 m/s, "
        "ikkinchisi α = 30°, v₂ = 20 m/s bilan otildi. Qaysi biri uzoqroq uchadi?",
        "Poyezd 60 km/soat tezlikda harakatlanayapti. Yo'lovchi oldindan v = 2 m/s yursa, "
        "erga nisbatan tezligi qancha?",
    ], st))

    return elems


# ═══════════════════════════════════════════════════════════════════════════
def build_bob2(st):
    """II BOB — DINAMIKA"""
    elems = []
    elems += cover_page(
        bob_num=2,
        bob_title="DINAMIKA",
        subtitle="Kuch, massa, Nyuton qonunlari va saqlanish qonunlari",
        lessons=[
            "Nyuton qonunlari. Inersiya va kuch",
            "Tortishish, elastiklik va ishqalanish kuchlari",
            "Impuls. Impuls saqlanish qonuni",
            "Mexanik ish, quvvat va energiya saqlanishi",
            "Impuls momenti. Aylanma harakat dinamikasi",
        ],
        st=st,
    )

    # ── MARUZA 8 ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(8, "Nyuton qonunlari", 2, st))

    elems.append(Paragraph("8.1  Nyutonning birinchi qonuni (inersiya qonuni)", st["h2"]))
    elems.append(Paragraph(
        "1687 yilda Isaak Nyuton «Naturalis Principia Mathematica» asarida uchta "
        "fundamental qonunni shakllantirdi. Birinchi qonun inersial sanash "
        "sistemasini aniqlaydi:", st["body"]))
    elems.append(formula_box(
        ["ΣF⃗ = 0  ⟹  v⃗ = const  (shu jumladan nol)"],
        st,
        desc_lines=["Tashqi kuchlar nol bo'lsa yoki ularning natijaviy vektori nol bo'lsa jism harakati o'zgarmaydi."],
    ))
    elems.append(Paragraph(
        "<b>Inersiya</b> — jismning tashqi ta'sirsiz o'z harakat holatini saqlab "
        "qolish xususiyati. Massasi katta jism inersiyasi katta — uning harakatini "
        "o'zgartirish qiyinroq.", st["body"]))

    elems.append(Paragraph("8.2  Nyutonning ikkinchi qonuni", st["h2"]))
    elems.append(formula_box(
        [
            "F⃗ = m·a⃗   →   a⃗ = F⃗/m",
            "Fₓ = m·aₓ,   Fy = m·ay,   Fz = m·az",
            "1 N = 1 kg·m/s²",
        ],
        st,
        desc_lines=[
            "F⃗ — barcha kuchlarning vektoral yig'indisi (natijaviy kuch)",
            "m — massa (inersiya o'lchovi) [kg]",
            "a⃗ — tezlanish [m/s²]",
        ],
    ))
    elems.append(note_box(
        "Muhim: F = ma da F — NATIJAVIY kuch (barcha kuchlar yig'indisi). "
        "Bitta kuchni yozish xato! ΣF = F₁ + F₂ + ... = ma", st, "warning",
    ))

    elems.append(Paragraph("8.3  Nyutonning uchinchi qonuni", st["h2"]))
    elems.append(formula_box(
        ["F⃗₁₂ = −F⃗₂₁"],
        st,
        desc_lines=[
            "F⃗₁₂ — 1-jism 2-jismga ta'sir etuvchi kuch",
            "F⃗₂₁ — 2-jism 1-jismga ta'sir etuvchi kuch",
            "Ikkala kuch bir xil modul, qarama-qarshi yo'nalish, lekin TURLI jismlarda!",
        ],
    ))
    elems.append(example_box(
        "9-misol: Liftda o'lchash",
        "Massasi m = 70 kg bo'lgan odam liftda turibdi. Lift a = 2 m/s² bilan "
        "yuqoriga tezlanayapti. Tarozida ko'rsatma nechaga teng?",
        [
            "Kuchlar: N (yuqoriga) va mg (pastga)",
            "2-qonun: N − mg = ma  →  N = m(g+a) = 70·(9.8+2) = 70·11.8 = 826 N",
            "Og'irlik ekvivalenti: 826/9.8 ≈ 84.3 kg",
            "Tekshirish: pastga tezlanganda N = m(g−a) = 70·7.8 = 546 N ≈ 55.7 kg",
        ],
        st,
    ))

    elems.append(Paragraph("8.4  Massa va og'irlik", st["h2"]))
    rows_mw = [
        ["Massa m", "kg", "Inersiya va gravitatsion xususiyat", "Joyga bog'liq emas"],
        ["Og'irlik W", "N", "Yer tortish kuchi: W = mg", "Joyga bog'liq (g farqli)"],
        ["Og'irlik kuch P", "N", "Tayanch reaktsiyasi", "Tezlanishga bog'liq"],
    ]
    elems.append(data_table(
        ["Kattaik", "Birlik", "Fizik ma'no", "Xususiyat"],
        rows_mw, st, col_widths=[80, 40, 175, 155],
    ))

    # ── MARUZA 9 ──────────────────────────────────────────────────────────────
    elems.append(lecture_header(9, "Tortishish, elastiklik va ishqalanish kuchlari", 2, st))

    elems.append(Paragraph("9.1  Umumjahon tortishish qonuni", st["h2"]))
    elems.append(Paragraph(
        "Nyuton (1687) oy harakati va jism tushishini bir qonun bilan birlashtirdi:", st["body"]))
    elems.append(formula_box(
        [
            "F = G · (m₁·m₂) / r²",
            "G = 6.674 × 10⁻¹¹  N·m²/kg²  (gravitatsion doimiy)",
        ],
        st,
    ))
    elems.append(formula_box(
        [
            "g = G·M_Z / R_Z²",
            "M_Z = 5.972 × 10²⁴ kg,   R_Z = 6.371 × 10⁶ m",
            "g ≈ 9.80 m/s²  →  balandlikda:  g(h) = G·M_Z / (R_Z+h)²",
        ],
        st,
        desc_lines=["h = 400 km (ISS orbita): g ≈ 8.7 m/s²  — og'irliksizlik emas, faqat erkin tushish!"],
    ))

    elems.append(Paragraph("9.2  Guk qonuni — elastiklik kuchi", st["h2"]))
    elems.append(Paragraph(
        "Deformatsiya kichik bo'lganda tiklanish kuchi deformatsiyaga proporsional:", st["body"]))
    elems.append(formula_box(
        [
            "F_el = −k·x",
            "k — prujina qattiqligi  [N/m]",
            "x — deformatsiya (cho'zilish yoki siqilish)  [m]",
        ],
        st,
        desc_lines=["Manfiy ishora: kuch deformatsiyaga qarshi yo'nalgan (tiklanish kuchi)"],
    ))
    elems.append(example_box(
        "10-misol: Prujina",
        "Prujina k = 200 N/m. 5 kg yuk osig'liq. Uzayishini toping.",
        [
            "Muvozanat: k·x = mg  →  x = mg/k = 5·9.8/200 = 0.245 m = 24.5 sm",
        ],
        st,
    ))

    elems.append(Paragraph("9.3  Ishqalanish kuchlari", st["h2"]))
    rows_fr = [
        ["Statik ishqalanish",   "F_st ≤ μ_s·N",   "Jism harakatsiz", "μ_s ≥ μ_k"],
        ["Kinetik ishqalanish",  "F_k  = μ_k·N",   "Jism harakatda",  "Konstantaga yaqin"],
        ["Siljishga qarshilik",  "F_r = C·v (v kichik)", "Suyuqlikda", "Stoks qonuni"],
    ]
    elems.append(data_table(
        ["Tur", "Formula", "Holat", "Izoh"],
        rows_fr, st, col_widths=[100, 130, 110, 110],
    ))
    elems.append(Paragraph(
        "Ishqalanish koeffitsientlari μ_s va μ_k materialga bog'liq, ammo yuz "
        "maydoniga bog'liq emas (Amonton qonuni, 1699). Tipik qiymatlar:", st["body"]))
    rows_mu = [
        ["Metall—metall (quruq)", "0.15—0.30", "0.10—0.25"],
        ["Kauchuk—asfalt",        "0.7—0.8",   "0.5—0.7"],
        ["Muz—muz",               "0.05—0.10", "0.03—0.06"],
        ["Yog'langan po'lat",     "0.05—0.10", "0.04—0.08"],
    ]
    elems.append(data_table(
        ["Material juft", "μ_s", "μ_k"], rows_mu, st,
        col_widths=[220, 110, 110],
    ))

    # ── MARUZA 10 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(10, "Impuls va impuls saqlanish qonuni", 2, st))

    elems.append(Paragraph("10.1  Impuls tushunchasi", st["h2"]))
    elems.append(formula_box(
        [
            "p⃗ = m·v⃗   [kg·m/s]",
            "F⃗ = dp⃗/dt   (Nyutonning 2-qonuni umumiy ko'rinishi)",
            "Kuch impulsi:  J⃗ = ∫F dt = Δp⃗",
        ],
        st,
        desc_lines=["Kuch impulsi va impuls o'zgarishi teng — bu 2-qonunning integral ko'rinishi"],
    ))

    elems.append(Paragraph("10.2  Impuls saqlanish qonuni", st["h2"]))
    elems.append(formula_box(
        [
            "ΣF⃗_tashqi = 0  ⟹  P⃗_umumiy = Σmᵢ·v⃗ᵢ = const",
        ],
        st,
        desc_lines=["Yopiq tizimda (tashqi kuchlar nol) umumiy impuls saqlanadi"],
    ))

    elems.append(Paragraph("10.3  To'qnashuvlar", st["h2"]))
    rows_coll = [
        ["Absolyut elastik",
         "p = const, E_k = const",
         "Atom zarrachalar, bilyar sharlari",
         "Tezliklar almashadi (teng massa)"],
        ["Absolyut noelastik",
         "p = const, E_k kamayadi",
         "Loy-loy, jismlar yopishishi",
         "u = (m₁v₁+m₂v₂)/(m₁+m₂)"],
        ["Qisman elastik",
         "p = const, E_k qisman saqlanadi",
         "Ko'pgina real to'qnashuvlar",
         "Tiklanish koeffitsienti e = v'/v"],
    ]
    elems.append(data_table(
        ["Tur", "Saqlanadi", "Misol", "Formula"],
        rows_coll, st, col_widths=[90, 115, 130, 115],
    ))
    elems.append(example_box(
        "11-misol: To'qnashuv",
        "Massasi m₁ = 2 kg, v₁ = 6 m/s bo'lgan jism tinch turgan "
        "m₂ = 3 kg jism bilan to'liq noelastik to'qnashdi.",
        [
            "p_oldin = m₁·v₁ = 2·6 = 12 kg·m/s",
            "u = p_oldin/(m₁+m₂) = 12/5 = 2.4 m/s",
            "E_k_oldin = ½·2·36 = 36 J",
            "E_k_keyin = ½·5·5.76 = 14.4 J",
            "Issiqlikka: ΔE = 36 − 14.4 = 21.6 J  (60% yo'qoldi)",
        ],
        st,
    ))

    elems.append(Paragraph("10.4  Raketa harakati", st["h2"]))
    elems.append(Paragraph(
        "Raketa — impuls saqlanish qonunining eng muhim amaliy tatbiqi. "
        "Gazlar chiqarish orqali kema tezlanadi:", st["body"]))
    elems.append(formula_box(
        [
            "Mesherskiy tenglamasi:  M·dv = −u·dM",
            "Tsiolkovskiy formulasi: Δv = u · ln(M₀/Mₖ)",
        ],
        st,
        desc_lines=[
            "u — gazning chiqish tezligi (10-mi-ing ra'yi m/s dan 4000 m/s gacha)",
            "M₀ — boshlang'ich massa (yoqilg'i bilan)",
            "Mₖ — oxirgi massa (bo'sh kema)",
            "Misol: Saturn-V: u = 2600 m/s,  M₀/Mₖ = 15  →  Δv = 2600·ln(15) ≈ 7000 m/s",
        ],
    ))

    # ── MARUZA 11 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(11, "Mexanik ish, quvvat va energiya saqlanishi", 2, st))

    elems.append(Paragraph("11.1  Mexanik ish", st["h2"]))
    elems.append(formula_box(
        [
            "dA = F⃗ · ds⃗ = F·ds·cosα",
            "A = ∫F⃗·ds⃗   [J = N·m]",
            "α = 0°:   A = F·s  (maks.)",
            "α = 90°:  A = 0    (kuch ish bajarmaydi)",
            "α = 180°: A = −F·s (qarshilik kuchi ishi)",
        ],
        st,
    ))

    elems.append(Paragraph("11.2  Kinetik energiya va ish-energiya teoremasi", st["h2"]))
    elems.append(formula_box(
        [
            "Ek = ½·m·v²   [J]",
            "A_natijaviy = ΔEk = Ek₂ − Ek₁",
        ],
        st,
        desc_lines=["Natijaviy kuch ishi kinetik energiya o'zgarishiga teng"],
    ))

    elems.append(Paragraph("11.3  Potensial energiya va konservativ kuchlar", st["h2"]))
    elems.append(Paragraph(
        "<b>Konservativ kuch</b> — ishi faqat boshlang'ich va oxirgi holatga bog'liq, "
        "traektoriyaga bog'liq bo'lmagan kuch. Yopiq yo'l bo'ylab ishi nol.", st["body"]))
    elems.append(formula_box(
        [
            "Tortishish potensial E.:   Ep = m·g·h",
            "Elastiklik potensial E.:   Ep = ½·k·x²",
            "F_konservativ = −dEp/dx",
        ],
        st,
    ))

    elems.append(Paragraph("11.4  Mexanik energiya saqlanish qonuni", st["h2"]))
    elems.append(formula_box(
        [
            "E = Ek + Ep = const   (konservativ tizimda)",
            "½mv₁² + Ep₁ = ½mv₂² + Ep₂",
        ],
        st,
    ))
    elems.append(example_box(
        "12-misol: Roller-coaster",
        "Attraksionda vagon h = 40 m balandlikdan tushadi (boshlang'ich tezlik = 0). "
        "Pastdagi tezlik va minimal balandlikda zarur markazga intilma kuchni toping (R = 10 m).",
        [
            "Energiya saqlanish: mgh = ½mv²  →  v = √(2gh) = √(2·9.8·40) = √784 = 28 m/s",
            "Minimal shart uchun: N − mg = mv²/R  →  N = m(g + v²/R)",
            "N = m(9.8 + 784/10) = m·88.2 N/kg  →  og'irlik 9 baravar ortadi!",
        ],
        st,
    ))

    elems.append(Paragraph("11.5  Quvvat", st["h2"]))
    elems.append(formula_box(
        [
            "P = dA/dt = F⃗·v⃗ = F·v·cosα   [W = J/s]",
            "1 kW = 1000 W,   1 ot kuchi (hp) = 746 W",
        ],
        st,
    ))

    # ── MARUZA 12 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(12, "Impuls momenti va qattiq jism mexanikasi", 2, st))

    elems.append(Paragraph("12.1  Impuls momenti", st["h2"]))
    elems.append(formula_box(
        [
            "L⃗ = r⃗ × p⃗ = m·(r⃗ × v⃗)   [kg·m²/s]",
            "τ⃗ = r⃗ × F⃗ = dL⃗/dt   (kuch momenti)",
            "Saqlanish: Στ_tashqi = 0  ⟹  L⃗ = const",
        ],
        st,
    ))

    elems.append(Paragraph("12.2  Inersiya momenti", st["h2"]))
    elems.append(Paragraph(
        "Massaning aylanma harakatdagi analogi — inersiya momenti. "
        "U massaning aylanish o'qidan qanday taqsimlanganiga bog'liq:", st["body"]))
    elems.append(formula_box(
        [
            "I = Σ mᵢ·rᵢ²  yoki  I = ∫r²·dm   [kg·m²]",
            "Parallel o'qlar teoremasi:  I = Icm + M·d²",
        ],
        st,
        desc_lines=["d — massa markazi o'qidan yangi o'q gacha masofa"],
    ))
    rows_inertia = [
        ["Yupqa halqa",   "I = MR²",          "R — radius"],
        ["Disk (silindr)","I = ½MR²",          "R — radius"],
        ["Sfera",         "I = ⅖MR²",          "R — radius"],
        ["Yupqa tayoq",   "I = ML²/12",        "L — uzunlik, o'rta nuqtadan"],
        ["Yupqa tayoq",   "I = ML²/3",         "L — uzunlik, uchidan"],
    ]
    elems.append(data_table(
        ["Jism shakli", "Inersiya momenti", "Izoh"],
        rows_inertia, st, col_widths=[150, 130, 170],
    ))
    elems.append(formula_box(
        [
            "Aylanma dinamika: τ = I·β   (F = ma analogiyasi)",
            "Kinetik energiya: Ek_ayl = ½·I·ω²",
        ],
        st,
    ))
    elems.append(example_box(
        "13-misol: Giroskop",
        "Velosiped g'ildiragi: M = 1.5 kg, R = 0.35 m, I = ½MR². "
        "v = 5 m/s da kinetik energiya va impuls momentini toping.",
        [
            "ω = v/R = 5/0.35 = 14.3 rad/s",
            "I = ½·1.5·0.35² = ½·1.5·0.1225 = 0.092 kg·m²",
            "Ek_ayl = ½·I·ω² = ½·0.092·204 = 9.4 J",
            "L = I·ω = 0.092·14.3 = 1.31 kg·m²/s",
        ],
        st,
    ))

    elems.append(summary_box([
        "ΣF⃗ = m·a⃗  (2-qonun, natijaviy kuch)",
        "F₁₂ = −F₂₁  (3-qonun, turli jismlarda!)",
        "F_grav = G·m₁m₂/r²,   g = GM_Z/R_Z² = 9.8 m/s²",
        "Impuls saqlanish: tashqi kuchlar nol bo'lsa  ΣP = const",
        "Energiya saqlanish: Ek + Ep = const (konservativ tizim)",
        "Impuls momenti saqlanish: Στ = 0 bo'lsa  ΣL = const",
    ], st))
    elems.append(questions_block([
        "3-qonunni to'g'ri tushuntiring: ot aravacha tortadi, aravacha ot tortadi — kim yutadi?",
        "Erkin tushayotgan liftda tarozi nol ko'rsatadi. Nima uchun?",
        "Kosmik kemada og'irliksizlik — tortishish yo'qligidanmi yoki boshqa sababdanmi?",
        "m₁ = 1 kg, v₁ = 10 m/s  va  m₂ = 2 kg, v₂ = 0. Elastik to'qnashuv. v₁', v₂'?",
        "Muzda uchayotgan konki: L = 80 kg·m²/s. Qo'llarni tortsangiz I kamayadi. ω?",
        "Qiya tekislikda (θ = 30°, μ = 0.2) 5 kg yuk. Harakatlanish uchun kuch va tezlanish.",
        "Nima uchun velosipedda harakatlanayotganda muvozanat oson saqlanadi?",
    ], st))

    return elems


# ═══════════════════════════════════════════════════════════════════════════
def build_bob3(st):
    """III BOB — MEXANIK TEBRANISHLAR VA TO'LQINLAR"""
    elems = []
    elems += cover_page(
        bob_num=3,
        bob_title="MEXANIK TEBRANISHLAR VA TO'LQINLAR",
        subtitle="Garmonik tebranish, so'nish, rezonans va to'lqin fizikasi",
        lessons=[
            "Erkin garmonik tebranishlar. Matematik va prujinali mayatnik",
            "So'nuvchi tebranishlar. Majburiy tebranishlar va rezonans",
            "Mexanik to'lqinlar. Tovush fizikasi. Doppler effekti",
        ],
        st=st,
    )

    # ── MARUZA 13 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(13, "Erkin garmonik tebranishlar", 3, st))

    elems.append(Paragraph("13.1  Tebranish nima?", st["h2"]))
    elems.append(Paragraph(
        "Tebranish — jismning muvozanat holatiga nisbatan davriy "
        "qaytib-keluvchi harakat. Agar tiklash kuchi ko'chishga "
        "proporsional bo'lsa (Guk qonuni kabi), natija "
        "<b>garmonik tebranish</b> bo'ladi.", st["body"]))

    elems.append(Paragraph("13.2  Garmonik tebranish tenglamasi", st["h2"]))
    elems.append(formula_box(
        [
            "ẍ + ω₀²·x = 0   (differensial tenglama)",
            "x(t) = A·cos(ω₀t + φ₀)",
            "v(t) = −A·ω₀·sin(ω₀t + φ₀)",
            "a(t) = −A·ω₀²·cos(ω₀t + φ₀) = −ω₀²·x",
        ],
        st,
        desc_lines=[
            "A  — amplituda [m] (muvozanatdan maksimal og'ish)",
            "ω₀ — sikllik chastota [rad/s]",
            "φ₀ — boshlang'ich faza [rad]",
            "T = 2π/ω₀ — davr [s];   ν = 1/T — chastota [Hz]",
        ],
    ))
    elems.append(note_box(
        "Tezlanish muvozanat holatida NOLGA teng, eng katta ko'chishda MAKSIMAL. "
        "Tezlik esa aksincha — muvozanatda maksimal, ekstremal nuqtalarda nol.", st, "info",
    ))

    elems.append(Paragraph("13.3  Prujinali va matematik mayatnik", st["h2"]))
    rows_pend = [
        ["Prujinali mayatnik", "F = −kx", "ω₀ = √(k/m)", "T = 2π√(m/k)", "m ga bog'liq, A ga emas"],
        ["Matematik mayatnik","F = −mg·sinθ ≈ −mgθ","ω₀ = √(g/L)", "T = 2π√(L/g)", "L ga bog'liq, m ga emas"],
    ]
    elems.append(data_table(
        ["Tur", "Kuch", "ω₀", "T", "Bog'liqlik"],
        rows_pend, st, col_widths=[90, 100, 90, 90, 80],
    ))
    elems.append(note_box(
        "Matematik mayatnik tenglamasi faqat kichik og'ishlarda (θ < 5°) to'g'ri. "
        "θ = 5° da xatolik < 0.1%. Bu tenglamadan g ni tajribada aniqlash mumkin: "
        "g = 4π²L/T²", st, "success",
    ))
    elems.append(example_box(
        "14-misol: Soat mayatniki",
        "Soat mayatniki T = 1 s davr bilan tebranishi uchun uzunligi qancha bo'lishi kerak? "
        "(g = 9.81 m/s²)",
        [
            "T = 2π√(L/g)  →  L = g·T²/(4π²)",
            "L = 9.81·1²/(4·π²) = 9.81/39.48 ≈ 0.2485 m ≈ 24.85 sm",
            "Eslatma: bu «sekundli mayatnik» — har yarim davr 0.5 s «tik-tak»",
        ],
        st,
    ))

    elems.append(Paragraph("13.4  Tebranish energiyasi", st["h2"]))
    elems.append(formula_box(
        [
            "Ek = ½m·ω₀²·A²·sin²(ω₀t+φ₀)",
            "Ep = ½m·ω₀²·A²·cos²(ω₀t+φ₀)",
            "E = Ek + Ep = ½m·ω₀²·A² = ½k·A² = const",
        ],
        st,
        desc_lines=["Umumiy mexanik energiya amplitudaga proporsional — garmonik tebranishda saqlanadi"],
    ))

    # ── MARUZA 14 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(14, "So'nuvchi tebranishlar va rezonans", 3, st))

    elems.append(Paragraph("14.1  So'nuvchi tebranishlar", st["h2"]))
    elems.append(Paragraph(
        "Real tizimda muhit qarshiligi tebranishlarni so'ndiradi. "
        "Kichik qarshilik uchun (β < ω₀) harakat:", st["body"]))
    elems.append(formula_box(
        [
            "ẍ + 2β·ẋ + ω₀²·x = 0",
            "x(t) = A₀·e^(−β·t)·cos(ω·t + φ)",
            "ω = √(ω₀² − β²)   (so'nuvchi chastota)",
            "So'nish dekrementi: δ = β·T = ln(Aₙ/Aₙ₊₁)",
            "Sifat ko'rsatkichi:  Q = π/(β·T) = ω/(2β)",
        ],
        st,
        desc_lines=[
            "β — so'nish koeffitsienti [s⁻¹]",
            "Q katta (β kichik) → sekin so'nadi.  Misol: kvarts rezonator Q ~ 10⁶",
        ],
    ))
    rows_q = [
        ["Mushuk tizimi (yumshoq yostiq)", "< 0.5",  "Tez so'nadi"],
        ["Avtomobil amortizator",           "0.5—1",  "Bir-ikki tebranish"],
        ["Kamera tutqich (vibratsiya)",     "5—50",   "O'rtacha Q"],
        ["Gitara tori",                     "100—500","Uzoq jaranglaydi"],
        ["Kvarts kristall",                 "10⁴—10⁶","Soat tebranishi"],
    ]
    elems.append(data_table(
        ["Tizim", "Q qiymati", "Xarakter"], rows_q, st,
        col_widths=[200, 110, 140],
    ))

    elems.append(Paragraph("14.2  Majburiy tebranishlar va rezonans", st["h2"]))
    elems.append(Paragraph(
        "Tashqi davriy kuch F = F₀·cos(Ωt) ta'sirida statsionar rejimda:", st["body"]))
    elems.append(formula_box(
        [
            "A(Ω) = (F₀/m) / √((ω₀² − Ω²)² + 4β²Ω²)",
            "Rezonans chastotasi: Ω_r = √(ω₀² − 2β²)",
            "β → 0 da:  Ω_r → ω₀  va  A_r = F₀/(2mβω₀) → ∞",
        ],
        st,
        desc_lines=[
            "Ω — tashqi kuch sikllik chastotasi",
            "A maksimum Ω = Ω_r da bo'ladi (rezonans)",
        ],
    ))
    elems.append(note_box(
        "1940-yil, Takoma tor'i ko'prigi: shamol ko'prikni rezonans chastotasida "
        "tebratdi (Ω ≈ ω₀). Natijada ko'prik qulab tushdi (video YouTube da mavjud).", st, "warning",
    ))
    elems.append(note_box(
        "Foydali rezonans: radio va TV qabul qilish (kontur rezonatorlari), MRT "
        "apparatlari, gitara va skripka gumbazi, mikrotolqinli pech.", st, "success",
    ))

    # ── MARUZA 15 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(15, "Mexanik to'lqinlar. Tovush. Doppler effekti", 3, st))

    elems.append(Paragraph("15.1  To'lqin harakati", st["h2"]))
    elems.append(Paragraph(
        "To'lqin — muhitda energiya va impulsning moddiy ko'chishsiz tarqalishi. "
        "To'lqinda zarrachalar tebranadi, lekin ko'chmaydi.", st["body"]))
    elems.append(formula_box(
        [
            "ξ(x, t) = A·cos(ωt − kx + φ₀)",
            "k = 2π/λ  (to'lqin soni),   λ = v·T  (to'lqin uzunligi)",
            "v = λ·ν = ω/k   (fazaviy tezlik)",
        ],
        st,
        desc_lines=["Ko'ndalang to'lqin: tebranish v⃗ ga ⊥.   Bo'ylama to'lqin: tebranish v⃗ bilan ∥"],
    ))

    elems.append(Paragraph("15.2  Tovush to'lqinlari", st["h2"]))
    elems.append(formula_box(
        [
            "v_tovush = √(γ·P/ρ) = √(γ·RT/M)",
            "Havoda 20°C da: v ≈ 343 m/s",
            "Harorat ta'siri: v(t) ≈ 331 + 0.6·t  [m/s]  (t — Celsius da)",
        ],
        st,
        desc_lines=[
            "γ — adiabat ko'rsatkichi (havo uchun 1.4)",
            "Suvda: 1480 m/s;   Temirda: 5100 m/s;   Granit: 5950 m/s",
        ],
    ))
    rows_sound = [
        ["Eshitish chegarasi",  "0 dB",    "10⁻¹² W/m²", "P₀ etalon"],
        ["Yaproq shovqini",     "10 dB",   "10⁻¹¹ W/m²", "1 bar"],
        ["Shivirlash",          "30 dB",   "10⁻⁹ W/m²",  "3 m"],
        ["Oddiy suhbat",        "60 dB",   "10⁻⁶ W/m²",  "1 m"],
        ["Ko'cha shovqini",     "80 dB",   "10⁻⁴ W/m²",  "—"],
        ["Kontsert (rok)",      "110 dB",  "0.1 W/m²",   "Xavfli!"],
        ["Reaktiv samolyot",    "130 dB",  "10 W/m²",    "Og'riq"],
    ]
    elems.append(data_table(
        ["Manba", "Sath (dB)", "Intensivlik", "Izoh"],
        rows_sound, st, col_widths=[160, 80, 100, 110],
    ))
    elems.append(formula_box(
        ["L = 10·lg(I/I₀)   [dB]",  "I₀ = 10⁻¹² W/m²"],
        st,
        desc_lines=["Har 10 dB → intensivlik 10 marta ortadi. 20 dB → 100 marta, 60 dB → 10⁶ marta"],
    ))

    elems.append(Paragraph("15.3  Doppler effekti", st["h2"]))
    elems.append(formula_box(
        [
            "ν' = ν₀ · (v + v_kuz) / (v − v_manba)",
            "Yaqinlashayotganda: ν' > ν₀  (yuqori parda)",
            "Uzoqlashayotganda:  ν' < ν₀  (past parda)",
        ],
        st,
        desc_lines=[
            "v — tovush tezligi;  v_kuz — kuzatuvchi tezligi;  v_manba — manba tezligi",
            "Qoidalar: kuzatuvchi manbaga yaqinlasa '+', manbadan uzoqlasa '−'",
        ],
    ))
    elems.append(example_box(
        "15-misol: Tez yordam mashina sirena",
        "Tez yordam mashinasi v_m = 108 km/soat = 30 m/s tezlikda yaqinlashmoqda. "
        "Sirena chastotasi ν₀ = 800 Hz. Kuzatuvchi eshitadigan chastota?",
        [
            "v = 343 m/s,  v_kuz = 0 (tinch turgan kuzatuvchi)",
            "ν' = 800 · (343+0)/(343−30) = 800 · 343/313 ≈ 876 Hz",
            "Mashinа o'tib ketganidan keyin: ν'' = 800 · 343/373 ≈ 735 Hz",
            "Farq: 876 − 735 = 141 Hz — bu effektni eshitish mumkin!",
        ],
        st,
    ))

    elems.append(summary_box([
        "Garmonik tebranish: x = A·cos(ω₀t+φ₀),  T = 2π/ω₀",
        "Mayatniklar: T_pruj = 2π√(m/k),  T_mat = 2π√(L/g)",
        "So'nuvchi tebranish: amplituda e^(−βt) bo'yicha kamayadi",
        "Rezonans: Ω ≈ ω₀ da amplituda maksimal (β kichik bo'lsa juda katta)",
        "To'lqin: v = λν,  L = 10·lg(I/I₀) dB",
        "Doppler: ν' = ν₀·(v±v_kuz)/(v∓v_manba)",
    ], st))
    elems.append(questions_block([
        "Prujinali mayatnik davri massaga bog'liqmi? Matematik mayatnikka-chi?",
        "Erkin tebranishda amplituda va chastota bir-biridan mustaqilligini isbotlang.",
        "Q = 100 bo'lgan tebranish nechta tebranishdan keyin amplitudasi 2 marta kamayadi?",
        "Rezonansda tizimga doimiy kuch bilan energiya berilsa nima bo'ladi?",
        "Dengizda to'lqin uzunligi 100 m, tezligi 10 m/s. Davr va chastotani toping.",
        "Poyezddan uzoqlashayotganingizda u signalay boshladi. Asl chastota 1000 Hz, "
        "siz eshitgani 920 Hz. Poyezd tezligi qancha? (v_tovush = 340 m/s)",
    ], st))

    return elems


# ═══════════════════════════════════════════════════════════════════════════
def build_bob4(st):
    """IV BOB — MOLEKULYAR FIZIKA VA TERMODINAMIKA"""
    elems = []
    elems += cover_page(
        bob_num=4,
        bob_title="MOLEKULYAR FIZIKA VA TERMODINAMIKA",
        subtitle="MKN nazariyasi · Ideal gaz · Termodinamika qonunlari · Entropiya",
        lessons=[
            "Ideal gaz. Molekulyar kinetik nazariya asoslari",
            "Molekulalar tezligi taqsimoti. Diffuziya va issiqlik o'tkazuvchanlik",
            "Termodinamikaning 1-qonuni. Izoprotsesslar",
            "Termodinamikaning 2-qonuni. Karnot sikli va entropiya",
            "Real gazlar. Fazaviy o'tishlar. Suyuqliklar",
        ],
        st=st,
    )

    # ── MARUZA 16 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(16, "Ideal gaz. Molekulyar kinetik nazariya", 4, st))

    elems.append(Paragraph("16.1  MKN asosiy postulatlari", st["h2"]))
    elems.append(Paragraph(
        "XIX asrda Bernulli, Klauzius, Maksvell va Bolsman tomonidan yaratilgan "
        "molekulyar kinetik nazariya (MKN) gazlar xossalarini molekulalar "
        "harakatidan tushuntiradi. Asosiy postulatlari:", st["body"]))
    for item in [
        "1. Barcha moddalar kichik zarralar — atom va molekulalardan iborat.",
        "2. Zarrachalar tinmay tartibsiz (issiqlik) harakat qiladi.",
        "3. Zarrachalar o'rtasida o'zaro ta'sir kuchlari ta'sir etadi.",
        "4. To'qnashuvlar absolyut elastik (energiya saqlanadi).",
    ]:
        elems.append(Paragraph(item, st["bullet"]))

    elems.append(Paragraph("16.2  Ideal gaz holat tenglamasi", st["h2"]))
    elems.append(Paragraph(
        "Boyl-Mariott (1662), Gay-Lyussak (1802) qonunlari va Avogadro "
        "prinsipi birlashtirilganda Klapeyron–Mendeleev tenglamasi hosil bo'ladi:", st["body"]))
    elems.append(formula_box(
        [
            "PV = νRT   (Klapeyron–Mendeleev)",
            "PV = NkT   (bitta molekula uchun)",
            "P = nkT    (n = N/V — molekulalar zichligi)",
        ],
        st,
        desc_lines=[
            "P — bosim [Pa],   V — hajm [m³],   T — absolyut harorat [K]",
            "ν — mol miqdori,  R = 8.314 J/(mol·K) — universal gaz doimiysi",
            "N — molekulalar soni,  k = 1.38×10⁻²³ J/K — Bolsman konstantasi",
            "Nₐ = 6.022×10²³ mol⁻¹ — Avogadro soni;  k = R/Nₐ",
        ],
    ))

    elems.append(Paragraph("16.3  Gaz bosimi va kinetik energiya", st["h2"]))
    elems.append(Paragraph(
        "Gaz bosimini molekulalar idish devorini urib hosil qilishi sifatida "
        "hisoblash mumkin (kinetik nazariya):", st["body"]))
    elems.append(formula_box(
        [
            "P = ⅓·n·m₀·〈v²〉 = ⅔·n·〈Ek〉",
            "〈Ek〉 = ½m₀〈v²〉 = (3/2)·kT",
            "〈v²〉^(½) = √(3kT/m₀) = √(3RT/M)",
        ],
        st,
        desc_lines=[
            "m₀ — bir molekula massasi [kg];  M — molyar massa [kg/mol]",
            "〈v²〉^(½) — kvadratik o'rtacha tezlik",
        ],
    ))
    elems.append(example_box(
        "16-misol: Azot molekulasi tezligi",
        "T = 300 K da azot (N₂, M = 0.028 kg/mol) molekulasining o'rtacha "
        "kvadratik tezligini toping.",
        [
            "v_rms = √(3RT/M) = √(3·8.314·300/0.028)",
            "= √(7482.6/0.028) = √(267 236) ≈ 517 m/s ≈ 1860 km/soat",
            "Bu samolyot tezligidan (900 km/soat) ikki marta tez!",
        ],
        st,
    ))

    elems.append(Paragraph("16.4  Energiyaning taqsimlanish teoremasi", st["h2"]))
    elems.append(formula_box(
        [
            "Har bir erkinlik darajasiga:  〈E〉 = kT/2",
            "Umumiy ichki energiya:  U = (i/2)·νRT",
        ],
        st,
        desc_lines=[
            "i — erkinlik darajasi soni",
            "Bir atomli gaz (He, Ar): i = 3 (faqat translatsion)",
            "Ikki atomli (N₂, O₂):   i = 5 (translatsion 3 + rotatsion 2)",
            "Ko'p atomli (CO₂, CH₄): i = 6 (translatsion 3 + rotatsion 3)",
        ],
    ))

    # ── MARUZA 17 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(17, "Molekulalar taqsimoti. Transport hodisalar", 4, st))

    elems.append(Paragraph("17.1  Maksvel taqsimoti", st["h2"]))
    elems.append(Paragraph(
        "Maksvell (1860) molekulalar tezligi taqsimotini chiqardi. "
        "Bu taqsimot Bolsman statistikasiga asoslanadi:", st["body"]))
    elems.append(formula_box(
        [
            "f(v) = 4π·n·(m₀/(2πkT))^(3/2)·v²·exp(−m₀v²/2kT)",
            "v_most = √(2kT/m₀) = √(2RT/M)   (eng ehtimoliy tezlik)",
            "〈v〉 = √(8kT/πm₀) = √(8RT/πM)   (o'rtacha tezlik)",
            "v_rms = √(3kT/m₀) = √(3RT/M)    (kvadratik o'rtacha tezlik)",
        ],
        st,
        desc_lines=["v_most < 〈v〉 < v_rms   nisbati:   1 : 1.128 : 1.225"],
    ))

    elems.append(Paragraph("17.2  Bolsman taqsimoti. Barometrik formula", st["h2"]))
    elems.append(formula_box(
        [
            "n(z) = n₀·exp(−m₀gz/kT) = n₀·exp(−Mgz/RT)",
            "P(z) = P₀·exp(−Mgz/RT)",
        ],
        st,
        desc_lines=[
            "Havo uchun M = 0.029 kg/mol: h = 5.5 km da bosim 2 marta kamayadi",
            "Barometrik formula atmosferani tengsizlikning Bolsman taqsimoti sifatida ifodalaydi",
        ],
    ))

    elems.append(Paragraph("17.3  Erkin yugurish yo'li va transport hodisalar", st["h2"]))
    elems.append(formula_box(
        [
            "〈l〉 = 1 / (√2·π·d²·n)   (erkin yugurish yo'li)",
            "Diffuziya:  J = −D·dn/dx  (Fick qonuni)",
            "Issiqlik o'tkazuvchanlik:  q = −κ·dT/dx",
            "Yopishqoqlik:  τ = η·dv/dy",
        ],
        st,
        desc_lines=["d — molekula diametri (N₂ uchun ~3.7×10⁻¹⁰ m)"],
    ))
    elems.append(example_box(
        "17-misol: Havo molekulasining erkin yugurish yo'li",
        "Normal sharoitda havo uchun (n = 2.7×10²⁵ m⁻³, d = 3.7×10⁻¹⁰ m). "
        "Erkin yugurish yo'li va bir sekunddagi to'qnashuvlar soni.",
        [
            "〈l〉 = 1/(√2·π·(3.7·10⁻¹⁰)²·2.7·10²⁵)",
            "= 1/(1.414·π·1.37·10⁻¹⁹·2.7·10²⁵)",
            "= 1/(1.414·3.14·3.7·10⁶) ≈ 68 nm ≈ 7×10⁻⁸ m",
            "To'qnashuvlar soni: Z = 〈v〉/〈l〉 = 470/7×10⁻⁸ ≈ 6.7×10⁹ s⁻¹",
            "Ya'ni azot molekulasi 1 sekundda ~7 milliard marta to'qnashadi!",
        ],
        st,
    ))

    # ── MARUZA 18 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(18, "Termodinamikaning 1-qonuni. Izoprotsesslar", 4, st))

    elems.append(Paragraph("18.1  Ichki energiya", st["h2"]))
    elems.append(Paragraph(
        "Tizimning ichki energiyasi — barcha zarralar kinetik va potensial "
        "energiyalari yig'indisi (markaziy massa harakati hisobga olinmaydi).", st["body"]))
    elems.append(formula_box(
        ["U = (i/2)·νRT   (ideal gaz uchun)",  "ΔU = (i/2)·ν·R·ΔT"],
        st,
        desc_lines=["Ideal gazda U faqat T ga bog'liq (Joule tajribasi, 1845)"],
    ))

    elems.append(Paragraph("18.2  Birinchi qonun", st["h2"]))
    elems.append(formula_box(
        [
            "ΔU = Q − A",
            "δQ = dU + δA = dU + P·dV",
        ],
        st,
        desc_lines=[
            "Q > 0 — tizimga issiqlik berildi",
            "A > 0 — tizim ish bajardi (kengaydi)",
            "Bu energiya saqlanish qonunining termodinamik ko'rinishi",
        ],
    ))

    elems.append(Paragraph("18.3  Izoprotsesslar va ish", st["h2"]))
    rows_proc = [
        ["Izoxor",   "V = const",   "A = 0",                       "Q = ΔU = νCᵥΔT"],
        ["Izobar",   "P = const",   "A = PΔV = νRΔT",              "Q = νCₚΔT = ΔU+A"],
        ["Izoterm",  "T = const",   "A = νRT·ln(V₂/V₁)",          "Q = A  (ΔU = 0)"],
        ["Adiabat",  "Q = 0",       "A = −ΔU = −νCᵥΔT",           "ΔU = −A"],
    ]
    elems.append(data_table(
        ["Jarayon", "Shart", "Ish A", "Q va ΔU"],
        rows_proc, st, col_widths=[65, 80, 165, 140],
    ))
    elems.append(formula_box(
        [
            "Cᵥ = (i/2)·R   (hajm doimiy issiqlik sig'imi)",
            "Cₚ = (i/2+1)·R = Cᵥ + R   (bosim doimiy issiqlik sig'imi)",
            "γ = Cₚ/Cᵥ = (i+2)/i",
            "Adiabat: PV^γ = const,   TV^(γ−1) = const",
        ],
        st,
        desc_lines=[
            "Bir atomli (He): γ = 5/3 ≈ 1.67;   Ikki atomli (havo): γ = 7/5 = 1.4",
        ],
    ))
    elems.append(example_box(
        "18-misol: Adiabatik siqish",
        "1 mol azot (γ = 1.4) T₁ = 300 K, V₁ hajmidan V₂ = V₁/8 gacha adiabatik siqildi. "
        "Oxirgi harorat va bajariladigan ish.",
        [
            "TV^(γ−1) = const  →  T₂ = T₁·(V₁/V₂)^(γ−1) = 300·8^0.4",
            "8^0.4 = e^(0.4·ln8) = e^(0.4·2.079) = e^0.832 ≈ 2.30",
            "T₂ = 300·2.30 = 690 K (≈ 417°C)  — siqish isitadi!",
            "A = −ΔU = −νCᵥΔT = −1·(5/2·8.314)·(690−300) = −8133 J",
            "Ya'ni tashqi kuch 8.1 kJ ish bajardi (tizim bu ishni issiqlikka aylantirdi)",
        ],
        st,
    ))

    # ── MARUZA 19 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(19, "Termodinamikaning 2-qonuni. Karnot va entropiya", 4, st))

    elems.append(Paragraph("19.1  Ikkinchi qonunning formulanmalari", st["h2"]))
    elems.append(Paragraph(
        "Birinchi qonun energiya miqdorini saqlanishini aytadi, lekin "
        "jarayonning yo'nalishi haqida hech narsa demaydi. Ikkinchi qonun "
        "yo'nalishni belgilaydi:", st["body"]))
    for f in [
        "Kelvin: Issiqlik manbaidan olingan issiqlikni to'liq ishga aylantiruvchi "
        "davriy mashina mavjud emas (ikkinchi turdagi abadiy dvigatel).",
        "Klazius: Issiqlik o'zi-o'zicha sovuq jismdan issiq jismga o'ta olmaydi.",
        "Bu ikkala formulalik ekvivalent — biri to'g'ri bo'lsa ikkinchisi ham to'g'ri.",
    ]:
        elems.append(Paragraph(f, st["bullet"]))

    elems.append(Paragraph("19.2  Karnot sikli va maksimal FIK", st["h2"]))
    elems.append(Paragraph(
        "Karnot (1824) ikkita harorat manbasida ishlaydigan eng samarali "
        "issiqlik mashinasining tsiklini ko'rsatdi:", st["body"]))
    rows_karnot = [
        ["1→2", "Izoterm kengayish",   "T₁ da", "Q₁ yutiladi",  "A₁₂ = Q₁"],
        ["2→3", "Adiabat kengayish",   "T₁→T₂", "Q = 0",         "A₂₃ = ΔU"],
        ["3→4", "Izoterm siqish",      "T₂ da",  "Q₂ beriladi",  "A₃₄ = −Q₂"],
        ["4→1", "Adiabat siqish",      "T₂→T₁", "Q = 0",         "A₄₁ = ΔU"],
    ]
    elems.append(data_table(
        ["Qadam", "Jarayon", "Harorat", "Issiqlik", "Ish"],
        rows_karnot, st, col_widths=[40, 130, 75, 100, 105],
    ))
    elems.append(formula_box(
        [
            "η_Karnot = A_net/Q₁ = 1 − T₂/T₁   (T — Kelvin da!)",
            "Har qanday mashina uchun: η ≤ η_Karnot",
        ],
        st,
        desc_lines=[
            "T₁ — qizdiruvchi harorati,  T₂ — sovutuvchi harorati",
            "Misol: T₁ = 800 K, T₂ = 300 K  →  η_max = 1 − 300/800 = 62.5%",
        ],
    ))
    elems.append(note_box(
        "Real issiqlik mashinalar FIK: bug' turbinasi 35–40%, "
        "dizel dvigatel 35–45%, benzin dvigateli 25–35%. "
        "Karnot chegarasi teorik maksimum.", st, "info",
    ))

    elems.append(Paragraph("19.3  Entropiya", st["h2"]))
    elems.append(formula_box(
        [
            "dS = δQ_qaytish / T   [J/K]",
            "ΔS ≥ 0   (yopiq tizimda, qaytmas jarayon uchun >)",
            "Bolsman: S = k·ln W",
        ],
        st,
        desc_lines=[
            "W — mikroskopoik holatlar soni (termodinamik ehtimollik)",
            "Entropiya — tartibsizlik (kaotiklik) o'lchovi",
            "Yopiq tizimda entropiya faqat ortadi yoki doimiy qoladi",
        ],
    ))
    elems.append(example_box(
        "19-misol: Entropiya o'zgarishi",
        "1 mol suv T = 373 K (100°C) da bug'lanadi. "
        "Bug'lanish issiqligi L = 2260 kJ/kg, M = 0.018 kg/mol. "
        "Entropiya o'zgarishini toping.",
        [
            "Q = ν·L·M = 1·2260·10³·0.018 = 40680 J",
            "ΔS = Q/T = 40680/373 = 109 J/K",
            "Manfiy emas — bug' suvdan tartibsizroq ✓",
        ],
        st,
    ))

    # ── MARUZA 20 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(20, "Real gazlar. Suyuqliklar va qattiq jismlar", 4, st))

    elems.append(Paragraph("20.1  Van-der-Vaals tenglamasi", st["h2"]))
    elems.append(formula_box(
        ["(P + a·ν²/V²) · (V − b·ν) = νRT"],
        st,
        desc_lines=[
            "a — molekulalar orasidagi tortishish (bosimga tuzatma)",
            "b — molekulalar o'z hajmi (hajmga tuzatma)",
            "a → 0, b → 0 da ideal gaz tenglamasiga keladi",
        ],
    ))
    elems.append(data_table(
        ["Gaz", "a (L²·atm/mol²)", "b (L/mol)", "Tc (K)", "Pc (atm)"],
        [
            ["He",   "0.034", "0.0238", "5.2",  "2.3"],
            ["H₂",   "0.245", "0.0267", "33.2", "13.0"],
            ["N₂",   "1.39",  "0.0391", "126",  "33.5"],
            ["CO₂",  "3.64",  "0.0427", "304",  "73.0"],
            ["H₂O",  "5.54",  "0.0305", "647",  "218"],
        ],
        st, col_widths=[70, 100, 80, 70, 80],
    ))

    elems.append(Paragraph("20.2  Yuzaki taranglik va kapillyarlik", st["h2"]))
    elems.append(formula_box(
        [
            "F = σ·l   (yuzaki taranglik kuchi)",
            "W_yuzaki = σ·ΔS   (yuz hosil qilish ishi)",
            "Kapillyar ko'tarilish: h = 2σ·cosθ / (ρ·g·r)",
        ],
        st,
        desc_lines=[
            "σ — yuzaki taranglik koeffitsienti [N/m]",
            "Suv uchun: σ = 0.073 N/m (20°C);  Simob: σ = 0.487 N/m",
        ],
    ))

    elems.append(summary_box([
        "Ideal gaz: PV = νRT,  〈Ek〉 = (3/2)kT,  U = (i/2)νRT",
        "Maksvell: v_most < 〈v〉 < v_rms,  nisbat 1 : 1.13 : 1.22",
        "1-qonun: ΔU = Q − A",
        "Izoprotsesslar: izoxor(A=0), izobar, izoterm(ΔU=0), adiabat(Q=0)",
        "Karnot FIK: η = 1 − T₂/T₁  (maksimal mümkün FIK)",
        "Entropiya: dS = δQ/T ≥ 0 (yopiq tizimda)",
    ], st))
    elems.append(questions_block([
        "Nima uchun ideal gaz ichki energiyasi faqat T ga bog'liq?",
        "Adiabatik siqishda harorat oshadi. Nima uchun?",
        "Karnot FIK ni oshirish uchun T₁ oshirish yaxshimi yoki T₂ kamaytirish?",
        "Entropiya kamayishi mumkinmi? Qanday sharoitda?",
        "1 mol argon (Cᵥ = 3R/2) T₁=300K dan T₂=600K gacha izobor qizdirildi. "
        "Q, ΔU va A ni toping.",
        "Muzxona (T₂=−20°C) xona (T₁=25°C) bilan. Karnot FIK sovutgich uchun qanday?",
        "Nima uchun gazlarni suyultirish uchun oldin sovutish kerak?",
    ], st))

    return elems


# ═══════════════════════════════════════════════════════════════════════════
def build_bob5(st):
    """V BOB — ELEKTROSTATIKA"""
    elems = []
    elems += cover_page(
        bob_num=5,
        bob_title="ELEKTROSTATIKA",
        subtitle="Elektr zaryad · Kulon qonuni · Maydon · Potensial · Kondensatorlar",
        lessons=[
            "Elektr zaryad. Kulon qonuni. Superpozitsiya prinsipi",
            "Elektr maydon. Gauss teoremasi",
            "Elektr potensiali. O'tkazgichlar elektrostatikada",
            "Kondensatorlar. Dielektriklar. Elektrostatik energiya",
        ],
        st=st,
    )

    # ── MARUZA 21 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(21, "Elektr zaryad va Kulon qonuni", 5, st))

    elems.append(Paragraph("21.1  Elektr zaryad", st["h2"]))
    elems.append(Paragraph(
        "Elektr zaryad — zarrachaning elektromagnit ta'sirini aniqlaydigan "
        "fundamental xususiyat. Zaryad turi musbat va manfiy. Bir xil zaryadlar "
        "itaradi, turli zaryadlar tortadi.", st["body"]))
    elems.append(formula_box(
        [
            "Elementar zaryad: e = 1.602 × 10⁻¹⁹ Kl",
            "Proton: +e,   Elektron: −e,   Neytron: 0",
            "Zaryadning saqlanish qonuni: q_umumiy = const",
            "Kvantlanish: q = n·e  (n — butun son)",
        ],
        st,
    ))

    elems.append(Paragraph("21.2  Kulon qonuni", st["h2"]))
    elems.append(Paragraph(
        "Kulon (1785) torli tarozi yordamida ikki nuqtaviy zaryadning o'zaro "
        "ta'sir kuchini o'lchadi:", st["body"]))
    elems.append(formula_box(
        [
            "F = k·|q₁·q₂| / r²  = (1/4πε₀)·|q₁·q₂| / r²",
            "k = 8.99 × 10⁹ N·m²/Kl² ≈ 9·10⁹",
            "ε₀ = 8.85 × 10⁻¹² Kl²/(N·m²)  (elektrik doimiy)",
        ],
        st,
        desc_lines=[
            "r — zaryadlar orasidagi masofa [m]",
            "Superpozitsiya prinsipi: F⃗_umumiy = Σ F⃗ᵢ (vektoral yig'indi)",
        ],
    ))
    elems.append(example_box(
        "21-misol: Vodorod atomida kuchlar nisbati",
        "Vodorod atomida elektron va proton o'rtasidagi elektr va gravitatsion "
        "kuchlar nisbatini hisoblang. (r = 0.529 Å = 5.29×10⁻¹¹ m)",
        [
            "F_el = k·e²/r² = 9·10⁹·(1.6·10⁻¹⁹)²/(5.29·10⁻¹¹)²",
            "= 9·10⁹·2.56·10⁻³⁸/2.8·10⁻²¹ = 8.2·10⁻⁸ N",
            "F_grav = G·mₑ·mₚ/r² = 6.67·10⁻¹¹·9.1·10⁻³¹·1.67·10⁻²⁷/2.8·10⁻²¹",
            "= 3.6·10⁻⁴⁷ N",
            "Nisbat: F_el/F_grav = 8.2·10⁻⁸/3.6·10⁻⁴⁷ ≈ 2.3·10³⁹",
            "Atom tuzilishida elektr kuchi gravitatsiyadan 10³⁹ marta kuchli!",
        ],
        st,
    ))

    # ── MARUZA 22 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(22, "Elektr maydon. Gauss teoremasi", 5, st))

    elems.append(Paragraph("22.1  Elektr maydon kuchlanganlik vektori", st["h2"]))
    elems.append(formula_box(
        [
            "E⃗ = F⃗/q₀   (sinov zaryad q₀ ga ta'sir kuch)",
            "Nuqtaviy zaryad: E⃗ = (1/4πε₀)·q/r²·r̂   [V/m = N/Kl]",
            "Superpozitsiya: E⃗_nat = Σ E⃗ᵢ",
        ],
        st,
        desc_lines=[
            "E⃗ yo'nalishi: musbat zaryad dari UZOQLAShADI,",
            "              manfiy zaryad tomon YAQINLAShADI",
        ],
    ))

    elems.append(Paragraph("22.2  Maydon chiziqlari va dipol", st["h2"]))
    elems.append(Paragraph(
        "Elektr maydon chiziqlar yordamida tasvirlanadi. Ular maydonning "
        "yo'nalishini ko'rsatadi. Siqiqligi intensivlikka proporsional. "
        "Chiziqlar o'zaro kesishmaydi!", st["body"]))
    elems.append(formula_box(
        [
            "Elektr dipol:  p⃗ = q·l⃗   (manfiydan musbatga)",
            "Dipol o'qi bo'ylab: E = (1/4πε₀)·2p/r³",
            "Perpendikulyar yo'nalishda: E = (1/4πε₀)·p/r³",
        ],
        st,
        desc_lines=["Dipol momenti p [Kl·m];  l — zaryadlar orasidagi masofa"],
    ))

    elems.append(Paragraph("22.3  Gauss teoremasi", st["h2"]))
    elems.append(formula_box(
        [
            "∮ E⃗·dS⃗ = Q_ichki / ε₀",
            "Elektr oqim: Φ_E = ∮ E⃗·dS⃗  [N·m²/Kl = V·m]",
        ],
        st,
        desc_lines=["Yopiq sirt orqali o'tadigan elektr oqim sirt ichidagi zaryadga proporsional"],
    ))
    rows_gauss = [
        ["Cheksiz tekis plastina (σ)", "E = σ/(2ε₀)", "Yo'nalish: perpendikulyar"],
        ["Ikkita qarama-qarshi plastina", "E = σ/ε₀", "Faqat ichida maydon"],
        ["Sferik qobiq tashqarisida", "E = q/(4πε₀r²)", "Nuqtaviy zaryad kabi"],
        ["Sferik qobiq ichida", "E = 0", "Ekranlash hodisasi"],
        ["Cheksiz o'tkazgich sim (λ)", "E = λ/(2πε₀r)", "Radial yo'nalish"],
    ]
    elems.append(data_table(
        ["Tizim", "Maydon kuchlanganlik", "Izoh"],
        rows_gauss, st, col_widths=[190, 150, 110],
    ))

    # ── MARUZA 23 ─────────────────────────────────────────════════════════════
    elems.append(lecture_header(23, "Elektr potensiali va o'tkazgichlar", 5, st))

    elems.append(Paragraph("23.1  Elektr potensiali", st["h2"]))
    elems.append(formula_box(
        [
            "φ = W_potensial/q₀ = A_{∞→r}/q₀   [V = J/Kl]",
            "Nuqtaviy zaryad: φ = (1/4πε₀)·q/r",
            "Potensiallar farqi (kuchlanish): U = φ₁ − φ₂ = A₁₂/q₀",
            "E⃗ va φ bog'liqligi: E⃗ = −grad φ = −∇φ",
            "Bir o'lchamda: Eₓ = −dφ/dx",
        ],
        st,
    ))
    elems.append(Paragraph(
        "<b>Ekvipotensial sirtlar</b> — potensial doimiy bo'lgan sirtlar. "
        "Maydon chiziqlari doim ekvipotensial sirtlarga perpendikulyar.", st["body"]))

    elems.append(Paragraph("23.2  O'tkazgichlarda elektrostatika", st["h2"]))
    for item in [
        "O'tkazgich ichida E = 0 (tinch holatda)",
        "Barcha zaryad sirt ustida joylashadi",
        "Sirt — ekvipotensial sirt (φ = const)",
        "Sirt yaqinida: E = σ/ε₀ (perpendikulyar, tashqarida)",
        "Bo'rtiq joylarda σ katta, ichburun joylarda kichik",
        "Yopiq o'tkazgich ichidagi bo'shliq ekranlangan (Faraday qafasi)",
    ]:
        elems.append(Paragraph("▸  " + item, st["bullet"]))

    # ── MARUZA 24 ─────────────────────────────────────────────────────────────
    elems.append(lecture_header(24, "Kondensatorlar. Dielektriklar. Elektrostatik energiya", 5, st))

    elems.append(Paragraph("24.1  Elektr sig'im", st["h2"]))
    elems.append(formula_box(
        [
            "C = q/U   [F = Kl/V]",
            "Tekis kondensator: C = ε·ε₀·S/d",
            "Sfera: C = 4πε₀R",
        ],
        st,
        desc_lines=[
            "1 F juda katta — amalda pF (10⁻¹²), nF (10⁻⁹), μF (10⁻⁶) ishlatiladi",
            "S — plastina yuzasi, d — masofa, ε — dielektrik singuvchanligi",
        ],
    ))

    elems.append(Paragraph("24.2  Kondensatorlar ulanishi", st["h2"]))
    elems.append(formula_box(
        [
            "Ketma-ket:  1/C = 1/C₁ + 1/C₂ + ...   (zaryad teng)",
            "Parallel:   C = C₁ + C₂ + ...           (kuchlanish teng)",
        ],
        st,
    ))

    elems.append(Paragraph("24.3  Dielektriklar", st["h2"]))
    elems.append(Paragraph(
        "Dielektriklar tashqi maydon ta'sirida qutblanadi — molekulalarning elektr "
        "dipol momentlari maydon yo'nalishida tartiblanadi. Bu maydonni ε marta "
        "zaiflashtirishga olib keladi:", st["body"]))
    rows_diel = [
        ["Vakuum",        "1",     "—"],
        ["Havo",          "1.0006","—"],
        ["Polietilen",    "2.3",   "Kabel izolyatsiyasi"],
        ["Shisha",        "5–10",  "Kondensator"],
        ["Suv",           "80",    "Biologik tizimlar"],
        ["Barium titanat","1000+", "Keramik kondensator"],
    ]
    elems.append(data_table(
        ["Dielektrik", "ε", "Qo'llanilishi"],
        rows_diel, st, col_widths=[160, 60, 230],
    ))

    elems.append(Paragraph("24.4  Elektrostatik energiya", st["h2"]))
    elems.append(formula_box(
        [
            "W = q²/(2C) = CU²/2 = qU/2   [J]",
            "Energiya zichligi: w = ε·ε₀·E²/2   [J/m³]",
        ],
        st,
    ))
    elems.append(example_box(
        "24-misol: Flash kondensator",
        "Kameradagi flash uchun C = 1000 μF kondensator U = 300 V gacha zaryadlanadi. "
        "To'plangan energiya va razryadlash vaqti (P = 100 W).",
        [
            "W = ½CU² = ½·10⁻³·9·10⁴ = 45 J",
            "t = W/P = 45/100 = 0.45 s (flash 450 ms — ko'z ko'ra olmaydi)",
            "Solishtiring: zaryadlash vaqti ~10 s,  razryadlash ~1 ms",
        ],
        st,
    ))

    elems.append(summary_box([
        "Kulon: F = kq₁q₂/r²,  k = 9·10⁹ N·m²/Kl²",
        "Maydon kuchlanganlik: E⃗ = F⃗/q₀,  nuqtaviy: E = kq/r²",
        "Gauss: ∮E·dS = Q_ich/ε₀",
        "Potensial: φ = kq/r,  E = −dφ/dx",
        "O'tkazgich ichida E = 0, sirt φ = const (Faraday qafasi)",
        "Kondensator: C = εε₀S/d,  W = CU²/2",
    ], st))
    elems.append(questions_block([
        "Ikkita teng va qarama-qarshi zaryad +q va −q bir-biridan d masofada. "
        "Ularning o'rtasida E ni toping.",
        "Sferik o'tkazgich ichida nima uchun E = 0?",
        "Kondensator zaryadlanib, batareyadan uzildi. Dielektrik qo'yilsa C, E, U qanday o'zgaradi?",
        "Kondensator batareyaga ulangan holda dielektrik qo'yilsa Q, E, U qanday o'zgaradi?",
        "C₁ = 2 μF va C₂ = 3 μF ketma-ket, 100 V ga ulangan. Har birida q, U va W ni toping.",
        "Nima uchun momaqaldiroq vaqtida mashina ichida xavfsiz?",
    ], st))

    return elems
