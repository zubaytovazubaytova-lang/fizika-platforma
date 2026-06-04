"""
8-sinf Fizika darsligini Mavzu modeliga import qilish.
Ishlatish: python import_8sinf_pdfs.py  (backend/ papkasida)
Kitob: Fizika 8-sinf, Habibullayev va boshq., 3-nashr, 2019
Mavzular: Elektr zaryad, Elektr toki, Tok ishi, Turli muhitlar, Magnit maydon
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

SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\8sinf_mavzular"

# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish_muqova_nashriyot",
     "Kirish — Muqova va nashriyot ma'lumotlari", 0, 1),

    # I BOB. ELEKTR ZARYAD VA ELEKTR MAYDON
    ("01_1par_Jismlarning_zaryadlanishi",
     "1-§. Jismlarning zaryadlanishi", 1, 4),
    ("02_2par_Elektr_zaryad",
     "2-§. Elektr zaryad", 1, 9),
    ("03_3par_Zaryadlarning_ozaro_tasiri_Kulon_qonuni",
     "3-§. Zaryadlarning o'zaro ta'siri. Kulon qonuni", 1, 12),
    ("04_4par_Masalalar_yechish",
     "4-§. Masalalar yechish", 1, 15),
    ("05_5par_Elektr_maydon",
     "5-§. Elektr maydon", 1, 18),
    ("06_6par_Otkazgichlarda_elektr_zaryadlar",
     "6-§. O'tkazgichlarda elektr zaryadlarning taqsimlanishi", 1, 22),
    ("07_7par_Masalalar_yechish",
     "7-§. Masalalar yechish", 1, 25),
    ("08_8par_Tabiatdagi_elektr_hodisalar_test",
     "8-§. Tabiatdagi elektr hodisalar. Bob bo'yicha test va xulosalar", 1, 27),

    # II BOB. ELEKTR TOKI
    ("09_9par_Elektr_toki_haqida_tushuncha",
     "9-§. Elektr toki haqida tushuncha", 2, 32),
    ("10_10par_Tok_manbai",
     "10-§. Tok manbai", 2, 34),
    ("11_11par_Elektr_kuchlanish",
     "11-§. Elektr kuchlanish va uni o'lchash", 2, 39),
    ("12_12par_Tok_kuchi",
     "12-§. Tok kuchi va uni o'lchash", 2, 42),
    ("13_13par_Masalalar_yechish",
     "13-§. Masalalar yechish", 2, 45),
    ("14_14par_Laboratoriya_elektr_zanjir",
     "14-§. Laboratoriya ishi: Elektr zanjirni yig'ish, tok kuchi va kuchlanishni o'lchash", 2, 46),
    ("15_15par_Elektr_qarshilik",
     "15-§. Elektr qarshilik", 2, 47),
    ("16_16par_Rezistorlar_Reostatlar_Potensiometrlar",
     "16-§. Rezistorlar. Reostatlar. Potensiometrlar", 2, 52),
    ("17_17par_Om_qonuni",
     "17-§. Zanjirning bir qismi uchun Om qonuni", 2, 55),
    ("18_18par_Masalalar_yechish",
     "18-§. Masalalar yechish", 2, 60),
    ("19_19par_Laboratoriya_Om_qonuni",
     "19-§. Laboratoriya ishi: Om qonunini o'rganish", 2, 61),
    ("20_20par_Amaliy_Reostat_rostlash",
     "20-§. Amaliy mashg'ulot: Reostat yordamida tok kuchini rostlash", 2, 63),
    ("21_21par_Ketmaket_ulash",
     "21-§. Iste'molchilarni ketma-ket ulash", 2, 64),
    ("22_22par_Parallel_ulash",
     "22-§. Iste'molchilarni parallel ulash", 2, 67),
    ("23_23par_Amaliy_tok_manbai_ulash",
     "23-§. Amaliy mashg'ulot: Tok manbalarini ulash", 2, 71),
    ("24_24par_Laboratoriya_otkazgich_ulash",
     "24-§. Laboratoriya ishi: O'tkazgichlarni ketma-ket va parallel ulashni o'rganish", 2, 72),
    ("25_25par_Aralash_ulash",
     "25-§. Iste'molchilarni aralash ulash (Mustaqil o'qish uchun)", 2, 75),
    ("26_26par_Masalalar_yechish",
     "26-§. Masalalar yechish", 2, 76),
    ("27_27par_Elektr_sigimi_Kondensatorlar",
     "27-§. Elektr sig'imi. Kondensatorlar", 2, 82),
    ("28_28par_Kondensator_ulash",
     "28-§. Kondensatorlarni parallel va ketma-ket ulash", 2, 84),
    ("29_29par_Masalalar_test_xulosalar",
     "29-§. Masalalar yechish. Bob bo'yicha test va xulosalar", 2, 86),

    # III BOB. ELEKTR TOKINING ISHI VA QUVVATI
    ("30_30par_Elektr_tokining_ishi",
     "30-§. Elektr tokining ishi", 3, 88),
    ("31_31par_Elektr_tokining_quvvati",
     "31-§. Elektr tokining quvvati", 3, 90),
    ("32_32par_Masalalar_yechish",
     "32-§. Masalalar yechish", 3, 93),
    ("33_33par_Laboratoriya_lampochka_quvvati",
     "33-§. Laboratoriya ishi: Iste'molchi (lampochka)ning elektr quvvatini aniqlash", 3, 96),
    ("34_34par_Otkazgich_qizishi_Joyl_Lens",
     "34-§. Elektr toki ta'sirida o'tkazgichlarning qizishi", 3, 97),
    ("35_35par_Masalalar_yechish",
     "35-§. Masalalar yechish", 3, 100),
    ("36_36par_Joyl_Lens_amaliy_tatbiq",
     "36-§. Joyl-Lens qonunining amaliy tatbiqlari", 3, 102),
    ("37_37par_Xona_elektr_zanjirlari",
     "37-§. Xonalardagi elektr zanjirlar va ulashlar", 3, 104),
    ("38_38par_Elektr_xavfsizlik_choralari",
     "38-§. Elektr xavfsizlik choralari", 3, 108),
    ("39_39par_Masalalar_test_xulosalar",
     "39-§. Masalalar yechish. Bob bo'yicha test va xulosalar", 3, 111),

    # IV BOB. TURLI MUHITLARDA ELEKTR TOKI
    ("40_40par_Metallarda_elektr_toki",
     "40-§. Metallarda elektr toki", 4, 115),
    ("41_41par_Suyuqliklarda_elektr_toki",
     "41-§. Suyuqliklarda elektr toki", 4, 117),
    ("42_42par_Elektroliz_Faraday_birinchi_qonuni",
     "42-§. Elektroliz. Faradeyning birinchi qonuni", 4, 120),
    ("43_43par_Faraday_ikkinchi_qonuni",
     "43-§. Faradeyning ikkinchi qonuni", 4, 123),
    ("44_44par_Masalalar_yechish",
     "44-§. Masalalar yechish", 4, 125),
    ("45_45par_Elektrolizdan_foydalanish",
     "45-§. Elektrolizdan turmushda va texnikada foydalanish", 4, 127),
    ("46_46par_Ionlar_ionlanish_razryad",
     "46-§. Ionlar. Ionlanish va rekombinatsiya. Gaz razryadi", 4, 129),
    ("47_47par_Gazlarda_elektr_toki",
     "47-§. Gazlarda elektr toki", 4, 131),
    ("48_48par_Elektr_razryadlar_test_xulosalar",
     "48-§. Elektr razryadlarning turlari va ulardan foydalanish. Bob bo'yicha test va xulosalar", 4, 133),

    # V BOB. MAGNIT MAYDON
    ("49_49par_Magnit_maydon_doimiy_magnit",
     "49-§. Magnit maydon. Doimiy magnit va uning qutblari", 5, 139),
    ("50_50par_Magnit_maydon_parametrlar",
     "50-§. Magnit maydonni xarakterlovchi parametrlar", 5, 143),
    ("51_51par_Yer_magnit_maydoni",
     "51-§. Yerning magnit maydoni", 5, 145),
    ("52_52par_Tok_magnit_maydoni",
     "52-§. Tokning magnit maydoni", 5, 146),
    ("53_53par_Magnit_tokli_otkazgichga_tasiri",
     "53-§. Magnit maydonning tokli o'tkazgichga ta'siri", 5, 149),
    ("54_54par_Masalalar_yechish",
     "54-§. Masalalar yechish", 5, 151),
    ("55_55par_Ramkaning_aylanma_harakati",
     "55-§. Bir jinsli magnit maydonda tokli ramkaning aylanma harakati", 5, 153),
    ("56_56par_Zaryadli_zarra_magnit_maydonda",
     "56-§. Magnit maydonda zaryadli zarraning harakati", 5, 155),
    ("57_57par_Elektromagnitlar_rele",
     "57-§. Elektromagnitlar. Elektromagnit rele", 5, 157),
    ("58_58par_Laboratoriya_elektromagnit",
     "58-§. Laboratoriya ishi: Eng oddiy elektromagnitni yig'ish va uning ishlashini o'rganish", 5, 161),
    ("59_59par_Ozgarmas_tok_elektr_dvigateli",
     "59-§. O'zgarmas tok elektr dvigateli", 5, 162),
    ("60_60par_Masalalar_test_xulosalar",
     "60-§. Masalalar yechish. Bob bo'yicha test va xulosalar", 5, 165),

    # OXIRGI
    ("61_Mashqlar_javoblari_Mundarija",
     "Mashqlarning javoblari va Mundarija", 0, 169),
]

print("8-sinf Fizika darsligini import qilish boshlandi...")
print("=" * 60)

darslik, created = Darslik.objects.get_or_create(
    grade=8,
    defaults={
        'subject':  'Elektr va Magnit',
        'subtitle': 'Elektr zaryad, Elektr toki, Magnit maydon',
        'icon':     '⚡',
        'color':    '#fb923c',
        'accent':   '#ea580c',
        'formulas': ['U = IR', 'P = UI', 'F = BIL'],
        'chapters': 5,
        'pages':    176,
        'is_published': True,
        'order':    2,
    }
)
if created:
    print(f"✅ Yangi Darslik yaratildi: 8-sinf Elektr va Magnit")
else:
    print(f"ℹ️  Mavjud Darslik topildi: {darslik}")
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")
    darslik.subject  = 'Elektr va Magnit'
    darslik.subtitle = 'Elektr zaryad, Elektr toki, Magnit maydon'
    darslik.icon     = '⚡'
    darslik.color    = '#fb923c'
    darslik.accent   = '#ea580c'
    darslik.formulas = ['U = IR', 'P = UI', 'F = BIL']
    darslik.chapters = 5
    darslik.pages    = 176
    darslik.is_published = True
    darslik.order    = 2
    darslik.save()
    print(f"   Darslik ma'lumotlari yangilandi")

ok = 0
errors = 0

for order_idx, (prefix, mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    src_file = os.path.join(SOURCE_DIR, f"{prefix}.pdf")
    if not os.path.exists(src_file):
        print(f"❌ Fayl topilmadi: {src_file}")
        errors += 1
        continue

    dest_filename = f"8sinf_{prefix}.pdf"
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
