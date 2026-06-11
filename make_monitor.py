"""
Physics scoreboard — hanging from above (no floor poles)
28-unit wide (70% of 40-unit track), 7-unit tall

Screen faces -Y Blender → +Z Three.js (toward camera)
Height along +Z Blender → +Y Three.js
"""
import bpy, math, os

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)

OUT = r"C:\Users\user\Desktop\Fizika AI\frontend\public\models\monitor.glb"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# ── Materials ─────────────────────────────────────────────────────────────
def mak(name, rgb, metal=0.80, rough=0.25, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs[0].default_value = (*rgb, 1)
    p.inputs["Metallic"].default_value  = metal
    p.inputs["Roughness"].default_value = rough
    if emit > 0:
        try:
            p.inputs["Emission Color"].default_value    = (*rgb, 1)
            p.inputs["Emission Strength"].default_value = emit
        except KeyError:
            p.inputs["Emission"].default_value = (*rgb, 1)
    return m

MB  = mak("Body",  (0.05, 0.06, 0.08), metal=0.72, rough=0.32)
MF  = mak("Frame", (0.20, 0.21, 0.24), metal=0.90, rough=0.16)
MS  = mak("Screen",(0.01, 0.02, 0.05), metal=0.00, rough=0.02)
MLB = mak("LedB",  (0.10, 0.55, 1.00), metal=0.00, rough=0.04, emit=8)
MLG = mak("LedG",  (0.08, 1.00, 0.45), metal=0.00, rough=0.04, emit=6)
MLA = mak("LedA",  (1.00, 0.65, 0.08), metal=0.00, rough=0.04, emit=5)
MST = mak("Steel", (0.12, 0.13, 0.16), metal=0.85, rough=0.30)
MCA = mak("Cable", (0.10, 0.11, 0.13), metal=0.80, rough=0.50)

def box(name, sx, sy, sz, loc=(0,0,0), rot=(0,0,0), mt=MB):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name; o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.clear(); o.data.materials.append(mt)
    return o

def cyl(name, r, h, loc=(0,0,0), rot=(0,0,0), mt=MST, seg=16):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h,
        location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    o.data.materials.clear(); o.data.materials.append(mt)
    return o

def tor(name, R, r, loc, mt=MST, ms=32, ns=8):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=R, minor_radius=r,
        major_segments=ms, minor_segments=ns, location=loc)
    o = bpy.context.active_object; o.name = name
    o.data.materials.clear(); o.data.materials.append(mt)
    return o

# ════════════════════════════════════════════════════════════════════════
# Dimensions
# ════════════════════════════════════════════════════════════════════════
SW     = 28.0   # screen width
SH     =  7.0   # screen height
SD     =  0.55  # housing depth
BZ     =  0.40  # bezel width
HC     =  9.0   # screen centre height (Three.js Y / Blender Z)
SCR_Z  = HC - SH/2               # = 5.5  (bottom of screen)
TOP_Z  = HC + SH/2 + BZ          # = 13.0 (top of housing)
HANG_Z = 17.0                    # rigging bar height
CABLE_H = HANG_Z - TOP_Z         # = 4.0
CABLE_ZC = (HANG_Z + TOP_Z) / 2  # = 15.0 (cable midpoint)
LO     = BZ + 0.012              # LED strip offset

# ════════════════════════════════════════════════════════════════════════
# 1.  HOUSING
# ════════════════════════════════════════════════════════════════════════
box("Housing",     SW/2+BZ, SD/2, SH/2+BZ, loc=(0, 0, HC))
box("ScreenGlass", SW/2, 0.022, SH/2,       loc=(0, -(SD/2-0.025), HC), mt=MS)

# Bezel strips (front face)
box("BzTop", SW/2+BZ, 0.030, BZ/2, loc=(0, -(SD/2+0.016), HC+SH/2+BZ/2), mt=MF)
box("BzBot", SW/2+BZ, 0.030, BZ/2, loc=(0, -(SD/2+0.016), HC-SH/2-BZ/2), mt=MF)
box("BzL",   BZ/2, 0.030, SH/2,    loc=(-(SW/2+BZ/2), -(SD/2+0.016), HC), mt=MF)
box("BzR",   BZ/2, 0.030, SH/2,    loc=( SW/2+BZ/2,  -(SD/2+0.016), HC), mt=MF)

# LED accent strips (blue glow)
box("LB_T", SW/2+LO, 0.018, 0.022, loc=(0,            -(SD/2+LO*0.5), HC+SH/2+LO), mt=MLB)
box("LB_B", SW/2+LO, 0.018, 0.022, loc=(0,            -(SD/2+LO*0.5), HC-SH/2-LO), mt=MLB)
box("LB_L", 0.022,   0.018, SH/2+LO, loc=(-(SW/2+LO), -(SD/2+LO*0.5), HC), mt=MLB)
box("LB_R", 0.022,   0.018, SH/2+LO, loc=( SW/2+LO,  -(SD/2+LO*0.5), HC), mt=MLB)

