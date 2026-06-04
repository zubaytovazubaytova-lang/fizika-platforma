# pdf_generator/styles.py  — reportlab stil va ranglar

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors

PAGE_W, PAGE_H = A4

# ── Fontlar ──────────────────────────────────────────────────────────────────
def register_fonts():
    base = r"C:\Windows\Fonts"
    pdfmetrics.registerFont(TTFont("Arial",     f"{base}\\arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-B",   f"{base}\\arialbd.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-I",   f"{base}\\ariali.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-BI",  f"{base}\\arialbi.ttf"))
    pdfmetrics.registerFontFamily(
        "Arial",
        normal="Arial", bold="Arial-B",
        italic="Arial-I", boldItalic="Arial-BI",
    )

# ── Ranga palitrasi ─────────────────────────────────────────────────────────
C_DARK   = colors.HexColor("#0f172a")
C_ACCENT = colors.HexColor("#3b82f6")
C_GREEN  = colors.HexColor("#10b981")
C_ORANGE = colors.HexColor("#f59e0b")
C_RED    = colors.HexColor("#ef4444")
C_PURPLE = colors.HexColor("#8b5cf6")
C_CYAN   = colors.HexColor("#06b6d4")
C_GRAY   = colors.HexColor("#64748b")
C_LIGHT  = colors.HexColor("#f1f5f9")
C_WHITE  = colors.white
C_BLACK  = colors.HexColor("#1e293b")
C_BORDER = colors.HexColor("#cbd5e1")
C_FORMULA_BG = colors.HexColor("#eff6ff")
C_EXAMPLE_BG = colors.HexColor("#f0fdf4")
C_WARNING_BG = colors.HexColor("#fff7ed")

BOB_COLORS = [
    colors.HexColor("#2563eb"),  # 1 - Kinematika
    colors.HexColor("#7c3aed"),  # 2 - Dinamika
    colors.HexColor("#0891b2"),  # 3 - Tebranishlar
    colors.HexColor("#059669"),  # 4 - Molekulyar
    colors.HexColor("#dc2626"),  # 5 - Elektrostatika
    colors.HexColor("#d97706"),  # 6 - O'zgarmas tok
    colors.HexColor("#4f46e5"),  # 7 - Magnit
    colors.HexColor("#0d9488"),  # 8 - Optika
    colors.HexColor("#b45309"),  # 9 - Yadro
    colors.HexColor("#1d4ed8"),  # 10 - EMI
    colors.HexColor("#6d28d9"),  # 11 - Nisbiylik
    colors.HexColor("#065f46"),  # 12 - Kvant
    colors.HexColor("#7e22ce"),  # 13 - Qattiq jism
    colors.HexColor("#991b1b"),  # 14 - Elementar zarralar
]

# ── Paragraph stillari ───────────────────────────────────────────────────────
def make_styles():
    register_fonts()
    s = {}

    s["title"] = ParagraphStyle(
        "title", fontName="Arial-B", fontSize=26,
        textColor=C_WHITE, alignment=TA_CENTER,
        spaceAfter=8, leading=32,
    )
    s["subtitle"] = ParagraphStyle(
        "subtitle", fontName="Arial-I", fontSize=13,
        textColor=colors.HexColor("#bfdbfe"), alignment=TA_CENTER,
        spaceAfter=4, leading=18,
    )
    s["h1"] = ParagraphStyle(
        "h1", fontName="Arial-B", fontSize=16,
        textColor=C_ACCENT, spaceBefore=18, spaceAfter=8,
        leading=22, borderPad=4,
    )
    s["h2"] = ParagraphStyle(
        "h2", fontName="Arial-B", fontSize=13,
        textColor=C_BLACK, spaceBefore=12, spaceAfter=5,
        leading=18,
    )
    s["h3"] = ParagraphStyle(
        "h3", fontName="Arial-B", fontSize=11,
        textColor=C_GRAY, spaceBefore=8, spaceAfter=4,
        leading=15,
    )
    s["body"] = ParagraphStyle(
        "body", fontName="Arial", fontSize=10.5,
        textColor=C_BLACK, alignment=TA_JUSTIFY,
        spaceAfter=5, leading=16, firstLineIndent=14,
    )
    s["body_left"] = ParagraphStyle(
        "body_left", fontName="Arial", fontSize=10.5,
        textColor=C_BLACK, alignment=TA_LEFT,
        spaceAfter=4, leading=16,
    )
    s["formula"] = ParagraphStyle(
        "formula", fontName="Arial-B", fontSize=11,
        textColor=colors.HexColor("#1e40af"), alignment=TA_CENTER,
        spaceAfter=3, spaceBefore=3, leading=18,
        backColor=C_FORMULA_BG,
    )
    s["formula_desc"] = ParagraphStyle(
        "formula_desc", fontName="Arial-I", fontSize=9.5,
        textColor=C_GRAY, alignment=TA_LEFT,
        spaceAfter=2, leading=14, leftIndent=20,
    )
    s["example_head"] = ParagraphStyle(
        "example_head", fontName="Arial-B", fontSize=10.5,
        textColor=colors.HexColor("#065f46"), alignment=TA_LEFT,
        spaceAfter=3, leading=15, leftIndent=10,
    )
    s["example_body"] = ParagraphStyle(
        "example_body", fontName="Arial", fontSize=10,
        textColor=C_BLACK, alignment=TA_JUSTIFY,
        spaceAfter=3, leading=15, leftIndent=10,
    )
    s["bullet"] = ParagraphStyle(
        "bullet", fontName="Arial", fontSize=10.5,
        textColor=C_BLACK, alignment=TA_LEFT,
        spaceAfter=3, leading=15, leftIndent=18, bulletIndent=6,
    )
    s["question"] = ParagraphStyle(
        "question", fontName="Arial", fontSize=10.5,
        textColor=C_BLACK, alignment=TA_LEFT,
        spaceAfter=4, leading=15, leftIndent=20,
    )
    s["caption"] = ParagraphStyle(
        "caption", fontName="Arial-I", fontSize=9,
        textColor=C_GRAY, alignment=TA_CENTER,
        spaceAfter=6, leading=13,
    )
    s["header_bar"] = ParagraphStyle(
        "header_bar", fontName="Arial-B", fontSize=9,
        textColor=C_GRAY, alignment=TA_LEFT,
        leading=12,
    )
    s["footer"] = ParagraphStyle(
        "footer", fontName="Arial-I", fontSize=8.5,
        textColor=C_GRAY, alignment=TA_CENTER, leading=11,
    )
    s["toc_title"] = ParagraphStyle(
        "toc_title", fontName="Arial-B", fontSize=12,
        textColor=C_ACCENT, alignment=TA_LEFT,
        spaceAfter=4, leading=16,
    )
    s["toc_item"] = ParagraphStyle(
        "toc_item", fontName="Arial", fontSize=10.5,
        textColor=C_BLACK, alignment=TA_LEFT,
        spaceAfter=3, leading=15, leftIndent=10,
    )
    s["definition"] = ParagraphStyle(
        "definition", fontName="Arial-I", fontSize=10.5,
        textColor=colors.HexColor("#1e3a5f"), alignment=TA_JUSTIFY,
        spaceAfter=4, leading=16, leftIndent=16, rightIndent=8,
    )
    return s
