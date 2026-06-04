"""
10-sinf Fizika darsligini Mavzu modeliga import qilish.
Ishlatish: python import_10sinf_pdfs.py  (backend/ papkasida)
"""
import sys, os, shutil
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from darsliklar.models import Darslik, Mavzu

MEDIA_PDF_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media', 'mavzular', 'pdf')
os.makedirs(MEDIA_PDF_DIR, exist_ok=True)

SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\10sinf_mavzular"

# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish_muqova_nashriyot",
     "Kirish — Muqova va nashriyot ma'lumotlari", 0, 1),

    # I BOB. DINAMIKA. STATIKA ELEMENTLARI
    ("01_1-mavzu_Kuchlarni_qoshish",
     "1-mavzu. Kuchlarni qo'shish", 1, 8),
    ("02_2-mavzu_Markazga_intilma_kuch",
     "2-mavzu. Markazga intilma kuch", 1, 11),
    ("03_3-mavzu_Gravitatsiya_maydonidagi_harakat",
     "3-mavzu. Gravitatsiya maydonidagi harakat", 1, 14),
    ("04_4-mavzu_Masalalar_yechish",
     "4-mavzu. Masalalar yechish", 1, 17),
    ("05_5-mavzu_Jism_ogirligining_harakat_turiga_boqliqligii",
     "5-mavzu. Jism og'irligining harakat turiga bog'liqligi", 1, 19),
    ("06_6-mavzu_Jismning_bir_nechta_kuch_tasiridagi_harakati",
     "6-mavzu. Jismning bir nechta kuch ta'siridagi harakati", 1, 23),
    ("07_7-mavzu_Masalalar_yechish",
     "7-mavzu. Masalalar yechish", 1, 26),
    ("08_8-mavzu_Jismning_qiya_tekislikdagi_harakati",
     "8-mavzu. Jismning qiya tekislikdagi harakati", 1, 28),
    ("09_9-mavzu_Qiya_tekislik_FIKi",
     "9-mavzu. Jismni qiya tekislik bo'ylab ko'chirishda ish. Qiya tekislikning FIKi", 1, 31),
    ("10_10-mavzu_Masalalar_yechish",
     "10-mavzu. Masalalar yechish", 1, 33),
    ("11_11-mavzu_Laboratoriya_ishi_Qiya_tekislik_FIKini_aniqlash",
     "11-mavzu. Laboratoriya ishi: Qiya tekislikning FIKini aniqlash", 1, 35),
    ("12_12-mavzu_Massa_markazi_Muvozanat_turlari_Kuch_momenti",
     "12-mavzu. Massa markazi. Muvozanat turlari. Kuch momenti", 1, 36),
    ("13_13-mavzu_Momentlar_qoidasi_oddiy_mexanizmlar",
     "13-mavzu. Momentlar qoidasiga asoslanib ishlaydigan oddiy mexanizmlar", 1, 40),
    ("14_14-mavzu_Masalalar_yechish",
     "14-mavzu. Masalalar yechish", 1, 43),
    ("15_Loyiha_ishi_Oddiy_mexanizmlarni_yasash",
     "Loyiha ishi: Oddiy mexanizmlarni yasash", 1, 46),

    # II BOB. MEXANIK TEBRANISHLAR VA TO'LQINLAR
    ("16_15-mavzu_Mexanik_tebranishlar",
     "15-mavzu. Mexanik tebranishlar", 2, 48),
    ("17_16-mavzu_Prujinali_va_matematik_mayatniklar",
     "16-mavzu. Prujinali va matematik mayatniklar", 2, 52),
    ("18_17-mavzu_Laboratoriya_ishi_Matematik_mayatnik",
     "17-mavzu. Laboratoriya ishi: Matematik mayatnik yordamida erkin tushish tezlanishini aniqlash", 2, 54),
    ("19_18-mavzu_Mexanik_tolqinlar",
     "18-mavzu. Mexanik to'lqinlar", 2, 55),
    ("20_19-mavzu_Tovush_tolqinlari",
     "19-mavzu. Tovush to'lqinlari", 2, 57),
    ("21_20-mavzu_Masalalar_yechish",
     "20-mavzu. Masalalar yechish", 2, 61),

    # III BOB. GIDRODINAMIKA VA AERODINAMIKA
    ("22_21-mavzu_Suyuqlik_va_gazlar_harakati",
     "21-mavzu. Suyuqlik va gazlar harakati", 3, 66),
    ("23_22-mavzu_Harakatlanayotgan_gaz_suyuqlik_bosimi_texnikada",
     "22-mavzu. Harakatlanayotgan gaz va suyuqlik bosimining tezlikka bog'liqligidan texnikada foydalanish", 3, 70),
    ("24_23-mavzu_Masalalar_yechish",
     "23-mavzu. Masalalar yechish", 3, 72),

    # IV BOB. ELEKTROSTATIK MAYDON
    ("25_24-mavzu_Elektr_maydon_superpozitsiya_prinsipi",
     "24-mavzu. Elektr maydon kuchlanganligining superpozitsiya prinsipi", 4, 76),
    ("26_25-mavzu_Zaryadlangan_sharning_elektr_maydoni",
     "25-mavzu. Zaryadlangan sharning elektr maydoni", 4, 80),
    ("27_26-mavzu_Masalalar_yechish",
     "26-mavzu. Masalalar yechish", 4, 84),
    ("28_27-mavzu_Elektrostatik_maydonda_zaryadni_kochirish_ishi",
     "27-mavzu. Elektrostatik maydonda nuqtaviy zaryadni ko'chirishda bajarilgan ish", 4, 85),
    ("29_28-mavzu_Nuqtaviy_zaryadning_potensial_energiyasi",
     "28-mavzu. Elektr maydonda joylashgan nuqtaviy zaryadning potensial energiyasi", 4, 87),
    ("30_29-mavzu_Elektr_maydon_energiyasi",
     "29-mavzu. Elektr maydon energiyasi", 4, 91),
    ("31_30-mavzu_Amaliy_mashgulot_Energiya_aylanishi",
     "30-mavzu. Amaliy mashg'ulot: Energiyaning bir turdan boshqasiga aylanishi", 4, 94),
    ("32_31-mavzu_Masalalar_yechish",
     "31-mavzu. Masalalar yechish", 4, 95),

    # V BOB. O'ZGARMAS TOK QONUNLARI
    ("33_32-mavzu_Tok_kuchi_va_tok_zichligi",
     "32-mavzu. Tok kuchi va tok zichligi", 5, 98),
    ("34_33-mavzu_Toliq_zanjir_uchun_Om_qonuni",
     "33-mavzu. To'liq zanjir uchun Om qonuni", 5, 103),
    ("35_34-mavzu_Masalalar_yechish",
     "34-mavzu. Masalalar yechish", 5, 107),
    ("36_35-mavzu_Laboratoriya_ishi_EYK_va_ichki_qarshilik",
     "35-mavzu. Laboratoriya ishi: Tok manbaining EYKi va ichki qarshiligini aniqlash", 5, 109),
    ("37_36-mavzu_Metall_otkazgichlar_qarshiligi_temperaturaga",
     "36-mavzu. Metall o'tkazgichlar qarshiligining temperaturaga bog'liqligi", 5, 110),
    ("38_37-mavzu_Masalalar_yechish",
     "37-mavzu. Masalalar yechish", 5, 115),
    ("39_Loyiha_ishi_Muqobil_elektr_manbalari",
     "Loyiha ishi: Muqobil elektr manbalari", 5, 117),

    # VI BOB. TURLI MUHITLARDA ELEKTR TOKI
    ("40_38-mavzu_Suyuqliklarda_elektr_toki",
     "38-mavzu. Suyuqliklarda elektr toki", 6, 122),
    ("41_39-mavzu_Faradeyning_birinchi_va_ikkinchi_qonuni",
     "39-mavzu. Faradeyning birinchi va ikkinchi qonuni", 6, 125),
    ("42_40-mavzu_Masalalar_yechish",
     "40-mavzu. Masalalar yechish", 6, 129),
    ("43_41-mavzu_Elektrolizdan_texnikada_foydalanish",
     "41-mavzu. Elektrolizdan turmushda va texnikada foydalanish", 6, 130),
    ("44_42-mavzu_Gazlarda_elektr_toki_Vakuumda_elektr_toki",
     "42-mavzu. Gazlarda elektr toki. Vakuumda elektr toki", 6, 132),
    ("45_43-mavzu_Yarimotkazgichlar_metallardan_farqi",
     "43-mavzu. Yarimo'tkazgichlar va ularning metallardan farqi", 6, 137),
    ("46_44-mavzu_Yarimotkazgichlarning_elektr_otkazuvchanligi",
     "44-mavzu. Yarimo'tkazgichlarning elektr o'tkazuvchanligi", 6, 139),
    ("47_45-mavzu_Yarimotkazgichli_asboblar_texnikada_qollanishi",
     "45-mavzu. Yarimo'tkazgichli asboblar va ularning texnikada qo'llanishi", 6, 142),
    ("48_46-mavzu_Laboratoriya_ishi_Diodning_volt_amper_tavsifi",
     "46-mavzu. Laboratoriya ishi: Yarimo'tkazgichli diodning volt-amper tavsifini o'rganish", 6, 147),

    # VII BOB. MAGNIT MAYDON
    ("49_47-mavzu_Magnit_maydon_induksiyasi_tokli_otkazgichlar",
     "47-mavzu. Magnit maydon induksiyasi. Tokli o'tkazgichlarning magnit maydoni", 7, 150),
    ("50_48-mavzu_Magnit_maydonning_tokli_otkazgichga_tasiri",
     "48-mavzu. Magnit maydonning tokli o'tkazgichga ta'siri", 7, 154),
    ("51_49-mavzu_Tokli_otkazgichlarning_ozaro_tasiri",
     "49-mavzu. Tokli o'tkazgichlarning o'zaro ta'siri", 7, 159),
    ("52_50-mavzu_Tokli_otkazgichni_magnit_maydonda_kochirish",
     "50-mavzu. Tokli o'tkazgichni magnit maydonda ko'chirishda bajarilgan ish", 7, 161),
    ("53_51-mavzu_Magnit_maydonda_zaryadli_zarraning_harakati",
     "51-mavzu. Magnit maydonda zaryadli zarraning harakati", 7, 164),
    ("54_52-mavzu_Ozgarmas_tok_elektr_dvigateli",
     "52-mavzu. O'zgarmas tok elektr dvigateli", 7, 167),
    ("55_53-mavzu_Masalalar_yechish",
     "53-mavzu. Masalalar yechish", 7, 169),
    ("56_54-mavzu_Elektromagnit_induksiya",
     "54-mavzu. Elektromagnit induksiya", 7, 171),
    ("57_55-mavzu_Amaliy_mashgulot_Elektromagnit_induksiya",
     "55-mavzu. Amaliy mashg'ulot: Elektromagnit induksiya hodisasini o'rganish", 7, 174),
    ("58_56-mavzu_Ozinduksiya_Induktivlik",
     "56-mavzu. O'zinduksiya. Induktivlik", 7, 176),
    ("59_57-mavzu_Masalalar_yechish",
     "57-mavzu. Masalalar yechish", 7, 179),
    ("60_58-mavzu_Tokning_magnit_maydon_energiyasi_Moddalar_magnit",
     "58-mavzu. Tokning magnit maydon energiyasi. Moddalarning magnit xossalari", 7, 180),
    ("61_59-mavzu_Masalalar_yechish",
     "59-mavzu. Masalalar yechish", 7, 184),

    # OXIRGI
    ("62_Foydalanilgan_adabiyotlar",
     "Foydalanilgan adabiyotlar", 0, 190),
]

