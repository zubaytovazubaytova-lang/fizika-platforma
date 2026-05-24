'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════════════════════════
   SHADERS
══════════════════════════════════════════════════════════════════════════════ */
const SUN_VERT = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const SUN_FRAG = `
precision highp float;
uniform float u_t;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545); }
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  mat2 r=mat2(0.8,0.6,-0.6,0.8);
  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.1;a*=0.5;}
  return v;
}

void main(){
  vec2 uv  = vUv - 0.5;
  float d  = length(uv);
  if(d > 0.5) discard;

  /* turbulent surface */
  float t  = u_t * 0.07;
  float n1 = fbm(vUv * 3.5 + vec2(t, 0.0));
  float n2 = fbm(vUv * 7.0 - vec2(0.0, t*0.9));
  float n3 = fbm(vUv *14.0 + vec2(t*0.6, t*0.4));
  float n  = n1*0.5 + n2*0.3 + n3*0.2;

  /* color: white-hot core → orange → dark red rim */
  vec3 cHot  = vec3(1.00, 0.97, 0.70);
  vec3 cOr   = vec3(1.00, 0.52, 0.02);
  vec3 cRim  = vec3(0.70, 0.12, 0.00);
  float r    = d * 2.0;
  vec3 col   = mix(cHot, cOr, r);
  col        = mix(col, cRim, r*r);
  col       += n * 0.35 * mix(vec3(1.0,0.9,0.3), vec3(1.0,0.2,0.0), r);

  /* limb darkening */
  col *= pow(max(0.0, 1.0 - r*0.8), 0.45);

  /* solar flare spikes */
  float angle  = atan(uv.y, uv.x);
  float spikes = pow(max(0.0, sin(angle*6.0 + u_t*0.4)), 14.0)
               + pow(max(0.0, sin(angle*4.0 - u_t*0.25)), 18.0);
  float flare  = spikes * smoothstep(0.48, 0.40, d) * 0.6;
  col         += vec3(1.0, 0.55, 0.05) * flare;

  float alpha  = smoothstep(0.50, 0.44, d);
  gl_FragColor = vec4(col * 2.2, alpha);  /* HDR boost for bloom */
}
`

/* ══════════════════════════════════════════════════════════════════════════════
   PLANET DATA
══════════════════════════════════════════════════════════════════════════════ */
interface PlanetCfg {
  name:   string
  info:   string
  r:      number
  orbit:  number
  speed:  number
  col:    number
  emit:   number
  emI:    number
  spec:   number
  shine:  number
  rings?: boolean
  moon?:  { r: number; orbit: number; speed: number; col: number }
}
const PLANET_DATA: PlanetCfg[] = [
  { name:'Merkuriy', info:'Ø 4 879 km · 88 kun',   r:0.38, orbit:7,  speed:1.20,  col:0xAAAAAA, emit:0x222222, emI:0.3, spec:0x444444, shine:20 },
  { name:'Venera',   info:'Ø 12 104 km · 225 kun',  r:0.70, orbit:11, speed:0.47,  col:0xE8C870, emit:0x3a2800, emI:0.4, spec:0x887722, shine:40 },
  { name:'Yer',      info:'Ø 12 756 km · 365 kun',  r:0.78, orbit:15, speed:0.29,  col:0x2277DD, emit:0x001133, emI:0.4, spec:0x224488, shine:60,
    moon:{ r:0.22, orbit:1.9, speed:3.8, col:0x999999 } },
  { name:'Mars',     info:'Ø 6 792 km · 687 kun',   r:0.42, orbit:20, speed:0.154, col:0xCC4422, emit:0x220800, emI:0.3, spec:0x441100, shine:25 },
  { name:'Yupiter',  info:'Ø 142 984 km · 12 yil',  r:2.00, orbit:30, speed:0.024, col:0xC88B3A, emit:0x251200, emI:0.3, spec:0x554422, shine:30,
    moon:{ r:0.30, orbit:3.3, speed:1.8, col:0xBBAA88 } },
  { name:'Saturn',   info:'Ø 120 536 km · 29 yil',  r:1.68, orbit:41, speed:0.010, col:0xE4D191, emit:0x251e00, emI:0.3, spec:0x887744, shine:35, rings:true,
    moon:{ r:0.26, orbit:3.1, speed:1.5, col:0xBBAA99 } },
  { name:'Uran',     info:'Ø 51 118 km · 84 yil',   r:1.14, orbit:52, speed:0.0035,col:0x7DEEE8, emit:0x002222, emI:0.5, spec:0x338888, shine:70 },
  { name:'Neptun',   info:'Ø 49 528 km · 165 yil',  r:1.06, orbit:61, speed:0.0018,col:0x3355DD, emit:0x000044, emI:0.5, spec:0x112266, shine:60 },
]

