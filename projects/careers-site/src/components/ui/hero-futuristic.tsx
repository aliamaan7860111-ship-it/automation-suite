// @ts-nocheck — Three.js TSL typings are experimental and incomplete
'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from 'three/tsl';

// ─── Default assets (swap with brand imagery + depth map) ────
const DEFAULT_TEXTURE = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEFAULT_DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// ─── Post Processing: Bloom + Cyan Scan Line ─────────────────
const PostProcessing = ({
  strength = 0.6,
  threshold = 0.85,
}: {
  strength?: number;
  threshold?: number;
}) => {
  const { gl, scene, camera } = useThree();

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Layer: scene + bloom
    const final = scenePassColor.add(bloomPass);
    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold]);

  useFrame(() => {
    render.renderAsync();
  }, 1);

  return null;
};

// ─── 3D Scene: Depth Parallax + Halftone Dots ────────────────
const WIDTH = 300;
const HEIGHT = 300;

const Scene = ({
  textureUrl,
  depthMapUrl,
  gyro,
}: {
  textureUrl: string;
  depthMapUrl: string;
  gyro: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const [rawMap, depthMap] = useTexture([textureUrl, depthMapUrl]);
  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (rawMap && depthMap) setVisible(true);
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);
    const strength = 0.01;

    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    // Only show dots where actual subject exists (depth > background threshold)
    const objectMask = smoothstep(0.03, 0.1, float(tDepthMap.r));

    // Blue/cyan dot energy — masked to subject only, not the square background
    const mask = dot.mul(flow).mul(objectMask).mul(vec3(0, 4, 10));
    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return { material, uniforms: { uPointer, uProgress } };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.4) * 0.5 + 0.5;
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.07);
      }
    }
  });

  // Merge pointer + gyroscope for mobile support
  useFrame(({ pointer }) => {
    const gx = gyro.current.x;
    const gy = gyro.current.y;
    const hasGyro = Math.abs(gx) > 0.001 || Math.abs(gy) > 0.001;
    uniforms.uPointer.value = hasGyro
      ? new THREE.Vector2(gx * 2, gy * 2)
      : pointer;
  });

  // Responsive scale: slightly bigger on mobile, compact on desktop
  const scaleFactor = isMobile ? 0.42 : 0.32;

  // Vertical offset
  const yOffset = isMobile ? 0.45 : 0.35;

  return (
    <mesh ref={meshRef} position={[0, yOffset, 0]} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

// ─── Main Hero Component ─────────────────────────────────────
interface HeroFuturisticProps {
  trustBadge?: string;
  headline: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
  textureUrl?: string;
  depthMapUrl?: string;
  className?: string;
}

const HeroFuturistic: React.FC<HeroFuturisticProps> = ({
  trustBadge,
  headline,
  subtitle,
  ctaText,
  onCtaClick,
  textureUrl = DEFAULT_TEXTURE.src,
  depthMapUrl = DEFAULT_DEPTHMAP.src,
  className = '',
}) => {
  const titleWords = headline.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const gyroRef = useRef({ x: 0, y: 0 });

  // Gyroscope for mobile parallax
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const x = (e.gamma || 0) / 45; // left/right tilt normalized to ~[-1, 1]
      const y = ((e.beta || 0) - 45) / 45; // front/back tilt
      gyroRef.current = { x: x * 0.5, y: y * 0.5 };
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handler, { passive: true });
    }
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  // Badge appears first
  useEffect(() => {
    const t = setTimeout(() => setBadgeVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Staggered word-by-word headline reveal
  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const t = setTimeout(() => setVisibleWords((v) => v + 1), 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setSubtitleVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [visibleWords, titleWords.length]);

  // CTA appears after subtitle
  useEffect(() => {
    if (subtitleVisible) {
      const t = setTimeout(() => setCtaVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [subtitleVisible]);

  const handleCanvasError = useCallback(() => setCanvasError(true), []);

  return (
    <div className={`relative w-full h-svh min-h-[600px] overflow-hidden bg-black ${className}`}>
      {/* ── Inline keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-word-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes hero-fade-up {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-badge-in {
          0% { opacity: 0; transform: translateY(-12px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .hero-word-reveal {
          animation: hero-word-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-fade-up {
          animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-badge-in {
          animation: hero-badge-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-scroll-bounce {
          animation: hero-scroll-bounce 2s ease-in-out infinite;
        }
      `}} />

      {/* ── 3D Canvas Background ── */}
      {!canvasError && (
        <div className="absolute inset-0 z-0">
          <Canvas
            flat
            gl={async (props) => {
              try {
                const renderer = new THREE.WebGPURenderer(props as any);
                await renderer.init();
                return renderer;
              } catch {
                throw new Error('WebGPU init failed');
              }
            }}
            onError={handleCanvasError}
            dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5}
          >
            <PostProcessing strength={0.6} threshold={0.85} />
            <Scene textureUrl={textureUrl} depthMapUrl={depthMapUrl} gyro={gyroRef} />
          </Canvas>
        </div>
      )}

      {/* ── CSS Fallback Background ── */}
      {canvasError && (
        <div className="absolute inset-0 z-0 bg-black">
        </div>
      )}

      {/* ── Dark vignette overlay — guarantees text readability ── */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.85)_100%)]" />

      {/* ── Bottom bleed into site background ── */}
      <div className="absolute bottom-0 inset-x-0 h-[35vh] bg-gradient-to-t from-black via-black/70 to-transparent z-[3]" />

      {/* ── Content Overlay ── */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col items-center justify-end pb-4 md:pb-12 w-full px-6 md:px-10 pointer-events-none">
        <div className="flex flex-col items-center text-center max-w-[800px] gap-5 md:gap-7 pointer-events-auto">

          {/* Trust Badge */}
          {trustBadge && (
            <div
              className={badgeVisible ? 'hero-badge-in' : ''}
              style={{ opacity: badgeVisible ? undefined : 0 }}
            >
              <div className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-[24px] border border-white/10 ring-1 ring-white/5 px-4 md:px-5 py-2 mt-2 shadow-2xl shadow-black">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-3 shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] text-zinc-300 uppercase">
                  {trustBadge}
                </span>
              </div>
            </div>
          )}

          {/* Headline — word-by-word reveal */}
          <h1 className="flex flex-wrap justify-center gap-x-2 md:gap-x-3.5 gap-y-1">
            {titleWords.map((word, i) => (
              <span
                key={i}
                className={i < visibleWords ? 'hero-word-reveal' : ''}
                style={{
                  opacity: i < visibleWords ? undefined : 0,
                  animationDelay: `${i * 0.08}s`,
                  display: 'inline-block',
                }}
              >
                <span
                  className="text-[32px] md:text-[52px] lg:text-[60px] font-semibold leading-[1.15] tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(160deg, #FFFFFF 30%, rgba(148,163,184,0.6) 100%)',
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <div
            className={subtitleVisible ? 'hero-fade-up' : ''}
            style={{
              opacity: subtitleVisible ? undefined : 0,
              animationDelay: '0.1s',
            }}
          >
            <p className="text-[14px] md:text-[16px] font-normal text-white/55 max-w-[560px] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* CTA Button */}
          {ctaText && (
            <div
              className={ctaVisible ? 'hero-fade-up' : ''}
              style={{
                opacity: ctaVisible ? undefined : 0,
                animationDelay: '0.15s',
              }}
            >
              <button
                onClick={onCtaClick}
                className="group flex items-center justify-center px-7 py-2.5 text-[13px] md:text-[14px] font-medium rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)]"
              >
                {ctaText}
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Scroll indicator - Integrated tightly below text */}
        <div
          className={`flex flex-col items-center gap-1.5 mt-8 pointer-events-auto ${ctaVisible ? 'hero-fade-up' : ''}`}
          style={{ opacity: ctaVisible ? undefined : 0, animationDelay: '0.6s' }}
        >
          <span className="text-[9px] font-mono tracking-widest uppercase text-white/20">
            Scroll
          </span>
          <div className="hero-scroll-bounce opacity-30">
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none" className="text-white">
              <path d="M11 5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;
