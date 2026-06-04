"""
generate_maruzalar_pdf.py
=========================
Umumiy Fizika kursi uchun 14 ta bob PDF fayllarini yaratuvchi asosiy skript.

Ishlatish:
    cd backend
    python generate_maruzalar_pdf.py

Natija:
    media/maruzalar/umumiy_fizika_bob_01_kinematika.pdf
    media/maruzalar/umumiy_fizika_bob_02_dinamika.pdf
    ...
    media/maruzalar/umumiy_fizika_bob_14_elementar_zarralar.pdf
    media/maruzalar/umumiy_fizika_TOLIK_KURS.pdf   ← barcha boblar bitta faylda
"""

import os
import sys
import time

# Django sozlamalarini yuklamasdan to'g'ridan-to'g'ri reportlab ishlatamiz
# (standalone skript — Django runserver kerak emas)

from reportlab.platypus import (
    SimpleDocTemplate, BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, PageBreak, HRFlowable,
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors

# ── Mahalliy modullar ─────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pdf_generator.styles import register_fonts, make_styles, PAGE_W, PAGE_H, BOB_COLORS
from pdf_generator.builder import spacer, hr
from pdf_generator.content_1_5 import (
    build_bob1, build_bob2, build_bob3, build_bob4, build_bob5,
)
from pdf_generator.content_6_10 import (
    build_bob6, build_bob7, build_bob8, build_bob9, build_bob10,
)
from pdf_generator.content_11_14 import (
    build_bob11, build_bob12, build_bob13, build_bob14,
)

# ── Chiqish katalogi ──────────────────────────────────────────────────────────
OUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "media", "maruzalar"
)
os.makedirs(OUT_DIR, exist_ok=True)

# ── Bob ro'yxati ──────────────────────────────────────────────────────────────
BOBS = [
    (1,  "Kinematika",                    "kinematika",           build_bob1),
    (2,  "Dinamika",                      "dinamika",             build_bob2),
    (3,  "Tebranishlar va To'lqinlar",    "tebranishlar",         build_bob3),
    (4,  "Molekulyar Fizika",             "molekulyar_fizika",    build_bob4),
    (5,  "Elektrostatika",                "elektrostatika",       build_bob5),
    (6,  "O'zgarmas Tok",                 "ozgarmas_tok",         build_bob6),
    (7,  "Magnit Maydon",                 "magnit_maydon",        build_bob7),
    (8,  "O'zgaruvchan Tok",              "ozgaruvchan_tok",      build_bob8),
    (9,  "Optika",                        "optika",               build_bob9),
    (10, "Maxsus Nisbiylik",              "maxsus_nisbiylik",     build_bob10),
    (11, "Kvant Mexanikasi",              "kvant_mexanikasi",     build_bob11),
    (12, "Qattiq Jism Fizikasi",          "qattiq_jism",          build_bob12),
    (13, "Yadro Fizikasi",                "yadro_fizikasi",       build_bob13),
    (14, "Elementar Zarralar",            "elementar_zarralar",   build_bob14),
]

