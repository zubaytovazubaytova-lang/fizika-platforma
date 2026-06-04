"""
9-sinf Fizika darsligini Mavzu modeliga import qilish.
Ishlatish: python import_9sinf_pdfs.py  (backend/ papkasida)
Kitob: Fizika 9-sinf, Habibullayev va boshq., 3-nashr, 2019
Mavzular: MKN nazariyasi, Termodinamika, Issiqlik dvigatellari,
          Suyuqlik va qattiq jismlar, Optika
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

SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\9sinf_mavzular"

# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish_muqova_nashriyot",
     "Kirish — Muqova va nashriyot ma'lumotlari", 0, 1),

    # I BOB. MODDA TUZILISHINING MOLEKULYAR-KINETIK NAZARIYASI ASOSLARI
    ("01_1par_Modda_tuzilishining_MKN_nazariyasi",
     "1-§. Modda tuzilishining molekulyar-kinetik nazariyasi", 1, 4),
    ("02_2par_Moddaning_massasi_va_olchami",
     "2-§. Moddaning massasi va o'lchami", 1, 7),
    ("03_3par_Modda_miqdori",
     "3-§. Modda miqdori", 1, 12),
    ("04_4par_Masalalar_yechish",
     "4-§. Masalalar yechish", 1, 16),
    ("05_5par_Ideal_gaz",
     "5-§. Ideal gaz", 1, 18),
    ("06_6par_Izoprotsesslar",
     "6-§. Izoprotsesslar", 1, 21),
    ("07_7par_Gaz_molekulalarining_harakat_tezligi",
     "7-§. Gaz molekulalarining harakat tezligi", 1, 25),
    ("08_8par_Masalalar_yechish",
     "8-§. Masalalar yechish", 1, 28),
    ("09_9par_Ideal_gaz_holatining_tenglamalari",
     "9-§. Ideal gaz holatining tenglamalari", 1, 30),
    ("10_10par_Izotermik_jarayon",
     "10-§. Izotermik jarayon", 1, 33),
    ("11_11par_Izobarik_jarayon",
     "11-§. Izobarik jarayon", 1, 35),
    ("12_12par_Izokor_jarayon",
     "12-§. Izokor jarayon", 1, 37),
    ("13_13par_Amaliy_Moddalar_olchamini_baholash",
     "13-§. Amaliy mashg'ulot: Moddalarning o'lchamini baholash", 1, 38),
    ("14_14par_Masalalar_yechish",
     "14-§. Masalalar yechish", 1, 41),
    ("15_I_bob_test_va_xulosalar",
     "I bob bo'yicha test topshiriqlari va muhim xulosalar", 1, 44),

    # II BOB. ICHKI ENERGIYA VA TERMODINAMIKA ELEMENTLARI
    ("16_15par_Ichki_energiya",
     "15-§. Ichki energiya", 2, 50),
    ("17_16par_Temperatura_Issiqlik_ishi",
     "16-§. Temperatura. Issiqlik ishi", 2, 53),
    ("18_17par_Issiqlik_miqdori",
     "17-§. Issiqlik miqdori", 2, 55),
    ("19_18par_Masalalar_yechish",
     "18-§. Masalalar yechish", 2, 60),
    ("20_19par_Amaliy_issiqlik_muvozanati",
     "19-§. Amaliy mashg'ulot: Jismlarda issiqlik muvozanatini o'rganish", 2, 63),
    ("21_20par_Laboratoriya_solishtirma_issiqlik_sigimi",
     "20-§. Laboratoriya ishi: Qattiq jismlarning solishtirma issiqlik sig'imini aniqlash", 2, 64),
    ("22_21par_Yoqilgi_solishtirma_yonish_issiqligi",
     "21-§. Yoqilg'ining solishtirma yonish issiqligi", 2, 65),
    ("23_22par_Termodinamika_birinchi_qonuni",
     "22-§. Termodinamikaning birinchi qonuni", 2, 67),
    ("24_23par_Masalalar_yechish",
     "23-§. Masalalar yechish", 2, 70),
    ("25_24par_Issiqlik_jarayo_qaytmasligi_ikkinchi_qonun",
     "24-§. Issiqlik jarayonlarining qaytmasligi. Termodinamikaning ikkinchi qonuni", 2, 72),
    ("26_25par_Laboratoriya_issiqlik_miqdorlarini_taqqoslash",
     "25-§. Laboratoriya ishi: Turli temperaturali suv aralashtirilganda issiqlik miqdorlarini taqqoslash", 2, 73),
    ("27_II_bob_test_va_xulosalar",
     "II bob bo'yicha test topshiriqlari va muhim xulosalar", 2, 74),

    # III BOB. ISSIQLIK DVIGATELLARI
    ("28_26par_Ichki_yonuv_dvigatellari",
     "26-§. Ichki yonuv dvigatellari", 3, 81),
    ("29_27par_Issiqlik_dvigatellarining_ishlash_printsipi",
     "27-§. Issiqlik dvigatellarining ishlash printsipi", 3, 83),
    ("30_28par_Issiqlik_dvigatellarining_FIKi",
     "28-§. Issiqlik dvigatellarining foydali ish koeffitsiyenti", 3, 86),
    ("31_29par_Issiqlik_mashinlari_va_tabiatni_muhofaza",
     "29-§. Issiqlik mashinlari va tabiatni muhofaza qilish", 3, 88),
    ("32_30par_Masalalar_yechish",
     "30-§. Masalalar yechish", 3, 89),
    ("33_III_bob_test_va_xulosalar",
     "III bob bo'yicha test topshiriqlari va muhim xulosalar", 3, 91),

    # IV BOB. SUYUQLIK VA QATTIQ JISMLARNING XOSSALARI
    ("34_31par_Suyuqliklarning_xossalari",
     "31-§. Suyuqliklarning xossalari", 4, 94),
    ("35_32par_Hollash_Kapillyar_hodisalar",
     "32-§. Ho'llash. Kapillyar hodisalar", 4, 97),
    ("36_33par_Masalalar_yechish",
     "33-§. Masalalar yechish", 4, 100),
    ("37_34par_Laboratoriya_sirt_taranglik_koeffitsiyenti",
     "34-§. Laboratoriya ishi: Suyuqlikning sirt taranglik koeffitsiyentini aniqlash", 4, 103),
    ("38_35par_Kristall_va_amorf_jismlar",
     "35-§. Kristall va amorf jismlar", 4, 104),
    ("39_36par_Qattiq_jismlarning_mexanik_xossalari",
     "36-§. Qattiq jismlarning mexanik xossalari", 4, 106),
    ("40_37par_Masalalar_yechish",
     "37-§. Masalalar yechish", 4, 109),
    ("41_38par_Qattiq_jismlarning_erishi_va_qotishi",
     "38-§. Qattiq jismlarning erishi va qotishi", 4, 111),
    ("42_39par_Moddalarning_havoga_erishi_Namlik",
     "39-§. Moddalarning havoga erishi. Namlik. Amorf jismlarning erishi va qotishi", 4, 113),
    ("43_40par_Buglanish_va_kondensatsiya",
     "40-§. Bug'lanish va kondensatsiya", 4, 116),
    ("44_41par_Atmosferadagi_hodisalar",
     "41-§. Atmosferadagi hodisalar", 4, 119),
    ("45_42par_Laboratoriya_havoning_nisbiy_namligi",
     "42-§. Laboratoriya ishi: Havoning nisbiy namligini aniqlash", 4, 123),
    ("46_43par_Masalalar_yechish",
     "43-§. Masalalar yechish", 4, 125),
    ("47_IV_bob_test_va_xulosalar",
     "IV bob bo'yicha test topshiriqlari va muhim xulosalar", 4, 127),

    # V BOB. OPTIKA. YORUG'LIKNING TARQALISH QONUNLARI. OPTIK ASBOBLAR
    ("48_44par_Yoruglik_tezligini_aniqlash",
     "44-§. Yorug'lik tezligini aniqlash", 5, 131),
    ("49_45par_Yoruglikning_qaytish_va_sinish_qonunlari",
     "45-§. Yorug'likning qaytish va sinish qonunlari", 5, 134),
    ("50_46par_Masalalar_yechish",
     "46-§. Masalalar yechish", 5, 138),
    ("51_47par_Tota_ichki_qaytish",
     "47-§. To'ta ichki qaytish", 5, 139),
    ("52_48par_Masalalar_yechish",
     "48-§. Masalalar yechish", 5, 142),
    ("53_49par_Laboratoriya_nur_sindirish_korsatkichi",
     "49-§. Laboratoriya ishi: Shishaning nur sindirish ko'rsatkichini aniqlash", 5, 143),
    ("54_50par_Linzalar",
     "50-§. Linzalar", 5, 144),
    ("55_51par_Yupqa_linza_tasvir_yasash",
     "51-§. Yupqa linza yordamida tasvir yasash", 5, 146),
    ("56_52par_Masalalar_yechish",
     "52-§. Masalalar yechish", 5, 148),
    ("57_53par_Laboratoriya_linza_optik_kuchi",
     "53-§. Laboratoriya ishi: Linzaning optik kuchini aniqlash", 5, 150),
    ("58_54par_Optik_asboblar",
     "54-§. Optik asboblar", 5, 151),
    ("59_55par_Koz_va_korish",
     "55-§. Ko'z va ko'rish", 5, 154),
    ("60_56par_Masalalar_yechish",
     "56-§. Masalalar yechish", 5, 156),
    ("61_57par_Geliotexnika_quyosh_energiyasi",
     "57-§. Geliotexnika. O'zbekistonda quyosh energiyasidan foydalanish", 5, 158),
    ("62_V_bob_test_va_xulosalar",
     "V bob bo'yicha test topshiriqlari va muhim xulosalar", 5, 160),

    # VI BOB. OLAMNING FIZIK MANZARASI. FIZIKA-TEXNIKA TARAQQIYOTI
    ("63_58par_Olamning_yagona_fizik_manzarasi",
     "58-§. Olamning yagona fizik manzarasi", 6, 164),
    ("64_59par_Fizika_va_texnika_taraqqiyoti",
     "59-§. Fizika va texnika taraqqiyoti. O'zbekistonda fizika sohasidagi tadqiqotlar", 6, 166),

    # OXIRGI
    ("65_Test_javoblari_Mundarija_Nashriyot",
     "Test javoblari, Mundarija va Nashriyot ma'lumotlari", 0, 170),
]

print("9-sinf Fizika darsligini import qilish boshlandi...")
print("=" * 60)

darslik, created = Darslik.objects.get_or_create(
    grade=9,
    defaults={
        'subject':  'Termodinamika va Optika',
        'subtitle': 'MKN nazariyasi, Termodinamika, Issiqlik dvigatellari, Optika',
        'icon':     '🌡️',
        'color':    '#34d399',
        'accent':   '#059669',
        'formulas': ['pV = νRT', 'ΔU = Q - A', 'n = sin α / sin β'],
        'chapters': 6,
        'pages':    176,
        'is_published': True,
        'order':    3,
    }
)
if created:
    print(f"✅ Yangi Darslik yaratildi: 9-sinf Termodinamika va Optika")
else:
    print(f"ℹ️  Mavjud Darslik topildi: {darslik}")
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")
    darslik.subject  = 'Termodinamika va Optika'
    darslik.subtitle = 'MKN nazariyasi, Termodinamika, Issiqlik dvigatellari, Optika'
    darslik.icon     = '🌡️'
    darslik.color    = '#34d399'
    darslik.accent   = '#059669'
    darslik.formulas = ['pV = νRT', 'ΔU = Q - A', 'n = sin α / sin β']
    darslik.chapters = 6
    darslik.pages    = 176
    darslik.is_published = True
    darslik.order    = 3
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

    dest_filename = f"9sinf_{prefix}.pdf"
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
