"""
7-sinf Fizika — Quiz testlarini bazaga qo'shish.
Ishlatish (backend/ papkasida):
    python manage.py add_7sinf_quizzes
"""
from django.core.management.base import BaseCommand
from tests.models import Quiz, Question, Choice


# ═══════════════════════════════════════════════════════════════════════════════
#  7-SINF FIZIKA — TO'LIQ QUIZ MA'LUMOTLARI
# ═══════════════════════════════════════════════════════════════════════════════

QUIZZES_7SINF = [

    # ─── 1-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Fizik kattaliklar va SI birliklari",
        "description": "I bob: Fizik kattaliklar, xalqaro SI tizimi, skalyar va vektor kattaliklar",
        "time_limit_minutes": 15,
        "pass_score": 60,
        "questions": [
            {
                "text": "Xalqaro birliklar sistemasi (SI) qachon qabul qilingan?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1960-yilda", True),
                    ("1945-yilda", False),
                    ("1975-yilda", False),
                    ("1900-yilda", False),
                ]
            },
            {
                "text": "SI da uzunlikning asosiy birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Metr (m)", True),
                    ("Santimetr (sm)", False),
                    ("Millimetr (mm)", False),
                    ("Kilometr (km)", False),
                ]
            },
            {
                "text": "SI da massaning asosiy birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Kilogramm (kg)", True),
                    ("Gramm (g)", False),
                    ("Tonna (t)", False),
                    ("Milligram (mg)", False),
                ]
            },
            {
                "text": "Vaqtning SI dagi asosiy birligi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Sekund (s)", True),
                    ("Minut (min)", False),
                    ("Soat (h)", False),
                    ("Millisekund (ms)", False),
                ]
            },
            {
                "text": "Skalyar kattalik deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Faqat son qiymatiga ega bo'lgan kattaliklariga", True),
                    ("Son qiymati va yo'nalishiga ega bo'lgan kattaliklarga", False),
                    ("Faqat yo'nalishga ega bo'lgan kattaliklarga", False),
                    ("O'lchovga ega bo'lmagan kattaliklarga", False),
                ]
            },
            {
                "text": "Quyidagilardan qaysi biri vektor kattaliklariga misol bo'ladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Tezlik", True),
                    ("Temperatura", False),
                    ("Massa", False),
                    ("Vaqt", False),
                ]
            },
            {
                "text": "1 km = ? m",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1000 m", True),
                    ("100 m", False),
                    ("10 m", False),
                    ("10 000 m", False),
                ]
            },
            {
                "text": "Fizikada tadqiqot metodlariga quyidagilardan qaysilari kiradi?",
                "type": "multiple",
                "points": 2,
                "choices": [
                    ("Kuzatish", True),
                    ("Tajriba o'tkazish", True),
                    ("Nazariya yaratish", True),
                    ("Ovqat pishirish", False),
                ]
            },
            {
                "text": "Al-Beruniy qaysi asrdagi O'rta Osiyo olimi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("X–XI asrlar", True),
                    ("VII–VIII asrlar", False),
                    ("XIV–XV asrlar", False),
                    ("XVI–XVII asrlar", False),
                ]
            },
            {
                "text": "Fizik kattalikni o'lchash uchun nima zarur?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("O'lchov birligi va o'lchov asbobi", True),
                    ("Faqat o'lchov birligi", False),
                    ("Faqat o'lchov asbobi", False),
                    ("Matematik formula", False),
                ]
            },
        ]
    },

    # ─── 2-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Mexanik harakat va kinematika",
        "description": "I bob: Mexanik harakat, tekis va notekis harakat, tezlik, yo'l",
        "time_limit_minutes": 20,
        "pass_score": 60,
        "questions": [
            {
                "text": "Mexanik harakat deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Jismning vaqt o'tishi bilan fazodagi o'rnini o'zgartirishi", True),
                    ("Jismning shakli o'zgarishi", False),
                    ("Jismning massasi o'zgarishi", False),
                    ("Jismning harorati o'zgarishi", False),
                ]
            },
            {
                "text": "Tekis harakat deganda nima tushuniladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Tezligi o'zgarmas harakat", True),
                    ("Yo'li o'zgarmas harakat", False),
                    ("Vaqti o'zgarmas harakat", False),
                    ("Tezligi ortib boruvchi harakat", False),
                ]
            },
            {
                "text": "Tekis harakatda yo'l formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("s = v · t", True),
                    ("s = v / t", False),
                    ("s = v + t", False),
                    ("s = v² · t", False),
                ]
            },
            {
                "text": "Tezlikning SI dagi birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("m/s (metr/sekund)", True),
                    ("km/h (kilometr/soat)", False),
                    ("sm/s (santimetr/sekund)", False),
                    ("m/min (metr/minut)", False),
                ]
            },
            {
                "text": "Jism 5 sekundda 100 metr yo'l bosib o'tdi. Tezligi qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("20 m/s", True),
                    ("500 m/s", False),
                    ("10 m/s", False),
                    ("0,05 m/s", False),
                ]
            },
            {
                "text": "Notekis harakat — bu ...",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Tezligi o'zgarib boruvchi harakat", True),
                    ("Tezligi doimiy bo'lgan harakat", False),
                    ("Jism to'xtab-to'xtab harakatlanishi", False),
                    ("Faqat aylana bo'ylab harakat", False),
                ]
            },
            {
                "text": "O'rtacha tezlik formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("v = s / t", True),
                    ("v = t / s", False),
                    ("v = s · t", False),
                    ("v = s − t", False),
                ]
            },
            {
                "text": "Aylana bo'ylab harakatda tezlik vektori qaysi tomonga yo'nalgan?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Aylana teginmasiga (tangent) yo'nalgan", True),
                    ("Markazga qarab yo'nalgan", False),
                    ("Markazdan uzoqlashish yo'nalishida", False),
                    ("Pastga yo'nalgan", False),
                ]
            },
            {
                "text": "20 m/s tezlik bilan harakatlanayotgan jism 4 sekundda qancha yo'l bosadi?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("80 m", True),
                    ("5 m", False),
                    ("24 m", False),
                    ("16 m", False),
                ]
            },
            {
                "text": "Kinematika nima bilan shug'ullanadi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Jismlar harakatini kuch sabablarisiz tavsiflash", True),
                    ("Harakatga sabab bo'lgan kuchlarni o'rganish", False),
                    ("Jismlar shakli o'zgarishini o'rganish", False),
                    ("Fizik kimyoviy jarayonlarni o'rganish", False),
                ]
            },
            {
                "text": "Harakatni tavsiflovchi asosiy kattaliklar qaysilar?",
                "type": "multiple",
                "points": 2,
                "choices": [
                    ("Yo'l (s)", True),
                    ("Tezlik (v)", True),
                    ("Vaqt (t)", True),
                    ("Temperatura (T)", False),
                ]
            },
            {
                "text": "Moddiy nuqta deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("O'lchami e'tiborga olinmaydigan jism", True),
                    ("Og'irligi bo'lmagan jism", False),
                    ("Faqat nuqta ko'rinishidagi jism", False),
                    ("Massasi nol bo'lgan jism", False),
                ]
            },
        ]
    },

    # ─── 3-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Massa, zichlik va kuch",
        "description": "II bob: Jismning massasi, zichligi, o'zaro ta'sir va kuch tushunchasi",
        "time_limit_minutes": 20,
        "pass_score": 60,
        "questions": [
            {
                "text": "Massa deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Jismdagi moddaning miqdorini ko'rsatuvchi skalyar kattaliк", True),
                    ("Jismdagi moddaning miqdorini ko'rsatuvchi vektor kattaliк", False),
                    ("Jismning og'irligini ko'rsatuvchi kattaliк", False),
                    ("Jism hajmini ko'rsatuvchi kattaliк", False),
                ]
            },
            {
                "text": "Massaning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Kilogramm (kg)", True),
                    ("Gramm (g)", False),
                    ("Tonna (t)", False),
                    ("Litr (L)", False),
                ]
            },
            {
                "text": "Zichlik formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("ρ = m / V", True),
                    ("ρ = V / m", False),
                    ("ρ = m · V", False),
                    ("ρ = m + V", False),
                ]
            },
            {
                "text": "Zichlikning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("kg/m³", True),
                    ("g/sm³", False),
                    ("kg/L", False),
                    ("t/m²", False),
                ]
            },
            {
                "text": "Suvning zichligi taxminan qancha?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1000 kg/m³", True),
                    ("100 kg/m³", False),
                    ("500 kg/m³", False),
                    ("2000 kg/m³", False),
                ]
            },
            {
                "text": "Kuch deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Jismlarning o'zaro ta'sirini miqdoriy ifodalovchi vektor kattaliк", True),
                    ("Jismlarning o'zaro ta'sirini miqdoriy ifodalovchi skalyar kattaliк", False),
                    ("Jism massasini o'zgartiruvchi kattaliк", False),
                    ("Jism tezligini aniqlash usuli", False),
                ]
            },
            {
                "text": "Kuchning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Nyuton (N)", True),
                    ("Joule (J)", False),
                    ("Watt (W)", False),
                    ("Pascal (Pa)", False),
                ]
            },
            {
                "text": "Hajmi 2 m³ bo'lgan jismning massasi 500 kg. Zichligi qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("250 kg/m³", True),
                    ("1000 kg/m³", False),
                    ("2,5 kg/m³", False),
                    ("0,004 kg/m³", False),
                ]
            },
            {
                "text": "Zichligiga ko'ra temir suvdan og'irroq. Bu nima degani?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Temir suvda cho'kadi", True),
                    ("Temir suvda suzadi", False),
                    ("Temir suv bilan aralashadi", False),
                    ("Temir suv bilan reaksiyaga kirishadi", False),
                ]
            },
            {
                "text": "Jismning massasi qaysi asbob bilan o'lchanadi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Tarozi (tarozи, dinamometr)", True),
                    ("Termometr", False),
                    ("Barometr", False),
                    ("Voltmetr", False),
                ]
            },
        ]
    },

    # ─── 4-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Bosim: qattiq jism, suyuqlik va gaz",
        "description": "II bob: Bosim formulasi, suyuqlik va gazlarda bosim, atmosfera bosimi",
        "time_limit_minutes": 20,
        "pass_score": 60,
        "questions": [
            {
                "text": "Bosim formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("P = F / S", True),
                    ("P = S / F", False),
                    ("P = F · S", False),
                    ("P = F − S", False),
                ]
            },
            {
                "text": "Bosimning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Pascal (Pa)", True),
                    ("Nyuton (N)", False),
                    ("Joule (J)", False),
                    ("Kilogramm (kg)", False),
                ]
            },
            {
                "text": "1 Pa = ?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1 N/m²", True),
                    ("1 N·m", False),
                    ("1 kg/m", False),
                    ("1 J/s", False),
                ]
            },
            {
                "text": "Paskal qonuni nima deydi?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("Suyuqlik yoki gazga berilgan bosim hamma tomonga bir xil uzatiladi", True),
                    ("Suyuqlik faqat pastga bosim uzatadi", False),
                    ("Gaz faqat idish devorlariga bosim o'tkazadi", False),
                    ("Bosim faqat qattiq jismlarda uzatiladi", False),
                ]
            },
            {
                "text": "Tinch holatdagi suyuqlik bosimi formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("P = ρ · g · h", True),
                    ("P = m · g", False),
                    ("P = ρ · h", False),
                    ("P = g / h", False),
                ]
            },
            {
                "text": "Atmosfera bosimining normal qiymati taxminan qancha?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("101 325 Pa (≈101 kPa)", True),
                    ("1 000 Pa", False),
                    ("1 000 000 Pa", False),
                    ("500 Pa", False),
                ]
            },
            {
                "text": "Atmosfera bosimini birinchi bo'lib kim o'lchagan?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Evangelista Torricelli", True),
                    ("Isaak Nyuton", False),
                    ("Galileo Galiley", False),
                    ("Blaise Paskal", False),
                ]
            },
            {
                "text": "Sirt maydoni 0,5 m² ga 100 N kuch tushirilsa, bosim qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("200 Pa", True),
                    ("50 Pa", False),
                    ("0,005 Pa", False),
                    ("600 Pa", False),
                ]
            },
            {
                "text": "Gidravlik press qaysi qonunga asoslanadi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Paskal qonuniga", True),
                    ("Arximed qonuniga", False),
                    ("Nyutonning II qonuniga", False),
                    ("Energiya saqlanish qonuniga", False),
                ]
            },
            {
                "text": "Nima uchun tog'da pishirish yer yuzasiga qaraganda qiyinroq?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("Tog'da atmosfera bosimi past bo'lgani uchun suv past temperaturada qaynaydi", True),
                    ("Tog'da havо sovuq bo'lgani uchun", False),
                    ("Tog'da suv tez bug'lanadi", False),
                    ("Tog'da gravitatsiya kuchli", False),
                ]
            },
        ]
    },

    # ─── 5-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Mexanik ish va energiya",
        "description": "II bob: Mexanik ish, quvvat, kinetik va potensial energiya, energiya saqlanish qonuni",
        "time_limit_minutes": 20,
        "pass_score": 60,
        "questions": [
            {
                "text": "Mexanik ish formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("A = F · s · cos α", True),
                    ("A = F / s", False),
                    ("A = m · g", False),
                    ("A = v · t", False),
                ]
            },
            {
                "text": "Mexanik ishning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Joule (J)", True),
                    ("Nyuton (N)", False),
                    ("Watt (W)", False),
                    ("Pascal (Pa)", False),
                ]
            },
            {
                "text": "1 J = ?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1 N · m", True),
                    ("1 kg · m/s", False),
                    ("1 N / m", False),
                    ("1 kg · m²/s", False),
                ]
            },
            {
                "text": "Quvvat formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("N = A / t", True),
                    ("N = A · t", False),
                    ("N = F · t", False),
                    ("N = t / A", False),
                ]
            },
            {
                "text": "Quvvatning SI birligi nima?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Watt (W)", True),
                    ("Joule (J)", False),
                    ("Nyuton (N)", False),
                    ("Pascal (Pa)", False),
                ]
            },
            {
                "text": "Kinetik energiya formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Ek = mv²/2", True),
                    ("Ek = mgh", False),
                    ("Ek = Fs", False),
                    ("Ek = mv", False),
                ]
            },
            {
                "text": "Potensial energiya formulasi qaysi? (yerdan h balandlikda)",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Ep = mgh", True),
                    ("Ep = mv²/2", False),
                    ("Ep = Fh", False),
                    ("Ep = mgh²", False),
                ]
            },
            {
                "text": "Energiya saqlanish qonuni nima deydi?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("Energiya yo'qdan bor bo'lmaydi, barqaror sistemada umumiy energiya o'zgarmaydi", True),
                    ("Energiya doimo kamayib boradi", False),
                    ("Kinetik energiya doimo potensial energiyadan katta", False),
                    ("Energiya faqat issiqlik shaklida saqlanadi", False),
                ]
            },
            {
                "text": "100 N kuch bilan jismni 5 m ko'chirsak, bajarilgan ish qancha? (α=0°)",
                "type": "single",
                "points": 2,
                "choices": [
                    ("500 J", True),
                    ("20 J", False),
                    ("105 J", False),
                    ("50 J", False),
                ]
            },
            {
                "text": "Massa 2 kg, tezlik 10 m/s bo'lsa, kinetik energiya qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("100 J", True),
                    ("20 J", False),
                    ("200 J", False),
                    ("10 J", False),
                ]
            },
            {
                "text": "Quyidagilardan qaysilari energiya turlariga misol bo'ladi?",
                "type": "multiple",
                "points": 2,
                "choices": [
                    ("Kinetik energiya", True),
                    ("Potensial energiya", True),
                    ("Issiqlik energiyasi", True),
                    ("Harakat formulasi", False),
                ]
            },
            {
                "text": "Kuch harakatga perpendikulyar yo'nalsa, bajarilgan ish qancha bo'ladi?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("0 J (nol)", True),
                    ("F · s", False),
                    ("Maksimal bo'ladi", False),
                    ("Manfiy bo'ladi", False),
                ]
            },
        ]
    },

    # ─── 6-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "Nyuton qonunlari va oddiy mexanizmlar",
        "description": "Dinamika: Nyutonning I, II, III qonunlari. Richag, blok, tekislik — oddiy mexanizmlar",
        "time_limit_minutes": 25,
        "pass_score": 60,
        "questions": [
            {
                "text": "Nyutonning I qonuni (inersiya qonuni) nima deydi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Kuch ta'sir etmasa jism tinchlик holatini yoki tekis harakatini saqlab qoladi", True),
                    ("Jismga qo'yilgan kuch massasiga teng", False),
                    ("Ta'sir va qayta ta'sir kuchlari teng", False),
                    ("Harakat tezlashishi kuchga tескари proportsional", False),
                ]
            },
            {
                "text": "Nyutonning II qonuni formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("F = m · a", True),
                    ("F = m / a", False),
                    ("F = m + a", False),
                    ("F = a / m", False),
                ]
            },
            {
                "text": "Nyutonning III qonuni nima deydi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Har bir ta'sirga unga teng va qarama-qarshi yo'nalishdagi qayta ta'sir mavjud", True),
                    ("Jism tezligi kuchga proportsional", False),
                    ("Massa va tezlanish o'rtasida teskari bog'liqlik bor", False),
                    ("Kuch va yo'l o'rtasida to'g'ri proporsional bog'liqlik bor", False),
                ]
            },
            {
                "text": "Inersiya deb nimaga aytiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Jismning o'z harakat holatini saqlab qolishga intilishi", True),
                    ("Jismning tezlanishi", False),
                    ("Jismga ta'sir etayotgan kuch", False),
                    ("Jismning massasi", False),
                ]
            },
            {
                "text": "5 kg massali jismga 20 N kuch ta'sir etsa, tezlanish qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("4 m/s²", True),
                    ("100 m/s²", False),
                    ("0,25 m/s²", False),
                    ("15 m/s²", False),
                ]
            },
            {
                "text": "Richag — bu ...",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Bir nuqtaga tayanib aylanuvchi qattiq tayoq yoki taхta", True),
                    ("Yuk ko'taruvchi ip", False),
                    ("Harakatlanuvchi blok", False),
                    ("Qiyalangan tekislik", False),
                ]
            },
            {
                "text": "Richag muvozanat sharti qaysi?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("F₁ · l₁ = F₂ · l₂", True),
                    ("F₁ + l₁ = F₂ + l₂", False),
                    ("F₁ / l₁ = F₂ + l₂", False),
                    ("F₁ · F₂ = l₁ · l₂", False),
                ]
            },
            {
                "text": "Harakatlanuvchi blok kuchni necha marta kamaytiradi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("2 marta", True),
                    ("4 marta", False),
                    ("3 marta", False),
                    ("O'zgarmaydi", False),
                ]
            },
            {
                "text": "Oddiy mexanizmlarga qaysilar kiradi?",
                "type": "multiple",
                "points": 2,
                "choices": [
                    ("Richag", True),
                    ("Blok", True),
                    ("Qiyalik tekislik", True),
                    ("Termometr", False),
                ]
            },
            {
                "text": "Og'irlik kuchi formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("G = m · g  (g ≈ 9,8 N/kg)", True),
                    ("G = m / g", False),
                    ("G = m + g", False),
                    ("G = g / m", False),
                ]
            },
            {
                "text": "Massa 3 kg bo'lsa, og'irlik kuchi qancha? (g = 10 N/kg)",
                "type": "single",
                "points": 2,
                "choices": [
                    ("30 N", True),
                    ("3 N", False),
                    ("300 N", False),
                    ("0,3 N", False),
                ]
            },
            {
                "text": "Nyuton kimning sharafiga nomlangan?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Isaak Nyuton (ingliz fizigi, 1643–1727)", True),
                    ("Nikola Tesla", False),
                    ("Albert Eynshteyn", False),
                    ("Galileo Galiley", False),
                ]
            },
        ]
    },

    # ─── 7-QUIZ ─────────────────────────────────────────────────────────────
    {
        "title": "7-sinf Yakuniy test",
        "description": "Barcha boblar bo'yicha: kinematika, dinamika, bosim, ish va energiya",
        "time_limit_minutes": 30,
        "pass_score": 55,
        "questions": [
            {
                "text": "Tezlik formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("v = s / t", True),
                    ("v = t / s", False),
                    ("v = s · t", False),
                    ("v = s − t", False),
                ]
            },
            {
                "text": "Massasi 4 kg, tezlanishi 3 m/s² bo'lsa, kuch qancha?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("12 N", True),
                    ("7 N", False),
                    ("1,33 N", False),
                    ("0,75 N", False),
                ]
            },
            {
                "text": "Bosim formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("P = F / S", True),
                    ("P = F · S", False),
                    ("P = S / F", False),
                    ("P = m · g", False),
                ]
            },
            {
                "text": "Mexanik ish birligi — Joule. 1 J = ?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("1 N · m", True),
                    ("1 kg · m", False),
                    ("1 W / s", False),
                    ("1 N / m", False),
                ]
            },
            {
                "text": "Zichlik formulasi qaysi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("ρ = m / V", True),
                    ("ρ = V / m", False),
                    ("ρ = m · V", False),
                    ("ρ = F / S", False),
                ]
            },
            {
                "text": "Paskal qonuni qayerda ishlatiladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Gidravlik preslarda", True),
                    ("Elektr motorlarda", False),
                    ("Issiqlik dvigatellarida", False),
                    ("Lazerli asboblarda", False),
                ]
            },
            {
                "text": "Potensial energiyasi katta bo'lishi uchun jism qanday bo'lishi kerak?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Balandda yoki siqilgan/cho'zilgan holatda bo'lishi kerak", True),
                    ("Tez harakat qilishi kerak", False),
                    ("Katta massaga ega bo'lishi kerak (balandlikdan qat'i nazar)", False),
                    ("Issiq bo'lishi kerak", False),
                ]
            },
            {
                "text": "Nyutonning II qonuni formulasidan: massa 10 kg, kuch 50 N bo'lsa, tezlanish?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("5 m/s²", True),
                    ("500 m/s²", False),
                    ("0,2 m/s²", False),
                    ("40 m/s²", False),
                ]
            },
            {
                "text": "Harakatlanuvchi blokda ip kuchi yukdan necha marta kichik bo'ladi?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("2 marta", True),
                    ("3 marta", False),
                    ("4 marta", False),
                    ("1 marta (o'zgarmaydi)", False),
                ]
            },
            {
                "text": "Atmosfera bosimining birligini ko'rsating:",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Pascal (Pa)", True),
                    ("Nyuton (N)", False),
                    ("Joule (J)", False),
                    ("Watt (W)", False),
                ]
            },
            {
                "text": "Energiya saqlanish qonuniga ko'ra, yopiq sistemada...",
                "type": "single",
                "points": 2,
                "choices": [
                    ("Umumiy mexanik energiya o'zgarmaydi", True),
                    ("Kinetik energiya doimo ortadi", False),
                    ("Potensial energiya yo'qoladi", False),
                    ("Energiya har doim kamayib boradi", False),
                ]
            },
            {
                "text": "Richag muvozanati uchun qaysi tenglama to'g'ri?",
                "type": "single",
                "points": 2,
                "choices": [
                    ("F₁ · l₁ = F₂ · l₂", True),
                    ("F₁ + F₂ = l₁ + l₂", False),
                    ("F₁ / F₂ = l₁ + l₂", False),
                    ("F₁ · F₂ = l₁ + l₂", False),
                ]
            },
            {
                "text": "Inersiya qonunini kim kashf etgan?",
                "type": "single",
                "points": 1,
                "choices": [
                    ("Isaak Nyuton", True),
                    ("Albert Eynshteyn", False),
                    ("Galileo Galiley (birinchi ta'riflagan)", True),  # ikkalasi to'g'ri
                    ("Aristotel", False),
                ]
            },
            {
                "text": "Quyidagi kattaliklar orasidan vektor kattalikni aniqlang:",
                "type": "multiple",
                "points": 2,
                "choices": [
                    ("Kuch (F)", True),
                    ("Tezlik (v)", True),
                    ("Massa (m)", False),
                    ("Temperatura (T)", False),
                ]
            },
            {
                "text": "200 N kuch bilan 10 m yo'l bosib o'tilsa, mexanik ish qancha? (cos0°=1)",
                "type": "single",
                "points": 2,
                "choices": [
                    ("2000 J", True),
                    ("20 J", False),
                    ("210 J", False),
                    ("190 J", False),
                ]
            },
        ]
    },
]


