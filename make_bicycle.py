"""
Mountain bicycle (dark frame, green suspension fork) — Blender 5.1 Python script
Exports: frontend/public/models/bicycle.glb

Coordinate plan (Blender, Z-up — converts to Three.js Y-up on export):
  +X = forward / front-wheel side   (matches the Car/Truck headlight convention:
                                      every vehicle in TezlikSim treats local +X as "front")
  +Z = up                            → +Y in Three.js
   Y = lateral / frame thickness     → -Z in Three.js
Ground (wheel-bottom contact) sits at Z = 0, axle height = wheel radius (0.40),
matching how Human/old-Bicycle keep their contact point near local origin.

Two top-level objects are exported:
  "BikeFrame" – static joined mesh: tubes, fork, cockpit, seat, cassette, derailleur
  "Pedals"    – separate joined mesh (crank + chainring), spun in React via rotation.x

Wheels are intentionally NOT modelled here — TezlikSim renders them procedurally
with the exact same torus + `rotation={[0,Math.PI/2,0]}` + `rotation.x += d` recipe
used by Car/Truck/Motorcycle/old-Bicycle, so orientation and roll animation stay
100% consistent with the rest of the moving-object fleet (only the broken FRAME —
the actual "katta xatolik" — is replaced by real connected geometry).
"""
import bpy, math, os
import mathutils

# ── Cleanup ───────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for m  in list(bpy.data.materials): bpy.data.materials.remove(m)
for me in list(bpy.data.meshes):    bpy.data.meshes.remove(me)

OUT = r"C:\Users\user\Desktop\Fizika AI\frontend\public\models\bicycle.glb"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# ── Materials (dark mountain-bike palette with green fork accent) ─────────
def mak(name, rgb, metal=0.5, rough=0.45, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs[0].default_value = (*rgb, 1.0)
    p.inputs["Metallic"].default_value  = metal
    p.inputs["Roughness"].default_value = rough
    if emit > 0:
        try:
            p.inputs["Emission Color"].default_value    = (*rgb, 1.0)
            p.inputs["Emission Strength"].default_value = emit
        except KeyError:
            p.inputs["Emission"].default_value = (*rgb, 1.0)
    return m

M_FRAME  = mak("Frame",  (0.045, 0.050, 0.055), metal=0.55, rough=0.40)
M_GREEN  = mak("Green",  (0.07,  0.24,  0.11),  metal=0.45, rough=0.38)
M_DARK   = mak("Dark",   (0.05,  0.055, 0.06),  metal=0.65, rough=0.30)
M_GRIP   = mak("Grip",   (0.05,  0.05,  0.055), metal=0.05, rough=0.75)
M_SADDLE = mak("Saddle", (0.04,  0.04,  0.045), metal=0.10, rough=0.65)
M_GEAR   = mak("Gear",   (0.58,  0.59,  0.61),  metal=0.88, rough=0.28)

objs  = []   # → joined into "BikeFrame"
pobjs = []   # → joined into "Pedals"

def cyl(name, r, h, loc, mt, rot=None, seg=14, target=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h, location=loc)
    o = bpy.context.active_object
    o.name = name
    if rot is not None:
        o.rotation_euler = rot
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    o.data.materials.clear(); o.data.materials.append(mt)
    (target if target is not None else objs).append(o)
    return o

def box(name, sx, sy, sz, loc, mt, target=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name; o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.clear(); o.data.materials.append(mt)
    (target if target is not None else objs).append(o)
    return o

def tube(name, p1, p2, r, mt, seg=10, target=None):
    """Cylinder spanning two exact points — guarantees connected joints
    (the old model's bug was hand-guessed Euler angles that never quite met)."""
    v1, v2 = mathutils.Vector(p1), mathutils.Vector(p2)
    d = v2 - v1
    length = d.length
    mid = (v1 + v2) / 2
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=length, location=mid)
    o = bpy.context.active_object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(d)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    o.data.materials.clear(); o.data.materials.append(mt)
    (target if target is not None else objs).append(o)
    return o

def disc(name, r, h, loc, mt, target=None):
    """Thin cylinder with its flat face along local +X — the same axle
    orientation the wheels end up with after the React-side rotation."""
    return cyl(name, r, h, loc, mt, rot=(0, math.radians(90), 0), seg=24, target=target)

# ════════════════════════════════════════════════════════════════════════
# Joints — Blender Z-up, ground = Z 0, wheel radius R = 0.40 (axle z = R)
# ════════════════════════════════════════════════════════════════════════
R = 0.40
A = (-0.65, 0.0, R)        # rear axle
C = ( 0.65, 0.0, R)        # front axle
B = ( 0.00, 0.0, R + 0.06) # bottom bracket
D = ( 0.48, 0.0, 0.70)     # head-tube bottom
E = ( 0.56, 0.0, 0.99)     # head-tube top
F = (-0.27, 0.0, 0.97)     # seat-tube top
G = (-0.31, 0.0, 1.09)     # saddle anchor
H = ( 0.58, 0.0, 1.15)     # handlebar centre

# tiny anchor at the world origin → the joined mesh's local space stays == world space
cyl("Anchor", 0.001, 0.001, (0, 0, 0), M_FRAME)

# ── Main diamond frame ──
tube("DownTube", B, D, 0.030, M_FRAME)
tube("TopTube",  F, E, 0.026, M_FRAME)
tube("SeatTube", B, F, 0.030, M_FRAME)
tube("HeadTube", D, E, 0.036, M_DARK)

# rear stays — paired, straddle the wheel and meet at a dropout bridge
for s in (-0.075, 0.075):
    tube(f"ChainStay{s}", (B[0], s, B[2]), (A[0], s, A[2]), 0.018, M_FRAME)
    tube(f"SeatStay{s}",  (F[0], s, F[2]), (A[0], s, A[2]), 0.016, M_FRAME)
tube("RearBridge", (A[0], -0.075, A[2]), (A[0], 0.075, A[2]), 0.020, M_FRAME)

# ── Suspension fork (green, like the reference photo) ──
for s in (-0.055, 0.055):
    tube(f"ForkLeg{s}", (D[0] + 0.02, s, D[2] - 0.05), (C[0], s, C[2]), 0.026, M_GREEN)
box("ForkCrown", 0.075, 0.16, 0.05, (D[0] + 0.01, 0, D[2] - 0.03), M_GREEN)
tube("FrontBridge", (C[0], -0.055, C[2]), (C[0], 0.055, C[2]), 0.018, M_GREEN)

# ── Cockpit ──
tube("Stem", E, H, 0.022, M_FRAME)
tube("Handlebar", (H[0], H[1] - 0.27, H[2]), (H[0], H[1] + 0.27, H[2]), 0.018, M_FRAME)
for s in (-0.27, 0.27):
    tube(f"Grip{s}", (H[0], s, H[2]), (H[0], s + (0.05 if s < 0 else -0.05), H[2]), 0.026, M_GRIP)

# ── Seat ──
tube("SeatPost", F, G, 0.018, M_FRAME)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.13, location=(G[0] - 0.02, 0, G[2] + 0.02),
                                     segments=14, ring_count=10)
