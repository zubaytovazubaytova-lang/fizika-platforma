"""
7-sinf Fizika darsligini Mavzu modeliga import qilish skripti.
Ishlatish: python import_7sinf_pdfs.py
(fizika-platform/backend/ papkasida)
"""
import sys, os, shutil
sys.stdout.reconfigure(encoding='utf-8')

# Django setup
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from django.core.files import File
from darsliklar.models import Darslik, Mavzu

# ===== 1. MEDIA papkasini tayyorlash =====
MEDIA_PDF_DIR = os.path.join(os.path.dirname(__file__), 'media', 'mavzular', 'pdf')
os.makedirs(MEDIA_PDF_DIR, exist_ok=True)

# Manba papkasi
SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\7-sinf_mavzular"

# ===== 2. Mavzu ma'lumotlari =====
# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish", "Kirish qismi — Muqova, Taqrizchilar, Mundarija", 0, 1),

    # I BOB
    ("01_1-mavzu_Fizika_fani_taraqqiyoti_tarixida_Orta_Osiyo_olimlari",
     "1-mavzu. Fizika fani taraqqiyoti tarixida O'rta Osiyo olimlari", 1, 7),
    ("02_2-mavzu_Ozbekistonda_ilmiy_maktab_yaratgan_fizik_olimlar",
     "2-mavzu. O'zbekistonda ilmiy maktab yaratgan fizik olimlar", 1, 10),
    ("03_3-mavzu_Fizik_kattaliklar_Xalqaro_birliklar_sistemasi_SI",
     "3-mavzu. Fizik kattaliklar. Xalqaro birliklar sistemasi (SI)", 1, 13),
    ("04_4-mavzu_Fizikada_tadqiqot_metodlari",
     "4-mavzu. Fizikada tadqiqot metodlari", 1, 17),
    ("05_5-mavzu_Skalyar_va_vektor_kattaliklar",
     "5-mavzu. Skalyar va vektor kattaliklar", 1, 20),
    ("06_6-mavzu_Masalalar_yechish",
     "6-mavzu. Masalalar yechish", 1, 22),
    ("07_7-mavzu_Mexanik_harakat",
     "7-mavzu. Mexanik harakat", 1, 24),
    ("08_8-mavzu_Kinematikaning_asosiy_tushunchalari",
     "8-mavzu. Kinematikaning asosiy tushunchalari", 1, 28),
    ("09_9-mavzu_Togri_chiziqli_tekis_harakatda_tezlik_va_yol",
     "9-mavzu. To'g'ri chiziqli tekis harakatda tezlik va yo'l", 1, 31),
    ("10_10-mavzu_Masalalar_yechish",
     "10-mavzu. Masalalar yechish", 1, 36),
    ("11_11-mavzu_Notekis_harakat",
     "11-mavzu. Notekis harakat", 1, 39),
    ("12_12-mavzu_Laboratoriya_ishi_Notekis_harakat_ortacha_tezlik",
     "12-mavzu. Lab ishi: Notekis harakatning o'rtacha tezligini aniqlash", 1, 42),
    ("13_13-mavzu_Masalalar_yechish",
     "13-mavzu. Masalalar yechish", 1, 43),
    ("14_14-mavzu_Aylana_boylab_harakat",
     "14-mavzu. Aylana bo'ylab harakat", 1, 45),
    ("15_15-mavzu_Masalalar_yechish_va_I_bob_topshiriqlari",
     "15-mavzu. Masalalar yechish va I bob topshiriqlari", 1, 48),

    # II BOB
    ("16_16-mavzu_Massa_va_uning_birliklari",
     "16-mavzu. Massa va uning birliklari", 2, 52),
    ("17_17-mavzu_Zichlik_va_uning_birliklari",
     "17-mavzu. Zichlik va uning birliklari", 2, 55),
    ("18_18-mavzu_Laboratoriya_ishi_Jismlar_zichligini_aniqlash",
     "18-mavzu. Lab ishi: Jismlar zichligini aniqlash", 2, 59),
    ("19_19-mavzu_Jismlarning_ozaro_tasiri_Kuch",
     "19-mavzu. Jismlarning o'zaro ta'siri. Kuch", 2, 62),
    ("20_20-mavzu_Bosim_va_uning_birliklari",
     "20-mavzu. Bosim va uning birliklari", 2, 66),
    ("21_21-mavzu_Masalalar_yechish",
     "21-mavzu. Masalalar yechish", 2, 69),
    ("22_22-mavzu_Suyuqlik_va_gazlarda_bosimning_uzatilishi",
     "22-mavzu. Suyuqlik va gazlarda bosimning uzatilishi", 2, 71),
    ("23_23-mavzu_Tinch_holatdagi_suyuqlik_bosimi",
     "23-mavzu. Tinch holatdagi suyuqlik bosimi", 2, 74),
    ("24_24-mavzu_Masalalar_yechish",
     "24-mavzu. Masalalar yechish", 2, 76),
    ("25_25-mavzu_Atmosfera_bosimi_va_Loyiha_ishi",
     "25-mavzu. Atmosfera bosimi va Loyiha ishi", 2, 78),
    ("26_26-mavzu_Mexanik_ish",
     "26-mavzu. Mexanik ish", 2, 83),
    ("27_27-mavzu_Mexanik_energiyaning_turlari",
     "27-mavzu. Mexanik energiyaning turlari", 2, 85),
    ("28_28-mavzu_Masalalar_yechish",
     "28-mavzu. Masalalar yechish", 2, 88),
    ("29_29-mavzu_Mexanik_quvvat_va_uning_birligi",
     "29-mavzu. Mexanik quvvat va uning birligi", 2, 90),
    ("30_30-mavzu_Masalalar_yechish_va_II_bob_topshiriqlari",
     "30-mavzu. Masalalar yechish va II bob topshiriqlari", 2, 93),

    # III BOB
    ("31_31-mavzu_Ichki_energiya",
     "31-mavzu. Ichki energiya", 3, 96),
    ("32_32-mavzu_Issiqlik_miqdori_va_Loyiha_ishi",
     "32-mavzu. Issiqlik miqdori va Loyiha ishi", 3, 100),
    ("33_33-mavzu_Masalalar_yechish",
     "33-mavzu. Masalalar yechish", 3, 104),
    ("34_34-mavzu_Amaliy_mashgulot_Issiqlik_almashinuvi",
     "34-mavzu. Amaliy mashg'ulot: Issiqlik almashinuvi", 3, 106),
    ("35_35-mavzu_Yoqilgining_solishtirma_yonish_issiqligi",
     "35-mavzu. Yoqilg'ining solishtirma yonish issiqligi", 3, 107),
    ("36_36-mavzu_Buglanish_Kondensatsiya_Qaynash",
     "36-mavzu. Bug'lanish. Kondensatsiya. Qaynash", 3, 110),
    ("37_37-mavzu_Qattiq_jismning_erishi_va_qotishi",
     "37-mavzu. Qattiq jismning erishi va qotishi", 3, 115),
    ("38_38-mavzu_Masalalar_yechish_va_III_bob_topshiriqlari",
     "38-mavzu. Masalalar yechish va III bob topshiriqlari", 3, 118),

    # IV BOB
    ("39_39-mavzu_Jismlarning_elektrlanishi",
     "39-mavzu. Jismlarning elektrlanishi", 4, 122),
    ("40_40-mavzu_Elektr_zaryad",
     "40-mavzu. Elektr zaryad", 4, 126),
    ("41_41-mavzu_Elektroskop_va_elektrometr",
     "41-mavzu. Elektroskop va elektrometr", 4, 130),
    ("42_42-mavzu_Elektr_otkazgichlar_va_dielektriklar",
     "42-mavzu. Elektr o'tkazgichlar va dielektriklar", 4, 132),
    ("43_43-mavzu_Zaryadlangan_jismlarning_ozaro_tasirlashuvi",
     "43-mavzu. Zaryadlangan jismlarning o'zaro ta'sirlashuvi", 4, 134),
    ("44_44-mavzu_Otkazgichlarda_elektr_zaryadlarning_taqsimlanishi",
     "44-mavzu. O'tkazgichlarda elektr zaryadlarning taqsimlanishi", 4, 137),
    ("45_45-mavzu_Tabiatdagi_elektr_hodisalar",
     "45-mavzu. Tabiatdagi elektr hodisalar", 4, 139),
    ("46_46-mavzu_Elektr_toki",
     "46-mavzu. Elektr toki", 4, 142),
    ("47_47-mavzu_Tok_manbalari",
     "47-mavzu. Tok manbalari", 4, 145),
    ("48_48-mavzu_Elektr_kuchlanish_va_uni_olchash",
     "48-mavzu. Elektr kuchlanish va uni o'lchash", 4, 149),
    ("49_49-mavzu_Tok_kuchi",
     "49-mavzu. Tok kuchi", 4, 153),
    ("50_50-mavzu_Masalalar_yechish",
     "50-mavzu. Masalalar yechish", 4, 156),
    ("51_51-mavzu_Laboratoriya_ishi_Tok_kuchi_va_kuchlanish",
     "51-mavzu. Lab ishi: Tok kuchi va kuchlanishni o'lchash", 4, 158),
    ("52_52-mavzu_Elektr_qarshilik",
     "52-mavzu. Elektr qarshilik", 4, 159),
    ("53_53-mavzu_Rezistorlar_Reostatlar",
     "53-mavzu. Rezistorlar. Reostatlar", 4, 163),
    ("54_54-mavzu_Zanjirning_bir_qismi_uchun_Om_qonuni",
     "54-mavzu. Zanjirning bir qismi uchun Om qonuni", 4, 166),
    ("55_55-mavzu_Masalalar_yechish",
     "55-mavzu. Masalalar yechish", 4, 169),
    ("56_56-mavzu_Amaliy_mashgulot_Reostat_yordamida_tok_rostlash",
     "56-mavzu. Amaliy mashg'ulot: Reostat yordamida tok kuchini rostlash", 4, 171),
    ("57_57-mavzu_Laboratoriya_ishi_va_IV_bob_topshiriqlari",
     "57-mavzu. Lab ishi va IV bob topshiriqlari", 4, 172),

    # V BOB
    ("58_58-mavzu_Yoruglikning_togri_chiziq_boylab_tarqalishi",
     "58-mavzu. Yorug'likning to'g'ri chiziq bo'ylab tarqalishi", 5, 175),
    ("59_59-mavzu_Quyosh_va_Oy_tutilishi",
     "59-mavzu. Quyosh va Oy tutilishi", 5, 178),
    ("60_60-mavzu_Yoruglikning_qaytishi_va_sinishi",
     "60-mavzu. Yorug'likning qaytishi va sinishi", 5, 181),
    ("61_61-mavzu_Linza",
     "61-mavzu. Linza", 5, 184),
    ("62_62-mavzu_Amaliy_mashgulot_va_V_bob_topshiriqlari",
     "62-mavzu. Amaliy mashg'ulot va V bob topshiriqlari", 5, 186),

    # OXIRGI
    ("63_Mashqlar_javoblari_va_Adabiyotlar",
     "Mashqlar javoblari va Foydalanilgan adabiyotlar", 0, 189),
]

