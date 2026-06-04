"""
Umumiy Fizika kursi — barcha bo'limlar va mavzular import qilish.
Universitet darajasi (1-4 semestr).

Ishlatish: python import_umumiy_fizika.py  (backend/ papkasida)
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

import django
django.setup()

from darsliklar.models import Darslik, Mavzu

# ============================================================
#  UMUMIY FIZIKA KURSI — BARCHA BO'LIM VA MAVZULAR
#  (mavzu_nomi, bob_raqami, bet_boshi)
# ============================================================

MAVZULAR = [

    # ══════════════════════════════════════════════════════════
    #  I BOB — MEXANIKA
    # ══════════════════════════════════════════════════════════

    # 1. Kinematika
    ("1. Kirish. Fizikaning predmeti va tadqiqot metodlari",                   1,   1),
    ("2. Moddiy nuqta kinematikasi. Koordinatalar sistemasi",                   1,   5),
    ("3. Tezlik va tezlanish vektorlari",                                       1,   9),
    ("4. To'g'ri chiziqli tekis va notekis harakat",                            1,  13),
    ("5. Erkin tushish. Gorizontal otilgan jism harakati",                      1,  17),
    ("6. Qiya otish kinematikasi",                                              1,  21),
    ("7. Aylana bo'ylab harakat: burchak tezligi va tezlanishi",                1,  25),
    ("8. Nisbiy harakat. Galiley almashtirishlari",                             1,  29),

    # 2. Dinamika
    ("9.  Nyutonning birinchi qonuni. Inersiya tushunchasi",                    1,  33),
    ("10. Nyutonning ikkinchi qonuni. Kuch va massa",                           1,  37),
    ("11. Nyutonning uchinchi qonuni. O'zaro ta'sir",                           1,  41),
    ("12. Tortishish qonuni. Gravitatsiya maydoni",                             1,  45),
    ("13. Elastiklik kuchi. Guk qonuni",                                        1,  49),
    ("14. Ishqalanish kuchlari. Statik va dinamik ishqalanish",                 1,  53),
    ("15. Inersial bo'lmagan sanash sistemalari",                               1,  57),

    # 3. Saqlanish qonunlari
    ("16. Mexanik ish. Quvvat",                                                 1,  61),
    ("17. Kinetik va potensial energiya",                                       1,  65),
    ("18. Mexanik energiya saqlanish qonuni",                                   1,  69),
    ("19. Impuls. Impuls saqlanish qonuni",                                     1,  73),
    ("20. Jismlar to'qnashuvi. Elastik va noelastik to'qnashuv",                1,  77),
    ("21. Impuls momenti. Impuls momenti saqlanish qonuni",                     1,  81),

    # 4. Qattiq jism mexanikasi
    ("22. Qattiq jismning aylanma harakati dinamikasi",                         1,  85),
    ("23. Inersiya momenti. Parallel o'qlar teoremasi",                         1,  89),
    ("24. Kuch momenti. Aylanma harakat tenglamasi",                            1,  93),
    ("25. Aylanma harakat kinetik energiyasi",                                  1,  97),
    ("26. Giroskop. Pretsessiya",                                               1, 101),

    # 5. Deformatsiya va elastiklik
    ("27. Kuchlanish va deformatsiya. Guk qonunining umumiy shakli",            1, 105),
    ("28. Cho'zilish, siqilish, egilish, buralish",                             1, 109),
    ("29. Suyuqlikning oqishi. Bernulli tenglamasi",                            1, 113),
    ("30. Qovushqoqlik. Stoks qonuni",                                          1, 117),

    # ══════════════════════════════════════════════════════════
    #  II BOB — MEXANIK TEBRANISHLAR VA TO'LQINLAR
    # ══════════════════════════════════════════════════════════

    ("31. Erkin garmonik tebranishlar. Tebranish tenglamasi",                   2, 121),
    ("32. Matematik va prujinali mayatnik",                                     2, 125),
    ("33. So'nuvchi tebranishlar. So'nish dekrementi",                          2, 129),
    ("34. Majburiy tebranishlar. Rezonans hodisasi",                            2, 133),
    ("35. Avtotebranishlar. Garmonik bo'lmagan tebranishlar",                   2, 137),
    ("36. To'lqin tarqalishi. To'lqin tenglamasi",                              2, 141),
    ("37. Ko'ndalang va bo'ylama to'lqinlar",                                   2, 145),
    ("38. Tovush to'lqinlari. Tovush tezligi",                                  2, 149),
    ("39. Akustika. Ovoz intensivligi va sathı",                               2, 153),
    ("40. Doppler effekti. Udara to'lqinlari",                                  2, 157),
    ("41. Ultratovush va infratovush. Qo'llanilishi",                           2, 161),

    # ══════════════════════════════════════════════════════════
    #  III BOB — MOLEKULYAR FIZIKA
    # ══════════════════════════════════════════════════════════

    # 1. Molekulyar-kinetik nazariya asoslari
    ("42. Molekulyar-kinetik nazariya. Ideal gaz modeli",                       3, 165),
    ("43. Ideal gaz holat tenglamasi. Avogadro qonuni",                         3, 169),
    ("44. Molekulalarning o'rtacha kinetik energiyasi va harorat",              3, 173),
    ("45. Gaz bosimi va molekulalar soni zichligi",                             3, 177),
    ("46. Molekulalar tezligining Maksvel taqsimoti",                           3, 181),
    ("47. Bolsman taqsimoti. Barometrik formula",                               3, 185),
    ("48. Molekulalar erkin yugurish yo'li",                                    3, 189),

    # 2. Termodinamika asoslari
    ("49. Ichki energiya. Termodinamikaning 0-qonuni",                          3, 193),
    ("50. Termodinamikaning 1-qonuni. Issiqlik va ish",                         3, 197),
    ("51. Izoprosesslar: izobar, izoxor, izoterm",                              3, 201),
    ("52. Adiabatik jarayon. Politropa",                                        3, 205),
    ("53. Issiqlik sig'imi. Energiyaning taqsimlanish teoremasi",               3, 209),
    ("54. Termodinamikaning 2-qonuni. Entropiya",                               3, 213),
    ("55. Karnot sikli va FIK",                                                 3, 217),
    ("56. Qaytmas jarayonlar. Entropiya o'sish qonuni",                         3, 221),

    # 3. Real gazlar va suyuqliklar
    ("57. Real gazlar. Van-der-Vaals tenglamasi",                               3, 225),
    ("58. Joul-Tomson effekti. Gazlarni suyultirish",                           3, 229),
    ("59. Suyuqliklar. Yuzaki taranglik va kapillyarlik",                       3, 233),
    ("60. Qovushqoqlik. Diffuziya. Issiqlik o'tkazuvchanlik",                   3, 237),

    # 4. Qattiq jismlar
    ("61. Kristall va amorf jismlar. Panjara turlari",                          3, 241),
    ("62. Qattiq jismlarning mexanik xossalari",                                3, 245),
    ("63. Issiqlik kengayishi. Issiqlik sig'imi",                               3, 249),
    ("64. Fazalar muvozanati. Bug' bosimi",                                     3, 253),
    ("65. Erish va qaynash. Uch nuqta",                                         3, 257),

    # ══════════════════════════════════════════════════════════
    #  IV BOB — ELEKTROSTATIKA
    # ══════════════════════════════════════════════════════════

    ("66. Elektr zaryadlar. Zaryadning saqlanish qonuni",                       4, 261),
    ("67. Kulon qonuni. Superpozitsiya prinsipi",                               4, 265),
    ("68. Elektr maydon. Kuchlanganlik vektori",                                4, 269),
    ("69. Elektr maydon chiziqlari. Dipol maydoni",                             4, 273),
    ("70. Gauss teoremasi va uning qo'llanilishi",                              4, 277),
    ("71. Elektr maydon potensiali. Potensiallar farqi",                        4, 281),
    ("72. Ekvipotensial sirtlar. E va φ bog'liqligi",                           4, 285),
    ("73. O'tkazgichlar elektrostatikada. Ekranlash",                           4, 289),
    ("74. Kondensatorlar. Elektr sig'imi",                                      4, 293),
    ("75. Kondensatorlar ulanishi. Energiya",                                   4, 297),
    ("76. Dielektriklar. Qutblanish. Dielektrik singuvchanligi",                4, 301),
    ("77. Elektrostatik maydon energiyasi. Energiya zichligi",                  4, 305),

    # ══════════════════════════════════════════════════════════
    #  V BOB — O'ZGARMAS TOK
    # ══════════════════════════════════════════════════════════

    ("78. Elektr toki. Tok kuchi va zichligi",                                  5, 309),
    ("79. Zanjirning bir qismi uchun Om qonuni",                                5, 313),
    ("80. Qarshilik. Metallarning o'tkazuvchanligi",                            5, 317),
    ("81. To'liq zanjir uchun Om qonuni. EYuK",                                 5, 321),
    ("82. Kircxoff qoidalari. Murakkab zanjirlar",                              5, 325),
    ("83. Elektr quvvati. Joule–Lens qonuni",                                   5, 329),
    ("84. Tok manbaning FIK va quvvat balansi",                                 5, 333),
    ("85. Turli muhitlarda elektr toki: suyuqliklar, gazlar, vakuum",           5, 337),
    ("86. Yarimo'tkazgichlar. p-n o'tish",                                      5, 341),

    # ══════════════════════════════════════════════════════════
    #  VI BOB — MAGNIT MAYDON
    # ══════════════════════════════════════════════════════════

    ("87. Magnit maydon. Magnit induksiya vektori B",                           6, 345),
    ("88. Bio–Savar–Laplas qonuni va uning qo'llanilishi",                      6, 349),
    ("89. Amper qonuni. Tokli o'tkazgichlarga ta'sir",                          6, 353),
    ("90. Lorens kuchi. Zaryadli zarraning magnit maydondagi harakati",         6, 357),
    ("91. Tokli o'tkazgichlarning o'zaro ta'siri. Amperning ta'rifi",          6, 361),
    ("92. Gauss teoremasi magnit maydon uchun. Magnit oqimi",                   6, 365),
    ("93. Moddalarning magnit xossalari. Para-, dia-, ferromagnetiklar",        6, 369),
    ("94. Magnit maydon energiyasi va energiya zichligi",                       6, 373),

    # ══════════════════════════════════════════════════════════
    #  VII BOB — ELEKTROMAGNIT INDUKSIYA
    # ══════════════════════════════════════════════════════════

    ("95. Elektromagnit induksiya hodisasi. Faraday qonuni",                    7, 377),
    ("96. O'zinduksiya. Induktivlik koeffitsienti",                             7, 381),
    ("97. O'zaro induksiya. Transformator",                                     7, 385),
    ("98. O'zgaruvchan tok. Amplituda, chastota, faza",                         7, 389),
    ("99. O'zgaruvchan tok zanjiri: R, L, C elementlar",                        7, 393),
    ("100. RLC zanjirida rezonans",                                             7, 397),
    ("101. Elektr energiyasini uzatish. Transformator",                         7, 401),
    ("102. Maksvell tenglamalari. Elektromagnit to'lqinlar",                    7, 405),
    ("103. Elektromagnit to'lqinlarning xossalari va tarqalishi",               7, 409),

    # ══════════════════════════════════════════════════════════
    #  VIII BOB — OPTIKA
    # ══════════════════════════════════════════════════════════

    # 1. Geometrik optika
    ("104. Yorug'likning tabiyati. Elektromagnit spektr",                       8, 413),
    ("105. Yorug'likning to'g'ri chiziqli tarqalishi. Soya va yarim soya",      8, 417),
    ("106. Yorug'likning qaytishi. Ko'zgu va tekis ko'zgu formulasi",           8, 421),
    ("107. Yorug'likning sinishi. Snell qonuni",                                8, 425),
    ("108. To'liq ichki aks ettirish. Optik tolalar",                           8, 429),
    ("109. Sferik ko'zgular. Fokuslash va kattalik",                            8, 433),
    ("110. Linzalar. Ingiz linzalar tenglamasi",                                8, 437),
    ("111. Linza xatoliklari (aberratsiyalar)",                                 8, 441),
    ("112. Optik asboblar: ko'z, ko'zoynak, mikroskop, teleskop",              8, 445),

    # 2. To'lqin optikasi
    ("113. Yorug'lik interferensiyasi. Kogerentlik",                            8, 449),
    ("114. Yupqa qavatda interferensiya. Nyuton halqalari",                     8, 453),
    ("115. Yorug'likning difraksiyasi. Guygen-Frenel prinsipi",                 8, 457),
    ("116. Bitta tirqishdan difraksiya. Difraksion panjara",                    8, 461),
    ("117. Yorug'likning tarqalishi. Rayleigh qonuni",                          8, 465),
    ("118. Yorug'likning qutblanishi. Brewster burchagi",                       8, 469),
    ("119. Ikki o'qli kristallar. Optik faollik",                               8, 473),
    ("120. Holografiya asoslari",                                               8, 477),

    # ══════════════════════════════════════════════════════════
    #  IX BOB — MAXSUS NISBIYLIK NAZARIYASI
    # ══════════════════════════════════════════════════════════

    ("121. Nisbiylik nazariyasining postulatlari. Maykelson tajribasi",         9, 481),
    ("122. Lorens almashtirishlari. Vaqt va uzunlik nisbiylik",                 9, 485),
    ("123. Nisbiylikdagi kinetik energiya va impuls",                           9, 489),
    ("124. Energiya va massa ekvivalentligi. E = mc²",                          9, 493),
    ("125. Nisbiy dinamika qonunlari",                                          9, 497),

    # ══════════════════════════════════════════════════════════
    #  X BOB — KVANT OPTIKA VA ATOM FIZIKASI
    # ══════════════════════════════════════════════════════════

    ("126. Issiqlik nurlanishi. Stefan-Bolsman va Vin qonunlari",               10, 501),
    ("127. Plank formulasi. Kvant gipotezasi",                                  10, 505),
    ("128. Fotoeffekt. Eynshteyn tenglamasi",                                   10, 509),
    ("129. Komptonlar sochilishi",                                              10, 513),
    ("130. De Broyl to'lqinlari. To'lqin-zarracha dualizmi",                    10, 517),
    ("131. Geyzenberg noaniqlik munosabati",                                    10, 521),
    ("132. Shnedinger tenglamasi. Kvant holatlar",                              10, 525),
    ("133. Tunel effekti. Potensial to'siq",                                    10, 529),
    ("134. Atom Bohr modeli. Vodorod spektri",                                  10, 533),
    ("135. Kvant sonlar. Orbital, spin va magnit kvant sonlar",                 10, 537),
    ("136. Pauli prinsipi. Elektronlarning tartiblanishi",                      10, 541),
    ("137. Davriy sistema va elektron konfiguratsiyalar",                       10, 545),
    ("138. Rentgen nurlari. Moseley qonuni",                                    10, 549),
    ("139. Lazerlar. Induktsiyalangan nurlanish. Lazer turlari",                10, 553),

    # ══════════════════════════════════════════════════════════
    #  XI BOB — QATTIQ JISM FIZIKASI
    # ══════════════════════════════════════════════════════════

    ("140. Kristall panjaralar turlari. X-nur difraksiyasi",                    11, 557),
    ("141. Metallar klassik nazariyasi. Druye modeli",                         11, 561),
    ("142. Elektron gaz kvant nazariyasi. Fermi energiyasi",                    11, 565),
    ("143. Zolalar nazariyasi: o'tkazgich, yarimo'tkazgich, dielektrik",       11, 569),
    ("144. Intrinsik va aralashma yarimo'tkazgichlar",                          11, 573),
    ("145. p-n o'tish. Diod, tranzistor ishlash prinsipi",                      11, 577),
    ("146. Supero'tkazuvchanlik. Meysner effekti",                              11, 581),

    # ══════════════════════════════════════════════════════════
    #  XII BOB — YADRO FIZIKASI
    # ══════════════════════════════════════════════════════════

    ("147. Atom yadrosi tuzilishi. Proton va neytron",                          12, 585),
    ("148. Yadro kuchlari. Bog'lanish energiyasi",                              12, 589),
    ("149. Radioaktiv yemirilish. Alpha, beta, gamma nurlanishi",               12, 593),
    ("150. Radioaktiv yemirilish qonuni. Yarim yemirilish davri",               12, 597),
    ("151. Yadro reaksiyalari. Q-qiymat",                                       12, 601),
    ("152. Yadro bo'linishi. Zanjirli reaksiya. Reaktorlar",                    12, 605),
    ("153. Termoyadro sintezi. Plazma va tokamak",                              12, 609),
    ("154. Ionlashtiruvchi nurlanish va biologik ta'sir",                       12, 613),
    ("155. Dozimetriya. Himoya usullari",                                       12, 617),

    # ══════════════════════════════════════════════════════════
    #  XIII BOB — ELEMENTAR ZARRALAR
    # ══════════════════════════════════════════════════════════

    ("156. Elementar zarralar tasnifi. Leptonlar, mezonlar, baryonlar",        13, 621),
    ("157. Zarrachalar akseleratorlari. Detektor asboblari",                   13, 625),
    ("158. Kvarklarning modeli. Rangiy zaряad",                                13, 629),
    ("159. Fundamental ta'sir turlari va ularning birlashtiruvchi nazariyalari",13, 633),
    ("160. Standart model. Zamonaviy fizikaning muammolari",                   13, 637),
]


# ============================================================
#  DATABASE GA YOZISH
# ============================================================

print("Umumiy Fizika kursi import qilinmoqda...")
print("=" * 65)

darslik, created = Darslik.objects.get_or_create(
    grade=0,
    subject='Umumiy Fizika',
    defaults={
        'subtitle': 'Mexanika · Termodinamika · Elektr · Optika · Kvant · Yadro',
        'icon':     '🔬',
        'color':    '#6366f1',
        'accent':   '#4f46e5',
        'formulas': [
            'F = ma',
            'E = mc²',
            'ΔU = Q − A',
            'rot E = −∂B/∂t',
            'E = hν',
        ],
        'chapters': 13,
        'pages':    640,
        'is_published': True,
        'order':    0,
    }
)

if created:
    print("✅ Yangi kurs yaratildi: Umumiy Fizika")
else:
    print(f"ℹ️  Mavjud kurs topildi: {darslik}")
    deleted = darslik.mavzu_set.all().delete()
    print(f"   Eski mavzular o'chirildi: {deleted[0]} ta")

ok = 0
for order_idx, (mavzu_nomi, bob, bet) in enumerate(MAVZULAR):
    Mavzu.objects.create(
        darslik=darslik,
        mavzu=mavzu_nomi,
        bet=bet,
        bob=bob,
        order=order_idx,
    )
    print(f"  [{order_idx+1:03d}] BOB {bob:02d} | {mavzu_nomi[:60]}")
    ok += 1

print()
print("=" * 65)
print(f"✅ Jami kiritildi: {ok} ta mavzu")
print(f"📚 Darslik ID: {darslik.id}")
print(f"📖 DB dagi mavzular: {darslik.mavzu_set.count()} ta")
print()
print("Bob bo'yicha taqsimot:")
bob_counts: dict[int, int] = {}
for _, bob, _ in MAVZULAR:
    bob_counts[bob] = bob_counts.get(bob, 0) + 1

BOB_NOMLAR = {
    1:  "Mexanika",
    2:  "Mexanik tebranishlar va to'lqinlar",
    3:  "Molekulyar fizika va termodinamika",
    4:  "Elektrostatika",
    5:  "O'zgarmas tok",
    6:  "Magnit maydon",
    7:  "Elektromagnit induksiya",
    8:  "Optika",
    9:  "Maxsus nisbiylik nazariyasi",
    10: "Kvant optika va atom fizikasi",
    11: "Qattiq jism fizikasi",
    12: "Yadro fizikasi",
    13: "Elementar zarralar",
}
for b in sorted(bob_counts):
    print(f"   {b:2d}-bob | {BOB_NOMLAR.get(b, '?'):<45} — {bob_counts[b]} mavzu")
