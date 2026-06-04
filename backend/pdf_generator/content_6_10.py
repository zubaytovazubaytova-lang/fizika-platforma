# pdf_generator/content_6_10.py
# VI–X BOB maruza matnlari

from .builder import (
    spacer, hr, formula_box, example_box,
    note_box, data_table, lecture_header,
    questions_block, summary_box, cover_page,
)
from reportlab.platypus import Paragraph, PageBreak


def build_bob6(st):
    """VI BOB — O'ZGARMAS TOK"""
    elems = []
    elems += cover_page(
        bob_num=6, bob_title="O'ZGARMAS TOK",
        subtitle="Om qonuni · Kircxoff · Joule–Lens · Yarimo'tkazgichlar",
        lessons=[
            "Elektr toki. Om qonuni. Qarshilik",
            "To'liq zanjir uchun Om qonuni. EYuK",
            "Kircxoff qoidalari. Murakkab zanjirlar",
            "Elektr quvvati. Joule–Lens qonuni",
            "Turli muhitlarda elektr toki. Yarimo'tkazgichlar",
        ], st=st,
    )

    elems.append(lecture_header(25, "Elektr toki va Om qonuni", 6, st))
    elems.append(Paragraph("25.1  Elektr tok", st["h2"]))
    elems.append(formula_box([
        "I = dq/dt = q/t   [A = Kl/s]",
        "Tok zichligi: j⃗ = nq v⃗d   [A/m²]",
        "I = ∫j⃗·dS⃗",
    ], st, desc_lines=[
        "n — zaryadli zarralar zichligi,  q — zaryad,  v_d — sürüklenmə tezligi",
        "Metall misda v_d ≈ 10⁻⁴ m/s (juda sekin!), signal tezligi ~c",
    ]))
    elems.append(Paragraph("25.2  Om qonuni (zanjir qismi)", st["h2"]))
    elems.append(formula_box([
        "U = I·R   (yoki  I = U/R,   R = U/I)",
        "R = ρ·l/S   [Ω]",
        "R(T) = R₀·[1 + α·(T−T₀)]",
    ], st, desc_lines=[
        "ρ — solishtirma qarshilik [Ω·m]",
        "l — o'tkazgich uzunligi [m],  S — kesim yuzasi [m²]",
        "α — haroriy koeffitsient [K⁻¹];  mis: α = 3.9×10⁻³ K⁻¹",
    ]))
    rows_rho = [
        ["Kumush (Ag)", "1.6×10⁻⁸", "Eng yaxshi o'tkazgich"],
        ["Mis (Cu)",    "1.7×10⁻⁸", "Kabellar"],
        ["Alyuminiy",   "2.8×10⁻⁸", "Yuqori kuchlanish liniyalari"],
        ["Temir (Fe)",  "1.0×10⁻⁷", "—"],
        ["Germaniy",    "4.6×10⁻¹", "Yarimo'tkazgich"],
        ["Silitsiy",    "6.4×10²",   "Yarimo'tkazgich"],
        ["Shisha",      "10¹⁰–10¹⁴","Dielektrik"],
    ]
    elems.append(data_table(["Material", "ρ (Ω·m)", "Izoh"], rows_rho, st,
                             col_widths=[130, 100, 220]))
    elems.append(Paragraph("25.3  Qarshiliklar ulanishi", st["h2"]))
    elems.append(formula_box([
        "Ketma-ket: R = R₁ + R₂ + R₃ + ...   (tok teng: I = const)",
        "Parallel:  1/R = 1/R₁ + 1/R₂ + ...  (kuchlanish teng: U = const)",
        "Ikki parallel: R = R₁R₂/(R₁+R₂)",
    ], st))

    elems.append(lecture_header(26, "To'liq zanjir uchun Om qonuni. EYuK", 6, st))
    elems.append(Paragraph("26.1  EYuK va tok manbai", st["h2"]))
    elems.append(Paragraph(
        "Elektr yurituvchi kuch (EYuK) — manba ichida zaryadni ko'chirish uchun "
        "sarf bo'ladigan eneriy. O'lchov birligi Volt.", st["body"]))
    elems.append(formula_box([
        "ε = A_sторonних/q₀   [V]",
        "To'liq zanjir: I = ε / (R + r)",
        "Terminal kuchlanish: U = ε − I·r = I·R",
    ], st, desc_lines=[
        "ε — EYuK (manba),  r — manba ichki qarshiligi",
        "R — tashqi qarshilik",
        "Qisqa tutashuv (R=0): I_max = ε/r",
    ]))
    elems.append(example_box("26-misol: Akkumulyator",
        "Avtomobil akkumulyatori: ε = 12 V, r = 0.05 Ω. "
        "Startyor R = 0.2 Ω iste'mol qiladi. I va terminal kuchlanish.",
        ["I = ε/(R+r) = 12/(0.2+0.05) = 12/0.25 = 48 A",
         "U = ε − Ir = 12 − 48·0.05 = 12 − 2.4 = 9.6 V",
         "Qisqa tutashuv: I_max = 12/0.05 = 240 A (xavfli!)"], st))

    elems.append(lecture_header(27, "Kircxoff qoidalari", 6, st))
    elems.append(formula_box([
        "1-qoida (tugun): ΣI_k = 0   (kirayotganlar + chiqayotganlar = 0)",
        "2-qoida (kontur): Σε_k = ΣI_k·R_k   (kontur bo'ylab)",
    ], st, desc_lines=[
        "Qoida: tugun uchun kirayotgan tok '+', chiqayotgan '−'",
        "Kontur uchun: tok yo'nalishi bilan EYuK '+', aksi '−'",
    ]))
    elems.append(note_box(
        "Kircxoff qoidalari zanjirdagi noma'lum toklarni topish uchun ishlatiladi. "
        "n ta tugun va m ta keng uchun: (n−1) tugun tenglamasi + (m−n+1) kontur tenglamasi.", st))

    elems.append(lecture_header(28, "Elektr quvvati. Joule–Lens qonuni", 6, st))
    elems.append(formula_box([
        "Elektr quvvati: P = U·I = I²·R = U²/R   [W]",
        "Joule–Lens: Q = I²·R·t   [J]",
        "Tok manbaning foydali quvvati: P_foydali = I²·R",
        "FIK: η = R/(R+r) = P_foydali/P_umumiy",
    ], st, desc_lines=["Quvvat R = r da maksimal bo'ladi (maksimal quvvat teoremasi)."]))

    elems.append(lecture_header(29, "Turli muhitlarda tok. Yarimo'tkazgichlar", 6, st))
    elems.append(Paragraph("29.1  Elektrolizda tok", st["h2"]))
    elems.append(formula_box([
        "Faradeyning 1-qonuni: m = k·q = k·I·t",
        "Faradeyning 2-qonuni: k = M/(n·F),   F = 96485 Kl/mol",
    ], st, desc_lines=["m — ajralgan modda massasi, n — valentlik, M — molyar massa"]))
    elems.append(Paragraph("29.2  Yarimo'tkazgichlar", st["h2"]))
    elems.append(Paragraph(
        "Si va Ge yarimo'tkazgichlarda harorat oshganda o'tkazuvchanlik ortadi "
        "(metallardan farqli). Aralashma qo'shish bilan p va n tiplar hosil qilinadi.", st["body"]))
    elems.append(formula_box([
        "p-n o'tish to'g'ri o'tkazishida: I ≈ I₀·(e^(eU/kT) − 1)",
        "I₀ — qorong'i tok;  kT/e ≈ 26 mV (300 K da)",
    ], st))
    elems.append(summary_box([
        "Om qonuni: U = IR,  R = ρl/S",
        "To'liq zanjir: I = ε/(R+r),  U_terminal = IR",
        "Kircxoff: ΣI=0 (tugun),  Σε=ΣIR (kontur)",
        "Joule–Lens: Q = I²Rt",
        "Elektroliz: m = kIt = MIt/(nF)",
        "p-n o'tish — diod asosi",
    ], st))
    elems.append(questions_block([
        "R₁=2Ω, R₂=3Ω, R₃=6Ω parallel. Umumiy qarshilik va U=12V da har birida tok.",
        "ε=9V, r=1Ω, R=8Ω. Terminal kuchlanish va manba FIK.",
        "Elektr isitgich 1000W, 220V. Qarshilik va 8 soatda sarflangan energiya.",
        "Nima uchun yarimo'tkazgichda harorat oshganda qarshilik kamayadi?",
        "Mis elektroliz: I=5A, t=2saat. Ajralgan mis massasi (M=64, n=2).",
    ], st))
    return elems


