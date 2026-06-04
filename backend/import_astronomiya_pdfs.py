"""
11-sinf Astronomiya darsligini Mavzu modeliga import qilish.
Ishlatish: python import_astronomiya_pdfs.py  (backend/ papkasida)
"""
import sys, os, shutil
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from darsliklar.models import Darslik, Mavzu

MEDIA_PDF_DIR = os.path.join(os.path.dirname(__file__), 'media', 'mavzular', 'pdf')
os.makedirs(MEDIA_PDF_DIR, exist_ok=True)

SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\astronomiya_11sinf_mavzular"

# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish_muqova_nashriyot",
     "Kirish — Muqova va nashriyot ma'lumotlari", 0, 1),

    # I BOB
    ("01_1-mavzu_Astronomiya_nimani_organadi_tarix",
     "1-mavzu. Astronomiya nimani o'rganadi? Rivojlanish tarixi", 1, 3),
    ("02_2-mavzu_Yoritgichlar_sutkalik_harakat_yulduz_turkumlari",
     "2-mavzu. Yoritgichlarning sutkalik ko'rinma harakatlari. Yulduz turkumlari", 1, 6),
    ("03_3-mavzu_Osmon_koordinatalari_xaritalar_yulduz_kattaliklari",
     "3-mavzu. Osmon koordinatalari. Yulduzlar xaritalari va kattaliklari", 1, 11),
    ("04_4-mavzu_Olam_qutbi_balandligi_kulminatsiya",
     "4-mavzu. Olam qutbi balandligi. Kulminatsiya. Geografik kenglik", 1, 15),
    ("05_5-mavzu_Vaqtni_olchash_asoslari_Kalendarlar",
     "5-mavzu. Vaqtni o'lchashning asoslari. Kalendarlar", 1, 21),
    ("06_6-mavzu_Oyning_harakati_fazalari_Tutilishlar",
     "6-mavzu. Oyning harakati, fazalari va davrlari. Quyosh va Oy tutilishlari", 1, 25),

    # II BOB
    ("07_7-mavzu_Quyosh_sistemasi_tuzilishi_planetalar_konfiguratsiya",
     "7-mavzu. Quyosh sistemasining tuzilishi. Planetalar konfiguratsiyasi va davrlari", 2, 31),
    ("08_8-mavzu_Parallaks_masofalar_radiuslar_aniqlash",
     "8-mavzu. Sutkalik parallaks. Masofalar va radiuslarni aniqlash", 2, 38),
    ("09_9-mavzu_Uzunlik_birliklari_Kepler_qonunlari_massalar",
     "9-mavzu. Astronomik uzunlik birliklari. Kepler qonunlari. Massalar", 2, 41),
    ("10_10-mavzu_Ikki_jism_masalasi_Kosmik_tezliklar",
     "10-mavzu. Ikki jism masalasi. Kosmik tezliklar", 2, 45),

    # III BOB
    ("11_11-mavzu_Elektromagnit_nurlanish_teleskoplar_Ulugbek_rasadxonasi",
     "11-mavzu. Elektromagnit nurlanish. Teleskoplar. Ulug'bek rasadxonasi", 3, 47),
    ("12_12-mavzu_Nurlanish_qonunlari_spektral_metodlar",
     "12-mavzu. Nurlanish qonunlari. Spektral metodlar", 3, 56),

    # IV BOB
    ("13_13-mavzu_Quyosh_eng_yaqin_yulduz_fotosfera_doglar",
     "13-mavzu. Quyosh — eng yaqin yulduz. Fotosfera va Quyosh dog'lari", 4, 59),
    ("14_14-mavzu_Quyosh_xromosferasi_toji_faolligi_Yerga_tasiri",
     "14-mavzu. Quyosh xromosferasi va toji. Quyosh faolligi va Yerga ta'siri", 4, 64),
    ("15_15-mavzu_Yer_rusumidagi_planetalar_Merkuriy_Venera_Oy_Mars",
     "15-mavzu. Yer rusumidagi planetalar: Merkuriy, Venera, Oy va Mars", 4, 71),
    ("16_16-mavzu_Gigant_planetalar_yoldoshlari_halqalari",
     "16-mavzu. Gigant planetalar, ularning yo'ldoshlari va halqalari", 4, 81),
    ("17_17-mavzu_Asteroidlar_mitti_planetalar",
     "17-mavzu. Asteroidlar va mitti planetalar", 4, 89),
    ("18_18-mavzu_Kometalar_Meteorlar_meteoritlar",
     "18-mavzu. Kometalar (dumli yulduzlar). Meteorlar va meteoritlar", 4, 92),
    ("19_19-mavzu_Quyosh_sistemasi_kelib_chiqishi",
     "19-mavzu. Quyosh sistemasining kelib chiqishi haqida hozirgi zamon qarashlari", 4, 99),

    # V BOB
    ("20_20-mavzu_Yillik_parallaks_yulduzlar_masofasi_parametrlari",
     "20-mavzu. Yillik parallaks. Yulduzlar masofasi, o'lchami va fizik parametrlari", 5, 102),
    ("21_21-mavzu_Absolyut_kattalik_spektr_yorqinlik_diagrammasi",
     "21-mavzu. Absolyut kattalik. Yulduzlar spektri. Spektr-yorqinlik diagrammasi", 5, 106),
    ("22_22-mavzu_Qoshaloq_yulduzlar_massalarini_hisoblash",
     "22-mavzu. Fizik qo'shaloq yulduzlar. Yulduzlar massasini hisoblash", 5, 111),
    ("23_23-mavzu_Ozgaruvchi_yulduzlar_sefeidlar_yangi_otayangilar",
     "23-mavzu. Fizik o'zgaruvchi yulduzlar: Sefeidlar, yangi va o'ta yangilar", 5, 115),
    ("24_24-mavzu_Yulduzlar_evolyutsiyasi_neytron_qora_olar",
     "24-mavzu. Yulduzlar evolyutsiyasi. Neytron yulduzlar va qora o'ralar", 5, 118),

    # VI BOB
    ("25_25-mavzu_Galaktika_tuzilishi_tarkibi_aylanishi",
     "25-mavzu. Galaktikamizning tuzilishi, tarkibi va aylanishi", 6, 121),
    ("26_26-mavzu_Diffuz_va_chang_tumanliklar",
     "26-mavzu. Diffuz va chang tumanliklar", 6, 124),
    ("27_27-mavzu_Tashqi_galaktikalar_radiogalaktikalar_kvazarlar",
     "27-mavzu. Tashqi galaktikalar. Radiogalaktikalar va kvazarlar", 6, 126),
    ("28_28-mavzu_Koinot_kengayishi_Habbl_qonuni",
     "28-mavzu. Koinotning kengayishi. Habbl qonuni", 6, 130),
    ("29_29-mavzu_Galaktikalar_Koinotda_taqsimlanishi",
     "29-mavzu. Galaktikalarning Koinotda taqsimlanishi", 6, 132),

    # II QISM — KOSMONAVTIKA
    ("30_30-mavzu_Kosmonavtika_predmeti_boshqa_fanlar_bilan_aloqasi",
     "30-mavzu. Kosmonavtika predmeti va boshqa fanlar bilan aloqasi", 7, 134),
    ("31_31-mavzu_Raketa_harakati_qonunlari_tortish_kuchi",
     "31-mavzu. Raketa harakati qonunlari. Raketaning tortish kuchi", 7, 138),
    ("32_32-mavzu_Raketa_strukturasi_KAga_tasir_etuvchi_kuchlar",
     "32-mavzu. Raketa strukturasi. KA ga ta'sir etuvchi kuchlar", 7, 141),
    ("33_33-mavzu_Tortishish_maydonida_jism_orbitalari",
     "33-mavzu. Tortishish markaziy maydonida jism orbitalari", 7, 144),
    ("34_34-mavzu_Tasir_sferasi_KA_trayektoriyalari_hisoblash",
     "34-mavzu. Ta'sir sferasi va KA trayektoriyalarini taxminiy hisoblash", 7, 148),
    ("35_35-mavzu_Yer_suniy_yoldoshlari_orbita_elementlari_evolyutsiya",
     "35-mavzu. Yer sun'iy yo'ldoshlari orbita elementlari va evolyutsiya", 7, 151),
    ("36_36-mavzu_Orbital_manyovrlar_orbitadan_tushirish",
     "36-mavzu. Orbital manyovrlar. SY ni orbitadan tushirish", 7, 154),
    ("37_37-mavzu_KAlarni_Oyga_uchirish",
     "37-mavzu. Kosmik apparatlarni Oyga uchirish", 7, 158),
    ("38_38-mavzu_Planetalarga_uchish_trayektoriyalari_Yer_tasir_sferasi",
     "38-mavzu. Planetalarga uchish trayektoriyalari. Yer ta'sir sferasi", 7, 160),
    ("39_39-mavzu_Gomon_orbitalari_boylab_uchishlar",
     "39-mavzu. Gomon orbitalari bo'ylab uchishlar", 7, 163),
    ("40_40-mavzu_KA_moljallangan_planeta_tasir_sferasidagi_harakat",
     "40-mavzu. KA ning mo'ljallangan planeta ta'sir sferasidagi harakati", 7, 167),

    # OXIRGI
    ("41_Astronomik_doimiylar_va_Jadvallar",
     "Astronomik doimiylar va Planetalar jadvali", 0, 169),
    ("42_Mundarija",
     "Mundarija", 0, 172),
]

print("11-sinf Astronomiya darsligini import qilish boshlandi...")
print("=" * 60)

# Darslik grade=11 uchun yozuv
darslik, created = Darslik.objects.get_or_create(
    grade=11,
    defaults={
        'subject':  'Astronomiya',
        'subtitle': 'Osmon jismlari va Koinot',
        'icon':     '🔭',
        'color':    '#f87171',
        'accent':   '#dc2626',
        'formulas': ['E = mc²', 'F = GMm/r²', 'T² = a³'],
        'chapters': 7,
        'pages':    176,
        'is_published': True,
        'order':    5,
    }
)
if created:
    print(f"✅ Yangi Darslik yaratildi: 11-sinf Astronomiya")
else:
    print(f"ℹ️  Mavjud Darslik yangilandi: {darslik}")
    # Mavzularni tozalaymiz
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")

ok = 0
errors = 0

for order_idx, (prefix, mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    src_file = os.path.join(SOURCE_DIR, f"{prefix}.pdf")
    if not os.path.exists(src_file):
        print(f"❌ Fayl topilmadi: {src_file}")
        errors += 1
        continue

    dest_filename = f"11sinf_astronomiya_{prefix}.pdf"
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
