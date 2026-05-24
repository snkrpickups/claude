import { useEffect, useRef, useState } from 'react'

// Cursor-reactive WebGL forge-fire. Renders a dark, restrained molten field
// of rising flame + embers; the cursor (or touch) adds a pocket of heat.
// Falls back gracefully (caller supplies a static fallback) when WebGL is
// unavailable or the user prefers reduced motion.

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;   // normalized, y up
uniform float u_heat;    // cursor influence 0..1

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)),hash(i+vec2(1.0,0.0)),u.x),
             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 q = vec2(uv.x*aspect, uv.y);
  float t = u_time*0.55;

  // Rising, domain-warped flame field
  vec2 fp = q*vec2(2.6,1.9);
  fp.y -= t*1.5;
  float warp = fbm(fp*0.6 + vec2(0.0,t*0.8));
  float n = fbm(fp + warp*1.2);

  // Flame is anchored to the bottom and licks upward
  float base = pow(clamp(1.0 - uv.y, 0.0, 1.0), 1.7);
  float flame = base * (n*1.35);

  // Cursor heat pocket
  float d = distance(q, vec2(u_mouse.x*aspect, u_mouse.y));
  float heat = u_heat * exp(-d*d*6.0);
  flame += heat * (0.6 + 0.4*n);

  // Rising embers (sparse bright sparks drifting up)
  vec2 ep = vec2(q.x*52.0, q.y*70.0 - t*9.0);
  float spark = hash(floor(ep));
  spark = step(0.992, spark) * smoothstep(0.0,0.6,fract(ep.y));
  float ember = spark * (0.5 + heat*1.5) * smoothstep(0.05, 0.6, uv.y);

  float intensity = clamp(flame + ember, 0.0, 1.0);

  // Molten color ramp: black -> deep red -> bronze -> amber -> near-white
  vec3 col = vec3(0.0);
  col = mix(col, vec3(0.42,0.05,0.0), smoothstep(0.05,0.32,intensity));
  col = mix(col, vec3(0.78,0.28,0.04), smoothstep(0.32,0.58,intensity));
  col = mix(col, vec3(0.98,0.62,0.18), smoothstep(0.58,0.82,intensity));
  col = mix(col, vec3(1.0,0.93,0.78),  smoothstep(0.82,1.0,intensity));

  // Fade toward the top + soft vignette so headline stays readable
  col *= smoothstep(1.05, 0.15, uv.y);
  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5,0.42)));
  col *= mix(0.55, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('shader error:', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

export default function ForgeCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const [ok, setOk] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOk(false)
      return
    }
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) {
      setOk(false)
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      setOk(false)
      return
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setOk(false)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_resolution')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uHeat = gl.getUniformLocation(prog, 'u_heat')

    // Lower internal resolution on small/touch screens — fire is soft, so it
    // looks identical while staying smooth.
    const isSmall = window.innerWidth < 768
    const scale = Math.min(window.devicePixelRatio || 1, isSmall ? 1 : 1.4) * (isSmall ? 0.7 : 1)

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale))
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const target = { x: 0.5, y: 0.55 }
    const cur = { x: 0.5, y: 0.55 }
    let heat = 0
    let lastMove = -10

    const onMove = (cx, cy) => {
      const r = canvas.getBoundingClientRect()
      target.x = (cx - r.left) / r.width
      target.y = 1 - (cy - r.top) / r.height
      lastMove = performance.now() / 1000
    }
    const mouseHandler = (e) => onMove(e.clientX, e.clientY)
    const touchHandler = (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', mouseHandler)
    window.addEventListener('touchmove', touchHandler, { passive: true })

    let raf
    let running = true
    const start = performance.now()
    const loop = () => {
      if (!running) return
      resize()
      const now = performance.now()
      const time = (now - start) / 1000
      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      const since = time - lastMove
      const wantHeat = since < 0.6 ? 1 : 0
      heat += (wantHeat - heat) * 0.05
      gl.uniform1f(uTime, time)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, cur.x, cur.y)
      gl.uniform1f(uHeat, heat)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        loop()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    loop()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', mouseHandler)
      window.removeEventListener('touchmove', touchHandler)
      document.removeEventListener('visibilitychange', onVis)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [])

  if (!ok) return null
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