/* ══════════════════════════════════════════════════════════════════════════════
   TEXTURE FACTORIES
══════════════════════════════════════════════════════════════════════════════ */
function makeRadialTex(sz: number, stops: [number, string][]): THREE.Texture {
  const c = document.createElement('canvas'); c.width = c.height = sz
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2)
  stops.forEach(([t,col]) => g.addColorStop(t,col))
  ctx.fillStyle = g; ctx.fillRect(0,0,sz,sz)
  return new THREE.CanvasTexture(c)
}

function makeStarTex(): THREE.Texture {
  return makeRadialTex(64, [
    [0,   'rgba(255,255,255,1)'],
    [0.15,'rgba(255,255,255,0.9)'],
    [0.4, 'rgba(200,220,255,0.4)'],
    [1,   'rgba(0,0,0,0)'],
  ])
}

function makeNebulaTex(r: number, g: number, b: number): THREE.Texture {
  const sz = 256
  const c = document.createElement('canvas'); c.width = c.height = sz
  const ctx = c.getContext('2d')!
  // multi-blob
  for (let i = 0; i < 5; i++) {
    const x = sz * (0.2 + Math.random() * 0.6)
    const y = sz * (0.2 + Math.random() * 0.6)
    const gr = ctx.createRadialGradient(x,y,0,sz/2,sz/2,sz*0.7)
    gr.addColorStop(0,   `rgba(${r},${g},${b},0.35)`)
    gr.addColorStop(0.5, `rgba(${r},${g},${b},0.10)`)
    gr.addColorStop(1,   `rgba(0,0,0,0)`)
    ctx.fillStyle = gr; ctx.fillRect(0,0,sz,sz)
  }
  return new THREE.CanvasTexture(c)
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function SolarSystemBg() {
  const mountRef  = useRef<HTMLDivElement>(null)
  const tipRef    = useRef<HTMLDivElement>(null)
  const rafRef    = useRef(0)

  useEffect(() => {
    const mount  = mountRef.current
    const tipRoot = tipRef.current
    if (!mount || !tipRoot) return
    const isMobile = window.innerWidth < 768

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference:'high-performance', preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.9
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // Canvas darhol ko'rinmasin — birinchi frame chizilgandan keyin fade-in
    Object.assign(renderer.domElement.style, {
      position: 'fixed', inset: '0', zIndex: '-1', pointerEvents: 'none',
      opacity: '0',
    })
    mount.appendChild(renderer.domElement)

    /* ── Scene ── */
    const scene  = new THREE.Scene()
    scene.background = new THREE.Color(0x04040e)
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth/window.innerHeight, 0.1, 900)
    camera.position.set(0, 44, 82)
    camera.lookAt(0, 0, 0)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x111133, 0.9))
    // PointLight with decay=0 so all planets get illuminated
    const sunLight = new THREE.PointLight(0xFFEE88, 3.0, 0, 0)
    scene.add(sunLight)
    const sunLight2 = new THREE.PointLight(0xFF8800, 1.5, 0, 0)
    scene.add(sunLight2)

    /* ── Stars – 100 000 particles in 4 layers ── */
    const starTex = makeStarTex()
    function addStarLayer(count: number, size: number, rMin: number, rMax: number) {
      const pos: number[] = [], col: number[] = []
      for (let i = 0; i < count; i++) {
        const r = rMin + Math.random() * (rMax - rMin)
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        pos.push(r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th), r*Math.cos(ph))
        // subtle blue-white-warm variety
        const t = Math.random()
        const warm = Math.random() < 0.15
        col.push(warm ? 1.0 : 0.8+t*0.2, warm ? 0.85 : 0.82+(1-t)*0.18, warm ? 0.6 : 0.9+Math.random()*0.1)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3))
      geo.setAttribute('color',    new THREE.Float32BufferAttribute(col,3))
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({
        size, map: starTex, vertexColors: true,
        transparent: true, alphaTest: 0.01,
        blending: THREE.AdditiveBlending, depthWrite: false,
        sizeAttenuation: true,
      }))
      scene.add(pts)
      return pts
    }
    const s1 = addStarLayer(50000, 0.18, 130, 350)  // tiny dim
    const s2 = addStarLayer(30000, 0.32, 130, 300)  // small
    const s3 = addStarLayer(15000, 0.60, 130, 280)  // medium bright
    const s4 = addStarLayer(5000,  1.10, 130, 260)  // large/bright → bloom

    /* ── Milky Way band ── */
    if (!isMobile) {
      const mwPos: number[] = [], mwCol: number[] = []
      for (let i = 0; i < 8000; i++) {
        const a = Math.random()*Math.PI*2
        const rr = 95 + Math.pow(Math.random(),0.4)*195
        const yy = (Math.random()-0.5)*16*(1-rr/310)
        mwPos.push(Math.cos(a)*rr, yy, Math.sin(a)*rr)
        const b = 0.10 + Math.random()*0.22
        mwCol.push(b*0.75, b*0.65, b*1.1)
      }
      const mwGeo = new THREE.BufferGeometry()
      mwGeo.setAttribute('position', new THREE.Float32BufferAttribute(mwPos,3))
      mwGeo.setAttribute('color',    new THREE.Float32BufferAttribute(mwCol,3))
      scene.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({
        size:0.38, vertexColors:true, map:starTex,
        transparent:true, opacity:0.30, alphaTest:0.01,
        blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true,
      })))
    }

    /* ── Nebula sprites ── */
    const nebulaDefs = [
      { r:30,  g:80,  b:255, x:80,  y:40,  z:-60, s:130 },
      { r:160, g:30,  b:220, x:-90, y:-30, z:50,  s:110 },
      { r:220, g:30,  b:80,  x:40,  y:-50, z:-80, s:95  },
      { r:180, g:120, b:30,  x:-60, y:25,  z:80,  s:120 },
      { r:30,  g:180, b:160, x:100, y:-20, z:70,  s:90  },
    ]
    nebulaDefs.forEach(({ r,g,b,x,y,z,s }) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeNebulaTex(r,g,b),
        transparent:true, opacity:0.25,
        blending:THREE.AdditiveBlending, depthWrite:false,
      }))
      sp.position.set(x,y,z)
      sp.scale.set(s,s,1)
      scene.add(sp)
    })

    /* ── Solar system group (tilted for perspective) ── */
    const solar = new THREE.Group()
    solar.rotation.x = -0.30
    scene.add(solar)

    /* ── Sun (custom shader) ── */
    const sunUniforms = { u_t: { value: 0 } }
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: sunUniforms,
        vertexShader: SUN_VERT,
        fragmentShader: SUN_FRAG,
        transparent: true,
        side: THREE.FrontSide,
      })
    )
    solar.add(sunMesh)

    // Corona glow layers
    const corona1 = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeRadialTex(128,[
        [0,'rgba(255,240,120,1)'],[0.2,'rgba(255,140,20,0.7)'],[0.6,'rgba(255,60,0,0.2)'],[1,'rgba(0,0,0,0)'],
      ]),
      transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.85,
    }))
    corona1.scale.set(22,22,1)
    solar.add(corona1)

    const corona2 = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeRadialTex(128,[
        [0,'rgba(255,200,80,0.5)'],[0.4,'rgba(255,80,0,0.2)'],[1,'rgba(0,0,0,0)'],
      ]),
      transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.6,
    }))
    corona2.scale.set(48,48,1)
    solar.add(corona2)

    // Lens flare elements (screen-space, positioned relative to sun)
    const flareTex = makeRadialTex(64,[
      [0,'rgba(255,255,200,0.9)'],[0.3,'rgba(200,180,255,0.4)'],[1,'rgba(0,0,0,0)'],
    ])
    const flares: THREE.Sprite[] = [0.4,0.7,-0.3,-0.8].map((off,i) => {
      const f = new THREE.Sprite(new THREE.SpriteMaterial({
        map:flareTex, transparent:true,
        blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.35-i*0.06,
      }))
      f.scale.set(4-i*0.5, 4-i*0.5, 1)
      scene.add(f) // added to scene not solar, updated in loop
      ;(f as THREE.Sprite & { _off: number })._off = off
      return f
    })

    /* ── Planets ── */
    interface PlanetObj {
      pivot:  THREE.Object3D
      mesh:   THREE.Mesh
      mPivot: THREE.Object3D | null
      speed:  number
      tip:    HTMLDivElement
    }
    const planets: PlanetObj[] = []
    const vpTmp = new THREE.Vector3()

    PLANET_DATA.forEach((p) => {
      /* orbit line */
      const pts: THREE.Vector3[] = []
      for (let i=0;i<=160;i++){const a=(i/160)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*p.orbit,0,Math.sin(a)*p.orbit))}
      solar.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color:0xBB9020, transparent:true, opacity:0.22, depthWrite:false })
      ))
      // orbit glow (slightly wider, more transparent)
      solar.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color:0xFFCC44, transparent:true, opacity:0.07, depthWrite:false })
      ))

      /* planet */
      const mat = new THREE.MeshPhongMaterial({
        color:    new THREE.Color(p.col),
        emissive: new THREE.Color(p.emit),
        emissiveIntensity: p.emI,
        shininess: p.shine,
        specular:  new THREE.Color(p.spec),
      })
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 36, 36), mat)

      const pivot = new THREE.Object3D()
      pivot.rotation.y = Math.random()*Math.PI*2
      mesh.position.x  = p.orbit
      pivot.add(mesh)
      solar.add(pivot)

      /* planet point-glow sprite */
      const pGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialTex(64,[
          [0, `rgba(${(p.col>>16)&255},${(p.col>>8)&255},${p.col&255},0.7)`],
          [0.4,'rgba(0,0,0,0.1)'],
          [1,'rgba(0,0,0,0)'],
        ]),
        transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.5,
      }))
      pGlow.scale.set(p.r*3.5, p.r*3.5, 1)
      mesh.add(pGlow)

      /* Earth: atmosphere ring */
      if (p.name==='Yer') {
        mesh.add(new THREE.Mesh(
          new THREE.SphereGeometry(p.r*1.10,28,28),
          new THREE.MeshPhongMaterial({ color:0x44AAFF, transparent:true, opacity:0.10, side:THREE.FrontSide, depthWrite:false })
        ))
      }
      /* Jupiter: band overlay */
      if (p.name==='Yupiter') {
        mesh.add(new THREE.Mesh(
          new THREE.SphereGeometry(p.r*1.005,36,12),
          new THREE.MeshPhongMaterial({ color:0xAA7733, transparent:true, opacity:0.28, depthWrite:false })
        ))
      }
      /* Saturn rings — multiple flat RingGeometry layers */
      if (p.rings) {
        const ringConfigs = [
          { i:p.r*1.35, o:p.r*1.95, col:0xD4B040, op:0.80 },
          { i:p.r*1.95, o:p.r*2.50, col:0xBB9828, op:0.55 },
          { i:p.r*2.50, o:p.r*2.90, col:0xAA8820, op:0.28 },
          { i:p.r*2.90, o:p.r*3.10, col:0x887714, op:0.12 },
        ]
        ringConfigs.forEach(({ i,o,col,op }) => {
          const rGeo = new THREE.RingGeometry(i,o,96)
          // fix UV so gradient is radial
          const pos=rGeo.attributes.position, uv=rGeo.attributes.uv
          for(let k=0;k<pos.count;k++){
            const x=pos.getX(k),z=pos.getZ(k)
            uv.setXY(k,(Math.sqrt(x*x+z*z)-i)/(o-i),0.5)
          }
          const rMesh = new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({
            color:col, transparent:true, opacity:op, side:THREE.DoubleSide, depthWrite:false,
          }))
          rMesh.rotation.x = Math.PI/2.15
          mesh.add(rMesh)
        })
      }

      /* Moon */
      let mPivot: THREE.Object3D|null = null
      if (p.moon) {
        const m=p.moon
        const mMesh = new THREE.Mesh(
          new THREE.SphereGeometry(m.r,20,20),
          new THREE.MeshPhongMaterial({ color:m.col, shininess:10 })
        )
        mPivot = new THREE.Object3D()
        mMesh.position.x = m.orbit
        mPivot.rotation.y = Math.random()*Math.PI*2
        mPivot.add(mMesh)
        mesh.add(mPivot)
      }

      /* tooltip */
      const tip = document.createElement('div')
      tip.style.cssText = `
        position:fixed;pointer-events:none;opacity:0;transition:opacity 0.25s;
        background:rgba(4,4,20,0.88);border:1px solid rgba(200,160,40,0.55);
        color:#FFD080;font-size:11px;font-family:sans-serif;
        padding:6px 11px;border-radius:9px;white-space:nowrap;
        backdrop-filter:blur(6px);
        box-shadow:0 0 14px rgba(200,160,40,0.25),0 0 4px rgba(200,160,40,0.5);
        transform:translate(-50%,-140%);
      `
      tip.innerHTML = `<span style="font-size:13px;font-weight:700">${p.name}</span><br><span style="opacity:0.7">${p.info}</span>`
      tipRoot.appendChild(tip)

      planets.push({ pivot, mesh, mPivot, speed:p.speed, tip })
    })

    /* ── Shooting stars ── */
    interface Meteor { pts: Float32Array; geo: THREE.BufferGeometry; mat: THREE.LineBasicMaterial; line: THREE.Line; t: number; dur: number; on: boolean }
    const meteors: Meteor[] = Array.from({length:4},() => {
      const pts = new Float32Array(6)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pts,3))
      const mat = new THREE.LineBasicMaterial({ color:0xFFFFFF, transparent:true, opacity:0, depthWrite:false })
      const line = new THREE.Line(geo,mat)
      scene.add(line)
      return { pts,geo,mat,line,t:0,dur:0.6,on:false }
    })
    let mIdx=0, mNext=0

    /* ── Bloom post-processing ── */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer: any = null
    ;(async () => {
      try {
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
        const { RenderPass     } = await import('three/examples/jsm/postprocessing/RenderPass.js')
        const { UnrealBloomPass} = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        const bloom = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          isMobile ? 0.8 : 1.4,   // strength
          0.55,                     // radius
          0.20                      // threshold
        )
        composer.addPass(bloom)
      } catch { /* bloom not available, fallback to renderer */ }
    })()

    /* ── Mouse + scroll ── */
    const mouse = { x:0, y:0 }
    let zoomOff = 0
    const camBase = { x:0, y:44, z:82 }
    const onMove = (e: MouseEvent) => { mouse.x=(e.clientX/window.innerWidth-0.5)*2; mouse.y=(e.clientY/window.innerHeight-0.5)*2 }
    const onWheel = (e: WheelEvent) => { zoomOff=Math.max(-28,Math.min(22,zoomOff+e.deltaY*0.018)) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('wheel', onWheel, { passive:true })

    /* hover detection */
    const onHover = (e: MouseEvent) => {
      planets.forEach(({ mesh, tip }) => {
        mesh.getWorldPosition(vpTmp)
        vpTmp.project(camera)
        const sx=(vpTmp.x+1)/2*window.innerWidth
        const sy=(-vpTmp.y+1)/2*window.innerHeight
        tip.style.opacity = Math.hypot(e.clientX-sx, e.clientY-sy) < 30 ? '1' : '0'
      })
    }
    window.addEventListener('mousemove', onHover)

    /* ── Animation ── */
    const t0 = performance.now()
    let prev = 0
    let firstFrame = true

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const t = (performance.now() - t0) / 1000
      if (t - prev < 1/60) return
      const dt = t - prev; prev = t

      /* camera: mouse parallax + breathing zoom */
      const tz = camBase.z + zoomOff + Math.sin(t/18*Math.PI*2)*7
      camera.position.x += (camBase.x + mouse.x*7 - camera.position.x)*0.025
      camera.position.y += (camBase.y - mouse.y*3 - camera.position.y)*0.025
      camera.position.z += (tz - camera.position.z)*0.02
      camera.lookAt(0,0,0)

      /* sun */
      sunUniforms.u_t.value = t
      const p = 1+0.055*Math.sin(t*1.8)
      corona1.scale.set(22*p,22*p,1)
      corona2.scale.set(50*(1+0.07*Math.sin(t*0.7)),50*(1+0.07*Math.sin(t*0.7)),1)

      /* lens flare — project sun to screen, offset flares */
      vpTmp.set(0,0,0).applyMatrix4(solar.matrixWorld).project(camera)
      const sx=(vpTmp.x+1)/2*window.innerWidth
      const sy=(-vpTmp.y+1)/2*window.innerHeight
      const cx=window.innerWidth/2, cy=window.innerHeight/2
      flares.forEach((f) => {
        const off = (f as THREE.Sprite & {_off:number})._off
        f.position.set(
          (sx-cx)/window.innerWidth*2  * off * 0.5,
          -(sy-cy)/window.innerHeight*2 * off * 0.5,
          -1
        )
        f.position.unproject(camera)
        f.material.opacity = 0.30 + 0.15*Math.sin(t*0.9)
      })

      /* planets */
      planets.forEach(({ pivot, mesh, mPivot, speed }) => {
        pivot.rotation.y += speed * dt
        mesh.rotation.y  += 0.010
        if (mPivot) mPivot.rotation.y += speed*dt*8
      })

      /* tooltip positions */
      planets.forEach(({ mesh, tip }) => {
        mesh.getWorldPosition(vpTmp); vpTmp.project(camera)
        tip.style.left = `${(vpTmp.x+1)/2*window.innerWidth}px`
        tip.style.top  = `${(-vpTmp.y+1)/2*window.innerHeight}px`
      })

      /* stars drift */
      const starLayers: THREE.Points[] = [s1, s2, s3, s4]
      starLayers.forEach((s, i) => { s.rotation.y += (i % 2 === 0 ? 1 : -1) * 0.000028 })

      /* meteors */
      if (t > mNext) {
        const m = meteors[mIdx%4]; mIdx++
        const x0=(Math.random()-0.5)*160, y0=25+Math.random()*45, z0=(Math.random()-0.5)*120
        const L=14+Math.random()*18
        m.pts.set([x0,y0,z0, x0-L*(0.6+Math.random()*0.4), y0-L*0.45, z0+L*0.25])
        m.geo.attributes.position.needsUpdate=true
        m.mat.opacity=0; m.t=0; m.dur=0.45+Math.random()*0.4; m.on=true
        mNext=t+3+Math.random()*6
      }
      meteors.forEach((m) => {
        if(!m.on) return
        m.t+=dt
        const prog=m.t/m.dur
        if(prog>=1){m.on=false;m.mat.opacity=0;return}
        m.mat.opacity=Math.sin(prog*Math.PI)*0.95
      })

      /* render */
      if (composer) composer.render()
      else renderer.render(scene, camera)

      /* birinchi frame chizilgandan keyin canvas silliq paydo bo'lsin */
      if (firstFrame) {
        firstFrame = false
        renderer.domElement.style.transition = 'opacity 1.2s ease'
        renderer.domElement.style.opacity    = '1'
      }
    }
    animate()

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (composer) composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousemove', onHover)
      window.removeEventListener('wheel',     onWheel)
      window.removeEventListener('resize',    onResize)
      planets.forEach(({ tip }) => tip.remove())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      {/* Canvas yuklanguncha ko'rinadigan qorong'i fon */}
      <div
        ref={mountRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: '#050510' }}
      />
      <div ref={tipRef} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  )
}