o = bpy.context.active_object; o.name = "Saddle"
o.scale = (1.55, 0.62, 0.42)
bpy.ops.object.transform_apply(scale=True)
o.data.materials.clear(); o.data.materials.append(M_SADDLE)
objs.append(o)

# ── Rear cassette (decreasing discs stacked on the hub, faces +X like the wheel) ──
for i in range(5):
    disc(f"Cog{i}", 0.155 - i * 0.018, 0.018, (A[0] + 0.05 + i * 0.02, 0, A[2]), M_GEAR)

# ── Rear derailleur (hanging arm + pulley wheel) ──
tube("DerCage", (A[0] - 0.04, 0.07, A[2] - 0.04), (A[0] - 0.13, 0.07, A[2] - 0.21), 0.014, M_DARK)
disc("DerPulley", 0.045, 0.02, (A[0] - 0.13, 0.07, A[2] - 0.21), M_GEAR)

# ════════════════════════════════════════════════════════════════════════
# Pedals / crank — separate object, built around its own local origin,
# then offset to the bottom-bracket position so React can spin it in place
# ════════════════════════════════════════════════════════════════════════
AXLE_HALF = 0.085
ARM_LEN   = 0.18
cyl("CrankAxle", 0.025, AXLE_HALF * 2 + 0.02, (0, 0, 0), M_FRAME,
    rot=(0, math.radians(90), 0), target=pobjs)
for side, phase in ((-1, 1), (1, -1)):
    x   = side * AXLE_HALF
    end = (x, 0, phase * ARM_LEN)
    tube(f"CrankArm{side}", (x, 0, 0), end, 0.020, M_FRAME, target=pobjs)
    box(f"Pedal{side}", 0.05, 0.10, 0.022, (x + side * 0.025, 0, end[2]), M_GRIP, target=pobjs)
disc("Chainring", 0.13, 0.022, (AXLE_HALF + 0.05, 0, 0), M_GEAR, target=pobjs)

# ════════════════════════════════════════════════════════════════════════
# Join groups, position Pedals, export
# ════════════════════════════════════════════════════════════════════════
def join(group, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in group:
        if o and o.name in bpy.data.objects:
            o.select_set(True)
    bpy.context.view_layer.objects.active = group[0]
    bpy.ops.object.join()
    j = bpy.context.active_object
    j.name = name
    return j

bike   = join(objs,  "BikeFrame")
pedals = join(pobjs, "Pedals")
pedals.location = B

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB',
                          use_selection=False, export_materials='EXPORT', export_apply=True)
print(f"\n✓  Bicycle exported  →  {OUT}\n")
