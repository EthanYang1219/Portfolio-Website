import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
    }) || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) return;

    // Vertex shader
    const VERTEX_SHADER_SOURCE = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with dither and slow organic ripples
    const FRAGMENT_SHADER_SOURCE = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_c1;
      uniform vec3 u_c2;
      uniform vec3 u_c3;
      uniform float u_grain;

      float hash(vec2 i) {
        return fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float vnoise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float aspectRatio = u_res.x / u_res.y;
        vec2 p = vec2(uv.x * aspectRatio, uv.y);
        vec2 m = vec2(u_mouse.x * aspectRatio, u_mouse.y);
        
        float distToMouse = distance(p, m);
        float cursorPull = 0.14 * exp(-distToMouse * distToMouse * 2.5);
        
        float t = u_time;
        float w = 0.0;
        w += sin(p.x * 2.1 + t * 0.5 + sin(p.y * 1.5 - t * 0.35) * 1.25);
        w += sin(p.y * 1.8 - t * 0.45 + sin(p.x * 1.1 + t * 0.28) * 1.15);
        w += 1.2 * vnoise(p * 1.5 + vec2(t * 0.045, -t * 0.035) + cursorPull * 5.0);
        w = w / 2.2 + cursorPull * 1.5;
        
        float f = 0.5 + 0.5 * sin(w * 3.14159);
        vec3 col = mix(u_c1, u_c2, smoothstep(0.18, 0.82, f));
        col = mix(col, u_c3, smoothstep(0.45, 0.95, f) * 0.9);
        col += (hash(gl_FragCoord.xy + t) - 0.5) * u_grain;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('WebGL program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full screen triangle positioning buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uniforms = {
      res: gl.getUniformLocation(program, 'u_res'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      c1: gl.getUniformLocation(program, 'u_c1'),
      c2: gl.getUniformLocation(program, 'u_c2'),
      c3: gl.getUniformLocation(program, 'u_c3'),
      grain: gl.getUniformLocation(program, 'u_grain'),
    };

    // Low-contrast editorial palettes
    const LIGHT_PALETTE = {
      c1: [0.957, 0.922, 0.882], // #f4f0e6 primary paper ivory
      c2: [0.824, 0.714, 0.549], // soft tan
      c3: [0.910, 0.847, 0.749], // paper shading accent
      grain: 0.020,
    };

    const DARK_PALETTE = {
      c1: [0.078, 0.067, 0.043], // #14110b primary dark charcoal
      c2: [0.220, 0.184, 0.118], // sienna/gold-brushed highlight
      c3: [0.137, 0.114, 0.075], // soft elevation charcoal
      grain: 0.028,
    };

    const getPalette = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? DARK_PALETTE : LIGHT_PALETTE;
    };

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      width = w;
      height = h;
      
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    };

    resize();
    
    // ResizeObserver tracks container layout perfectly
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(document.body);

    // Interaction states
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let animationFrameId: number;
    const startTime = performance.now();

    // Reusable uniform buffers — avoids allocating 3 Float32Arrays per frame
    const c1Buf = new Float32Array(3);
    const c2Buf = new Float32Array(3);
    const c3Buf = new Float32Array(3);

    const render = (now: number) => {
      // Lerp custom coordinate drag values smoothly
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const timeSec = (now - startTime) * 0.00018;
      const palette = getPalette();

      gl!.uniform2f(uniforms.res, width, height);
      gl!.uniform1f(uniforms.time, timeSec);
      gl!.uniform2f(uniforms.mouse, mouseX, mouseY);

      c1Buf.set(palette.c1);
      c2Buf.set(palette.c2);
      c3Buf.set(palette.c3);
      gl!.uniform3fv(uniforms.c1, c1Buf);
      gl!.uniform3fv(uniforms.c2, c2Buf);
      gl!.uniform3fv(uniforms.c3, c3Buf);
      gl!.uniform1f(uniforms.grain, palette.grain);

      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Clean up resources properly when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      gl!.deleteBuffer(buffer);
      gl!.deleteProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
    };
  }, []);

  return (
    <div
      className="shaderbg fixed inset-0 -z-10 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
