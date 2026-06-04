# pdf_generator/builder.py  — PDF sahifalarini qurish yordamchilari

from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, HRFlowable,
    PageBreak, KeepTogether,
)
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame
from reportlab.lib.pagesizes import A4
from .styles import (
    PAGE_W, PAGE_H, C_ACCENT, C_DARK, C_LIGHT, C_WHITE,
    C_BORDER, C_FORMULA_BG, C_EXAMPLE_BG, C_WARNING_BG,
    C_BLACK, C_GRAY, C_GREEN, C_ORANGE, BOB_COLORS,
)

# ── Ajratuvchi chiziq ────────────────────────────────────────────────────────
def hr(color=C_BORDER, thickness=0.7):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=6, spaceBefore=4)

def spacer(h=6):
    return Spacer(1, h)

# ── Formula bloki ─────────────────────────────────────────────────────────────
def formula_box(lines: list[str], st: dict, desc_lines=None):
    """
    lines      — formulalar (har biri alohida qator)
    desc_lines — izohlari (ixtiyoriy)
    """
    elems = []
    for line in lines:
        elems.append(Paragraph(line, st["formula"]))
    if desc_lines:
        for d in desc_lines:
            elems.append(Paragraph(d, st["formula_desc"]))
    tbl = Table([[elems]], colWidths=["100%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), C_FORMULA_BG),
        ("BOX",         (0,0), (-1,-1), 1.2, colors.HexColor("#bfdbfe")),
        ("LEFTPADDING", (0,0), (-1,-1), 14),
        ("RIGHTPADDING",(0,0), (-1,-1), 14),
        ("TOPPADDING",  (0,0), (-1,-1), 10),
        ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ]))
    return KeepTogether([spacer(4), tbl, spacer(4)])

# ── Misol bloki ──────────────────────────────────────────────────────────────
def example_box(title: str, problem: str, solution_lines: list[str], st: dict):
    inner = [
        Paragraph(f"📌 {title}", st["example_head"]),
        Paragraph(problem, st["example_body"]),
        Paragraph("<b>Yechim:</b>", st["example_body"]),
    ]
    for line in solution_lines:
        inner.append(Paragraph(line, st["example_body"]))
    tbl = Table([[inner]], colWidths=["100%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), C_EXAMPLE_BG),
        ("BOX",         (0,0), (-1,-1), 1.0, colors.HexColor("#6ee7b7")),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING",(0,0), (-1,-1), 12),
        ("TOPPADDING",  (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
    ]))
    return KeepTogether([spacer(4), tbl, spacer(4)])

# ── Eslatma bloki ────────────────────────────────────────────────────────────
def note_box(text: str, st: dict, kind="info"):
    bg = {"info": C_FORMULA_BG, "warning": C_WARNING_BG,
          "success": C_EXAMPLE_BG}.get(kind, C_FORMULA_BG)
    border = {"info": colors.HexColor("#93c5fd"),
              "warning": colors.HexColor("#fcd34d"),
              "success": colors.HexColor("#6ee7b7")}.get(kind, C_BORDER)
    icons = {"info": "ℹ️", "warning": "⚠️", "success": "✅"}
    icon = icons.get(kind, "ℹ️")
    tbl = Table([[Paragraph(f"{icon}  {text}", st["body_left"])]], colWidths=["100%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), bg),
        ("BOX",          (0,0), (-1,-1), 1.0, border),
        ("LEFTPADDING",  (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("TOPPADDING",   (0,0), (-1,-1), 7),
        ("BOTTOMPADDING",(0,0), (-1,-1), 7),
    ]))
    return KeepTogether([spacer(3), tbl, spacer(3)])

# ── Jadval ───────────────────────────────────────────────────────────────────
def data_table(headers: list, rows: list[list], st: dict, col_widths=None):
    data = [[Paragraph(f"<b>{h}</b>", st["body_left"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), st["body_left"]) for c in row])
    tbl = Table(data, colWidths=col_widths)
    style = [
        ("BACKGROUND",   (0,0), (-1,0), colors.HexColor("#dbeafe")),
        ("TEXTCOLOR",    (0,0), (-1,0), colors.HexColor("#1e3a8a")),
        ("GRID",         (0,0), (-1,-1), 0.5, C_BORDER),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),
         [colors.white, colors.HexColor("#f8fafc")]),
        ("FONTNAME",     (0,0), (-1,0), "Arial-B"),
        ("FONTNAME",     (0,1), (-1,-1), "Arial"),
        ("FONTSIZE",     (0,0), (-1,-1), 9.5),
        ("ALIGN",        (0,0), (-1,-1), "LEFT"),
        ("LEFTPADDING",  (0,0), (-1,-1), 7),
        ("TOPPADDING",   (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
    ]
    tbl.setStyle(TableStyle(style))
    return KeepTogether([spacer(4), tbl, spacer(4)])

# ── Muqova sahifasi ──────────────────────────────────────────────────────────
def cover_page(bob_num: int, bob_title: str, subtitle: str,
               lessons: list[str], st: dict):
    accent = BOB_COLORS[(bob_num - 1) % len(BOB_COLORS)]
    elems = []

    # Yuqori rangli blok — jadval orqali
    header_data = [[
        Paragraph(f"UMUMIY FIZIKA", st["subtitle"]),
        Paragraph(f"{bob_num}-BOB", st["title"]),
        Paragraph(bob_title, st["title"]),
        Paragraph(subtitle, st["subtitle"]),
    ]]
    cover_tbl = Table([header_data[0]], colWidths=["100%"])
    cover_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), accent),
        ("LEFTPADDING",  (0,0), (-1,-1), 24),
        ("RIGHTPADDING", (0,0), (-1,-1), 24),
        ("TOPPADDING",   (0,0), (-1,-1), 40),
        ("BOTTOMPADDING",(0,0), (-1,-1), 40),
        ("ALIGN",        (0,0), (-1,-1), "CENTER"),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
    ]))
    elems.append(cover_tbl)
    elems.append(spacer(24))

    # Mundarija
    elems.append(hr(accent, 2))
    elems.append(Paragraph("MUNDARIJA", st["toc_title"]))
    elems.append(spacer(6))
    for i, lesson in enumerate(lessons, 1):
        elems.append(Paragraph(f"{i}. {lesson}", st["toc_item"]))
    elems.append(spacer(12))
    elems.append(hr(accent, 2))

    # Manba
    elems.append(spacer(16))
    sources = [
        "• I. E. Irodov — Umumiy fizika kursi (3 jild)",
        "• S. P. Myasnikov, T. N. Osanova — Fizika qo'llanmasi",
        "• D. Halliday, R. Resnick — Fundamentals of Physics (10th ed.)",
        "• R. P. Feynman — Feynman Lectures on Physics",
        "• H. D. Young, R. A. Freedman — University Physics (14th ed.)",
    ]
    elems.append(Paragraph("<b>Foydalanilgan adabiyotlar:</b>", st["h3"]))
    for s in sources:
        elems.append(Paragraph(s, st["bullet"]))
    elems.append(PageBreak())
    return elems

