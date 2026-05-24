"""
Blender 4.x  |  Elektroskop + Elektrometr
Scripting tabida: Open → bu fayl → Run Script (▶)
"""

import bpy, math
from math import radians, sin, cos, pi

# ── sahna tozalash ────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
for c in [c for c in bpy.data.collections if c.name != "Scene Collection"]:
    bpy.data.collections.remove(c)

COL = bpy.data.collections.new("Physics_Instruments")
bpy.context.scene.collection.children.link(COL)


# ── yordamchi: kolleksiyaga qo'shish ─────────────────────────────────────────
def adopt(obj):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    COL.objects.link(obj)
    return obj


# ── material yaratish ─────────────────────────────────────────────────────────
def mkmat(name, r, g, b,
          metal=0.0, rough=0.5,
          trans=0.0, ior=1.45, alpha=1.0,
          emit_r=0.0, emit_g=0.0, emit_b=0.0, emit_str=0.0):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (r, g, b, 1)
    p.inputs["Metallic"].default_value   = metal
    p.inputs["Roughness"].default_value  = rough
    p.inputs["IOR"].default_value        = ior
    for k in ("Transmission Weight", "Transmission"):
        if k in p.inputs:
            p.inputs[k].default_value = trans; break
    for k in ("Emission Color",):
        if k in p.inputs and emit_str > 0:
            p.inputs[k].default_value = (emit_r, emit_g, emit_b, 1); break
    for k in ("Emission Strength",):
        if k in p.inputs and emit_str > 0:
            p.inputs[k].default_value = emit_str; break
    if alpha < 1.0:
        try: m.blend_method  = "BLEND"
        except Exception: pass
        try: m.shadow_method = "CLIP"
        except Exception: pass
        try: p.inputs["Alpha"].default_value = alpha
        except Exception: pass
    return m


def setmat(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


# ── materiallar ───────────────────────────────────────────────────────────────
MAT = {
    "silver":  mkmat("Silver",  0.75, 0.75, 0.78, metal=0.97, rough=0.08),
    "gold":    mkmat("Gold",    1.00, 0.77, 0.33, metal=1.00, rough=0.06),
    "foil":    mkmat("GoldFoil",1.00, 0.75, 0.08, metal=0.90, rough=0.18,
                      emit_r=1.0, emit_g=0.80, emit_b=0.15, emit_str=1.4),
    "glass":   mkmat("Glass",   0.88, 0.95, 1.00, metal=0.0,  rough=0.0,
                      trans=1.0, ior=1.50, alpha=1.0),
    "plug":    mkmat("Plug",    0.08, 0.08, 0.08, metal=0.0,  rough=0.95),
    "needle":  mkmat("Needle",  0.30, 0.30, 0.34, metal=0.75, rough=0.30,
                      emit_r=0.9, emit_g=0.9, emit_b=1.0, emit_str=0.9),
    "ground":  mkmat("Ground",  0.12, 0.12, 0.14, metal=0.6,  rough=0.5),
    "shield":  mkmat("Shield",  0.55, 0.57, 0.60, metal=0.75, rough=0.35),
}


# ── primitiv yaratuvchi funksiyalar ───────────────────────────────────────────
def cyl(name, r, h, loc, rx=0, ry=0, rz=0, mat=None, smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=r, depth=h, location=loc,
        rotation=(radians(rx), radians(ry), radians(rz)))
    o = bpy.context.active_object; o.name = name
    if smooth: bpy.ops.object.shade_smooth()
    if mat: setmat(o, MAT[mat])
    return adopt(o)


def sph(name, r, loc, mat=None):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=r, segments=40, ring_count=24, location=loc)
    o = bpy.context.active_object; o.name = name
    bpy.ops.object.shade_smooth()
    if mat: setmat(o, MAT[mat])
    return adopt(o)


def tor(name, R, r, loc, rx=0, ry=0, rz=0, mat=None):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=R, minor_radius=r,
        major_segments=64, minor_segments=16,
        location=loc,
        rotation=(radians(rx), radians(ry), radians(rz)))
    o = bpy.context.active_object; o.name = name
    bpy.ops.object.shade_smooth()
    if mat: setmat(o, MAT[mat])
    return adopt(o)


