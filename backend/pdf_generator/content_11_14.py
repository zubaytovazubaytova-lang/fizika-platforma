# pdf_generator/content_11_14.py
# XI–XIV BOB maruza matnlari

from .builder import (
    spacer, hr, formula_box, example_box,
    note_box, data_table, lecture_header,
    questions_block, summary_box, cover_page,
)
from reportlab.platypus import Paragraph


def build_bob11(st):
    """XI BOB — KVANT MEXANIKASI VA ATOM FIZIKASI"""
    elems = []
    elems += cover_page(
        bob_num=11, bob_title="KVANT MEXANIKASI VA ATOM FIZIKASI",
        subtitle="Plank · Fotoeffekt · De Broyl · Shnedinger · Bohr · Lazer",
        lessons=[
            "Kvant optika: issiqlik nurlanishi va fotoeffekt",
            "To'lqin-zarracha dualizmi. Geyzenberg noaniqlik munosabati",
            "Shnedinger tenglamasi. Kvant holatlari",
            "Atom Bohr modeli. Kvant sonlar va Pauli prinsipi",
            "Lazerlar va induktsiyalangan nurlanish",
        ], st=st,
    )

    elems.append(lecture_header(47, "Kvant optika: nurlanish va fotoeffekt", 11, st))
    elems.append(Paragraph("47.1  Issiqlik nurlanishi muammosi", st["h2"]))
    elems.append(Paragraph(
        "XIX asr oxirida qora jism nurlanishi klassik fizika bilan ziddiyat tug'dirdi "
        "(«ultraviolet falokat»). Plank (1900) kvant gipotezasi bilan muammoni hal qildi:", st["body"]))
    elems.append(formula_box([
        "Plank formulasi: B(ν,T) = (2hν³/c²) / (e^(hν/kT) − 1)",
        "h = 6.626×10⁻³⁴ J·s  (Plank konstantasi)",
        "Stefan–Bolsman: R = σT⁴,   σ = 5.67×10⁻⁸ W/(m²·K⁴)",
        "Vin ko'chishi: λ_max·T = b = 2.898×10⁻³ m·K",
    ], st, desc_lines=[
        "Quyosh T ≈ 5800 K → λ_max = 2.898·10⁻³/5800 ≈ 500 nm (yashil!) — ko'z shu uchun yashilga o'rganган",
    ]))
    elems.append(Paragraph("47.2  Fotoeffekt (Eynshteyn, 1905)", st["h2"]))
    elems.append(formula_box([
        "hν = A + Ek_max",
        "Ek_max = ½mv²_max = eU_tormoz",
        "Qizil chegara: ν₀ = A/h  (bu chastotadan past — fotoeffekt yo'q)",
        "Foton energiyasi: E = hν = hc/λ",
        "Foton impulsi: p = h/λ = hν/c = E/c",
    ], st, desc_lines=[
        "A — chiqish ishi [J yoki eV];  1 eV = 1.6×10⁻¹⁹ J",
        "Fotoeffektni kuchlanish emas, chastota belgilaydi!",
    ]))
    elems.append(example_box("47-misol: Fotoeffekt",
        "Na ning chiqish ishi A = 2.27 eV. λ = 400 nm da fotoeffekt bo'ladimi? "
        "Chiqayotgan elektronning max kinetik energiyasi?",
        ["Foton energiyasi: E = hc/λ = 6.63·10⁻³⁴·3·10⁸/4·10⁻⁷",
         "= 4.97·10⁻¹⁹ J = 3.11 eV",
         "3.11 eV > 2.27 eV → fotoeffekt bo'ladi!",
         "Ek_max = 3.11 − 2.27 = 0.84 eV = 1.34·10⁻¹⁹ J"], st))

    elems.append(lecture_header(48, "To'lqin-zarracha dualizmi. Noaniqlik", 11, st))
    elems.append(formula_box([
        "Kompton sochilishi: Δλ = λ_K·(1−cosθ)",
        "λ_K = h/(m₀c) = 2.43 pm  (Kompton to'lqin uzunligi)",
        "De Broyl to'lqini: λ = h/p = h/(mv)",
        "Geyzenberg: Δx·Δpₓ ≥ ℏ/2",
        "Energiya-vaqt: ΔE·Δt ≥ ℏ/2",
        "ℏ = h/(2π) = 1.055×10⁻³⁴ J·s",
    ], st))
    elems.append(example_box("48-misol: Elektron de Broyl to'lqini",
        "Ek = 100 eV elektron uchun de Broyl to'lqin uzunligi. "
        "Kristall panjarasida difraktsiya bo'ladimi? (d ≈ 0.1 nm)",
        ["p = √(2m·Ek) = √(2·9.11·10⁻³¹·1.6·10⁻¹⁷)",
         "= √(2.92·10⁻⁴⁷) = 5.4·10⁻²⁴ kg·m/s",
         "λ = h/p = 6.63·10⁻³⁴/5.4·10⁻²⁴ = 0.123 nm",
         "λ ≈ d → difraktsiya bo'ladi! (bu elektron difraksion mikroskop asosi)"], st))

    elems.append(lecture_header(49, "Shnedinger tenglamasi. Kvant holatlari", 11, st))
    elems.append(formula_box([
        "Vaqtga bog'liq: iℏ·∂Ψ/∂t = Ĥ·Ψ",
        "Statsionar: Ĥ·ψ = E·ψ",
        "Ĥ = −ℏ²/(2m)·∇² + V(r⃗)   (Gamilton operatori)",
        "|Ψ(r⃗,t)|² = ρ(r⃗,t) — ehtimollik zichligi",
        "Normalashtirish: ∫|Ψ|²dV = 1",
    ], st, desc_lines=[
        "Ψ — to'lqin funksiyasi (kvant holatni to'liq tasvirlaydi)",
        "Tunel effekti: E < U₀ bo'lsa ham zarracha to'siqdan o'ta oladi",
    ]))
    rows_qm = [
        ["Cheksiz quduq", "E_n = n²π²ℏ²/(2ma²)", "Diskret energiya"],
        ["Garmonik osillyator", "E_n = (n+½)ℏω₀", "Nol tebranish eneriyasi!"],
        ["Vodorod atomi", "E_n = −13.6/n² eV", "Bohr formulasi"],
    ]
    elems.append(data_table(["Tizim", "Energiya", "Izoh"], rows_qm, st,
                             col_widths=[150, 180, 120]))

    elems.append(lecture_header(50, "Bohr modeli. Kvant sonlar. Pauli prinsipi", 11, st))
    elems.append(formula_box([
        "Bohr 1-postulat: m·v·r = nℏ  (orbit kvantlanishi)",
        "Bohr 2-postulat: hν = E_n2 − E_n1  (foton chiqarilishi)",
        "Vodorod energiyasi: E_n = −13.6 eV/n²",
        "Orbita radiusi: r_n = n²·a₀,   a₀ = 0.529 Å (Bohr radiusi)",
    ], st))
    rows_qnum = [
        ["n", "Asosiy", "1, 2, 3, ...", "Energiyani belgilaydi"],
        ["l", "Orbital", "0, 1, ..., n−1", "Orbital impuls momenti"],
        ["m_l", "Magnit", "−l, ..., 0, ..., +l", "Z-komponent"],
        ["m_s", "Spin", "±½", "Elektronning aylanishi"],
    ]
    elems.append(data_table(["Kvant son", "Nomi", "Qiymatlar", "Fizik ma'no"],
                             rows_qnum, st, col_widths=[70, 80, 120, 180]))
    elems.append(formula_box([
        "Pauli prinsipi: bir atomda bir xil (n, l, m_l, m_s) bo'lgan ikki elektron yo'q",
        "Qatlam sig'imlari: K(n=1):2,  L(n=2):8,  M(n=3):18,  N(n=4):32",
    ], st))

    elems.append(lecture_header(51, "Lazerlar va spontan/induktsiyalangan nurlanish", 11, st))
    elems.append(formula_box([
        "Spontan nurlanish: tasodifiy, kogerent emas",
        "Yutilish: N₁·B₁₂·ρ(ν)   (past darajadan yuqoriga)",
        "Induktsiyalangan: foton kelishi bilan bir xil foton hosil bo'ladi",
        "Inversiya sharti: N₂ > N₁  (yuqori darajada ko'p elektron)",
        "Lazer kuchayishi: G = e^(σ·(N₂−N₁)·l)",
    ], st, desc_lines=[
        "LASER = Light Amplification by Stimulated Emission of Radiation",
        "Lazer xossalari: monoxromatik, kogerent, kollimatlangan, kuchli",
    ]))
    rows_laser = [
        ["He–Ne", "632.8 nm", "0.1–50 mW", "Barcode, holografiya"],
        ["CO₂",   "10.6 μm",  "10 W–100 kW","Kesish, payvandlash"],
        ["Nd:YAG","1064 nm",  "1 W–100 kW", "Tibbiyot, sanoat"],
        ["Diod",  "635–980nm","1–500 mW",   "DVD, optik tolа"],
        ["Ekzimer","193–351nm","1–100 W",   "Litografiya, ko'z"],
    ]
    elems.append(data_table(["Lazer turi", "λ", "Quvvat", "Qo'llanilishi"],
                             rows_laser, st, col_widths=[80, 70, 100, 200]))
    elems.append(summary_box([
        "Plank: E = hν,  Stefan-Bolsman: R = σT⁴,  Vin: λ_max·T = const",
        "Fotoeffekt: hν = A + Ek_max (qizil chegara ν₀ = A/h)",
        "De Broyl: λ = h/p;  Noaniqlik: ΔxΔp ≥ ℏ/2",
        "Shnedinger: Ĥψ = Eψ,  |Ψ|² — ehtimollik zichligi",
        "Vodorod: E_n = −13.6/n² eV,  n,l,m_l,m_s — kvant sonlar",
        "Lazer — induktsiyalangan nurlanish yordamida kuchaytirilgan kogerent yorug'lik",
    ], st))
    elems.append(questions_block([
        "Nima uchun UV yorug'lik fotoeffekt hosil qiladi, qizil qilmaydi (Na uchun)?",
        "Noaniqlik munosabatini elektron atomdan chiqib ketmasligi uchun tadbiq qiling.",
        "Balmer seriyasining birinchi chizig'i: n=3 → n=2. λ ni toping.",
        "Nima uchun lazer nuri deyarli tarqalmaydi (kollimatlangan)?",
        "Tunel effektini flash xotira (NAND) da qanday ishlatilishini tushuntiring.",
    ], st))
    return elems


