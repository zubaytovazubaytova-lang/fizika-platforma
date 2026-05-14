'use client'
import { useEffect, useRef, useCallback } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}

float fbm(vec2 p) {
  float v=0.0, a=0.5;
  mat2 r=mat2(0.866,0.5,-0.5,0.866);
  for(int i=0;i<6;i++){v+=a*noise(p);p=r*p*2.1;a*=0.5;}
  return v;
}

float star(vec2 uv, float sc, float sz) {
  vec2 gv=fract(uv*sc)-0.5, id=floor(uv*sc);
  float r=hash(id), tw=0.55+0.45*sin(u_time*(1.0+r*3.0)+r*6.28);
  gv -= (vec2(hash(id*1.3),hash(id*2.7))-0.5)*0.55;
  return smoothstep(sz,0.0,length(gv))*tw;
}

void main(){
  vec2 uv = gl_FragCoord.xy/u_res;
  uv.y = 1.0-uv.y;
  vec2 m  = u_mouse/u_res;
  vec2 par= (m-0.5)*0.05;

  vec3 col = vec3(0.003,0.005,0.016);
  float t  = u_time*0.011;

  float n1=fbm((uv+par)*1.7  +vec2(t,0.0));
  float n2=fbm((uv+par*1.4)*2.9-vec2(0.0,t*0.75));
  float n3=fbm((uv+par*0.6)*1.2+vec2(t*0.35,t*0.55));

  col += vec3(0.10,0.02,0.25)*pow(n1,2.0)*2.0;
  col += vec3(0.01,0.06,0.20)*pow(n2,2.0)*1.5;
  col += vec3(0.15,0.01,0.10)*n3*n1*2.4;
  col += vec3(0.00,0.10,0.16)*n2*n3*1.1;

  col += vec3(0.55,0.70,1.0 )*star(uv,          72.0,0.006);
  col += vec3(0.85,0.80,1.0 )*star(uv+par*1.2,  36.0,0.010)*1.7;
  col += vec3(1.00,0.88,0.65)*star(uv+par*2.6,  18.0,0.015)*2.8;
  col += vec3(1.00,1.00,1.00)*star(uv+par*4.5,   8.0,0.022)*5.0;

  /* shooting star */
  float ss_t = fract(u_time*0.07);
  vec2  ss_p = vec2(fract(u_time*0.017),0.2+fract(u_time*0.031)*0.6);
  vec2  ss_d = normalize(vec2(1.4,-0.5));
  vec2  ss   = uv - (ss_p + ss_d*ss_t*1.2);
  float ss_l = dot(ss, ss_d);
  float ss_s = smoothstep(0.0,0.18,ss_l)*smoothstep(0.22,0.18,ss_l);
  col += vec3(0.9,0.9,1.0)*ss_s*smoothstep(0.003,0.0,abs(dot(ss,vec2(-ss_d.y,ss_d.x))))*step(0.0,ss_t);

  /* vignette */
  float v=1.0-smoothstep(0.15,0.95,length(uv-0.5)*1.85);
  col *= v;
  col  = pow(max(col,0.0),vec3(0.78));
  gl_FragColor=vec4(col,1.0);
}
`

function makeShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export default function CosmicCanvas() {
  const ref   = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const raf   = useRef(0)

  const onMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, makeShader(gl, gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, makeShader(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes   = gl.getUniformLocation(prog, 'u_res')
    const uTime  = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize',    resize)
    window.addEventListener('mousemove', onMove)

    const t0 = performance.now()
    const draw = () => {
      const t = (performance.now() - t0) / 1000
      gl.uniform2f(uRes,   canvas.width, canvas.height)
      gl.uniform1f(uTime,  t)
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [onMove])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  )
}