def cube(name, sx, sy, sz, loc, rx=0, ry=0, rz=0, mat=None):
    bpy.ops.mesh.primitive_cube_add(
        location=loc,
        rotation=(radians(rx), radians(ry), radians(rz)))
    o = bpy.context.active_object; o.name = name
    o.scale = (sx * 0.5, sy * 0.5, sz * 0.5)
    bpy.ops.object.transform_apply(scale=True)
    if mat: setmat(o, MAT[mat])
    return adopt(o)


# ─────────────────────────────────────────────────────────────────────────────
#   ELEKTROSKOP
#   Tuzilish:  poydevor → bo'yin → dumaloq shisha tana → sterjen → shar → yaproq
# ─────────────────────────────────────────────────────────────────────────────
def build_electroscope(ox, prefix="ES", leaf_deg=22.0):
    """
    ox        – X markaziy koordinata
    leaf_deg  – yaproq ochilish burchagi (0 = yopiq, 45 = to'liq ochiq)
    """
    lr = radians(leaf_deg)

    # ── Poydevor ─────────────────────────────────────────────────────────────
    cyl(f"{prefix}_Foot",       0.50, 0.09, (ox, 0, 0.045),            mat="silver")
    cyl(f"{prefix}_Stem",       0.09, 0.60, (ox, 0, 0.345),            mat="silver")
    tor(f"{prefix}_StemFlange", 0.28, 0.042, (ox, 0, 0.66),            mat="silver")

    # ── Dumaloq shisha tana ───────────────────────────────────────────────────
    # Tashqi metall halqa (doira, XZ tekisligida — ko'ruvchiga qarab turadi)
    tor(f"{prefix}_Ring",  0.56, 0.058, (ox, 0, 1.22), rx=90,          mat="silver")

    # Shisha disklar (old va orqa): inchin silindrlar, XZ tekisligi
    cyl(f"{prefix}_GlassFront", 0.545, 0.022, (ox,  0.29, 1.22), rx=90, mat="glass")
    cyl(f"{prefix}_GlassBack",  0.545, 0.022, (ox, -0.29, 1.22), rx=90, mat="glass")

    # Tepasidagi kichik ikkilamchi halqa (dekorativ, kuchaytiruvchi chiziq)
    tor(f"{prefix}_RingTop", 0.56, 0.022, (ox, 0, 1.78), rx=90,        mat="silver")

    # ── Plastik izolyator tiqin (tepada) ──────────────────────────────────────
    cyl(f"{prefix}_Plug",  0.062, 0.18, (ox, 0, 1.79),                  mat="plug")

    # ── Metall sterjen (vertikal, markazdan o'tadi) ────────────────────────────
    cyl(f"{prefix}_Rod",   0.022, 1.35, (ox, 0, 1.095),                 mat="silver")

    # ── Oltin shar (tepada) ────────────────────────────────────────────────────
    sph(f"{prefix}_Ball",  0.175, (ox, 0, 1.955),                       mat="gold")

    # ── Oltin folga yaproqchalari ─────────────────────────────────────────────
    # Yaproq geometriyasi:
    #   – juda yupqa (X=0.004), tor (Y=0.004), baland (Z=0.33) quti
    #   – Global Y o'qi atrofida ±lr ga buriladi
    #   – Markaziy koordinata: (±sin(lr)*H/2, 0, hinge_z - cos(lr)*H/2)
    H  = 0.33                   # yaproq uzunligi
    hz = 0.79                   # osish nuqtasi (sternjen pastki qismi)

    # Chap yaproq  (-X tomonga yoyiladi)
    lx = ox - sin(lr) * H / 2
    lz = hz - cos(lr) * H / 2
    cube(f"{prefix}_LeafL", 0.016, 0.006, H,
         (lx, 0, lz), ry=-leaf_deg,                                     mat="foil")

    # O'ng yaproq  (+X tomonga yoyiladi)
    rx2 = ox + sin(lr) * H / 2
    rz2 = hz - cos(lr) * H / 2
    cube(f"{prefix}_LeafR", 0.016, 0.006, H,
         (rx2, 0, rz2), ry=leaf_deg,                                    mat="foil")

    # Yaproq tutqichi (osish nuqtasidagi kichik disk)
    cyl(f"{prefix}_Hinge", 0.020, 0.022, (ox, 0, hz),                   mat="silver")

    # ── Ichki shkala chiziqlari (yoy shaklida, dekorativ) ─────────────────────
    for i in range(5):
        ang = radians(-50 + i * 25)
        tx  = ox + 0.44 * sin(ang)
        tz  = 1.22 + 0.44 * cos(ang)
        cube(f"{prefix}_Tick{i}", 0.006, 0.010, 0.052,
             (tx, 0, tz), rz=-math.degrees(ang),                        mat="silver")