# ===== 3. Darslik yozuvini olish yoki yaratish =====
print("7-sinf Fizika darsligini import qilish boshlandi...")
print("=" * 60)

darslik, created = Darslik.objects.get_or_create(
    grade=7,
    defaults={
        'subject':  'Mexanika',
        'subtitle': 'Harakat, Kuch va Energiya',
        'icon':     '🚀',
        'color':    '#38bdf8',
        'accent':   '#0891b2',
        'formulas': ['F = ma', 'v = v₀ + at', 'E = mgh'],
        'chapters': 5,
        'pages':    192,
        'is_published': True,
        'order':    1,
    }
)
if created:
    print(f"✅ Yangi Darslik yaratildi: 7-sinf Mexanika")
else:
    print(f"ℹ️  Mavjud Darslik topildi: {darslik}")
    # Eski mavzularni o'chiramiz (qayta import uchun)
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")

# ===== 4. Har bir mavzu uchun PDF ni ko'chirish va DB ga yozish =====
ok = 0
errors = 0

for order_idx, (prefix, mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    # PDF faylni topish
    src_file = os.path.join(SOURCE_DIR, f"{prefix}.pdf")
    if not os.path.exists(src_file):
        print(f"❌ Fayl topilmadi: {src_file}")
        errors += 1
        continue

    # Media papkasiga nusxa ko'chirish
    dest_filename = f"7sinf_{prefix}.pdf"
    dest_path = os.path.join(MEDIA_PDF_DIR, dest_filename)
    shutil.copy2(src_file, dest_path)

    # Mavzu yaratish
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
total_mavzular = darslik.mavzu_set.count()
print(f"📖 Jami mavzular DB da: {total_mavzular} ta")
print()
print("Natijani tekshirish:")
print(f"  http://localhost:8000/api/darsliklar/")
print(f"  http://localhost:8000/admin/darsliklar/mavzu/")
