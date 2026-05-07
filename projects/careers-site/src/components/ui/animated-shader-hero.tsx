"use client";

import React, { useRef, useEffect, useState } from 'react';

// Types for component props
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
  children?: React.ReactNode;
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const [isFallback, setIsFallback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  // WebGL Renderer class
  class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    public gl: WebGL2RenderingContext | null = null;
    private program: WebGLProgram | null = null;
    private vs: WebGLShader | null = null;
    private fs: WebGLShader | null = null;
    private buffer: WebGLBuffer | null = null;
    private scale: number;
    private shaderSource: string;
    private mouseMove = [0, 0];
    private mouseCoords = [0, 0];
    private pointerCoords = [0, 0];
    private nbrOfPointers = 0;

    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas: HTMLCanvasElement, scale: number) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
      if (this.gl) {
        this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      }
      this.shaderSource = defaultShaderSource;
    }

    updateShader(source: string) {
      if (!this.gl) return;
      this.reset();
      this.shaderSource = source;
      try {
        this.setup();
        this.init();
        return true;
      } catch (e) {
        console.warn("Shader initialized failed");
        return false;
      }
    }

    updateMove(deltas: number[]) {
      this.mouseMove = deltas;
    }

    updateMouse(coords: number[]) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords: number[]) {
      this.pointerCoords = coords;
    }

    updatePointerCount(nbr: number) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale: number) {
      if (!this.gl) return;
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader: WebGLShader, source: string) {
      if (!this.gl) return;
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Shader compilation error: ' + gl.getShaderInfoLog(shader));
      }
    }

    test(source: string) {
      if (!this.gl) return null;
      let result = null;
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader);
      }
      gl.deleteShader(shader);
      return result;
    }

    reset() {
      if (!this.gl) return;
      const gl = this.gl;
      if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs);
          gl.deleteShader(this.vs);
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs);
          gl.deleteShader(this.fs);
        }
        gl.deleteProgram(this.program);
      }
    }

    setup() {
      if (!this.gl) return;
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER)!;
      this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error('Program link error: ' + gl.getProgramInfoLog(this.program));
      }
    }

    init() {
      if (!this.gl) return;
      const gl = this.gl;
      const program = this.program!;
      
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      (program as any).resolution = gl.getUniformLocation(program, 'resolution');
      (program as any).time = gl.getUniformLocation(program, 'time');
      (program as any).move = gl.getUniformLocation(program, 'move');
      (program as any).touch = gl.getUniformLocation(program, 'touch');
      (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
      (program as any).pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
      if (!this.gl) return;
      const gl = this.gl;
      const program = this.program;
      
      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      
      gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f((program as any).time, now * 1e-3);
      gl.uniform2f((program as any).move, ...this.mouseMove as [number, number]);
      gl.uniform2f((program as any).touch, ...this.mouseCoords as [number, number]);
      gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
      gl.uniform2fv((program as any).pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  // Pointer Handler class
  class PointerHandler {
    private scale: number;
    private active = false;
    private pointers = new Map<number, number[]>();
    private lastCoords = [0, 0];
    private moves = [0, 0];

    constructor(element: HTMLCanvasElement, scale: number) {
      this.scale = scale;
      
      const map = (element: HTMLCanvasElement, scale: number, x: number, y: number) => 
        [x * scale, element.height - y * scale];

      element.addEventListener('pointerdown', (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
      });

      element.addEventListener('pointerup', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointerleave', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointermove', (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale: number) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0 
        ? Array.from(this.pointers.values()).flat() 
        : [0, 0];
    }

    get first() {
      return this.pointers.values().next().value || this.lastCoords;
    }
  }

  const resize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now: number) => {
    if (!rendererRef.current || !pointersRef.current) return;
    
    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    rendererRef.current = new WebGLRenderer(canvas, dpr);
    if (!rendererRef.current.gl) {
      console.warn("WebGL2 not supported, rendering CSS fallback.");
      setIsFallback(true);
      return;
    }
    pointersRef.current = new PointerHandler(canvas, dpr);
    
    try {
      rendererRef.current.setup();
      rendererRef.current.init();
    } catch (e) {
      console.warn("Shader init failed", e);
      setIsFallback(true);
      return;
    }
    
    resize();
    
    if (rendererRef.current.test(defaultShaderSource) === null) {
      const success = rendererRef.current.updateShader(defaultShaderSource);
      if (!success) {
        setIsFallback(true);
      }
    }
    
    loop(0);
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return { canvasRef, isFallback };
};

// Reusable Hero Component
const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
  children
}) => {
  const { canvasRef, isFallback } = useShaderBackground();

  return (
    <div className={`relative w-full h-[85svh] md:h-[100svh] min-h-[550px] md:min-h-[650px] overflow-hidden bg-black flex flex-col justify-start pt-[140px] md:pt-[240px] pb-[40px] md:pb-[102px] ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}} />
      
      {!isFallback && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block touch-none"
          style={{ background: '#000000' }}
        />
      )}
      {isFallback && (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#000000]">
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_40%)]" />
          <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      )}
      
      {/* Massive soft fade at the bottom to smoothly bleed the shader into the rest of the page */}
      <div className="absolute bottom-0 inset-x-0 h-[40vh] bg-gradient-to-t from-black via-black/60 to-transparent z-[5]" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col text-white w-full h-full">
        
        {/* Content Stack - Absolutely centered so it is totally immune to children pushing it around */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] flex flex-col items-center text-center gap-[40px] max-w-[680px] w-full px-5">
          
          {/* Trust Badge (Pill) */}
          {trustBadge && (
            <div className="animate-fade-in-down">
              <div className="inline-flex items-center rounded-[20px] bg-white/10 border border-white/20 px-3.5 py-[7px]">
                <span className="w-1 h-1 rounded-full bg-white mr-2 shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse" />
                <span className="text-[13px] font-medium text-white/60">
                  {trustBadge.text.split(" ").slice(0, -1).join(" ")}{" "}
                </span>
                <span className="text-[13px] font-medium text-white ml-1">
                  {trustBadge.text.split(" ").pop()}
                </span>
              </div>
            </div>
          )}

          {/* Main Heading */}
          <div className="animate-fade-in-up animation-delay-200 w-full flex justify-center">
            <h1 
              className="text-[36px] md:text-[56px] font-medium leading-[1.28] max-w-[613px] tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(144.5deg, #FFFFFF 28%, rgba(0, 0, 0, 0) 115%)" }}
            >
              {headline.line1} {headline.line2}
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="animate-fade-in-up animation-delay-600 w-full flex justify-center mt-[-16px]">
            <p className="text-[15px] font-normal text-white/70 max-w-[680px] leading-relaxed">
              {subtitle}
            </p>
          </div>
          
          {/* CTA Buttons */}
          {buttons && (
            <div className="flex justify-center animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <div className="relative z-10 w-fit group">
                  <button 
                    onClick={buttons.primary.onClick}
                    className="flex items-center justify-center px-[29px] py-[11px] text-[14px] font-medium rounded-full border-[0.6px] border-white/40 bg-white text-black hover:bg-[#e2e2e2] transition-colors duration-300 relative shadow-[inset_0_1px_rgba(255,255,255,1),0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[inset_0_1px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.3)]"
                  >
                    {buttons.primary.text}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Render children separately at the bottom */}
        {children && (
          <div className="w-full mt-auto px-5 pb-8 relative z-20">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Monochromatic GRQ Shader Source
const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		// Changed from orange (bg*.25, bg*.137, bg*.05) to Galactic Blue
		col=mix(col,vec3(bg*.05,bg*.15,bg*.35),d);
	}
	O=vec4(col,1);
}`;

export default AnimatedShaderHero;