# ─────────────────────────────────────────────────────────────────────────────
#   ELEKTROMETR
#   Elektroskopdek, lekin yaproq o'rniga aylanuvchi strelka bor
# ─────────────────────────────────────────────────────────────────────────────
def build_electrometer(ox, prefix="EM", deflect=0.0):
    """
    deflect – strelkaning og'ish burchagi daraja (0 = to'g'ri pastga)
    """
    dr = radians(deflect)

    # ── Poydevor (elektroskopnikidan biroz kattaroq) ──────────────────────────
    cyl(f"{prefix}_Foot",       0.56, 0.10, (ox, 0, 0.050),             mat="silver")
    cyl(f"{prefix}_Stem",       0.11, 0.68, (ox, 0, 0.390),             mat="silver")
    tor(f"{prefix}_StemFlange", 0.34, 0.046, (ox, 0, 0.74),             mat="silver")

    # ── Dumaloq shisha tana (kattaroq) ────────────────────────────────────────
    tor(f"{prefix}_Ring",  0.66, 0.065, (ox, 0, 1.38), rx=90,           mat="silver")
    cyl(f"{prefix}_GlassFront", 0.645, 0.022, (ox,  0.32, 1.38), rx=90, mat="glass")
    cyl(f"{prefix}_GlassBack",  0.645, 0.022, (ox, -0.32, 1.38), rx=90, mat="glass")

    # ── Metall himoya g'ilofi (orqa yarmi) ────────────────────────────────────
    # Yarim silindr sifatida: to'liq torus + orqa plastina
    tor(f"{prefix}_Shield",  0.67, 0.032, (ox, -0.15, 1.38), rx=90,     mat="silver")
    cube(f"{prefix}_ShieldBack", 1.36, 0.038, 0.58,
         (ox, -0.68, 1.38),                                              mat="shield")

    # Tepasidagi ring
    tor(f"{prefix}_RingTop", 0.66, 0.020, (ox, 0, 1.96), rx=90,         mat="silver")

    # ── Yerga ulanish belgisi (3 ta qisqarayuvchi gorizontal chiziq) ───────────
    for i, w in enumerate([0.28, 0.20, 0.12]):
        cube(f"{prefix}_Gnd{i}", w, 0.012, 0.018,
             (ox, -0.72, 0.88 - i * 0.076),                             mat="ground")
    cyl(f"{prefix}_GndStem", 0.009, 0.24, (ox, -0.72, 1.01),            mat="ground")

    # ── Izolyator tiqin ────────────────────────────────────────────────────────
    cyl(f"{prefix}_Plug",  0.070, 0.20, (ox, 0, 2.06),                  mat="plug")

    # ── Sterjen ────────────────────────────────────────────────────────────────
    cyl(f"{prefix}_Rod",   0.026, 1.28, (ox, 0, 1.320),                 mat="silver")

    # ── Oltin shar ─────────────────────────────────────────────────────────────
    sph(f"{prefix}_Ball",  0.195, (ox, 0, 2.265),                       mat="gold")

    # ── Aylanuvchi strelka ─────────────────────────────────────────────────────
    # Pivot: (ox, 0, 1.38) — tana markazi
    # Strelka pastga osilib turadi, deflect daraja og'adi
    H_needle = 0.55
    pivot_z  = 1.38
    n_cx = ox  + sin(dr) * H_needle / 2
    n_cz = pivot_z - cos(dr) * H_needle / 2
    cube(f"{prefix}_Needle", 0.018, 0.012, H_needle,
         (n_cx, 0, n_cz), ry=deflect,                                   mat="needle")

    # Strelka tutqichi (pivot nuqtasida kichik disk)
    cyl(f"{prefix}_NeedleHub", 0.028, 0.024, (ox, 0, pivot_z),          mat="silver")

    # ── Shkala chiziqlari (7 ta, yarim doira) ─────────────────────────────────
    for i in range(7):
        ang = radians(-65 + i * 21.7)
        tx  = ox + 0.54 * sin(ang)
        tz  = 1.38 + 0.54 * cos(ang)
        cube(f"{prefix}_Tick{i}", 0.008, 0.012, 0.058,
             (tx, 0, tz), rz=-math.degrees(ang),                        mat="silver")


