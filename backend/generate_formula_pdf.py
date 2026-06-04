"""
generate_formula_pdf.py
========================
Umumiy Fizika kursi — barcha formulalar ketma-ket PDF.

Ishlatish:
    cd backend
    python generate_formula_pdf.py

Natija:
    media/maruzalar/umumiy_fizika_FORMULALAR.pdf
"""

import os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak,
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from pdf_generator.styles import register_fonts, make_styles, BOB_COLORS

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "media", "maruzalar")
os.makedirs(OUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# Qo'shimcha uslublar
# ─────────────────────────────────────────────────────────────────────────────
def extra_styles():
    return {
        "bob_header": ParagraphStyle(
            "bob_header", fontName="Arial-B", fontSize=13,
            textColor=colors.white, alignment=TA_CENTER,
            spaceAfter=0, spaceBefore=0, leading=18,
        ),
        "section": ParagraphStyle(
            "section", fontName="Arial-B", fontSize=10,
            textColor=colors.HexColor("#1e3a8a"), alignment=TA_LEFT,
            spaceAfter=3, spaceBefore=6, leading=14,
        ),
        "formula": ParagraphStyle(
            "formula", fontName="Arial-B", fontSize=10.5,
            textColor=colors.HexColor("#1e40af"), alignment=TA_LEFT,
            spaceAfter=0, spaceBefore=0, leading=15,
        ),
        "desc": ParagraphStyle(
            "desc", fontName="Arial", fontSize=9,
            textColor=colors.HexColor("#374151"), alignment=TA_LEFT,
            spaceAfter=0, spaceBefore=0, leading=13,
        ),
        "sub_title": ParagraphStyle(
            "sub_title", fontName="Arial-B", fontSize=10,
            textColor=colors.HexColor("#374151"), alignment=TA_LEFT,
            spaceAfter=2, spaceBefore=4, leading=14,
        ),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Yordamchi funksiyalar
# ─────────────────────────────────────────────────────────────────────────────
def sp(h=4):
    return Spacer(1, h)

def hrule(color=colors.HexColor("#e2e8f0"), t=0.6):
    return HRFlowable(width="100%", thickness=t, color=color,
                      spaceAfter=4, spaceBefore=2)

def bob_header_block(num, title, subtitle, st, es):
    accent = BOB_COLORS[(num - 1) % len(BOB_COLORS)]
    rows = [
        [Paragraph(f"BOB {num}", es["bob_header"])],
        [Paragraph(title, es["bob_header"])],
        [Paragraph(subtitle, ParagraphStyle("s2", fontName="Arial", fontSize=9,
                   textColor=colors.white, alignment=TA_CENTER, leading=12))],
    ]
    tbl = Table(rows, colWidths=["100%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), accent),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
    ]))
    return KeepTogether([sp(8), tbl, sp(6)])


def formula_row(formula, description, es, bg=colors.HexColor("#eff6ff"), border=colors.HexColor("#bfdbfe")):
    """Bitta formula qatori: chap — formula, o'ng — izoh."""
    cell_f = Paragraph(formula, es["formula"])
    cell_d = Paragraph(description, es["desc"])
    tbl = Table([[cell_f, cell_d]], colWidths=["42%", "58%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), bg),
        ("BOX",          (0,0), (-1,-1), 0.7, border),
        ("LINEAFTER",    (0,0), (0,-1),  0.5, border),
        ("LEFTPADDING",  (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING",   (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
    ]))
    return tbl


def section_title(text, es):
    return KeepTogether([sp(5), Paragraph(text, es["section"]),
                         HRFlowable(width="100%", thickness=0.8,
                                    color=colors.HexColor("#3b82f6"),
                                    spaceAfter=3, spaceBefore=1)])


def formula_group(formulas, es, bg=None, border=None):
    """
    formulas: list of (formula_str, description_str)
    Hammasi bitta vizual blokda.
    """
    kw = {}
    if bg:     kw["bg"]     = bg
    if border: kw["border"] = border
    rows = []
    for f, d in formulas:
        rows.append(formula_row(f, d, es, **kw))
        rows.append(sp(2))
    return KeepTogether([sp(3)] + rows + [sp(3)])


# ─────────────────────────────────────────────────────────────────────────────
# ===  BOB MAZMUNLARI  ========================================================
# ─────────────────────────────────────────────────────────────────────────────

def bob1(es):
    """I BOB — Kinematika"""
    elems = [bob_header_block(1, "KINEMATIKA", "Mexanikaning kinematik bo'limi — jismlar harakat qonunlari", None, es)]

    elems.append(section_title("1.1  O'rin va Siljish", es))
    elems.append(formula_group([
        ("r = x·i + y·j + z·k",          "radius-vektor (o'rin vektori)"),
        ("s = r<sub>2</sub> - r<sub>1</sub>", "siljish vektori"),
        ("|s| = sqrt(dx<super>2</super> + dy<super>2</super> + dz<super>2</super>)", "siljish moduli"),
    ], es))

    elems.append(section_title("1.2  Tezlik va Tezlanish", es))
    elems.append(formula_group([
        ("v = dr/dt",                      "tezlik vektori"),
        ("a = dv/dt = d<super>2</super>r/dt<super>2</super>", "tezlanish vektori"),
        ("|v| = sqrt(v<sub>x</sub><super>2</super> + v<sub>y</sub><super>2</super> + v<sub>z</sub><super>2</super>)", "tezlik moduli"),
    ], es))

    elems.append(section_title("1.3  Tekis va Tekis Tezlanuvchan Harakat", es))
    elems.append(formula_group([
        ("x = x<sub>0</sub> + v<sub>0</sub>t",             "tekis harakat"),
        ("v = v<sub>0</sub> + at",                          "tezlik (tekis tezlanuvchan)"),
        ("x = x<sub>0</sub> + v<sub>0</sub>t + at<super>2</super>/2", "koordinata (tekis tezlanuvchan)"),
        ("v<super>2</super> = v<sub>0</sub><super>2</super> + 2a(x - x<sub>0</sub>)", "Galiley formulasi"),
        ("h = v<sub>0</sub>t - gt<super>2</super>/2",       "vertikal tashlash (yuqoriga)"),
        ("x = v<sub>0x</sub>t,  y = v<sub>0y</sub>t - gt<super>2</super>/2", "qiya tashlash"),
        ("R = v<sub>0</sub><super>2</super>sin2α/g",        "qiya tashlash masofasi"),
    ], es))

    elems.append(section_title("1.4  Doiraviy Harakat", es))
    elems.append(formula_group([
        ("ω = dφ/dt",                      "burchak tezligi (rad/s)"),
        ("β = dω/dt",                      "burchak tezlanishi"),
        ("v = ωR",                         "chiziqli tezlik"),
        ("a<sub>n</sub> = v<super>2</super>/R = ω<super>2</super>R", "normal (markazga intilma) tezlanish"),
        ("a<sub>τ</sub> = βR",             "tangensial tezlanish"),
        ("a = sqrt(a<sub>n</sub><super>2</super> + a<sub>τ</sub><super>2</super>)", "to'liq tezlanish"),
        ("T = 2π/ω",                       "davr (s)"),
        ("ν = 1/T = ω/2π",                 "chastota (Hz)"),
    ], es))

    elems.append(section_title("1.5  Galiley Nisbiylik Printsipi", es))
    elems.append(formula_group([
        ("v = v' + u",                     "tezliklar qo'shilishi (Galiley)"),
        ("a = a'",                         "tezlanishlar teng (inertsial sistemalar)"),
        ("x = x' + ut",                    "koordinatalar transformatsiyasi"),
    ], es))
    return elems


def bob2(es):
    """II BOB — Dinamika"""
    elems = [bob_header_block(2, "DINAMIKA", "Newton qonunlari, impuls, energiya va mexanik ish", None, es)]

    elems.append(section_title("2.1  Newton Qonunlari", es))
    elems.append(formula_group([
        ("F = ma",                         "Newton 2-qonuni"),
        ("F<sub>12</sub> = -F<sub>21</sub>", "Newton 3-qonuni (ta'sir va reaktsiya)"),
        ("sum(F) = 0  =>  a = 0",          "Newton 1-qonuni (inersiya)"),
    ], es))

    elems.append(section_title("2.2  Kuchlar", es))
    elems.append(formula_group([
        ("F<sub>og</sub> = GMm/r<super>2</super>", "tortishish kuchi (Newton)"),
        ("g = GM/R<super>2</super>",        "erkin tushish tezlanishi"),
        ("F<sub>pruj</sub> = -kx",         "elastiklik kuchi (Guk qonuni)"),
        ("F<sub>ish</sub> = μN",           "sürtülme kuchi (dinamik)"),
        ("N = mgcosα",                     "tayanch reaktsiyasi (qiyalik)"),
    ], es))

    elems.append(section_title("2.3  Impuls va Impuls Momenti", es))
    elems.append(formula_group([
        ("p = mv",                         "impuls"),
        ("F = dp/dt",                      "Newton 2-qonuni impuls orqali"),
        ("p<sub>1</sub> + p<sub>2</sub> = const", "impulsning saqlanish qonuni"),
        ("J = F·Δt = Δp",                  "kuch impulsi"),
        ("L = r × p = Iω",                 "impuls momenti"),
        ("M = dL/dt",                      "kuch momenti"),
        ("L = const  (M = 0 da)",          "impuls momentining saqlanishi"),
    ], es))

    elems.append(section_title("2.4  Ish va Energiya", es))
    elems.append(formula_group([
        ("A = F·s·cosα",                   "kuchning ishi"),
        ("A = integral(F·dr)",             "umumiy ish (integral)"),
        ("E<sub>k</sub> = mv<super>2</super>/2", "kinetik energiya"),
        ("E<sub>p</sub> = mgh",            "potensial energiya (og'irlik kuchi)"),
        ("E<sub>p</sub> = kx<super>2</super>/2", "potensial energiya (prujina)"),
        ("E = E<sub>k</sub> + E<sub>p</sub> = const", "mexanik energiyaning saqlanishi"),
        ("A<sub>net</sub> = ΔE<sub>k</sub>", "kinetik energiya teoremasi"),
        ("η = A<sub>foydali</sub>/A<sub>sarflangan</sub>", "FIK — foydali ish koeffitsienti"),
    ], es))

    elems.append(section_title("2.5  Aylanma Harakat Dinamikasi", es))
    elems.append(formula_group([
        ("M = F·d",                        "kuch momenti (d — yelka)"),
        ("M = Iβ",                         "aylanma harakat uchun Newton 2-qonuni"),
        ("I = sum(m<sub>i</sub>r<sub>i</sub><super>2</super>)", "inersiya momenti"),
        ("I<sub>disk</sub> = mR<super>2</super>/2", "disk inersiya momenti"),
        ("I<sub>shar</sub> = 2mR<super>2</super>/5", "shar inersiya momenti"),
        ("I<sub>sterjen</sub> = ml<super>2</super>/12", "sterjen (markaz atrofida)"),
        ("E<sub>k</sub><sub>ayl</sub> = Iω<super>2</super>/2", "aylanma harakatning kinetik energiyasi"),
    ], es))
    return elems


def bob3(es):
    """III BOB — Tebranishlar va To'lqinlar"""
    elems = [bob_header_block(3, "TEBRANISHLAR VA TO'LQINLAR",
                               "Garmonik tebranishlar, so'nish, rezonans, mexanik to'lqinlar", None, es)]

    elems.append(section_title("3.1  Erkin Garmonik Tebranishlar", es))
    elems.append(formula_group([
        ("x = A·cos(ω<sub>0</sub>t + φ<sub>0</sub>)", "tebranish qonuni"),
        ("ω<sub>0</sub> = sqrt(k/m)",       "prujinali tebranuvchining natural chastotasi"),
        ("T = 2π/ω<sub>0</sub> = 2π·sqrt(m/k)", "tebranish davri"),
        ("ν = 1/T",                         "chastota (Hz)"),
        ("T<sub>may</sub> = 2π·sqrt(l/g)",  "matematik mayatnik davri"),
        ("v = -Aω<sub>0</sub>·sin(ω<sub>0</sub>t + φ<sub>0</sub>)", "tezlik"),
        ("a = -Aω<sub>0</sub><super>2</super>·cos(ω<sub>0</sub>t + φ<sub>0</sub>)", "tezlanish"),
        ("E = kA<super>2</super>/2 = const", "garmonik tebranuvchi energiyasi"),
    ], es))

    elems.append(section_title("3.2  So'nuvchi Tebranishlar", es))
    elems.append(formula_group([
        ("x = A<sub>0</sub>e<super>-βt</super>·cos(ω<sub>1</sub>t + φ)", "so'nuvchi tebranish"),
        ("β = r/(2m)",                      "so'nish koeffitsienti (r — qarshilik)"),
        ("ω<sub>1</sub> = sqrt(ω<sub>0</sub><super>2</super> - β<super>2</super>)", "so'nuvchi tebranish chastotasi"),
        ("δ = βT<sub>1</sub> = ln(A<sub>n</sub>/A<sub>n+1</sub>)", "logarifmik so'nish dekrementi"),
        ("Q = π/(δ) = ω<sub>1</sub>/(2β)",  "sifat koeffitsienti (Q-faktor)"),
    ], es))

    elems.append(section_title("3.3  Majburiy Tebranishlar va Rezonans", es))
    elems.append(formula_group([
        ("A = F<sub>0</sub>/m / sqrt((ω<sub>0</sub><super>2</super>-ω<super>2</super>)<super>2</super> + 4β<super>2</super>ω<super>2</super>)", "amplituda (majburiy tebranish)"),
        ("ω<sub>rez</sub> = sqrt(ω<sub>0</sub><super>2</super> - 2β<super>2</super>)", "rezonans chastotasi"),
        ("A<sub>rez</sub> = F<sub>0</sub>/(2mβ·sqrt(ω<sub>0</sub><super>2</super>-β<super>2</super>))", "rezonans amplitudasi"),
    ], es))

    elems.append(section_title("3.4  Mexanik To'lqinlar", es))
    elems.append(formula_group([
        ("y = A·cos(ωt - kx)",              "ko'ndalang to'lqin tenglamasi"),
        ("k = 2π/λ",                        "to'lqin soni"),
        ("λ = vT = v/ν",                    "to'lqin uzunligi"),
        ("v<sub>t</sub> = sqrt(T<sub>nat</sub>/ρ<sub>lin</sub>)", "ip bo'ylab to'lqin tezligi"),
        ("v<sub>s</sub> = sqrt(γRT/M)",     "gazda tovush tezligi"),
        ("v<sub>s</sub> ≈ 331 + 0.6t",      "havoda tovush tezligi (m/s, t—°C)"),
        ("I = E/(S·t) = A<super>2</super>ρvω<super>2</super>/2", "to'lqin intensivligi"),
        ("ν' = ν·(v ± v<sub>ting</sub>)/(v ∓ v<sub>man</sub>)", "Doppler effekti"),
    ], es))
    return elems


def bob4(es):
    """IV BOB — Molekulyar Fizika va Termodinamika"""
    elems = [bob_header_block(4, "MOLEKULYAR FIZIKA VA TERMODINAMIKA",
                               "Ideal va real gazlar, MKN, issiqlik o'tkazuvchanlik, termodinamika asoslari", None, es)]

    elems.append(section_title("4.1  Ideal Gaz — Asosiy Tenglamalar", es))
    elems.append(formula_group([
        ("pV = νRT",                        "Mendeleev-Klapeyron tenglamasi"),
        ("pV = NkT",                        "molekulalar soni orqali"),
        ("p = nkT",                         "n — molekulalar konsentratsiyasi"),
        ("R = 8.314 J/(mol·K)",             "universal gaz doimiysi"),
        ("k = 1.38×10<super>-23</super> J/K", "Boltzmann doimiysi"),
        ("N<sub>A</sub> = 6.022×10<super>23</super> mol<super>-1</super>", "Avogadro soni"),
        ("ν = m/M = N/N<sub>A</sub>",       "molyar miqdor"),
    ], es))

    elems.append(section_title("4.2  Molekulalar Kinetik Nazariyasi", es))
    elems.append(formula_group([
        ("p = (1/3)·nm&lt;v<super>2</super>&gt;",         "gaz bosimi (MKN)"),
        ("&lt;E<sub>k</sub>&gt; = (i/2)kT",               "o'rtacha kinetik energiya"),
        ("i = 3 (ato), 5 (ikki ato), 6 (ko'p ato)",       "erkinlik darajalari soni"),
        ("v<sub>ort</sub> = sqrt(8RT/(πM))",               "o'rtacha tezlik"),
        ("v<sub>kv</sub> = sqrt(3RT/M)",                   "kvadratik o'rtacha tezlik"),
        ("v<sub>eh</sub> = sqrt(2RT/M)",                   "eng ehtimollik tezlik"),
        ("λ = 1/(sqrt(2)·π·d<super>2</super>·n)",          "o'rtacha erkin yugurish yo'li"),
        ("z = n·σ·v<sub>ort</sub>",                        "o'rtacha to'qnashishlar soni"),
    ], es))

    elems.append(section_title("4.3  Termodinamika 1-Qonuni", es))
    elems.append(formula_group([
        ("Q = ΔU + A",                      "termodinamika 1-qonuni"),
        ("ΔU = νC<sub>V</sub>ΔT",           "ichki energiya o'zgarishi"),
        ("C<sub>V</sub> = (i/2)R",          "izoxajmli issiqlik sig'imi"),
        ("C<sub>P</sub> = C<sub>V</sub> + R = (i/2+1)R", "izobarli issiqlik sig'imi"),
        ("γ = C<sub>P</sub>/C<sub>V</sub> = (i+2)/i", "adiabata ko'rsatkichi"),
        ("A = νR·ΔT  (izobar)",             "izobar jarayonda ish"),
        ("A = 0  (izoxajm)",                "izoxajm jarayonda ish"),
        ("A = νRT·ln(V<sub>2</sub>/V<sub>1</sub>)  (izoterm)", "izoterm jarayonda ish"),
        ("pV<super>γ</super> = const  (adiabat)", "Puasson tenglamasi"),
    ], es))

    elems.append(section_title("4.4  Termodinamika 2-Qonuni va Karnо", es))
    elems.append(formula_group([
        ("η = A/Q<sub>1</sub> = 1 - Q<sub>2</sub>/Q<sub>1</sub>", "issiqlik mashinasi FIK"),
        ("η<sub>Karnо</sub> = 1 - T<sub>2</sub>/T<sub>1</sub>",   "Karnо sikli FIK (maksimal)"),
        ("ΔS = Q<sub>rev</sub>/T",           "entropiya o'zgarishi"),
        ("ΔS ≥ 0  (izolyats. sistema)",      "termodinamika 2-qonuni"),
        ("S = k·lnW",                        "Boltzmann entropiya formulasi"),
    ], es))

    elems.append(section_title("4.5  Real Gazlar", es))
    elems.append(formula_group([
        ("(p + a/V<sub>m</sub><super>2</super>)(V<sub>m</sub> - b) = RT", "Van-der-Vaals tenglamasi"),
        ("a — molekulalar o'zaro ta'sir korreksiyasi",  ""),
        ("b — molekulalar o'z hajmi korreksiyasi",      ""),
    ], es))
    return elems


def bob5(es):
    """V BOB — Elektrostatika"""
    elems = [bob_header_block(5, "ELEKTROSTATIKA",
                               "Kulon qonuni, elektr maydon, potensial, kondensatorlar", None, es)]

    elems.append(section_title("5.1  Kulon Qonuni va Elektr Maydon", es))
    elems.append(formula_group([
        ("F = k·|q<sub>1</sub>q<sub>2</sub>|/r<super>2</super>", "Kulon qonuni"),
        ("k = 1/(4πε<sub>0</sub>) = 9×10<super>9</super> N·m<super>2</super>/C<super>2</super>", "Kulon doimiysi"),
        ("ε<sub>0</sub> = 8.85×10<super>-12</super> F/m", "elektr doimiysi"),
        ("E = F/q",                         "elektr maydon kuchlanganligi"),
        ("E = k·Q/(ε·r<super>2</super>)",   "nuqtaviy zaryadning maydoni"),
        ("E<sub>cheks</sub> = σ/(2ε<sub>0</sub>ε)", "cheksiz tekislikning maydoni"),
        ("E<sub>cond</sub> = σ/(ε<sub>0</sub>ε)", "o'tkazgich sirtidagi maydon"),
    ], es))

    elems.append(section_title("5.2  Gauss Teoremasi", es))
    elems.append(formula_group([
        ("∮E·dS = Q<sub>ichki</sub>/ε<sub>0</sub>", "Gauss teoremasi (vakuum)"),
        ("∮D·dS = Q<sub>ichki</sub>",        "Gauss teoremasi (muhit)"),
        ("D = ε<sub>0</sub>εE",              "elektr siljish vektori"),
    ], es))

    elems.append(section_title("5.3  Potensial va Potensiallar Farqi", es))
    elems.append(formula_group([
        ("φ = k·Q/(ε·r)",                   "nuqtaviy zaryadning potensiali"),
        ("U<sub>12</sub> = φ<sub>1</sub> - φ<sub>2</sub>", "potensiallar farqi (kuchlanish)"),
        ("E = -grad(φ) = -dφ/dr",           "maydon va potensial bog'liqligi"),
        ("A = q(φ<sub>1</sub> - φ<sub>2</sub>)", "elektr kuchining ishi"),
        ("W = qφ",                           "potensial energiya"),
    ], es))

    elems.append(section_title("5.4  Kondensatorlar", es))
    elems.append(formula_group([
        ("C = Q/U",                          "elektr sig'im"),
        ("C<sub>tekis</sub> = ε<sub>0</sub>εS/d", "yassi kondensator sig'imi"),
        ("C<sub>kup</sub> = ε<sub>0</sub>ε·2πl/ln(R<sub>2</sub>/R<sub>1</sub>)", "silindrli kondensator"),
        ("C<sub>ketten</sub> = C<sub>1</sub> + C<sub>2</sub> + ...", "parallel ulash"),
        ("1/C<sub>kett</sub> = 1/C<sub>1</sub> + 1/C<sub>2</sub> + ...", "ketma-ket ulash"),
        ("W = CU<super>2</super>/2 = Q<super>2</super>/(2C) = QU/2", "kondensatordagi energiya"),
        ("w = ε<sub>0</sub>εE<super>2</super>/2",   "elektr maydon energiyasi zichligi"),
    ], es))
    return elems


def bob6(es):
    """VI BOB — O'zgarmas Tok"""
    elems = [bob_header_block(6, "O'ZGARMAS TOK",
                               "Om qonuni, qarshilik, EMK, Kirxgof qoidalari, tok ishi va quvvati", None, es)]

    elems.append(section_title("6.1  Tok va Qarshilik", es))
    elems.append(formula_group([
        ("I = dq/dt",                       "tok kuchi"),
        ("j = I/S = nqv<sub>drift</sub>",   "tok zichligi"),
        ("U = IR",                          "Om qonuni (zanjir qismi)"),
        ("R = ρl/S",                        "qarshilik (ρ — solenoidal qarshilik)"),
        ("ρ = ρ<sub>0</sub>(1 + αt)",       "qarshilikning temperaturaga bog'liqligi"),
        ("R<sub>kett</sub> = R<sub>1</sub> + R<sub>2</sub> + ...", "ketma-ket ulash"),
        ("1/R<sub>par</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ...", "parallel ulash"),
    ], es))

    elems.append(section_title("6.2  To'liq Zanjir uchun Om Qonuni", es))
    elems.append(formula_group([
        ("I = ε/(R + r)",                   "to'liq zanjir uchun Om qonuni"),
        ("U<sub>term</sub> = ε - Ir",       "terminal kuchlanish"),
        ("ε = A<sub>sirt</sub>/q",          "EMK (elektr yurituvchi kuch)"),
    ], es))

    elems.append(section_title("6.3  Kirxgof Qoidalari", es))
    elems.append(formula_group([
        ("sum(I<sub>k</sub>) = 0",          "Kirxgof 1-qoidasi (tugun)"),
        ("sum(ε<sub>k</sub>) = sum(I<sub>k</sub>R<sub>k</sub>)", "Kirxgof 2-qoidasi (kontur)"),
    ], es))

    elems.append(section_title("6.4  Tok Ishi va Quvvati", es))
    elems.append(formula_group([
        ("A = UIt = I<super>2</super>Rt = U<super>2</super>t/R", "tok ishi"),
        ("P = UI = I<super>2</super>R = U<super>2</super>/R", "tok quvvati"),
        ("Q = I<super>2</super>Rt",         "Joule-Lenz qonuni"),
        ("P<sub>maks</sub> = ε<super>2</super>/(4r)  (R=r da)", "manba maksimal quvvati"),
    ], es))
    return elems


def bob7(es):
    """VII BOB — Magnit Maydon"""
    elems = [bob_header_block(7, "MAGNIT MAYDON",
                               "Bio-Savar-Laplas, Amper va Lorens kuchlari, elektromagnit induksiya", None, es)]

    elems.append(section_title("7.1  Magnit Maydon Manbalari", es))
    elems.append(formula_group([
        ("dB = μ<sub>0</sub>/(4π) · I·dl×r̂/r<super>2</super>", "Bio-Savar-Laplas qonuni"),
        ("B<sub>sim</sub> = μ<sub>0</sub>I/(2πr)",              "to'g'ri sim magnit maydoni"),
        ("B<sub>sol</sub> = μ<sub>0</sub>nI",                   "solenoid ichidagi maydon"),
        ("B<sub>tor</sub> = μ<sub>0</sub>NI/(2πr)",             "toroid ichidagi maydon"),
        ("B<sub>markaz</sub> = μ<sub>0</sub>I/(2R)",            "aylanma tok markazida"),
        ("μ<sub>0</sub> = 4π×10<super>-7</super> H/m",          "magnit doimiysi"),
    ], es))

    elems.append(section_title("7.2  Magnit Maydon va Tok o'rtasidagi Qonunlar", es))
    elems.append(formula_group([
        ("∮B·dl = μ<sub>0</sub>I<sub>ichki</sub>",  "Amper to'la tok qonuni"),
        ("∮B·dS = 0",                                "magnit oqimning saqlanishi"),
        ("Φ = B·S·cosα",                             "magnit oqim"),
    ], es))

    elems.append(section_title("7.3  Kuchlar", es))
    elems.append(formula_group([
        ("F = qv×B",                        "Lorens kuchi"),
        ("F = q(E + v×B)",                  "Lorens kuchining to'liq ifodasi"),
        ("F = IL×B",                        "Amper kuchi"),
        ("F/l = μ<sub>0</sub>I<sub>1</sub>I<sub>2</sub>/(2πd)", "parallel simlardagi kuch"),
        ("M = pm×B",                        "magnit dipol momenti"),
        ("r = mv/(qB)",                     "zaryadli zarraning Larmor radiusi"),
    ], es))

    elems.append(section_title("7.4  Elektromagnit Induksiya", es))
    elems.append(formula_group([
        ("ε = -dΦ/dt",                      "Faraday induksiya qonuni"),
        ("ε = BLv",                         "o'tkazgich harakat qilganda EMK"),
        ("L = Φ/I",                         "o'z induktivlik koeffitsienti"),
        ("ε<sub>L</sub> = -L·dI/dt",        "o'z induktiv EMK"),
        ("M = Φ<sub>12</sub>/I<sub>1</sub>","o'zaro induktivlik"),
        ("W<sub>L</sub> = LI<super>2</super>/2", "induktivlikdagi energiya"),
        ("w<sub>m</sub> = B<super>2</super>/(2μ<sub>0</sub>μ)", "magnit maydon energiya zichligi"),
    ], es))
    return elems


def bob8(es):
    """VIII BOB — O'zgaruvchan Tok"""
    elems = [bob_header_block(8, "O'ZGARUVCHAN TOK VA ELEKTROMAGNIT TO'LQINLAR",
                               "AC zanjirlar, RLC, rezonans, Maxwell tenglamalari", None, es)]

    elems.append(section_title("8.1  O'zgaruvchan Tok Asoslari", es))
    elems.append(formula_group([
        ("u = U<sub>m</sub>sin(ωt)",         "kuchlanish (momentli qiymat)"),
        ("i = I<sub>m</sub>sin(ωt - φ)",     "tok"),
        ("U<sub>eff</sub> = U<sub>m</sub>/sqrt(2)", "effektiv kuchlanish"),
        ("I<sub>eff</sub> = I<sub>m</sub>/sqrt(2)", "effektiv tok"),
        ("ω = 2πν",                           "burchak chastota"),
    ], es))

    elems.append(section_title("8.2  Reaktans va To'la Qarshilik", es))
    elems.append(formula_group([
        ("X<sub>L</sub> = ωL",               "induktiv reaktans"),
        ("X<sub>C</sub> = 1/(ωC)",           "sig'imli reaktans"),
        ("Z = sqrt(R<super>2</super> + (X<sub>L</sub> - X<sub>C</sub>)<super>2</super>)", "to'la qarshilik (impedans)"),
        ("tgφ = (X<sub>L</sub> - X<sub>C</sub>)/R", "faza burchagi tg"),
        ("I = U/Z",                           "Om qonuni (AC)"),
    ], es))

    elems.append(section_title("8.3  Rezonans va Quvvat", es))
    elems.append(formula_group([
        ("ω<sub>0</sub> = 1/sqrt(LC)",        "rezonans chastotasi"),
        ("Q<sub>rez</sub> = ω<sub>0</sub>L/R = 1/(ω<sub>0</sub>CR)", "Q-faktor (rezonans sharpness)"),
        ("P = UI·cosφ",                       "faol quvvat"),
        ("Q = UI·sinφ",                       "reaktiv quvvat"),
        ("S = UI",                            "to'la quvvat"),
        ("cosφ",                              "quvvat koeffitsienti"),
        ("P<sub>tr</sub> = P<sub>1</sub>·η = P<sub>2</sub>", "transformator quvvati"),
        ("U<sub>1</sub>/U<sub>2</sub> = N<sub>1</sub>/N<sub>2</sub>", "transformator kuchlanish nisbati"),
    ], es))

    elems.append(section_title("8.4  Maxwell Tenglamalari", es))
    elems.append(formula_group([
        ("rot E = -∂B/∂t",                   "Faraday (Maxwell 3-tenglamasi)"),
        ("rot H = j + ∂D/∂t",               "Amper-Maksvel (4-tenglama)"),
        ("div D = ρ",                         "Gauss (elektr, 1-tenglama)"),
        ("div B = 0",                         "Gauss (magnit, 2-tenglama)"),
        ("c = 1/sqrt(ε<sub>0</sub>μ<sub>0</sub>) = 3×10<super>8</super> m/s", "yorug'lik tezligi"),
        ("I = cε<sub>0</sub>E<super>2</super>/2 = S<sub>Puant</sub>", "EM to'lqin intensivligi"),
        ("S = E×H",                           "Puanting vektori"),
    ], es))
    return elems


def bob9(es):
    """IX BOB — Optika"""
    elems = [bob_header_block(9, "OPTIKA",
                               "Geometrik optika, interferensiya, diffraktsiya, polyarizatsiya", None, es)]

    elems.append(section_title("9.1  Geometrik Optika Qonunlari", es))
    elems.append(formula_group([
        ("n = c/v",                          "sindirish ko'rsatkichi"),
        ("n<sub>1</sub>sinθ<sub>1</sub> = n<sub>2</sub>sinθ<sub>2</sub>", "Snell qonuni (sindirish)"),
        ("θ<sub>tushish</sub> = θ<sub>qaytish</sub>", "qaytish qonuni"),
        ("sinθ<sub>to'la</sub> = n<sub>2</sub>/n<sub>1</sub>", "to'la ichki qaytish burchagi"),
        ("D = 1/f",                          "optik kuch (dioptriялар)"),
        ("1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub>", "yupqa linza formulasi"),
        ("1/f = (n-1)(1/R<sub>1</sub> - 1/R<sub>2</sub>)", "linzasozlar formulasi"),
        ("Γ = d<sub>i</sub>/d<sub>o</sub>",  "linzaning kattalashtirishligi"),
    ], es))

    elems.append(section_title("9.2  Interferensiya", es))
    elems.append(formula_group([
        ("Δ = r<sub>2</sub> - r<sub>1</sub>", "optik yo'l farqi"),
        ("Δ = mλ  (m = 0, ±1, ±2...)",       "kuchayish sharti (yorug' zolaqlar)"),
        ("Δ = (m + 1/2)λ",                   "so'nish sharti (qorang'i zolaqlar)"),
        ("Δ = 2d·n·cosθ",                    "yupqa plyonkada interferensiya"),
        ("Δx = λL/a",                        "Young tajribasida zolaqlar orasi (a — tirqish orasi, L — ekran)"),
        ("r<sub>m</sub> = sqrt(mλR)",        "Nyuton halqalari radiusi"),
        ("L<sub>koh</sub> = λ<super>2</super>/Δλ", "kogerentlik uzunligi"),
    ], es))

    elems.append(section_title("9.3  Diffraktsiya", es))
    elems.append(formula_group([
        ("b·sinθ = mλ  (m = ±1, ±2...)",    "tirqishda minimumlar"),
        ("d·sinθ = mλ  (m = 0, ±1, ...)",   "diffraktsiya panjarasida maksimumlar"),
        ("d = 1/N",                          "panjara davri (N — 1 mm dagi chiziqlar)"),
        ("R = λ/δλ = mN",                    "ajratish kuchi"),
        ("2d·sinθ = mλ",                     "Bragg qonuni (rentgen diffraktsiyasi)"),
        ("r<sub>m</sub> = sqrt(mλb)",        "Frenel zonalari radiusi"),
    ], es))

    elems.append(section_title("9.4  Polyarizatsiya", es))
    elems.append(formula_group([
        ("I = I<sub>0</sub>/2",              "tabiiy yorug'likni polarizator o'tkazishi"),
        ("I = I<sub>0</sub>cos<super>2</super>φ", "Malus qonuni"),
        ("tgθ<sub>B</sub> = n",              "Bryuster burchagi"),
    ], es))
    return elems


def bob10(es):
    """X BOB — Maxsus Nisbiylik Nazariyasi"""
    elems = [bob_header_block(10, "MAXSUS NISBIYLIK NAZARIYASI",
                               "Lorens transformatsiyalari, vaqt va uzunlik, massa-energiya", None, es)]

    elems.append(section_title("10.1  Asosiy Postulatllar va Lorens Transformatsiyasi", es))
    elems.append(formula_group([
        ("c = 3×10<super>8</super> m/s = const", "yorug'lik tezligi (barcha inertsiyal sistemalarda)"),
        ("γ = 1/sqrt(1 - v<super>2</super>/c<super>2</super>)", "Lorens omili (γ ≥ 1)"),
        ("x' = γ(x - vt)",                  "koordinata transformatsiyasi"),
        ("t' = γ(t - vx/c<super>2</super>)", "vaqt transformatsiyasi"),
        ("v'<sub>x</sub> = (v<sub>x</sub> - u)/(1 - uv<sub>x</sub>/c<super>2</super>)", "relyativistik tezlik qo'shilishi"),
    ], es))

    elems.append(section_title("10.2  Vaqt, Uzunlik va Massa", es))
    elems.append(formula_group([
        ("Δt = γΔt<sub>0</sub>",            "vaqt cho'zilishi (Δt₀ — xos vaqt)"),
        ("l = l<sub>0</sub>/γ",             "uzunlik qisqarishi (l₀ — xos uzunlik)"),
        ("m = γm<sub>0</sub>",              "relyativistik massa"),
        ("p = γm<sub>0</sub>v",             "relyativistik impuls"),
    ], es))

    elems.append(section_title("10.3  Energiya va Massa", es))
    elems.append(formula_group([
        ("E = mc<super>2</super> = γm<sub>0</sub>c<super>2</super>", "to'liq energiya"),
        ("E<sub>0</sub> = m<sub>0</sub>c<super>2</super>", "tinchlik energiyasi"),
        ("E<sub>k</sub> = (γ - 1)m<sub>0</sub>c<super>2</super>", "kinetik energiya"),
        ("E<super>2</super> = (m<sub>0</sub>c<super>2</super>)<super>2</super> + (pc)<super>2</super>", "energiya-impuls bog'liqligi"),
        ("E = pc  (foton uchun, m<sub>0</sub>=0)", "foton energiyasi"),
    ], es))
    return elems


def bob11(es):
    """XI BOB — Kvant Mexanikasi"""
    elems = [bob_header_block(11, "KVANT MEXANIKASI",
                               "Fotoeffekt, de Broyl, Geyzenberg, Shredinger, atom modellari", None, es)]

    elems.append(section_title("11.1  Kvant Optika", es))
    elems.append(formula_group([
        ("E = hν = hc/λ",                   "foton energiyasi"),
        ("h = 6.626×10<super>-34</super> J·s", "Plank doimiysi"),
        ("ℏ = h/(2π) = 1.055×10<super>-34</super> J·s", "qisqartirilgan Plank doimiysi"),
        ("p<sub>foton</sub> = h/λ = E/c",   "foton impulsi"),
        ("E<sub>k</sub><sub>max</sub> = hν - A", "fotoeffekt (Einstein formulasi)"),
        ("λ<sub>maks</sub>T = b = 2.898×10<super>-3</super> m·K", "Vin qonuni"),
        ("M = σT<super>4</super>",           "Stefan-Boltzmann qonuni"),
        ("Δλ = λ<sub>K</sub>(1 - cosθ)",    "Kompton effekti; λ_K = 2.426 pm"),
    ], es))

    elems.append(section_title("11.2  De Broyl To'lqinlari va Noaniqlik Printsipi", es))
    elems.append(formula_group([
        ("λ = h/p = h/(mv)",                "de Broyl to'lqin uzunligi"),
        ("Δx·Δp<sub>x</sub> ≥ ℏ/2",        "Geyzenberg noaniqlik printsipi (koordinata-impuls)"),
        ("ΔE·Δt ≥ ℏ/2",                    "energiya-vaqt noaniqlik printsipi"),
        ("ΔL<sub>z</sub>·Δφ ≥ ℏ/2",        "burchak momenti noaniqlik printsipi"),
    ], es))

    elems.append(section_title("11.3  Shredinger Tenglamasi", es))
    elems.append(formula_group([
        ("iℏ·∂ψ/∂t = Ĥψ",                 "vaqtga bog'liq Shredinger tenglamasi"),
        ("(-ℏ<super>2</super>/2m)·∇<super>2</super>ψ + Uψ = Eψ", "statsionar Shredinger tenglamasi"),
        ("w = |ψ|<super>2</super>",         "ehtimollik zichligi"),
        ("∫|ψ|<super>2</super>dV = 1",      "to'liqlik sharti"),
        ("E<sub>n</sub> = n<super>2</super>π<super>2</super>ℏ<super>2</super>/(2mL<super>2</super>)", "quduqdagi energiya sathlari"),
    ], es))

    elems.append(section_title("11.4  Vodorod Atomi (Bor Modeli)", es))
    elems.append(formula_group([
        ("r<sub>n</sub> = n<super>2</super>·a<sub>0</sub>", "Bor radiusi (n — bosh kvant soni)"),
        ("a<sub>0</sub> = 0.0529 nm",        "birinchi Bor radiusi"),
        ("E<sub>n</sub> = -13.6/n<super>2</super> eV", "vodorod energiya sathlari"),
        ("1/λ = R<sub>∞</sub>(1/n<sub>1</sub><super>2</super> - 1/n<sub>2</sub><super>2</super>)", "Balmer-Ridberg formulasi"),
        ("R<sub>∞</sub> = 1.097×10<super>7</super> m<super>-1</super>", "Ridberg doimiysi"),
        ("n = 1,2,3...; l = 0..n-1; m<sub>l</sub> = -l..+l; m<sub>s</sub> = ±1/2", "kvant sonlari"),
    ], es))
    return elems


def bob12(es):
    """XII BOB — Qattiq Jism Fizikasi"""
    elems = [bob_header_block(12, "QATTIQ JISM FIZIKASI",
                               "Kristall tuzilishi, zona nazariyasi, yarimo'tkazgichlar, o'ta o'tkazuvchanlik", None, es)]

    elems.append(section_title("12.1  Kristall Panjarasining Asoslari", es))
    elems.append(formula_group([
        ("2d·sinθ = mλ",                    "Bragg difraktsiya qonuni"),
        ("d = a/sqrt(h<super>2</super>+k<super>2</super>+l<super>2</super>)", "Miller indekslari va tekisliklar orasi"),
        ("N<sub>A</sub> = ρ·N<sub>mol</sub>/M", "Avogadro soni (tajriba)"),
    ], es))

    elems.append(section_title("12.2  Fermi-Dirak Taqsimoti", es))
    elems.append(formula_group([
        ("f(E) = 1/(exp((E-E<sub>F</sub>)/kT) + 1)", "Fermi-Dirak taqsimoti"),
        ("E<sub>F</sub> = (ℏ<super>2</super>/2m)(3π<super>2</super>n)<super>2/3</super>", "Fermi energiyasi (T=0 da)"),
        ("n = integral(g(E)·f(E)dE)",        "elektron konsentratsiyasi"),
        ("g(E) = (4π/h<super>3</super>)(2m)<super>3/2</super>·sqrt(E)", "holat zichligi"),
    ], es))

    elems.append(section_title("12.3  Yarimo'tkazgichlar", es))
    elems.append(formula_group([
        ("n = n<sub>0</sub>·exp(-E<sub>g</sub>/(2kT))", "intrinsik yarim o'tkazgich n (i-tip)"),
        ("np = n<sub>i</sub><super>2</super>", "massa ta'sir qonuni"),
        ("σ = neμ<sub>e</sub> + peμ<sub>h</sub>", "elektr o'tkazuvchanlik"),
        ("I = I<sub>0</sub>(exp(eU/kT) - 1)", "p-n o'tish Volt-Amper xarakteristikasi"),
        ("E<sub>g</sub>(Si) = 1.12 eV; E<sub>g</sub>(Ge) = 0.67 eV", "band gap qiymatlari"),
    ], es))

    elems.append(section_title("12.4  O'ta O'tkazuvchanlik", es))
    elems.append(formula_group([
        ("ρ = 0  (T &lt; T<sub>c</sub>)",   "nol qarshilik (o'ta o'tkazuvchan holat)"),
        ("B = 0  (Meissner effekti)",        "magnit maydonni siqib chiqarish"),
        ("2eV = hν",                         "Josephson effekti — chastota-kuchlanish"),
        ("λ<sub>L</sub> = sqrt(m/(μ<sub>0</sub>ne<super>2</super>))", "London kirish chuqurligi"),
        ("Φ<sub>0</sub> = h/(2e) = 2.07×10<super>-15</super> Wb", "fluksoid (magnit oqim kvanty)"),
    ], es))
    return elems


def bob13(es):
    """XIII BOB — Yadro Fizikasi"""
    elems = [bob_header_block(13, "YADRO FIZIKASI",
                               "Yadro tuzilishi, radioaktivlik, yadroviy reaktsiyalar, bo'linish va sintez", None, es)]

    elems.append(section_title("13.1  Yadro Tuzilishi va Bog'lanish Energiyasi", es))
    elems.append(formula_group([
        ("A = Z + N",                        "massa soni (proton + neytron)"),
        ("R = R<sub>0</sub>·A<super>1/3</super>; R<sub>0</sub>=1.2 fm", "yadro radiusi"),
        ("Δm = Z·m<sub>p</sub> + N·m<sub>n</sub> - M<sub>yad</sub>", "massa defekti"),
        ("E<sub>bog</sub> = Δm·c<super>2</super>",  "bog'lanish energiyasi"),
        ("ε = E<sub>bog</sub>/A",            "nucleon boshiga bog'lanish energiyasi"),
        ("E<sub>bog</sub>/A ≈ 8.6 MeV",     "og'ir yadrolarda o'rtacha qiymat"),
        ("1 a.u.m. = 931.5 MeV/c<super>2</super>", "atom massa birligi (a.u.m.)"),
    ], es))

    elems.append(section_title("13.2  Radioaktiv Parchalanish", es))
    elems.append(formula_group([
        ("N(t) = N<sub>0</sub>·e<super>-λt</super>", "radioaktiv parchalanish qonuni"),
        ("T<sub>1/2</sub> = ln2/λ = 0.693/λ", "yarim parchalanish davri"),
        ("A = λN = A<sub>0</sub>·e<super>-λt</super>", "aktivlik (Bekkrel)"),
        ("1 Bq = 1 parchalanish/s",          "aktivlik birligi"),
        ("1 Ci = 3.7×10<super>10</super> Bq", "Kyuri"),
        ("<super>A</super><sub>Z</sub>X → <super>A-4</super><sub>Z-2</sub>Y + <super>4</super><sub>2</sub>He", "alfa parchalanish"),
        ("<super>A</super><sub>Z</sub>X → <super>A</super><sub>Z+1</sub>Y + e<super>-</super> + ν̄", "beta minus parchalanish"),
    ], es))

    elems.append(section_title("13.3  Yadroviy Reaktsiyalar", es))
    elems.append(formula_group([
        ("Q = (m<sub>kirish</sub> - m<sub>chiqish</sub>)c<super>2</super>", "reaktsiya energiyasi Q"),
        ("Q > 0 — ekzotermik;  Q &lt; 0 — endotermik", ""),
        ("E<sub>ostonasi</sub> = |Q|·(1 + m<sub>a</sub>/M<sub>A</sub>)", "ostonali kinetik energiya"),
    ], es))

    elems.append(section_title("13.4  Yadroviy Bo'linish va Sintez", es))
    elems.append(formula_group([
        ("<super>235</super>U + n → Bo'linish mahsulotlar + 2-3n + ~200 MeV", "uran bo'linishi"),
        ("k = η·ε·p·f·l<sub>fast</sub>·l<sub>therm</sub>",     "ko'payish koeffitsienti (6 faktor)"),
        ("k > 1 — zanjirli reaktsiya",       "reaktorning shartlari"),
        ("<super>2</super>H + <super>3</super>H → <super>4</super>He + n + 17.6 MeV", "D-T sintez reaktsiyasi"),
        ("Lawson: nτ ≥ 10<super>20</super> s/m<super>3</super>", "termoyaderovi sintez sharti"),
    ], es))
    return elems


def bob14(es):
    """XIV BOB — Elementar Zarralar"""
    elems = [bob_header_block(14, "ELEMENTAR ZARRALAR VA STANDART MODEL",
                               "Zarralar tasniflash, kvarklar, fundamental kuchlar, Standart Model", None, es)]

    elems.append(section_title("14.1  Zarralar Tasnifi", es))
    elems.append(formula_group([
        ("Fermionlar: spin = 1/2, 3/2...",   "Fermi-Dirak statistikasiga bo'ysunadi"),
        ("Bozonlar: spin = 0, 1, 2...",      "Boze-Eynshteyn statistikasiga bo'ysunadi"),
        ("Leptonlar (e, μ, τ, ν_e, ν_μ, ν_τ)", "kvarksiz zarralar, 6 ta"),
        ("Kvarklar (u, d, c, s, t, b)",      "rangli zaryadli fermionlar, 6 ta"),
        ("Hadronlar = mezonlar + barionlar",  "quark tarkibli zarralar"),
        ("Mezon: q-q̄  |  Barion: qqq",       "quark tarkibi"),
    ], es))

    elems.append(section_title("14.2  Saqlanish Qonunlari", es))
    elems.append(formula_group([
        ("B = const",                        "barion soni saqlanishi"),
        ("L<sub>e</sub>, L<sub>μ</sub>, L<sub>τ</sub> = const", "lepton sonlari saqlanishi"),
        ("Q = const",                        "elektr zaryadining saqlanishi"),
        ("S, C, B*, T = const (kuchli TA)", "strangeness va boshqa kvant sonlar"),
        ("E, p, L = const",                  "energiya, impuls, impuls momenti"),
    ], es))

    elems.append(section_title("14.3  Fundamental Kuchlar va Tashuvchilar", es))
    rows_data = [
        ["Kuch", "Tashuvchi", "Massa", "Kuch doimiysi", "Masofa"],
        ["Kuchli", "glyuon (g)", "0", "α_s ≈ 1", "~10⁻¹⁵ m"],
        ["Elektromagnit", "foton (γ)", "0", "α ≈ 1/137", "∞"],
        ["Kuchsiz", "W±, Z⁰", "80-91 GeV", "α_w ≈ 10⁻⁶", "~10⁻¹⁸ m"],
        ["Gravitatsion", "graviton (?)", "0 (?)", "α_g ~ 10⁻³⁸", "∞"],
    ]
    accent = BOB_COLORS[13]  # 14-bob rangi
    tbl = Table(rows_data, colWidths=["22%","20%","18%","22%","18%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), accent),
        ("TEXTCOLOR",     (0,0), (-1,0), colors.white),
        ("FONTNAME",      (0,0), (-1,0), "Arial-B"),
        ("FONTNAME",      (0,1), (-1,-1), "Arial"),
        ("FONTSIZE",      (0,0), (-1,-1), 8.5),
        ("GRID",          (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("ALIGN",         (0,0), (-1,-1), "CENTER"),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ]))
    elems.append(KeepTogether([sp(4), tbl, sp(4)]))

    elems.append(section_title("14.4  Standart Model Muhim Formulalari", es))
    elems.append(formula_group([
        ("α = e<super>2</super>/(4πε<sub>0</sub>ℏc) ≈ 1/137", "mayda tuzilish doimiysi"),
        ("m<sub>Higgs</sub> ≈ 125.1 GeV/c<super>2</super>", "Higgs bozon massasi (LHC, 2012)"),
        ("sin<super>2</super>θ<sub>W</sub> ≈ 0.231",          "Vaynberg burchagi"),
        ("e = g·sinθ<sub>W</sub>",           "elektr zaryad va kuchsiz tok bog'liqligi"),
        ("g<sub>s</sub> — kuchli o'zaro ta'sir kuchi (QCD)", "kvant xromodinamika"),
    ], es))
    return elems


# ─────────────────────────────────────────────────────────────────────────────
# Kolontitullar
# ─────────────────────────────────────────────────────────────────────────────
def make_header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    accent = colors.HexColor("#1e3a8a")
    canvas.setStrokeColor(accent)
    canvas.setLineWidth(2)
    canvas.line(1.5*cm, h - 1.0*cm, w - 1.5*cm, h - 1.0*cm)
    canvas.setFont("Arial-B", 8)
    canvas.setFillColor(accent)
    canvas.drawString(1.5*cm, h - 0.75*cm, "UMUMIY FIZIKA — FORMULALAR TO'PLAMI")
    canvas.setFont("Arial", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawRightString(w - 1.5*cm, h - 0.75*cm, "Barcha 14 bob · 2024")
    canvas.setStrokeColor(colors.HexColor("#e2e8f0"))
    canvas.setLineWidth(0.6)
    canvas.line(1.5*cm, 1.2*cm, w - 1.5*cm, 1.2*cm)
    canvas.setFont("Arial", 8)
    canvas.setFillColor(colors.HexColor("#94a3b8"))
    canvas.drawCentredString(w/2, 0.7*cm, f"Sahifa {doc.page}")
    canvas.restoreState()


# ─────────────────────────────────────────────────────────────────────────────
# Asosiy funksiya
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  UMUMIY FIZIKA FORMULALAR PDF GENERATORI")
    print("=" * 60)

    register_fonts()
    st  = make_styles()
    es  = extra_styles()

    out_path = os.path.join(OUT_DIR, "umumiy_fizika_FORMULALAR.pdf")
    pw, ph = A4

    doc = BaseDocTemplate(
        out_path,
        pagesize=A4,
        leftMargin=1.5*cm, rightMargin=1.5*cm,
        topMargin=1.8*cm,  bottomMargin=1.8*cm,
        title="Umumiy Fizika — Formulalar To'plami",
        author="Fizika Platformasi",
        subject="Barcha 14 bob formulalari ketma-ket",
    )

    frame = Frame(
        1.5*cm, 1.8*cm,
        pw - 3.0*cm, ph - 3.2*cm,
        id="main",
        leftPadding=0, rightPadding=0,
        topPadding=0,  bottomPadding=0,
    )
    doc.addPageTemplates([
        PageTemplate(id="main", frames=[frame], onPage=make_header_footer)
    ])

    # ── Muqova ────────────────────────────────────────────────────────────
    story = []
    cover = Table([[
        Paragraph("UMUMIY FIZIKA", st["subtitle"]),
        Paragraph("FORMULALAR TO'PLAMI", st["title"]),
        Paragraph("Barcha 14 Bob — 200+ Formula ketma-ket", st["subtitle"]),
        Paragraph("Manbalar: Irodov · Savelev · Halliday/Resnick · Feynman · Young/Freedman", st["subtitle"]),
    ]], colWidths=["100%"])
    cover.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ("LEFTPADDING",   (0,0), (-1,-1), 30),
        ("RIGHTPADDING",  (0,0), (-1,-1), 30),
        ("TOPPADDING",    (0,0), (-1,-1), 55),
        ("BOTTOMPADDING", (0,0), (-1,-1), 55),
        ("ALIGN",         (0,0), (-1,-1), "CENTER"),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ]))
    story.append(cover)
    story.append(sp(20))

    # Mundarija
    story.append(HRFlowable(width="100%", thickness=2,
                             color=colors.HexColor("#3b82f6"),
                             spaceAfter=8, spaceBefore=4))
    story.append(Paragraph("MUNDARIJA", st["toc_title"]))
    story.append(sp(6))
    bob_list = [
        "I BOB — Kinematika",
        "II BOB — Dinamika",
        "III BOB — Tebranishlar va To'lqinlar",
        "IV BOB — Molekulyar Fizika va Termodinamika",
        "V BOB — Elektrostatika",
        "VI BOB — O'zgarmas Tok",
        "VII BOB — Magnit Maydon",
        "VIII BOB — O'zgaruvchan Tok va Elektromagnit To'lqinlar",
        "IX BOB — Optika",
        "X BOB — Maxsus Nisbiylik Nazariyasi",
        "XI BOB — Kvant Mexanikasi",
        "XII BOB — Qattiq Jism Fizikasi",
        "XIII BOB — Yadro Fizikasi",
        "XIV BOB — Elementar Zarralar va Standart Model",
    ]
    for item in bob_list:
        story.append(Paragraph(f"  {item}", st["toc_item"]))
    story.append(sp(14))
    story.append(HRFlowable(width="100%", thickness=1,
                             color=colors.HexColor("#3b82f6"),
                             spaceAfter=4, spaceBefore=4))
    story.append(PageBreak())

    # ── Boblar ────────────────────────────────────────────────────────────
    builders = [bob1, bob2, bob3, bob4, bob5, bob6, bob7,
                bob8, bob9, bob10, bob11, bob12, bob13, bob14]

    for fn in builders:
        elems = fn(es)
        story.extend(elems)
        story.append(PageBreak())

    # ── Qurilish ─────────────────────────────────────────────────────────
    print("  PDF qurilmoqda...", end="", flush=True)
    t0 = time.time()
    doc.build(story)
    elapsed = time.time() - t0
    size_kb = os.path.getsize(out_path) // 1024
    print(f" OK  ({elapsed:.1f}s, {size_kb} KB)")
    print(f"\n  Fayl: {out_path}")
    print("=" * 60)
    print("  [OK] Formulalar PDF muvaffaqiyatli yaratildi!")
    print("=" * 60)


if __name__ == "__main__":
    main()