def build_bob7(st):
    """VII BOB — MAGNIT MAYDON"""
    elems = []
    elems += cover_page(
        bob_num=7, bob_title="MAGNIT MAYDON",
        subtitle="Bio–Savar · Amper kuchi · Lorens kuchi · Elektromagnit induksiya",
        lessons=[
            "Magnit maydon. Bio–Savar–Laplas qonuni",
            "Amper qonuni. Tokli o'tkazgichlarning o'zaro ta'siri",
            "Lorens kuchi. Zaryadli zarralar magnit maydonda",
            "Elektromagnit induksiya. Faraday qonuni",
            "O'zinduksiya. Induktivlik. Energiya",
        ], st=st,
    )

    elems.append(lecture_header(30, "Magnit maydon. Bio–Savar–Laplas qonuni", 7, st))
    elems.append(Paragraph("30.1  Magnit maydon", st["h2"]))
    elems.append(Paragraph(
        "Harakatlanuvchi zaryadlar va toklar o'z atrofida magnit maydon hosil qiladi. "
        "Magnit maydon magnit induksiya vektori B⃗ bilan tavsiflanadi.", st["body"]))
    elems.append(formula_box([
        "Bio–Savar–Laplas: dB⃗ = (μ₀/4π)·I·dl⃗×r̂/r²",
        "μ₀ = 4π×10⁻⁷ H/m  (magnit doimiy)",
        "B birligi: Tesla [T = Wb/m² = kg/(A·s²)]",
    ], st))
    rows_b = [
        ["Cheksiz to'g'ri sim",   "B = μ₀I/(2πr)",    "r — simdan masofa"],
        ["Halqa markazi",          "B = μ₀I/(2R)",      "R — halqa radiusi"],
        ["Solenoid ichida",        "B = μ₀nI",          "n = N/l — birikmalar/m"],
        ["Toroid ichida",          "B = μ₀NI/(2πr)",    "N — umumiy burmalar soni"],
    ]
    elems.append(data_table(["Tizim", "Formula", "Izoh"], rows_b, st,
                             col_widths=[180, 160, 110]))

    elems.append(lecture_header(31, "Amper va Lorens kuchlari", 7, st))
    elems.append(formula_box([
        "Amper kuchi: dF⃗ = I·dl⃗ × B⃗",
        "To'g'ri o'tkazgich: F = BIl·sinα",
        "Lorens kuchi: F⃗ = q·v⃗ × B⃗",
        "|F_Lorens| = q·v·B·sinα",
    ], st, desc_lines=[
        "Lorens kuchi ish bajarmaydi! Chunki F⃗ ⊥ v⃗ — energiya saqlanadi",
        "Zarracha magnit maydonda aylana (v⃗⊥B⃗) yoki spiral bo'ylab harakat qiladi",
    ]))
    elems.append(formula_box([
        "Aylana radiusi: r = mv/(qB)",
        "Siklotron chastotasi: ω_c = qB/m   (tezlikka bog'liq emas!)",
        "Xoll effekti: U_H = IB/(nqd)",
    ], st, desc_lines=["Siklotron — zarrachalar tezlatgichi asosi"]))
    elems.append(example_box("31-misol: Elektronning spiral harakati",
        "Elektron B = 0.5 T maydonida v = 2×10⁷ m/s (B ga ⊥) tezlik bilan "
        "uchadi. Aylana radiusi va siklotron chastotasini toping.",
        ["r = mv/(eB) = 9.11×10⁻³¹·2×10⁷/(1.6×10⁻¹⁹·0.5)",
         "= 1.82×10⁻²³/8×10⁻²⁰ = 2.28×10⁻⁴ m ≈ 0.23 mm",
         "ω_c = eB/m = 1.6×10⁻¹⁹·0.5/9.11×10⁻³¹ = 8.78×10¹⁰ rad/s",
         "ν_c = ω_c/(2π) ≈ 14 GHz — mikroto'lqin diapazon!"], st))

    elems.append(lecture_header(32, "Elektromagnit induksiya. Faraday qonuni", 7, st))
    elems.append(formula_box([
        "Magnit oqim: Φ = ∫B⃗·dS⃗ = B·S·cosα   [Wb = V·s]",
        "Faraday: ε = −dΦ/dt   [V]",
        "Lenz qoidasi: induksiya toki asosiy oqim o'zgarishiga qarshilik ko'rsatadi",
        "Harakat EYuK: ε = Blv (v⃗⊥B⃗⊥l)",
    ], st))

    elems.append(lecture_header(33, "O'zinduksiya va induktivlik", 7, st))
    elems.append(formula_box([
        "O'z magnit oqimi: Φ = LI",
        "O'zinduksiya EYuK: ε = −L·dI/dt   [V]",
        "Solenoid: L = μ₀n²V = μ₀N²S/l   [H = Wb/A]",
        "Toqdagi energiya: W = LI²/2   [J]",
    ], st, desc_lines=[
        "L — induktivlik [Genri = H]",
        "Misol: 1000 burmali solenoid L = μ₀·10⁶·S/l",
    ]))
    elems.append(example_box("33-misol: Toqdagi energiya",
        "L = 0.1 H induktivlikka ega g'altakdan I = 10 A tok o'tyapti. "
        "G'altakda to'plangan energiya va tok birdan uzilsa hosil bo'ladigan kuchlanish "
        "(τ = 10⁻³ s).",
        ["W = LI²/2 = 0.1·100/2 = 5 J",
         "ε = −L·ΔI/Δt = −0.1·(0−10)/10⁻³ = +1000 V",
         "Bu katta kuchlanish — shuning uchun induktiv yukni o'chirish xavfli!"], st))
    elems.append(summary_box([
        "B = μ₀nI (solenoid), B = μ₀I/(2πr) (sim)",
        "F_Amper = BIl·sinα,  F_Lorens = qvB·sinα",
        "Lorens kuchi ish bajarmaydi",
        "Faraday: ε = −dΦ/dt  (Lenz qoidasi bilan)",
        "O'zinduksiya: ε = −L·dI/dt,  W = LI²/2",
    ], st))
    elems.append(questions_block([
        "Lorens kuchi nima uchun ish bajarmaydi?",
        "Tezlik 2 marta oshsa magnit maydonda aylana radiusi qanday o'zgaradi?",
        "Solenoidga Fe o'zak kiritilsa B va L qanday o'zgaradi?",
        "Magnit oqim o'zgarmasa induksiya EYuK hosil bo'ladimi?",
        "I = 5 A, L = 0.2 H. G'altakdagi energiya va I = 0 ga tushirishda ε (Δt = 0.01 s).",
    ], st))
    return elems