# ─────────────────────────────────────────────────────────────────────────────
#   STOL (asboblar ustiga turadi)
# ─────────────────────────────────────────────────────────────────────────────
table_mat = mkmat("Table", 0.45, 0.32, 0.20, metal=0.0, rough=0.70)
MAT["table"] = table_mat

bpy.ops.mesh.primitive_cube_add(location=(0.3, 0, -0.20))
tbl = bpy.context.active_object
tbl.name = "TableTop"
tbl.scale = (4.5, 1.2, 0.15)
bpy.ops.object.transform_apply(scale=True)
setmat(tbl, table_mat)
adopt(tbl)

bpy.ops.mesh.primitive_cube_add(location=(0.3, 0, -1.05))
tbl2 = bpy.context.active_object
tbl2.name = "TableBase"
tbl2.scale = (4.2, 1.0, 0.7)
bpy.ops.object.transform_apply(scale=True)
setmat(tbl2, mkmat("TableBase", 0.35, 0.24, 0.14, metal=0.0, rough=0.80))
adopt(tbl2)


# ─────────────────────────────────────────────────────────────────────────────
#   JIHOZLARNI QURISH
# ─────────────────────────────────────────────────────────────────────────────

# Elektroskop (chap)
build_electroscope(-2.6, "ES", leaf_deg=22)

# Zaryadlanmagan elektrometr (o'rta)
build_electrometer( 0.4, "EM_neutral",  deflect=0)

# Zaryadlangan elektrometr (o'ng, strelka 42° og'gan)
build_electrometer( 3.0, "EM_charged",  deflect=42)


# ─────────────────────────────────────────────────────────────────────────────
#   KAMERA
# ─────────────────────────────────────────────────────────────────────────────
bpy.ops.object.camera_add(
    location=(0.3, -11.5, 4.2),
    rotation=(radians(80), 0, radians(1.5))
)
cam = bpy.context.active_object
cam.name = "Main_Camera"
cam.data.lens = 36
cam.data.clip_start = 0.1
cam.data.clip_end   = 100
adopt(cam)
bpy.context.scene.camera = cam


# ─────────────────────────────────────────────────────────────────────────────
#   YORUG'LIK
# ─────────────────────────────────────────────────────────────────────────────

# Asosiy quyosh (iliq sariq)
bpy.ops.object.light_add(type='SUN', location=(6, -6, 9))
key = bpy.context.active_object
key.name = "Light_Key"
key.data.energy = 5.0
key.data.color  = (1.0, 0.95, 0.85)
key.rotation_euler = (radians(35), radians(10), radians(30))
adopt(key)

# To'ldiruvchi (katta, yumshoq)
bpy.ops.object.light_add(type='AREA', location=(-5, -4, 6))
fill = bpy.context.active_object
fill.name = "Light_Fill"
fill.data.energy = 350
fill.data.size   = 6.0
fill.data.color  = (0.92, 0.95, 1.0)
fill.rotation_euler = (radians(45), 0, radians(-30))
adopt(fill)