# ─────────────────────────────────────────────────────────────────────────────
# Kolontitul (sahifa boshi va pastki qismi)
# ─────────────────────────────────────────────────────────────────────────────
def make_page_templates(doc, bob_num: int, bob_title: str, st: dict):
    """Har bir PDF uchun kolontitullar bilan sahifa shabloni."""
    accent = BOB_COLORS[(bob_num - 1) % len(BOB_COLORS)]

    def header_footer(canvas, doc):
        canvas.saveState()
        w, h = A4

        # ── Yuqori chiziq ──
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(2)
        canvas.line(1.5 * cm, h - 1.0 * cm, w - 1.5 * cm, h - 1.0 * cm)

        # ── Yuqori matn ──
        canvas.setFont("Arial-B", 8)
        canvas.setFillColor(accent)
        canvas.drawString(1.5 * cm, h - 0.75 * cm,
                          f"UMUMIY FIZIKA — {bob_num}-BOB: {bob_title.upper()}")
        canvas.setFont("Arial", 8)
        canvas.setFillColor(colors.HexColor("#64748b"))
        canvas.drawRightString(w - 1.5 * cm, h - 0.75 * cm,
                               "Toshkent — 2024")

        # ── Pastki chiziq ──
        canvas.setStrokeColor(colors.HexColor("#e2e8f0"))
        canvas.setLineWidth(0.7)
        canvas.line(1.5 * cm, 1.2 * cm, w - 1.5 * cm, 1.2 * cm)

        # ── Sahifa raqami ──
        canvas.setFont("Arial", 8)
        canvas.setFillColor(colors.HexColor("#94a3b8"))
        page_text = f"Sahifa {doc.page}"
        canvas.drawCentredString(w / 2, 0.7 * cm, page_text)

        canvas.restoreState()

    _pw, _ph = A4
    frame = Frame(
        1.5 * cm,          # x
        1.8 * cm,          # y (pastdan)
        _pw - 3.0 * cm,    # kenglik
        _ph - 3.2 * cm,    # balandlik
        id="main",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    return PageTemplate(id="main", frames=[frame], onPage=header_footer)


# ─────────────────────────────────────────────────────────────────────────────
# Bitta bob PDF yaratish
# ─────────────────────────────────────────────────────────────────────────────
def build_single_bob_pdf(bob_num: int, bob_title: str, slug: str,
                         build_fn, st: dict) -> str:
    fname = f"umumiy_fizika_bob_{bob_num:02d}_{slug}.pdf"
    fpath = os.path.join(OUT_DIR, fname)

    doc = BaseDocTemplate(
        fpath,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title=f"Umumiy Fizika — {bob_num}-Bob: {bob_title}",
        author="Fizika Platformasi",
        subject="Umumiy Fizika Maruzalar Kursi",
    )

    template = make_page_templates(doc, bob_num, bob_title, st)
    doc.addPageTemplates([template])

    story = build_fn(st)
    doc.build(story)
    return fpath


# ─────────────────────────────────────────────────────────────────────────────
# To'liq kurs — barcha boblar bitta faylda
# ─────────────────────────────────────────────────────────────────────────────
def build_full_course_pdf(st: dict) -> str:
    """14 bob birlashtirilgan yagona PDF."""
    fpath = os.path.join(OUT_DIR, "umumiy_fizika_TOLIK_KURS.pdf")

    doc = BaseDocTemplate(
        fpath,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="Umumiy Fizika — To'liq Kurs (14 Bob)",
        author="Fizika Platformasi",
        subject="Umumiy Fizika Universiteti Kursi",
    )

    # To'liq kurs uchun neytral rang kolontituli
    def header_footer_full(canvas, doc_obj):
        canvas.saveState()
        w, h = A4
        canvas.setStrokeColor(colors.HexColor("#3b82f6"))
        canvas.setLineWidth(2)
        canvas.line(1.5 * cm, h - 1.0 * cm, w - 1.5 * cm, h - 1.0 * cm)
        canvas.setFont("Arial-B", 8)
        canvas.setFillColor(colors.HexColor("#1e3a8a"))
        canvas.drawString(1.5 * cm, h - 0.75 * cm,
                          "UMUMIY FIZIKA — TO'LIQ UNIVERSITETLAR KURSI")
        canvas.setFont("Arial", 8)
        canvas.setFillColor(colors.HexColor("#64748b"))
        canvas.drawRightString(w - 1.5 * cm, h - 0.75 * cm, "Toshkent — 2024")
        canvas.setStrokeColor(colors.HexColor("#e2e8f0"))
        canvas.setLineWidth(0.7)
        canvas.line(1.5 * cm, 1.2 * cm, w - 1.5 * cm, 1.2 * cm)
        canvas.setFont("Arial", 8)
        canvas.setFillColor(colors.HexColor("#94a3b8"))
        canvas.drawCentredString(w / 2, 0.7 * cm, f"Sahifa {doc_obj.page}")
        canvas.restoreState()

    frame_full = Frame(
        1.5 * cm, 1.8 * cm,
        PAGE_W - 3.0 * cm,
        PAGE_H - 3.2 * cm,
        id="main",
        leftPadding=0, rightPadding=0,
        topPadding=0,  bottomPadding=0,
    )
    tmpl = PageTemplate(id="main", frames=[frame_full],
                        onPage=header_footer_full)
    doc.addPageTemplates([tmpl])

    # ── Muqova sahifasi ────────────────────────────────────────────────────
    from reportlab.platypus import Table, TableStyle, KeepTogether
    from reportlab.lib.enums import TA_CENTER

    story = []
    cover_tbl = Table([[
        Paragraph("UMUMIY FIZIKA", st["subtitle"]),
        Paragraph("TO'LIQ UNIVERSITETLAR KURSI", st["title"]),
        Paragraph("14 Bob · 60+ Maruza · Formulalar va Masalalar", st["subtitle"]),
    ]], colWidths=["100%"])
    cover_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), colors.HexColor("#1e3a8a")),
        ("LEFTPADDING",  (0, 0), (-1, -1), 28),
        ("RIGHTPADDING", (0, 0), (-1, -1), 28),
        ("TOPPADDING",   (0, 0), (-1, -1), 50),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 50),
        ("ALIGN",        (0, 0), (-1, -1), "CENTER"),
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(cover_tbl)
    story.append(Spacer(1, 30))

    # Asosiy mundarija — barcha boblar
    story.append(HRFlowable(width="100%", thickness=2,
                             color=colors.HexColor("#3b82f6"),
                             spaceAfter=8, spaceBefore=4))
    story.append(Paragraph("MUNDARIJA", st["toc_title"]))
    story.append(Spacer(1, 8))
    for (bn, bt, _slug, _fn) in BOBS:
        story.append(Paragraph(f"{bn}. {bt}", st["toc_item"]))
    story.append(Spacer(1, 14))

    # Manbalar
    story.append(HRFlowable(width="100%", thickness=2,
                             color=colors.HexColor("#3b82f6"),
                             spaceAfter=8, spaceBefore=4))
    story.append(Paragraph("<b>Foydalanilgan adabiyotlar:</b>", st["h3"]))
    sources = [
        "• I. E. Irodov — Umumiy fizika kursi (3 jild), Mir nashriyoti",
        "• I. V. Savelev — Umumiy fizika kursi (3 jild)",
        "• S. P. Myasnikov, T. N. Osanova — Fizika bo'yicha qo'llanma",
        "• D. Halliday, R. Resnick, J. Walker — Fundamentals of Physics (10th ed.)",
        "• R. P. Feynman, R. B. Leighton, M. Sands — The Feynman Lectures on Physics",
        "• H. D. Young, R. A. Freedman — University Physics (14th ed.), Pearson",
        "• A. A. Pinsky — Zamonaviy fizika masalalari",
    ]
    for s in sources:
        story.append(Paragraph(s, st["bullet"]))
    story.append(PageBreak())

    # ── Boblar mazmunini ketma-ket qo'shamiz ──────────────────────────────
    for (bn, bt, _slug, build_fn) in BOBS:
        bob_story = build_fn(st)
        story.extend(bob_story)
        # Har bob PageBreak bilan tugaydi (cover_page ichida bor),
        # lekin qo'shimcha xavfsizlik uchun:
        story.append(PageBreak())

    doc.build(story)
    return fpath