print("10-sinf Fizika darsligini import qilish boshlandi...")
print("=" * 60)

darslik, created = Darslik.objects.get_or_create(
    grade=10,
    defaults={
        'subject':  'Fizika',
        'subtitle': 'Dinamika, Elektr va Magnit',
        'icon':     '⚡',
        'color':    '#a78bfa',
        'accent':   '#7c3aed',
        'formulas': ['F = ma', 'U = IR', 'F = qvB'],
        'chapters': 7,
        'pages':    192,
        'is_published': True,
        'order':    4,
    }
)
if created:
    print(f"✅ Yangi Darslik yaratildi: 10-sinf Fizika")
else:
    print(f"ℹ️  Mavjud Darslik topildi: {darslik}")
    # Eski mavzularni o'chiramiz
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")
    # Ma'lumotlarni yangilaymiz
    darslik.subject = 'Fizika'
    darslik.subtitle = 'Dinamika, Elektr va Magnit'
    darslik.icon = '⚡'
    darslik.color = '#a78bfa'
    darslik.accent = '#7c3aed'
    darslik.formulas = ['F = ma', 'U = IR', 'F = qvB']
    darslik.chapters = 7
    darslik.pages = 192
    darslik.is_published = True
    darslik.order = 4
    darslik.save()

ok = 0
errors = 0

for order_idx, (prefix, mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    src_file = os.path.join(SOURCE_DIR, f"{prefix}.pdf")
    if not os.path.exists(src_file):
        print(f"❌ Fayl topilmadi: {src_file}")
        errors += 1
        continue

    dest_filename = f"10sinf_{prefix}.pdf"
    dest_path = os.path.join(MEDIA_PDF_DIR, dest_filename)
    shutil.copy2(src_file, dest_path)

    relative_path = f"mavzular/pdf/{dest_filename}"
    mavzu = Mavzu(
        darslik=darslik,
        mavzu=mavzu_nomi,
        bet=bet,
        bob=bob,
        order=order_idx,
    )
    mavzu.pdf_file.name = relative_path
    mavzu.save()

    size_kb = os.path.getsize(dest_path) // 1024
    print(f"✅ [{order_idx+1:02d}] {mavzu_nomi[:55]:<55} | {bet}-bet | {size_kb} KB")
    ok += 1

print()
print("=" * 60)
print(f"✅ Muvaffaqiyatli: {ok} ta mavzu")
print(f"❌ Xato: {errors} ta")
print(f"📚 Darslik ID: {darslik.id}")
print(f"📖 Jami mavzular DB da: {darslik.mavzu_set.count()} ta")