# Orqa (chiroyli rim — ko'k)
bpy.ops.object.light_add(type='POINT', location=(0, 6, 5))
rim = bpy.context.active_object
rim.name = "Light_Rim"
rim.data.energy = 220
rim.data.color  = (0.65, 0.80, 1.0)
adopt(rim)

# Pastdan (soyalarni yumshatar)
bpy.ops.object.light_add(type='AREA', location=(0, -2, -0.5))
bot = bpy.context.active_object
bot.name = "Light_Bottom"
bot.data.energy = 80
bot.data.size   = 7.0
bot.rotation_euler = (radians(-90), 0, 0)
adopt(bot)

# O'ng yorug' (oltin rangi uchun)
bpy.ops.object.light_add(type='SPOT', location=(5, -3, 3))
right = bpy.context.active_object
right.name = "Light_Right"
right.data.energy = 180
right.data.color  = (1.0, 0.90, 0.65)
right.data.spot_size   = radians(60)
right.data.spot_blend  = 0.4
right.rotation_euler   = (radians(45), 0, radians(-45))
adopt(right)


# ─────────────────────────────────────────────────────────────────────────────
#   SAHNA FONI VA RENDER
# ─────────────────────────────────────────────────────────────────────────────

world = bpy.context.scene.world or bpy.data.worlds.new("World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value    = (0.72, 0.76, 0.82, 1.0)
    bg.inputs["Strength"].default_value = 0.9

scene = bpy.context.scene
scene.render.resolution_x          = 1920
scene.render.resolution_y          = 1080
scene.render.resolution_percentage = 100

# Cycles rendereri (shishani to'g'ri ko'rsatadi)
scene.render.engine = 'CYCLES'
try:
    scene.cycles.device        = 'GPU'
except Exception:
    scene.cycles.device        = 'CPU'
scene.cycles.samples           = 512
scene.cycles.use_denoising     = True
try:
    scene.cycles.denoiser      = 'OPENIMAGEDENOISE'
except Exception:
    pass
scene.cycles.max_bounces       = 8
scene.cycles.transmission_bounces = 12
try:
    # GPU preferences
    prefs = bpy.context.preferences
    cprefs = prefs.addons.get("cycles")
    if cprefs:
        cprefs.preferences.compute_device_type = 'OPTIX'
except Exception:
    pass


# ─────────────────────────────────────────────────────────────────────────────
#   3D VIEWPORT: MATERIAL PREVIEW MODE  (faqat GUI rejimida)
# ─────────────────────────────────────────────────────────────────────────────
if bpy.context.screen:
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                if space.type == 'VIEW_3D':
                    space.shading.type            = 'MATERIAL'
                    space.shading.use_scene_lights = True
                    space.shading.use_scene_world  = True
            break

    bpy.ops.object.select_all(action='DESELECT')
    for o in COL.objects:
        o.select_set(True)
    try:
        for area in bpy.context.screen.areas:
            if area.type == 'VIEW_3D':
                with bpy.context.temp_override(area=area):
                    bpy.ops.view3d.view_selected()
                break
    except Exception:
        pass
    bpy.ops.object.select_all(action='DESELECT')

# ─────────────────────────────────────────────────────────────────────────────
#   RENDER CHIQISH YO'LI  (background mode)
# ─────────────────────────────────────────────────────────────────────────────
import os, sys
OUT_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "renders")
OUT_FILE = os.path.join(OUT_DIR, "elektroskop_elektrometr.png")
os.makedirs(OUT_DIR, exist_ok=True)
scene.render.filepath              = OUT_FILE
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'

# Background rejimida avtomatik render
if "--background" in sys.argv or "-b" in sys.argv:
    print("► Render boshlandi …")
    bpy.ops.render.render(write_still=True)
    print(f"► Render saqlandi: {OUT_FILE}")

# ─────────────────────────────────────────────────────────────────────────────
print("=" * 55)
print("  Elektroskop va Elektrometr muvaffaqiyatli yaratildi!")
print(f"  Jami ob'ektlar: {len(list(COL.objects))}")
if not (bpy.context.screen):
    print(f"  Render: {OUT_FILE}")
else:
    print("  Render uchun:  F12")
print("=" * 55)