def build_bob8(st):
    """VIII BOB — ELEKTROMAGNIT INDUKSIYA VA O'ZGARUVCHAN TOK"""
    elems = []
    elems += cover_page(
        bob_num=8, bob_title="O'ZGARUVCHAN TOK VA ELEKTROMAGNIT TO'LQINLAR",
        subtitle="O'zaro induksiya · RLC zanjir · Rezonans · Maksvell tenglamalari",
        lessons=[
            "O'zaro induksiya. Transformator",
            "O'zgaruvchan tok. R, L, C elementlar",
            "Ketma-ket RLC zanjiri. Rezonans",
            "O'zgaruvchan tok quvvati. Transformator va uzatish",
            "Maksvell tenglamalari. Elektromagnit to'lqinlar",
        ], st=st,
    )

    elems.append(lecture_header(34, "O'zaro induksiya va transformator", 8, st))
    elems.append(formula_box([
        "O'zaro induksiya: ε₂ = −M·dI₁/dt",
        "M = k·√(L₁·L₂),   0 ≤ k ≤ 1   (ulanish koeffitsienti)",
        "Ideal transformator: U₁/U₂ = N₁/N₂ = I₂/I₁",
        "FIK ideal transformer: η = 1 (real: 0.95–0.99)",
    ], st, desc_lines=["M — o'zaro induktivlik [H];  N₁, N₂ — birlamchi/ikkilamchi burmalar"]))

    elems.append(lecture_header(35, "O'zgaruvchan tok asoslari", 8, st))
    elems.append(formula_box([
        "e(t) = E₀·cos(ωt),   i(t) = I₀·cos(ωt − φ)",
        "RMS (effektiv) qiymat: U_rms = U₀/√2,   I_rms = I₀/√2",
        "Uy tarmog'i: U₀ = 220√2 ≈ 311 V (amplituda!)",
    ], st))
    rows_rlc = [
        ["Rezistor R", "U va I bir fazada (φ=0)", "Z = R",         "P = I²R"],
        ["Katushka L", "U tok oldida π/2",         "X_L = ωL",     "P = 0 (reaktiv)"],
        ["Kondensator C","U tok ortida π/2",        "X_C = 1/(ωC)", "P = 0 (reaktiv)"],
    ]
    elems.append(data_table(["Element", "Faza", "Reaktans", "Quvvat"],
                             rows_rlc, st, col_widths=[90, 155, 100, 105]))

    elems.append(lecture_header(36, "Ketma-ket RLC zanjiri. Rezonans", 8, st))
    elems.append(formula_box([
        "Impedans: Z = √(R² + (X_L − X_C)²)",
        "Faza: tanφ = (X_L − X_C)/R",
        "Tok: I₀ = U₀/Z",
        "Rezonans sharti: X_L = X_C  →  ω₀ = 1/√(LC)",
        "Rezonansda: Z = R (minimal!),  I = U/R (maksimal!),  φ = 0",
        "Sifat koeff.: Q = ω₀L/R = 1/(ω₀CR) = √L/(R√C)",
    ], st))
    elems.append(example_box("36-misol: Radio qabul qilish",
        "Radio qabul qiluvchi: C ni o'zgartirib ω₀ = 1/√(LC) ni sozlaydi. "
        "L = 0.1 mH, f = 100 MHz ga sozlash uchun C ni toping.",
        ["ω₀ = 2πf = 2π·10⁸ rad/s",
         "C = 1/(ω₀²L) = 1/((2π·10⁸)²·10⁻⁴)",
         "= 1/(3.95·10¹⁶·10⁻⁴) = 1/(3.95·10¹²) ≈ 0.25 pF",
         "Bu juda kichik kondensator — FM radioda odatiy qiymat"], st))

    elems.append(lecture_header(37, "O'zgaruvchan tok quvvati", 8, st))
    elems.append(formula_box([
        "Faol quvvat: P = U_rms·I_rms·cosφ   [W]",
        "Reaktiv quvvat: Q = U_rms·I_rms·sinφ   [VAR]",
        "To'liq quvvat: S = U_rms·I_rms   [VA]",
        "S² = P² + Q²",
        "cosφ — quvvat koeffitsienti (1 ga yaqin bo'lishi yaxshi!)",
    ], st))

    elems.append(lecture_header(38, "Maksvell tenglamalari", 8, st))
    elems.append(formula_box([
        "1. ∮E⃗·dS⃗ = Q_ich/ε₀        (Gauss elektr)",
        "2. ∮B⃗·dS⃗ = 0               (Gauss magnit — monopol yo'q)",
        "3. ∮E⃗·dl⃗ = −dΦ_B/dt        (Faraday)",
        "4. ∮B⃗·dl⃗ = μ₀(I + ε₀dΦ_E/dt)  (Amper–Maksvell)",
    ], st, desc_lines=[
        "Ko'chma tok: j_k = ε₀·∂E/∂t  (Maksvell, 1861)",
        "EM to'lqin tezligi: c = 1/√(μ₀ε₀) = 3×10⁸ m/s  ← bu yorug'lik!",
    ]))
    elems.append(formula_box([
        "Elektromagnit to'lqin: E va B ko'ndalang va bir fazada",
        "Umov–Poyinting vektori: S⃗ = (1/μ₀)·E⃗×B⃗   [W/m²]",
        "c = E₀/B₀   (amplitudalar nisbati)",
    ], st))
    rows_em = [
        ["Radio to'lqin",   "> 1 mm",       "< 300 GHz",   "Telekommunikatsiya"],
        ["Mikroto'lqin",    "1 mm–1 m",     "300 MHz–300GHz","Radar, pech"],
        ["Infraqizil",      "700 nm–1 mm",  "300 GHz–430 THz","Issiqlik"],
        ["Ko'rinadigan",    "380–760 nm",   "430–790 THz",  "Ko'z"],
        ["Ultrabinafsha",   "10–380 nm",    "790–30 000 THz","Dezinfeksiya"],
        ["Rentgen",         "0.01–10 nm",   "30 PHz–30 EHz","Tibbiyot"],
        ["Gamma",           "< 0.01 nm",    "> 30 EHz",     "Yadro"],
    ]
    elems.append(data_table(["Tur", "To'lqin uzunligi", "Chastota", "Qo'llanilish"],
                             rows_em, st, col_widths=[100, 100, 110, 140]))
    elems.append(summary_box([
        "Transformator: U₁/U₂ = N₁/N₂",
        "RLC rezonans: ω₀ = 1/√(LC), Z_min = R",
        "Quvvat: P = UI·cosφ",
        "Maksvell 4 tenglamasi → EM to'lqin → c = 1/√(μ₀ε₀)",
        "EM spektr: radio → mikro → IR → ko'rinadigan → UV → X → γ",
    ], st))
    elems.append(questions_block([
        "Transformatorning ikkilamchi chulg'amida tok katta bo'lsa birinchisida qanday?",
        "Elektr tarmog'ida cosφ = 0.7. Quvvat koeffitsientini 0.95 ga oshirish uchun nima kerak?",
        "Radiostation f = 1 MHz da ishlaydi. L = 10 μH bo'lsa C qanday?",
        "Ko'chma tok nima? Uni Maksvell qanday kiritdi?",
        "Nima uchun EM to'lqin vakuumda tarqala oladi?",
    ], st))
    return elems