# Corner accents (green)
for cx, cz in [(-1,1),(1,1),(-1,-1),(1,-1)]:
    box(f"CA{cx}{cz}", 0.12, 0.028, 0.12,
        loc=(cx*(SW/2+BZ), -(SD/2+0.022), HC+cz*(SH/2+BZ)), mt=MLG)

# Rear cooling ribs
for i in range(14):
    xr = -SW/2+0.6 + i*(SW-1.2)/13
    box(f"Rib{i}", 0.030, 0.040, SH/2+BZ-0.15, loc=(xr, SD/2+0.032, HC), mt=MF)

# Top and bottom edge caps
box("TopCap", SW/2+BZ+0.10, SD/2+0.02, 0.055, loc=(0, 0, TOP_Z+0.045), mt=MF)
box("BotCap", SW/2+BZ+0.10, SD/2+0.02, 0.055, loc=(0, 0, SCR_Z-0.38),  mt=MF)

# Amber status bar (bottom front)
box("StatusBar", SW/2+BZ, 0.026, 0.085,
    loc=(0, -(SD/2+0.020), SCR_Z-0.065), mt=MLA)

# Status LED dots
for i, (mc, dx) in enumerate([(MLB,-2.0),(MLG,0),(MLA,2.0)]):
    cyl(f"StatusDot{i}", 0.065, 0.024,
        loc=(dx, -(SD/2+0.028), SCR_Z-0.065),
        rot=(math.pi/2, 0, 0), mt=mc, seg=10)

# ════════════════════════════════════════════════════════════════════════
# 2.  TOP MOUNTING BRACKETS  (where cables attach to housing)
# ════════════════════════════════════════════════════════════════════════
BRKT_X = SW * 0.40   # bracket x position

for bx in (-BRKT_X, BRKT_X):
    # L-shaped bracket welded to housing top
    box(f"BrktH{bx:.0f}", 0.28, SD/2+0.06, 0.18,
        loc=(bx, 0, TOP_Z+0.16), mt=MF)
    box(f"BrktV{bx:.0f}", 0.22, 0.060, 0.30,
        loc=(bx, 0, TOP_Z+0.44), mt=MF)
    # Shackle / cable attachment pin
    cyl(f"Pin{bx:.0f}", 0.055, SD/2*1.3,
        loc=(bx, 0, TOP_Z+0.55),
        rot=(math.pi/2, 0, 0), mt=MF, seg=8)
    tor(f"Shackle{bx:.0f}", R=0.10, r=0.028,
        loc=(bx, 0, TOP_Z+0.60), mt=MF)

# ════════════════════════════════════════════════════════════════════════
# 3.  HANGING CABLES  (4 cables: 2 front, 2 back)
# ════════════════════════════════════════════════════════════════════════
for cx in (-BRKT_X, BRKT_X):
    for cy in (-(SD/2+0.02), (SD/2+0.02)):
        cyl(f"Cable{cx:.0f}_{cy:.2f}", r=0.042, h=CABLE_H,
            loc=(cx, cy, CABLE_ZC), mt=MCA, seg=8)

# ════════════════════════════════════════════════════════════════════════
# 4.  RIGGING BAR  (horizontal truss at top where cables terminate)
# ════════════════════════════════════════════════════════════════════════
box("RigBar",    SW/2*0.90, 0.24, 0.28, loc=(0, 0, HANG_Z), mt=MST)
box("RigBarExt", SW/2*0.90+0.60, 0.14, 0.14, loc=(0, 0, HANG_Z), mt=MF)

# Diagonal braces on the rig bar
for i, xb in enumerate([-SW*0.30, -SW*0.10, SW*0.10, SW*0.30]):
    box(f"RigDiag{i}", 0.10, 0.12, 0.60,
        loc=(xb, 0, HANG_Z),
        rot=(0, math.radians(35), 0), mt=MST)

# Cable clamps on rigging bar top
for cx in (-BRKT_X, BRKT_X):
    box(f"Clamp{cx:.0f}", 0.22, 0.30, 0.18, loc=(cx, 0, HANG_Z+0.22), mt=MF)

# Central hanging chain (goes further up off-screen)
cyl("ChainUpper", r=0.055, h=3.0,
    loc=(0, 0, HANG_Z+1.65), mt=MCA, seg=8)
tor("ChainRing1", R=0.10, r=0.030,
    loc=(0, 0, HANG_Z+0.18), mt=MF)
tor("ChainRing2", R=0.10, r=0.030,
    loc=(0, 0, HANG_Z+3.12), mt=MF)

# ════════════════════════════════════════════════════════════════════════
# 5.  EXPORT
# ════════════════════════════════════════════════════════════════════════
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=OUT, export_format='GLB',
    use_selection=False, export_materials='EXPORT', export_apply=True,
)
print(f"\n✓  Scoreboard exported  →  {OUT}")
print(f"   SW={SW}  SH={SH}  HC(Three.js Y)={HC:.2f}")
print(f"   TOP_Z={TOP_Z:.2f}  HANG_Z={HANG_Z:.2f}")