def build_bob12(st):
    """XII BOB — QATTIQ JISM FIZIKASI"""
    elems = []
    elems += cover_page(
        bob_num=12, bob_title="QATTIQ JISM FIZIKASI",
        subtitle="Kristall panjara · Zolalar · Yarimo'tkazgichlar · Supero'tkazuvchanlik",
        lessons=[
            "Kristall tuzilishi. Bragg difraksiyasi",
            "Elektron gaz nazariyasi. Fermi energiyasi",
            "Zolalar nazariyasi: o'tkazgich, yarimo'tkazgich, dielektrik",
            "p-n o'tish. Diod va tranzistor",
            "Supero'tkazuvchanlik. Meysner effekti",
        ], st=st,
    )

    elems.append(lecture_header(52, "Kristall tuzilishi va Bragg difraksiyasi", 12, st))
    elems.append(formula_box([
        "Bragg qonuni: 2d·sinθ = nλ   (rentgen difraksiyasi)",
        "d — panjara tekisliklari orasidagi masofa",
    ], st))
    rows_crystal = [
        ["Kubik tekis (SC)",   "Na", "Har uchida 1 atom"],
        ["Kubik yuz markazli (FCC)", "Cu, Al, Au", "Olti yuzda qo'shimcha"],
        ["Kubik hajm markazli (BCC)", "Fe, W, Mo",  "Markazda 1 qo'shimcha"],
        ["Olmos kubik", "C, Si, Ge", "2 ta o'zbek FCC"],
        ["Geksagonal (HCP)", "Mg, Ti, Zn", "Olti burchak qatlam"],
    ]
    elems.append(data_table(["Tuzilish", "Misol", "Tavsif"],
                             rows_crystal, st, col_widths=[150, 100, 200]))

    elems.append(lecture_header(53, "Fermi-Dirak taqsimoti. Fermi energiyasi", 12, st))
    elems.append(formula_box([
        "Fermi-Dirak: f(E) = 1 / (e^((E−E_F)/kT) + 1)",
        "T = 0 da: f = 1 (E < E_F);  f = 0 (E > E_F)",
        "Fermi energiyasi: E_F = (ℏ²/2m)·(3π²n)^(2/3)",
    ], st, desc_lines=[
        "E_F — Fermi energiyasi: T=0 da eng yuqori to'ldirilgan daraja",
        "Mis: E_F ≈ 7 eV;  Na: E_F ≈ 3.2 eV",
        "T=0 da ham elektronlar harakatlanadi (kvant ta'sir)!",
    ]))
    elems.append(formula_box([
        "Elektr o'tkazuvchanlik: σ = ne²τ/m",
        "Issiqlik o'tkazuvchanlik: κ = (π²k²T·n·τ)/(3m)",
        "Wiedemann–Frans: κ/σ = L₀T,   L₀ = 2.44×10⁻⁸ W·Ω/K²",
    ], st))

    elems.append(lecture_header(54, "Zolalar nazariyasi", 12, st))
    elems.append(Paragraph(
        "Kristalda periodik potensial elektron energiyalarini ruxsat etilgan "
        "zolalar (band) va taqiqlangan oraliqlar (gap) ga ajratadi.", st["body"]))
    rows_band = [
        ["Metal",         "Eg = 0",   "Zolalar qoplashadi", "κ ~ T⁻¹ (oshsa qarshilik ortadi)"],
        ["Yarimo'tkazgich","Eg ~ 1 eV","Si: 1.12, Ge: 0.67, GaAs: 1.43", "κ ~ e^(Eg/2kT)"],
        ["Dielektrik",    "Eg > 3 eV","SiO₂: 9, Al₂O₃: 8.8", "Amalda tok o'tmaydi"],
    ]
    elems.append(data_table(["Tur", "Band gap", "Misol (eV)", "Xarakter"],
                             rows_band, st, col_widths=[90, 80, 175, 105]))
    elems.append(formula_box([
        "Intrinsik (aralashmаsiz) yarimo'tkazgich:",
        "n = p = nᵢ ∝ T^(3/2)·e^(−Eg/2kT)",
        "Si da 300 K: nᵢ ≈ 1.5×10¹⁰ cm⁻³",
    ], st))

    elems.append(lecture_header(55, "p-n o'tish. Diod. Tranzistor", 12, st))
    elems.append(formula_box([
        "p-n diod I-V tavsifi: I = I₀(e^(eU/kT) − 1)",
        "To'g'ri o'tkazish (U > 0): I eksponensial oshadi",
        "Teskari o'tkazish (U < 0): I ≈ −I₀  (mikroamperlar)",
        "BJT tranzistor: I_C = β·I_B,   β = 50–500",
        "MOSFET: U_GS > U_th bo'lsa kanal ochiladi",
    ], st))
    elems.append(example_box("55-misol: Diod",
        "p-n diod I₀ = 10 nA, T = 300 K. U = 0.6 V da tok qancha?",
        ["kT/e = 0.026 V (termal kuchlanish)",
         "I = I₀(e^(0.6/0.026) − 1) = 10·10⁻⁹·(e^23.1 − 1)",
         "= 10·10⁻⁹·10⁷ ≈ 0.1 A = 100 mA",
         "Teskari: U = −5 V → I ≈ −10 nA (minglarcha karra kichik!)"], st))

    elems.append(lecture_header(56, "Supero'tkazuvchanlik", 12, st))
    elems.append(formula_box([
        "T < Tc bo'lsa R = 0 (mutlaq nol qarshilik)",
        "Meysner effekti: B = 0 (magnit maydon siqib chiqariladi)",
        "London tenglamasi: J = −(n_s e²/m)·A⃗",
        "Koper juftliklari (BCS nazariyasi, 1957)",
    ], st, desc_lines=[
        "Konvensional Tc: Hg 4.2K, Nb 9.3K, Nb₃Sn 18K",
        "Yuqori haroratli: YBa₂Cu₃O₇ (YBCO) Tc = 93K  (suyuq N₂ da!)",
        "2019: LaH₁₀ Tc = 250K (250 GPa bosimda)",
    ]))
    rows_sc = [
        ["MRT magnit",    "9 T",    "NbTi, Nb₃Sn", "Tibbiyot"],
        ["LHC sektorlari","8.3 T",  "NbTi",         "Zarralar fizikasi"],
        ["Maglev poyezd", "~0.5 T", "YBCO",         "Yaponiya SCMaglev"],
        ["Tokamak magnit","~12 T",  "Nb₃Sn",        "ITER sintez reaktori"],
    ]
    elems.append(data_table(["Qo'llanilish", "B (T)", "Material", "Soha"],
                             rows_sc, st, col_widths=[150, 60, 100, 140]))
    elems.append(summary_box([
        "Bragg: 2d·sinθ = nλ",
        "Fermi-Dirak: f(E) = 1/(e^((E−E_F)/kT)+1)",
        "Metal: Eg=0;  Yarimo'tkazgich: Eg~1eV;  Dielektrik: Eg>3eV",
        "Diod: I = I₀(e^(eU/kT)−1);  Tranzistor: I_C = β·I_B",
        "Supero'tkazuvchanlik: T < Tc → R=0, B=0 (Meysner)",
    ], st))
    elems.append(questions_block([
        "Nima uchun metall qizdirilsa qarshilik ortadi, yarimo'tkazgich uchun aksi?",
        "p-tipli yarimo'tkazgich hosil qilish uchun Si ga qanday aralashma qo'shiladi?",
        "Supero'tkazgich magnit ustida suzishini tushuntiring (Meysner effekti).",
        "MOSFET va BJT tranzistorlarning ishlash prinsipini solishtiring.",
        "E_F = 7 eV (Cu). T = 300 K va T = 1000 K da taqsimotni solishtiring.",
    ], st))
    return elems