def build_bob9(st):
    """IX BOB — OPTIKA"""
    elems = []
    elems += cover_page(
        bob_num=9, bob_title="OPTIKA",
        subtitle="Geometrik optika · Interferensiya · Difraksiya · Qutblanish",
        lessons=[
            "Yorug'likning tabiatı. Geometrik optika qonunlari",
            "Sferik ko'zgular va linzalar",
            "Yorug'lik interferensiyasi. Kogerentlik",
            "Yorug'likning difraksiyasi. Difraksion panjara",
            "Yorug'likning qutblanishi. Tarqalishi",
        ], st=st,
    )

    elems.append(lecture_header(39, "Yorug'likning tabiatı. Geometrik optika", 9, st))
    elems.append(Paragraph("39.1  Yorug'likning elektromagnit tabiati", st["h2"]))
    elems.append(formula_box([
        "c = 2.998×10⁸ m/s ≈ 3×10⁸ m/s (vakuumda)",
        "Ko'rinadigan spektr: 380 nm (binafsha) — 760 nm (qizil)",
        "Moddada: v = c/n,   n — sindirish ko'rsatkichi (n ≥ 1)",
    ], st))
    elems.append(Paragraph("39.2  Geometrik optika qonunlari", st["h2"]))
    elems.append(formula_box([
        "Qaytish qonuni: θ_i = θ_r   (tushish burchagi = qaytish burchagi)",
        "Snell (sinish) qonuni: n₁·sinθ₁ = n₂·sinθ₂",
        "To'liq aks ettirish: sinθ_kritik = n₂/n₁  (n₁ > n₂ bo'lganda)",
    ], st, desc_lines=[
        "Suvda to'liq aks: θ_k = arcsin(1/1.33) ≈ 48.8°",
        "Optik tolalar — to'liq aks ettirish asosida ishlaydi",
    ]))

    elems.append(lecture_header(40, "Sferik ko'zgular va linzalar", 9, st))
    elems.append(formula_box([
        "Ko'zgu tenglamasi: 1/d_o + 1/d_i = 1/f = 2/R",
        "Kattalik: M = −d_i/d_o",
        "Yupqa linza tenglamasi: 1/f = (n−1)·(1/R₁ − 1/R₂)",
        "Linza uchun: 1/d_o + 1/d_i = 1/f",
        "Linza kuchi: D = 1/f   [Dioptri]",
    ], st, desc_lines=[
        "f > 0 — to'plovchi (konveks) linza yoki botiq ko'zgu",
        "f < 0 — tarqatuvchi (konkav) linza yoki qavariq ko'zgu",
    ]))
    elems.append(example_box("40-misol: Ko'z va ko'zoynak",
        "Qisqa ko'zlik uchun uzoq nuqta 2 m da. Ko'zoynak (f qanday?) "
        "cheksizlikdagi predmetni ko'rish uchun kerak.",
        ["Ko'z 2 m dagi predmetni ko'ra oladi → d_i sabit",
         "Cheksizlikdagi predmet d_o = ∞ → 1/f = 1/∞ + 1/d_i",
         "Korreksiya linzasi: 1/f_linza = 1/∞ − 1/2 = −0.5",
         "f = −2 m → D = −0.5 Dioptri (tarqatuvchi linza)"], st))
    rows_optic = [
        ["Ko'z",        "f ~ 17 mm", "D = 0–70 Dioptri", "Moslashuvchi"],
        ["Ko'zoynak",   "f o'zgaruvchan", "D = ±0.25...±20 D", "Korreksiya"],
        ["Kamera",      "f = 35–300 mm", "M < 1",         "Tasvirni kichraytiradi"],
        ["Mikroskop",   "f_obj = 2–5 mm", "M = 100–1500x", "Kichik ob'ektlar"],
        ["Teleskop",    "f_ob = 1–10 m",  "M = 20–1000x", "Uzoq ob'ektlar"],
    ]
    elems.append(data_table(["Asbob", "Fokus", "Kattalik", "Izoh"],
                             rows_optic, st, col_widths=[90, 120, 130, 110]))

    elems.append(lecture_header(41, "Yorug'lik interferensiyasi", 9, st))
    elems.append(Paragraph(
        "Interferensiya — ikkita kogerent to'lqin superpozitviyasida intensivlikning "
        "makoniy taqsimlanishi. Kogerent to'lqinlar bir xil chastota va doimiy faza "
        "farqiga ega bo'lishi kerak.", st["body"]))
    elems.append(formula_box([
        "Yo'l farqi: Δ = r₂ − r₁",
        "Maksimum (kuchaytirish): Δ = mλ,   m = 0, ±1, ±2, ...",
        "Minimum (so'nish):      Δ = (m+½)λ",
        "Yung tajribasi — tasmalar kengligi: Δx = λL/d",
    ], st, desc_lines=[
        "L — ekran masofasi [m],  d — tirqishlar oralig'i [m]",
        "Misol: λ=550nm, L=2m, d=0.5mm → Δx = 550·10⁻⁹·2/5·10⁻⁴ = 2.2 mm",
    ]))

    elems.append(lecture_header(42, "Difraksiya. Qutblanish", 9, st))
    elems.append(formula_box([
        "Bitta tirqish minimum: a·sinθ = mλ",
        "Difraksion panjara asosiy maksimum: d·sinθ = mλ",
        "Panjara ajrish qobiliyati: R = mN",
    ], st, desc_lines=[
        "a — tirqish eni,  d — panjara davri = 1/N (N — 1 mm dagi chiziqlar soni)",
        "Tipik panjara: 600 chiziq/mm → d = 1.67 μm",
    ]))
    elems.append(formula_box([
        "Brewster burchagi (to'liq qutblanish): tanθ_B = n₂/n₁",
        "Malus qonuni: I = I₀·cos²θ",
    ], st, desc_lines=["θ — analizator va polyarizator o'qlari orasidagi burchak"]))
    elems.append(summary_box([
        "Snell: n₁sinθ₁ = n₂sinθ₂; To'liq aks: θ_k = arcsin(n₂/n₁)",
        "Linza: 1/do + 1/di = 1/f,  D = 1/f [Dioptri]",
        "Interferensiya: Δ = mλ (max),  Δ = (m+½)λ (min)",
        "Yung: Δx = λL/d",
        "Panjara: d·sinθ = mλ",
        "Brewster: tanθ_B = n₂/n₁",
    ], st))
    elems.append(questions_block([
        "Nima uchun optik tolada yorug'lik yo'qolmaydi?",
        "Yupqa sovun pardasida interferensiya. Ko'rinadigan tasmalar kengligi 2 mm, "
        "λ = 550 nm, L = 1 m. d ni toping.",
        "Brewster burchagida qanday yorug'lik to'liq qutblanadi?",
        "Mikroskop va teleskopdagi ob'ektiv linzalar farqi qanday?",
        "Ko'k yorug'lik qizil yorug'likdan qanday difraksiyalanadi?",
    ], st))
    return elems