# ── Maruza sarlavhasi ────────────────────────────────────────────────────────
def lecture_header(num: int, title: str, bob_num: int, st: dict):
    accent = BOB_COLORS[(bob_num - 1) % len(BOB_COLORS)]
    tbl = Table([[
        Paragraph(f"Maruza {num}", st["header_bar"]),
        Paragraph(title, st["h1"]),
    ]], colWidths=[60, "*"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (0,0), accent),
        ("TEXTCOLOR",   (0,0), (0,0), C_WHITE),
        ("ALIGN",       (0,0), (0,0), "CENTER"),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING",  (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LINEBELOW",   (0,0), (-1,-1), 2, accent),
    ]))
    return KeepTogether([spacer(10), tbl, spacer(8)])

# ── Nazorat savollari bloki ───────────────────────────────────────────────────
def questions_block(questions: list[str], st: dict):
    elems = [
        hr(C_ORANGE, 1.5),
        Paragraph("📝 NAZORAT SAVOLLARI VA MASALALAR", st["h2"]),
    ]
    for i, q in enumerate(questions, 1):
        elems.append(Paragraph(f"{i}. {q}", st["question"]))
    elems.append(spacer(8))
    return KeepTogether(elems)

# ── Xulosa bloki ─────────────────────────────────────────────────────────────
def summary_box(points: list[str], st: dict):
    inner = [Paragraph("<b>BOB XULOSA — ASOSIY FORMULALAR VA QONUNLAR</b>", st["h3"])]
    for p in points:
        inner.append(Paragraph(f"▶  {p}", st["bullet"]))
    tbl = Table([[inner]], colWidths=["100%"])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), colors.HexColor("#f0f9ff")),
        ("BOX",          (0,0), (-1,-1), 1.5, C_ACCENT),
        ("LEFTPADDING",  (0,0), (-1,-1), 14),
        ("RIGHTPADDING", (0,0), (-1,-1), 14),
        ("TOPPADDING",   (0,0), (-1,-1), 10),
        ("BOTTOMPADDING",(0,0), (-1,-1), 10),
    ]))
    return KeepTogether([spacer(8), tbl, spacer(8)])