def build_bob13(st):
    """XIII BOB — YADRO FIZIKASI"""
    elems = []
    elems += cover_page(
        bob_num=13, bob_title="YADRO FIZIKASI",
        subtitle="Yadro tuzilishi · Radioaktivlik · Yadro reaksiyalari · Sintez va bo'linish",
        lessons=[
            "Atom yadrosi. Yadro kuchlari va bog'lanish energiyasi",
            "Radioaktiv yemirilish qonunlari. α, β, γ nurlanish",
            "Yadro reaksiyalari. Q-qiymat",
            "Yadro bo'linishi. Zanjirli reaksiya. Atom reaktori",
            "Termoyadro sintezi. Plazma va ITER",
        ], st=st,
    )

    elems.append(lecture_header(57, "Atom yadrosi va bog'lanish energiyasi", 13, st))
    elems.append(formula_box([
        "Yadro: Z proton + N neytron,  A = Z + N (mass soni)",
        "Yadro radiusi: R ≈ R₀·A^(1/3),   R₀ = 1.2×10⁻¹⁵ m",
        "Massa defekti: Δm = Z·m_p + N·m_n − M_yadro",
        "Bog'lanish energiyasi: ΔE = Δm·c²   [MeV]",
        "Bir nuklonga bog'lanish: ε = ΔE/A   [MeV/nuklon]",
    ], st, desc_lines=[
        "Yadro zichligi: ρ = 3m_p/(4πR₀³) ≈ 2.3×10¹⁷ kg/m³  (barcha yadrolar uchun!)",
        "Eng barqaror yadrolar: ⁵⁶Fe, ⁶²Ni  →  ε ≈ 8.8 MeV/nuklon (maksimum)",
    ]))
    rows_be = [
        ["²H (deyteriy)", "1.11",  "Kuchsiz bog'langan"],
        ["⁴He (alfa)",    "7.07",  "Juda barqaror"],
        ["¹²C",           "7.68",  "Barqaror"],
        ["⁵⁶Fe",          "8.79",  "Eng barqaror!"],
        ["²³⁵U",          "7.59",  "Nisbatan zaiflangan"],
    ]
    elems.append(data_table(["Yadro", "ε (MeV/nuklon)", "Izoh"],
                             rows_be, st, col_widths=[130, 130, 190]))

    elems.append(lecture_header(58, "Radioaktiv yemirilish qonunlari", 13, st))
    elems.append(formula_box([
        "N(t) = N₀·e^(−λt)",
        "Faollik: A(t) = λ·N(t) = A₀·e^(−λt)   [Bq = 1/s]",
        "Yarim yemirilish davri: T₁/₂ = ln2/λ = 0.693/λ",
        "O'rtacha umr: τ = 1/λ = T₁/₂/ln2 ≈ 1.443·T₁/₂",
    ], st))
    rows_decay_types = [
        ["α-yemirilish",  "²⁴He yadro", "A kamayadi 4, Z kamayadi 2", "Ionlash qobiliyati yuqori, diapazon kichik"],
        ["β⁻-yemirilish", "Elektron + ν̄_e", "Z ortadi 1, A o'zgarmaydi", "n → p + e⁻ + ν̄_e"],
        ["β⁺-yemirilish", "Pozitron + ν_e", "Z kamayadi 1",             "p → n + e⁺ + ν_e  (yadro ichida)"],
        ["γ-nurlanish",   "Foton (γ)",    "A va Z o'zgarmaydi",        "Qo'zg'algan yadroning relaksatsiyasi"],
        ["Elektron tutish","ν_e chiqadi", "p + e⁻ → n + ν_e",         "β⁺ alternativasi"],
    ]
    elems.append(data_table(["Tur", "Zarracha", "Yadro o'zgarishi", "Xarakter"],
                             rows_decay_types, st, col_widths=[90, 90, 150, 120]))
    elems.append(example_box("58-misol: ¹⁴C yoshi aniqlash",
        "Yog'och namunasida ¹⁴C faolligi tirik daraxtga nisbatan 25% tashkil etadi. "
        "Namunaning yoshi? (T₁/₂(¹⁴C) = 5730 yil)",
        ["A/A₀ = e^(−λt) = 0.25",
         "λt = −ln(0.25) = ln4 = 1.386",
         "λ = ln2/T₁/₂ = 0.693/5730 = 1.209×10⁻⁴ yil⁻¹",
         "t = 1.386/1.209×10⁻⁴ = 11 460 yil ≈ 11 500 yil"], st))

    elems.append(lecture_header(59, "Yadro reaksiyalari. Q-qiymat", 13, st))
    elems.append(formula_box([
        "a + A → B + b  yoki qisqacha A(a,b)B",
        "Q = (m_kirish − m_chiqish)·c²   [MeV]",
        "Q > 0 — ekzoterm (energiya ajraladi)",
        "Q < 0 — endoterm (energiya kiritilishi kerak)",
        "Saqlanish qonunlari: A, Z, impuls, energiya, spin",
    ], st))

    elems.append(lecture_header(60, "Yadro bo'linishi. Zanjirli reaksiya. Reaktor", 13, st))
    elems.append(formula_box([
        "²³⁵U + n → ⁹²Kr + ¹⁴¹Ba + 3n + 200 MeV",
        "Zanjirli reaksiya ko'paytma koeffitsienti: k = ν·f·p·ε·η",
        "k < 1 → so'nadi;  k = 1 → doimiy;  k > 1 → portlash",
    ], st, desc_lines=[
        "1 kg ²³⁵U ning to'liq bo'linishi: E ≈ 8.2×10¹³ J = 20 kt TNT",
        "AES da η ≈ 33%, Chernobil 1986 — k > 1 (boshqaruvsiz reaksiya)",
    ]))
    rows_reactor = [
        ["Yoqilg'i",       "²³⁵U (boyitilgan 3–5%)",   "Tabiiida 0.72%"],
        ["Sekinlashtiruvchi","Suv, og'ir suv, grafit",  "Neytronni sekinlashtiradi"],
        ["Sovutuvchi",      "Suv, gaz, suyuq metall",  "Issiqlik uzatish"],
        ["Nazorat tayoqcha","Bor, kadmiy",              "Neytron yutadi"],
        ["Qo'riqlovchi",    "Beton va qo'rg'oshin",    "Nurlanishdan himoya"],
    ]
    elems.append(data_table(["Element", "Material", "Vazifa"],
                             rows_reactor, st, col_widths=[130, 150, 170]))

    elems.append(lecture_header(61, "Termoyadro sintezi. ITER", 13, st))
    elems.append(formula_box([
        "D + T → ⁴He + n + 17.6 MeV",
        "D + D → ³He + n + 3.27 MeV",
        "Sintez sharti (Lawson): n·τ > 10²⁰ m⁻³·s  (T > 10⁸ K)",
        "Quyoshda: 4p → ⁴He + 2e⁺ + 2ν + γ + 26.7 MeV",
    ], st, desc_lines=[
        "1 kg deyteriy-tritiy sinti = 3.4×10¹⁴ J = 85 ming tonna neft!",
        "ITER (Frantsiya): 2025-yildan plazma tajriba, Q = 10 maqsad",
    ]))
    elems.append(summary_box([
        "Yadro: R = R₀A^(1/3), ρ = const, ΔE = Δm·c²",
        "Radioaktiv yemirilish: N = N₀e^(−λt), T₁/₂ = ln2/λ",
        "α(⁴He), β(e±), γ(foton) — yemirilish turlari",
        "¹⁴C yoshi aniqlash: t = ln(A₀/A)/λ",
        "Fission: ²³⁵U → 200 MeV; Fusion: D+T → 17.6 MeV",
        "Reaktor komponentlari: yoqilg'i, sekinlashtiruvchi, nazorat tayoqchasi",
    ], st))
    elems.append(questions_block([
        "Nima uchun yadro bo'linishi va sintezi ham energiya ajratadi?",
        "α va γ nurlanishlarning biologik ta'siri farqini tushuntiring.",
        "Atom bombasi va atom reaktorining fundamental farqi nima?",
        "Termoyadro sintezi uchun nima uchun juda yuqori harorat kerak?",
        "²³⁸U ning T₁/₂ = 4.5×10⁹ yil. 1 g ²³⁸U ning hozirgi faolligi?",
    ], st))
    return elems