def build_bob10(st):
    """X BOB — MAXSUS NISBIYLIK NAZARIYASI"""
    elems = []
    elems += cover_page(
        bob_num=10, bob_title="MAXSUS NISBIYLIK NAZARIYASI",
        subtitle="Eynshteyn postulatlari · Lorens · E = mc² · Relyativistik dinamika",
        lessons=[
            "Klassik mexanikaning muammolari. Maykelson tajribasi",
            "Eynshteyn postulatlari. Lorens almashtirishlari",
            "Vaqt kengayishi va uzunlikning qisqarishi",
            "Tezliklarni nisbiy qo'shish",
            "Relyativistik dinamika. E = mc²",
        ], st=st,
    )

    elems.append(lecture_header(43, "Maykelson tajribasi va nisbiylik postulatlari", 10, st))
    elems.append(Paragraph("43.1  Klassik fizikaning muammosi", st["h2"]))
    elems.append(Paragraph(
        "XIX asr oxirida yorug'likning efir orqali tarqalishi taxmin qilinardi. "
        "Maykelson va Morli (1887) tajribasi efirni topishga urinish edi, "
        "lekin natija nol bo'ldi — efir yo'q!", st["body"]))
    elems.append(Paragraph("43.2  Eynshteyn postulatlari (1905)", st["h2"]))
    for p in [
        "1. NISBIYLIK PRINSIPI: Barcha inersial sanash sistemalarida fizika "
        "qonunlari (mexanika va elektrodinamika) bir xil ko'rinishga ega.",
        "2. YORUG'LIK TEZLIGI DOIMIYSI: Yorug'lik tezligi c barcha inersial "
        "sistemalarda bir xil (manbaga va kuzatuvchiga bog'liq emas).",
    ]:
        elems.append(Paragraph(p, st["bullet"]))
    elems.append(note_box(
        "Galiley almashtirishlari v << c uchun to'g'ri, lekin c ga yaqin "
        "tezliklarda Lorens almashtirishlari qo'llanilishi kerak.", st, "warning"))

    elems.append(lecture_header(44, "Lorens almashtirishlari", 10, st))
    elems.append(formula_box([
        "x' = γ(x − Vt)",
        "t' = γ(t − Vx/c²)",
        "y' = y,   z' = z",
        "Lorens gammasi: γ = 1/√(1−β²),   β = V/c",
    ], st, desc_lines=[
        "V — sistemalar o'rtasidagi nisbiy tezlik",
        "γ ≥ 1 (tenglik: V = 0 da)",
        "β = 0.9 → γ = 2.29;   β = 0.99 → γ = 7.09;   β = 0.999 → γ = 22.4",
    ]))

    elems.append(lecture_header(45, "Vaqt kengayishi va uzunlikning qisqarishi", 10, st))
    elems.append(formula_box([
        "Vaqt kengayishi:  Δt = γ·Δt₀  ≥  Δt₀",
        "Uzunlikning qisqarishi:  l = l₀/γ  ≤  l₀",
    ], st, desc_lines=[
        "Δt₀ — o'z vaqti (to'g'ri soat bilan o'lchangan)",
        "l₀ — to'g'ri uzunlik (jismga nisbatan tinch sistemada)",
        "Ikkalasi ham o'lchov qurilmasining kamchiligi emas, tabiatning o'zi shunday!",
    ]))
    elems.append(example_box("45-misol: Myuon tajribasi",
        "Kosmik nurlardan hosil bo'lgan myuonlar (T₀ = 2.2 μs umr ko'radi) "
        "v = 0.998c tezlikda h = 10 km balanddan tushadi. Ular yerga yetib keladimi?",
        ["Klassik: d = v·T₀ = 0.998·3·10⁸·2.2·10⁻⁶ = 659 m  (yetib kelmaydi!)",
         "γ = 1/√(1−0.998²) = 1/√(1−0.996) = 1/0.0632 ≈ 15.8",
         "Labaratoriya vaqti: Δt = γ·T₀ = 15.8·2.2·10⁻⁶ = 34.8 μs",
         "Bosib o'tilgan yo'l: d = 0.998·3·10⁸·34.8·10⁻⁶ ≈ 10.4 km  ✓ yetib keladi!",
         "Yoki myuon ko'zi bilan: uzunlik l = h/γ = 10000/15.8 ≈ 633 m  (kichik!)"], st))

    elems.append(lecture_header(46, "Relyativistik dinamika. E = mc²", 10, st))
    elems.append(formula_box([
        "Relyativistik impuls: p⃗ = γm₀v⃗",
        "To'liq energiya: E = γm₀c²",
        "Tinchlik energiyasi: E₀ = m₀c²",
        "Kinetik energiya: Ek = (γ−1)m₀c²",
        "Energiya-impuls invarianti: E² − (pc)² = (m₀c²)²",
    ], st, desc_lines=[
        "v << c:   Ek = (γ−1)m₀c² ≈ ½m₀v²  (klassik formulaga keladi)",
        "Foton: m₀ = 0  →  E = pc = hν",
        "c² = 9·10¹⁶ J/kg  →  1 kg = 9·10¹⁶ J (25 mlrd kWh!)",
    ]))
    elems.append(example_box("46-misol: Yadro energiyasi",
        "Uran-235 bo'linishida massa defekti Δm = 0.19% ga teng. "
        "1 kg ₂₃₅U ning to'liq bo'linishida ajraladigan energiya va u bilan ishlatiladigan "
        "ko'mir ekvivalenti (ko'mir yonish issiqligi 30 MJ/kg).",
        ["E = Δm·c² = 0.0019·1·(3·10⁸)² = 0.0019·9·10¹⁶ = 1.71·10¹⁴ J",
         "Ko'mir ekvivalenti: m = E/Q = 1.71·10¹⁴/3·10⁷ = 5.7·10⁶ kg = 5700 tonna",
         "Ya'ni 1 kg uran = 5700 tonna ko'mir!"], st))
    elems.append(summary_box([
        "Postulat: c = const barcha sistemalarda",
        "γ = 1/√(1−v²/c²) ≥ 1",
        "Vaqt kengayishi: Δt = γΔt₀;  uzunlik qisqarishi: l = l₀/γ",
        "Tezlik qo'shish: u = (v₁+v₂)/(1+v₁v₂/c²) < c",
        "E₀ = m₀c²,  Ek = (γ−1)m₀c²,  E² = (pc)² + (m₀c²)²",
    ], st))
    elems.append(questions_block([
        "Nima uchun yorug'lik tezligida harakat qilish mumkin emas?",
        "v = 0.6c da γ ni hisoblang. Vaqt qancha kengayadi?",
        "β = 0.8c da harakatlanuvchi 1 m uzunlikdagi qaymoq qanday ko'rinadi?",
        "Elektron Ek = 1 MeV (m₀c² = 0.511 MeV). γ va v ni toping.",
        "Antimoddadan atom bombasi: 1 g anti-vodorod + 1 g vodorod. E = ?",
    ], st))
    return elems