# ═══════════════════════════════════════════════════════════════════════════════
class Command(BaseCommand):
    help = "7-sinf Fizika quiz testlarini bazaga qo'shadi"

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Avvalgi 7-sinf testlarini o\'chirib, yangidan qo\'shadi',
        )

    def handle(self, *args, **options):
        if options['clear']:
            deleted, _ = Quiz.objects.filter(
                title__in=[q["title"] for q in QUIZZES_7SINF]
            ).delete()
            self.stdout.write(self.style.WARNING(f"  {deleted} ta eski test o'chirildi"))

        created_count = 0
        question_count = 0
        choice_count = 0

        for quiz_data in QUIZZES_7SINF:
            # Quiz mavjudligini tekshirish
            if Quiz.objects.filter(title=quiz_data["title"]).exists():
                self.stdout.write(
                    self.style.WARNING(f"  [!]  Mavjud (o'tkazildi): {quiz_data['title']}")
                )
                continue

            # Quiz yaratish
            quiz = Quiz.objects.create(
                title=quiz_data["title"],
                description=quiz_data["description"],
                grade=7,
                time_limit_minutes=quiz_data["time_limit_minutes"],
                pass_score=quiz_data["pass_score"],
            )
            created_count += 1

            # Savollarni qo'shish
            for order, q_data in enumerate(quiz_data["questions"], start=1):
                question = Question.objects.create(
                    quiz=quiz,
                    text=q_data["text"],
                    question_type=q_data["type"],
                    points=q_data["points"],
                    order=order,
                )
                question_count += 1

                # Javob variantlarini qo'shish
                for choice_text, is_correct in q_data["choices"]:
                    Choice.objects.create(
                        question=question,
                        text=choice_text,
                        is_correct=is_correct,
                    )
                    choice_count += 1

            total_q = len(quiz_data["questions"])
            self.stdout.write(
                self.style.SUCCESS(
                    f"  [OK] {quiz.title}  ({total_q} savol, {quiz_data['time_limit_minutes']} daqiqa)"
                )
            )

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"TAYYOR! "
            f"{created_count} ta quiz | "
            f"{question_count} ta savol | "
            f"{choice_count} ta javob varianti bazaga qo'shildi."
        ))
