"""
11-sinf Fizika darsligini Mavzu modeliga import qilish.
Ishlatish: python import_11sinf_fizika_pdfs.py  (backend/ papkasida)
Kitob: Fizika 11-sinf, Turdiyev, Tursunmetov va boshq., 2017/2018
Mavzular: Magnit maydon, Elektromagnit induksiya, EMT, Optika,
          Nisbiylik, Kvant, Atom va yadro fizikasi

ESLATMA: grade=11 uchun Astronomiya (ID=5) ham mavjud.
Bu script grade=11, subject='Zamonaviy Fizika' bilan yangi yozuv yaratadi.
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

SOURCE_DIR = r"C:\Users\user\Desktop\darsliklar\11sinf_fizika_mavzular"

# (fayl_nomi_prefix, mavzu_nomi, bob_raqami, bet_boshi)
MAVZULAR = [
    # KIRISH
    ("00_Kirish_muqova_nashriyot",
     "Kirish — Muqova va nashriyot ma'lumotlari", 0, 1),

    # I BOB. MAGNIT MAYDON
    ("01_1-mavzu_Magnit_maydon_tavsiflovchi_kattaliklar",
     "1-mavzu. Magnit maydon. Magnit maydonni tavsiflovchi kattaliklar", 1, 4),
    ("02_2-mavzu_Tokli_ramkani_aylantiruvchi_moment",
     "2-mavzu. Bir jinsli magnit maydonning tokli ramkani aylantiruvchi momenti", 1, 7),
    ("03_3-mavzu_Togri_otkazgich_halqa_galtak_magnit_maydoni",
     "3-mavzu. Tokli to'g'ri o'tkazgichning, halqa va g'altakning magnit maydoni", 1, 10),
    ("04_4-mavzu_Tokli_otkazgichni_magnit_maydonda_kochirish",
     "4-mavzu. Tokli o'tkazgichni magnit maydonda ko'chirishda bajarilgan ish", 1, 13),
    ("05_5-mavzu_Tokli_otkazgichlarning_ozaro_tasir_kuchi",
     "5-mavzu. Tokli o'tkazgichlarning o'zaro ta'sir kuchi", 1, 15),
    ("06_6-mavzu_Zaryadli_zarraning_harakati_Lorens_kuchi",
     "6-mavzu. Bir jinsli magnit maydonida zaryadli zarraning harakati. Lorens kuchi", 1, 17),
    ("07_I_bob_test_va_yakunlash",
     "I bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 1, 22),

    # II BOB. ELEKTROMAGNIT INDUKSIYA
    ("08_7-mavzu_Elektromagnit_induksiya_Faraday_qonuni",
     "7-mavzu. Elektromagnit induksiya hodisasi. Faraday qonuni", 2, 26),
    ("09_8-mavzu_Ozinduksiya_EYuK_Induktivlik",
     "8-mavzu. O'zinduksiya hodisasi. O'zinduksiya EYuK. Induktivlik", 2, 29),
    ("10_9-mavzu_Moddalarning_magnit_xossalari",
     "9-mavzu. Moddalarning magnit xossalari", 2, 32),
    ("11_10-mavzu_Magnit_maydon_energiyasi",
     "10-mavzu. Magnit maydon energiyasi", 2, 35),
    ("12_II_bob_test_va_yakunlash",
     "II bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 2, 38),

    # III BOB. ELEKTROMAGNIT TEBRANISHLAR
    ("13_11-mavzu_Erkin_elektromagnit_tebranishlar",
     "11-mavzu. Erkin elektromagnit tebranishlar (tebranish konturi)", 3, 41),
    ("14_12-mavzu_Sobuvchi_elektromagnit_tebranishlar",
     "12-mavzu. Tebranishlarni grafik tasvirlash. So'nuvchi elektromagnit tebranishlar", 3, 45),
    ("15_13-mavzu_Tranzistorli_generator",
     "13-mavzu. Tranzistorli elektromagnit tebranishlar generatori", 3, 48),
    ("16_14-mavzu_Aktiv_qarshilik_ozgaruvchan_tok",
     "14-mavzu. O'zgaruvchan tok zanjiridagi aktiv qarshilik", 3, 51),
    ("17_15-mavzu_Kondensator_ozgaruvchan_tok_zanjiridagi",
     "15-mavzu. O'zgaruvchan tok zanjiridagi kondensator", 3, 55),
    ("18_16-mavzu_Induktiv_galtak_ozgaruvchan_tok_zanjiridagi",
     "16-mavzu. O'zgaruvchan tok zanjiridagi induktiv g'altak", 3, 57),
    ("19_17-mavzu_Om_qonuni_RLC_zanjir",
     "17-mavzu. Aktiv qarshilik, induktiv g'altak va kondensator ketma-ket ulangan zanjir uchun Om qonuni", 3, 59),
    ("20_18-mavzu_Rezonans_hodisasi",
     "18-mavzu. O'zgaruvchan tok zanjirida rezonans hodisasi", 3, 62),
    ("21_19-mavzu_Laboratoriya_rezonans",
     "19-mavzu. Laboratoriya ishi: o'zgaruvchan tok zanjirida rezonans hodisasini o'rganish", 3, 65),
    ("22_20-mavzu_Ozgaruvchan_tok_ishi_va_quvvati",
     "20-mavzu. O'zgaruvchan tokning ishi va quvvati. Quvvat koeffitsiyenti", 3, 66),
    ("23_III_bob_test_va_yakunlash",
     "III bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 3, 72),

    # IV BOB. ELEKTROMAGNIT TO'LQINLAR VA TO'LQIN OPTIKASI
    ("24_21-mavzu_Elektromagnit_tolqin_tezligi",
     "21-mavzu. Elektromagnit tebranishlarning tarqalishi. Elektromagnit to'lqin tezligi", 4, 76),
    ("25_22-mavzu_Elektromagnit_tolqinlar_xossalari",
     "22-mavzu. Elektromagnit to'lqinlarning umumiy xossalari", 4, 79),
    ("26_23-mavzu_Radioaloqa_radiolokatsiya",
     "23-mavzu. Radioaloqaning fizik asoslari. Radiolokatsiya", 4, 83),
    ("27_24-mavzu_Telekvideniye_fizik_asoslari",
     "24-mavzu. Telekvideniyening fizik asoslari. Toshkent — televideniye vatani", 4, 87),
    ("28_25-mavzu_Yoruglik_interferensiyasi_va_difraksiyasi",
     "25-mavzu. Yorug'lik interferensiyasi va difraksiyasi", 4, 91),
    ("29_26-mavzu_Laboratoriya_difraksion_panjara",
     "26-mavzu. Laboratoriya ishi: Difraksion panjara yordamida to'lqin uzunligini aniqlash", 4, 96),
    ("30_27-mavzu_Yoruglik_dispersiyasi_spektral_analiz",
     "27-mavzu. Yorug'lik dispersiyasi. Spektral analiz", 4, 98),
    ("31_28-mavzu_Yoruglikning_qutblanishi",
     "28-mavzu. Yorug'likning qutblanishi", 4, 103),
    ("32_29-mavzu_Infraqizil_nurlanish",
     "29-mavzu. Infraqizil nurlanish. Ultrabinafsha nurlanish. Rentgen nurlari", 4, 107),
    ("33_30-mavzu_Yoruglik_oqimi_kuchi_yoritilganlik",
     "30-mavzu. Yorug'lik oqimi. Yorug'lik kuchi. Yoritilganlik", 4, 110),
    ("34_31-mavzu_Laboratoriya_yoritilganlik",
     "31-mavzu. Laboratoriya ishi: Yoritilganlikni aniqlash", 4, 116),
    ("35_IV_bob_test_va_yakunlash",
     "IV bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 4, 120),

    # V BOB. NISBIYLIK NAZARIYASI
    ("36_32-mavzu_Maxsus_nisbiylik_nazariyasi_asoslari",
     "32-mavzu. Maxsus nisbiylik nazariyasi asoslari. Tezliklarni qo'shishning relyativistik qonuni", 5, 125),
    ("37_33-mavzu_Massaning_tezlikka_bogliqligii_Energiya",
     "33-mavzu. Massaning tezlikka bog'liqligi. Massa va energiya o'rtasidagi bog'liqlik", 5, 129),
    ("38_V_bob_test_va_yakunlash",
     "V bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 5, 133),

    # VI BOB. KVANT FIZIKASI
    ("39_34-mavzu_Kvant_fizikasining_paydo_bolishi",
     "34-mavzu. Kvant fizikasining paydo bo'lishi", 6, 136),
    ("40_35-mavzu_Fotoelektrik_effekt_Fotonlar",
     "35-mavzu. Fotoelektrik effekt. Fotonlar", 6, 138),
    ("41_36-mavzu_Fotonning_impulsi_Yoruglik_bosimi",
     "36-mavzu. Fotonning impulsi. Yorug'lik bosimi. Fotoeffektdan foydalanish", 6, 143),
    ("42_VI_bob_test_va_yakunlash",
     "VI bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 6, 148),

    # VII BOB. ATOM VA YADRO FIZIKASI. ATOM ENERGETIKASINING FIZIK ASOSLARI
    ("43_37-mavzu_Atomning_Bor_modeli_Bor_postulatlari",
     "37-mavzu. Atomning Bor modeli. Bor postulatlari", 7, 152),
    ("44_38-mavzu_Lazer_va_ularning_turlari",
     "38-mavzu. Lazer va ularning turlari", 7, 157),
    ("45_39-mavzu_Atom_yadrosining_tarkibi",
     "39-mavzu. Atom yadrosining tarkibi", 7, 161),
    ("46_40-mavzu_Radioaktiv_nurlanish_va_zarrachalarni_qayd_qilish",
     "40-mavzu. Radioaktiv nurlanishni va zarralarni qayd qiluvchi asboblar", 7, 165),
    ("47_41-mavzu_Radioaktiv_yemirilish_qonuni",
     "41-mavzu. Radioaktiv yemirilish qonuni", 7, 168),
    ("48_42-mavzu_Yadro_reaksiyalari_Siljish_qonuni",
     "42-mavzu. Yadro reaksiyalari. Siljish qonuni", 7, 171),
    ("49_43-mavzu_Elementar_zarralar",
     "43-mavzu. Elementar zarralar", 7, 174),
    ("50_44-mavzu_Atom_energetikasining_fizik_asoslari",
     "44-mavzu. Atom energetikasining fizik asoslari", 7, 178),
    ("51_45-mavzu_Ozbekistonda_yadro_fizikasi",
     "45-mavzu. O'zbekistonda yadro fizikasi sohasidagi tadqiqotlar", 7, 183),
    ("52_VII_bob_test_va_yakunlash",
     "VII bob bo'yicha test topshiriqlari va eng muhim tushunchalar", 7, 186),

    # OXIRGI
    ("53_Foydalanilgan_adabiyotlar_Mundarija",
     "Foydalanilgan adabiyotlar va Mundarija", 0, 190),
]

print("11-sinf Fizika darsligini import qilish boshlandi...")
print("=" * 60)

# grade=11 AND subject='Zamonaviy Fizika' bo'yicha qidirish
# (Astronomiya grade=11 dan alohida)
try:
    darslik = Darslik.objects.get(grade=11, subject='Zamonaviy Fizika')
    created = False
    print(f"ℹ️  Mavjud Darslik topildi: {darslik}")
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")
except Darslik.DoesNotExist:
    darslik = Darslik.objects.create(
        grade=11,
        subject='Zamonaviy Fizika',
        subtitle='Magnit maydon, Elektromagnit hodisalar, Kvant va Yadro fizikasi',
        icon='⚛️',
        color='#818cf8',
        accent='#4f46e5',
        formulas=['E = hν', 'E = mc²', 'ΔN = -λN·Δt'],
        chapters=7,
        pages=192,
        is_published=True,
        order=6,
    )
    created = True
    print(f"✅ Yangi Darslik yaratildi: 11-sinf Zamonaviy Fizika (ID={darslik.id})")

if not created:
    darslik.subject  = 'Zamonaviy Fizika'
    darslik.subtitle = 'Magnit maydon, Elektromagnit hodisalar, Kvant va Yadro fizikasi'
    darslik.icon     = '⚛️'
    darslik.color    = '#818cf8'
    darslik.accent   = '#4f46e5'
    darslik.formulas = ['E = hν', 'E = mc²', 'ΔN = -λN·Δt']
    darslik.chapters = 7
    darslik.pages    = 192
    darslik.is_published = True
    darslik.order    = 6
    darslik.save()

ok = 0
errors = 0

for order_idx, (prefix, mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    src_file = os.path.join(SOURCE_DIR, f"{prefix}.pdf")
    if not os.path.exists(src_file):
        print(f"❌ Fayl topilmadi: {src_file}")
        errors += 1
        continue

    dest_filename = f"11sinf_fizika_{prefix}.pdf"
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
