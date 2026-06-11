"""
Stage spotlight (Fresnel/barn-door) – Blender 5.1 Python script
Exports: frontend/public/models/spotlight.glb

Orientation (export frame):
  +Z  = hook / hanging point (top)
  -Z  = lens face (front / light output)
  +X  = right side
"""
import bpy, math, os

# ── Cleanup ──────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials):   bpy.data.materials.remove(m)
for me in list(bpy.data.meshes):      bpy.data.meshes.remove(me)

OUT = r"C:\Users\user\Desktop\Fizika AI\frontend\public\models\spotlight.glb"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# ── Materials ─────────────────────────────────────────────────────────────
def mak(name, rgb, metal=0.7, rough=0.35, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs[0].default_value = (*rgb, 1.0)     # Base Color
    p.inputs["Metallic"].default_value   = metal
    p.inputs["Roughness"].default_value  = rough
    if emit > 0:
        try:
            p.inputs["Emission Color"].default_value    = (*rgb, 1.0)
            p.inputs["Emission Strength"].default_value = emit
        except KeyError:
            p.inputs["Emission"].default_value = (*rgb, 1.0)
            try: p.inputs["Emission Strength"].default_value = emit
            except: pass
    return m

MB = mak("Body",  (0.06, 0.06, 0.07), metal=0.50, rough=0.65)
MM = mak("Metal", (0.30, 0.31, 0.33), metal=0.92, rough=0.18)
ML = mak("Lens",  (1.00, 0.90, 0.62), metal=0.05, rough=0.04, emit=8.0)
MR = mak("Ring",  (0.82, 0.74, 0.52), metal=0.10, rough=0.10, emit=4.0)
MD = mak("Door",  (0.08, 0.08, 0.09), metal=0.45, rough=0.70)

objs = []

# ── Helpers ───────────────────────────────────────────────────────────────
def cyl(name, r, h, loc, rot=(0,0,0), mt=MB, seg=32):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=seg, radius=r, depth=h, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.clear(); o.data.materials.append(mt)
    objs.append(o); return o

def box(name, sx, sy, sz, loc, rot=(0,0,0), mt=MB):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name; o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.clear(); o.data.materials.append(mt)
    objs.append(o); return o

def tor(name, R, r, loc, mt=MM, ms=64, ns=8):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=R, minor_radius=r,
        major_segments=ms, minor_segments=ns, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.clear(); o.data.materials.append(mt)
    objs.append(o); return o

# ═══════════════════════════════════════════════════════════════════════════
# 1. HOUSING  (truncated cylinder body)
# ═══════════════════════════════════════════════════════════════════════════
cyl("Housing",  r=0.46, h=0.76, loc=(0, 0, 0),      mt=MB, seg=48)
tor("FrontRim", R=0.46, r=0.030, loc=(0, 0, -0.40), mt=MM)
tor("BackRim",  R=0.46, r=0.022, loc=(0, 0,  0.40), mt=MM)
cyl("RearCap",  r=0.44, h=0.030, loc=(0, 0,  0.40), mt=MM, seg=32)

# Ventilation ribs on sides (thin raised strips)
for ang_deg in range(0, 360, 30):
    a = math.radians(ang_deg)
    cyl(f"Rib{ang_deg}", r=0.015, h=0.60,
        loc=(0.462*math.cos(a), 0.462*math.sin(a), 0.02),
        mt=MM, seg=6)

# ═══════════════════════════════════════════════════════════════════════════
# 2. FRESNEL LENS
# ═══════════════════════════════════════════════════════════════════════════
cyl("LensDisc", r=0.395, h=0.026, loc=(0, 0, -0.405), mt=ML, seg=64)

for i, (R, r) in enumerate([
    (0.08, 0.018), (0.155, 0.016), (0.228, 0.015),
    (0.300, 0.014), (0.360, 0.013)]):
    tor(f"LR{i}", R=R, r=r, loc=(0, 0, -0.421), mt=MR, ms=64, ns=6)

# ═══════════════════════════════════════════════════════════════════════════
# 3. BARN DOORS  (4 flat panels hinged to front edge)
# ═══════════════════════════════════════════════════════════════════════════
# Each door: width W, depth L (extension from hinge), thickness T
# Opens by angle 'a' outward from the front face (-Z plane).
#
# Geometry (top door, pivoting at y=+0.44, z=-0.40):
#   center_y = 0.44 + (L/2)*cos(a)
#   center_z = -0.40 - (L/2)*sin(a)
#   rotation around X: positive a = door opens upward/forward

W = 0.96   # door panel width
L = 0.46   # door panel depth (from hinge edge)
T = 0.024  # door thickness
a = 0.50   # opening angle ~28°
HINGE = 0.44  # radial distance from z-axis to hinge

cy_center = HINGE + (L/2)*math.cos(a)
cz_center = -0.40 - (L/2)*math.sin(a)

box("BarnTop",    W,  L, T, loc=( 0,  cy_center, cz_center), rot=(-a, 0,  0), mt=MD)
box("BarnBottom", W,  L, T, loc=( 0, -cy_center, cz_center), rot=( a, 0,  0), mt=MD)
box("BarnLeft",   L,  W, T, loc=(-cy_center, 0,  cz_center), rot=( 0, a,  0), mt=MD)
box("BarnRight",  L,  W, T, loc=( cy_center, 0,  cz_center), rot=( 0,-a,  0), mt=MD)

# Hinge strip along each side of front face
HS = 0.035   # hinge strip thickness
for sign in (1, -1):
    box(f"HingeH{sign}", W+0.06, HS, 0.06,
        loc=(0, sign*0.46, -0.41), mt=MM)
    box(f"HingeV{sign}", HS, W+0.06, 0.06,
        loc=(sign*0.46, 0, -0.41), mt=MM)

# ═══════════════════════════════════════════════════════════════════════════
# 4. YOKE / HANGING BRACKET
# ═══════════════════════════════════════════════════════════════════════════
# Horizontal bar across the top
cyl("YokeBar",  r=0.038, h=1.14, loc=(0,0,0.57),
    rot=(0, math.pi/2, 0), mt=MM, seg=12)

# Side arms (from bar ends down to housing sides)
for sx in (-0.57, 0.57):
    cyl(f"Arm{int(sx*100)}",  r=0.030, h=0.60, loc=(sx, 0, 0.27), mt=MM, seg=10)
    # Pivot bolt
    cyl(f"Bolt{int(sx*100)}", r=0.050, h=0.07, loc=(sx, 0, -0.01),
        rot=(0, math.pi/2, 0), mt=MM, seg=10)

# Top clamp tube
cyl("Clamp",     r=0.055, h=0.14, loc=(0, 0, 0.75), mt=MM, seg=16)
cyl("ClampCap",  r=0.048, h=0.04, loc=(0, 0, 0.84), mt=MM, seg=16)

# Hanging ring / shackle
tor("HangRing",  R=0.078, r=0.022, loc=(0, 0, 0.90), mt=MM, ms=32, ns=8)

# ─── All objects are now created; join them ──────────────────────────────
bpy.ops.object.select_all(action='DESELECT')
for o in objs:
    if o and o.name in bpy.data.objects:
        o.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
bpy.ops.object.join()
combined = bpy.context.active_object
combined.name = "StageSpotlight"

# Center origin
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
# Shift so that the hanging ring is exactly at Z=0 (world origin = hang point)
# Hang ring was at z=0.90 before centering. After origin_set the mesh shifts.
# Let's just keep geometry origin at center and handle offset in Three.js.

# ─── Export ──────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format='GLB',
    use_selection=False,
    export_materials='EXPORT',
    export_apply=True,
)
print(f"\n✓  Spotlight exported  →  {OUT}\n")