def build_bob14(st):
    """XIV BOB — ELEMENTAR ZARRALAR VA STANDART MODEL"""
    elems = []
    elems += cover_page(
        bob_num=14, bob_title="ELEMENTAR ZARRALAR VA STANDART MODEL",
        subtitle="Kvarklar · Fundamental ta'sirlar · Standart model · Zamonaviy muammolar",
        lessons=[
            "Elementar zarralar tasnifi. Leptonlar va hadronlar",
            "Kvarklar modeli. Rang zaryadi. Renglangan dinamika",
            "Fundamental ta'sir turlari. Virtual zarralar",
            "Standart model. Higgs bosoni",
            "Zamonaviy fizika muammolari: qorong'u modda, energiya, M-nazariya",
        ], st=st,
    )

    elems.append(lecture_header(62, "Elementar zarralar tasnifi", 14, st))
    rows_particles = [
        ["Elektron e⁻",    "−1",   "0.511 MeV",    "Lepton (1-avlod)"],
        ["Myuon μ⁻",       "−1",   "105.7 MeV",    "Lepton (2-avlod)"],
        ["Tau τ⁻",         "−1",   "1776.8 MeV",   "Lepton (3-avlod)"],
        ["ν_e, ν_μ, ν_τ",  "0",    "<2 eV",         "Neytrinolar"],
        ["Proton p",        "+1",   "938.3 MeV",    "Baryon (uud)"],
        ["Neytron n",       "0",    "939.6 MeV",    "Baryon (udd)"],
        ["π⁺ mezon",        "+1",   "139.6 MeV",    "Mezon (ud̄)"],
        ["Foton γ",         "0",    "0",            "EMT tashuvchi"],
    ]
    elems.append(data_table(["Zarra", "Zaryad", "Massa", "Tur"],
                             rows_particles, st, col_widths=[100, 65, 85, 200]))

    elems.append(lecture_header(63, "Kvarklar modeli", 14, st))
    elems.append(formula_box([
        "6 xil kvark:  u(+2/3),  d(−1/3),  s(−1/3),  c(+2/3),  b(−1/3),  t(+2/3)",
        "Proton = uud:  2/3 + 2/3 − 1/3 = +1  ✓",
        "Neytron = udd:  2/3 − 1/3 − 1/3 = 0  ✓",
        "Baryon = 3 kvark;  Mezon = kvark + antikvark",
        "Rang zaryadi: R, G, B  (kuchli ta'sir)",
        "Hadronlar rangсиз: RGB (baryon) yoki RR̄ (mezon)",
    ], st, desc_lines=[
        "Kvarklar erkin holda uchramaydi — konfinement (qayd etish) hodisasi",
        "Kuchli ta'sir tashuvchisi — gluon (8 tur)",
    ]))

    elems.append(lecture_header(64, "Fundamental ta'sir turlari", 14, st))
    rows_forces = [
        ["Kuchli",         "Gluon (8 ta)",   "~10⁻¹⁵ m",  "10³⁸",  "Yadro bog'lanishi"],
        ["Elektromagnit",  "Foton (γ)",      "∞",          "10³⁶",  "Atom, kimyo"],
        ["Kuchsiz",        "W±, Z⁰",        "~10⁻¹⁸ m",  "10²⁵",  "β-yemirilish"],
        ["Gravitatsion",   "Graviton (?)",   "∞",          "1",     "Massa, koinot"],
    ]
    elems.append(data_table(["Ta'sir", "Tashuvchi", "Diapazon", "Nisbiy kuch", "Misol"],
                             rows_forces, st, col_widths=[90, 100, 80, 90, 90]))
    elems.append(note_box(
        "Kuchsiz va elektromagnit ta'sir birlashtirilgan: Glashow, Salam, Weinberg "
        "(Nobel 1979). Bu elektrozaif nazariya (EW). Keyingi maqsad: kuchli ham kiritish "
        "(Katta Birlik Nazariyasi — GUT).", st, "info"))

    elems.append(lecture_header(65, "Standart model va Higgs bosoni", 14, st))
    elems.append(formula_box([
        "Standart model zarralari:",
        "  6 kvark × 3 rang = 18 kvark  (+ 18 antikvark)",
        "  6 lepton  (+ 6 antilepton)",
        "  Tashuvchilar: γ (1) + gluon (8) + W±,Z⁰ (4)",
        "  Higgs bosoni (1)",
        "Jami: 61 ta fundamental zarra",
    ], st, desc_lines=[
        "Higgs bosoni LHC da 2012 yil 4-iyulda topildi! Massa ≈ 125 GeV",
        "Nobel mukofoti 2013: Higgs va Englert",
    ]))
    elems.append(example_box("65-misol: LHC da Higgs izlash",
        "LHC da proton-proton to'qnashuvi √s = 13 TeV energiyada. "
        "Higgs bosoni asosan qaysi kanallar orqali topildi?",
        ["H → γγ (2 foton): nadir (~0.2%) lekin toza signal",
         "H → ZZ* → 4l: 4 lepton (e,μ) aniq o'lchanadi",
         "H → WW* → lνlν: kuchli signal",
         "H → bb̄: eng ko'p (~58%), lekin fon ko'p",
         "2012-da 5σ ishonch darajasida topildi (5σ = 10⁻⁷ noto'g'ri ehtimol)"], st))

    elems.append(lecture_header(66, "Zamonaviy fizika muammolari", 14, st))
    elems.append(Paragraph(
        "Standart model ulkan muvaffaqiyatga qaramay, bir qancha fundamental "
        "savollar hali javob kutmoqda:", st["body"]))
    rows_problems = [
        ["Qorong'u modda",    "Koinotning 27%",   "WIMPs, aksionlar, steril neytrinolar",
         "Galaktika rotatsion egri chiziqlari"],
        ["Qorong'u energiya", "Koinotning 68%",   "Kosmologik doimiy Λ, kvintessensiya",
         "Koinotning tezlashgan kengayishi"],
        ["Baryogenez",        "Materia ustunligi","Leptoogenez, Sakharov shartlari",
         "Nima uchun antimodda kam?"],
        ["Gravitatsiya",      "SM da yo'q",       "Kvant gravitatsiya, string nazariya",
         "Planck energiyasi: 10¹⁹ GeV"],
        ["Neytrinо massasi",  "SM da nol",        "Seesaw mexanizmi, Majorana",
         "Neytrinо ostsillatsiyalari"],
    ]
    elems.append(data_table(["Muammo", "Miqdor", "Nazariy g'oya", "Eksperimental belgi"],
                             rows_problems, st, col_widths=[90, 90, 150, 120]))
    elems.append(formula_box([
        "Koinot tarkibi: 5% oddiy modda, 27% qorong'u modda, 68% qorong'u energiya",
        "Plank uzunligi: l_P = √(ℏG/c³) = 1.6×10⁻³⁵ m",
        "Plank vaqti:   t_P = √(ℏG/c⁵) = 5.4×10⁻⁴⁴ s",
    ], st, desc_lines=["Bu miqyoslarda kvant gravitatsiya kerak — hali mavjud emas!"]))
    elems.append(note_box(
        "Ip nazariyasi (String Theory) — barcha zarralarni 1 o'lchamli «ip» "
        "tebranish modlari sifatida tasvirlaydi. Bu qadar kichik — hozircha "
        "eksperimental tekshirib bo'lmaydi. Alternativa: Aylanma kvant gravitatsiya (LQG).", st))
    elems.append(summary_box([
        "Standart model: 6 kvark, 6 lepton, 4 ta ta'sir tashuvchi + Higgs",
        "4 fundamental ta'sir: kuchli > EM > kuchsiz > gravitatsion",
        "Kvarklar: baryon (qqq), mezon (qq̄), rang rangсиз",
        "Higgs bosoni 2012-da LHC da topildi (125 GeV)",
        "Ochiq muammolar: qorong'u modda/energiya, gravitatsiya, baryogenez",
    ], st))
    elems.append(questions_block([
        "Proton va neytron massa farqi nimaga teng va sababı nima?",
        "Nima uchun kvarklar erkin holda uchramaydi?",
        "Higgs mexanizmi massani qanday beradi?",
        "Qorong'u modda va qorong'u energiyani qanday kuzatish mumkin?",
        "String nazariya testlanishi uchun nima kerak?",
        "Koinotda antimoddadan ko'ra modda ko'p — bu standart model nimaga mos kelmaydi?",
    ], st))
    return elems