# ─────────────────────────────────────────────────────────────────────────────
# Asosiy funksiya
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("=" * 65)
    print("  UMUMIY FIZIKA PDF GENERATOR")
    print("=" * 65)

    print("\n[1/3] Shriftlar ro'yxatdan o'tkazilmoqda...")
    register_fonts()
    print("      Arial, Arial-B, Arial-I, Arial-BI — OK")

    print("\n[2/3] Uslublar tayyorlanmoqda...")
    st = make_styles()
    print(f"      {len(st)} uslub yaratildi")

    print(f"\n[3/3] PDF fayllar yaratilyapti -> {OUT_DIR}\n")
    t0 = time.time()

    generated = []
    errors    = []

    # ── Alohida bob PDFlari ────────────────────────────────────────────────
    for (bob_num, bob_title, slug, build_fn) in BOBS:
        label = f"Bob {bob_num:02d}: {bob_title}"
        print(f"  >>  {label:<40}", end="", flush=True)
        try:
            t1 = time.time()
            fpath = build_single_bob_pdf(bob_num, bob_title, slug, build_fn, st)
            size_kb = os.path.getsize(fpath) // 1024
            elapsed = time.time() - t1
            print(f"OK  {size_kb:>5} KB  ({elapsed:.1f}s)")
            generated.append(fpath)
        except Exception as exc:
            print(f"XATO: {exc}")
            errors.append((label, str(exc)))

    # ── To'liq kurs PDFi ──────────────────────────────────────────────────
    print(f"\n  >>  {'TOLIQ KURS (14 bob)':<40}", end="", flush=True)
    try:
        t1 = time.time()
        fpath = build_full_course_pdf(st)
        size_kb = os.path.getsize(fpath) // 1024
        elapsed = time.time() - t1
        print(f"OK  {size_kb:>5} KB  ({elapsed:.1f}s)")
        generated.append(fpath)
    except Exception as exc:
        print(f"XATO: {exc}")
        errors.append(("To'liq kurs", str(exc)))

    # ── Natija ────────────────────────────────────────────────────────────
    total = time.time() - t0
    print("\n" + "=" * 65)
    print(f"  Jami: {len(generated)} fayl yaratildi, {len(errors)} xato")
    print(f"  Vaqt: {total:.1f} s")
    print(f"  Katalog: {OUT_DIR}")

    if errors:
        print("\n  XATOLAR:")
        for label, msg in errors:
            print(f"    - {label}: {msg}")

    print("=" * 65)
    if generated and not errors:
        print("\n  [OK] Barcha PDF fayllar muvaffaqiyatli yaratildi!\n")
    elif generated:
        print(f"\n  [!]  {len(generated)} ta fayl yaratildi, lekin xatolar mavjud.\n")
    else:
        print("\n  [X]  Hech qanday fayl yaratilmadi. Xatolarni tekshiring.\n")


if __name__ == "__main__":
    main()
