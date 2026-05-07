"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

/**
 * Ultra-premium, massive, half-visible spinning globe.
 * Parallax-linked to scroll depth for buttery smooth transitions.
 */
export function HeroGlobe() {
    if (typeof window === "undefined") return null;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFallback, setIsFallback] = useState(false);

    // Track scroll specifically within the hero area (first 100vh)
    const { scrollY } = useScroll();

    // Parallax effects
    const yTransform = useTransform(scrollY, [0, 800], [0, 150]);
    const scaleTransform = useTransform(scrollY, [0, 800], [1, 0.85]);
    const opacityTransform = useTransform(scrollY, [0, 800], [1, 0.1]);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                // Determine a size relative to viewport, but scaled down
                width = window.innerWidth * 0.8; 
                if (width < 768) {
                    width = width * 1.2; 
                }
            } else {
                width = 800; // Safe fallback
            }
        };

        window.addEventListener("resize", onResize);
        onResize();

        if (!canvasRef.current) return;

        let globe: any = null;

        const initTimeout = setTimeout(() => {
            if (!canvasRef.current) return;
            
            // Explicit WebGL support check before calling cobe
            const gl = canvasRef.current.getContext("webgl") || canvasRef.current.getContext("experimental-webgl");
            if (!gl) {
                console.warn("WebGL not supported. Rendering CSS Fallback Globe.");
                setIsFallback(true);
                return;
            }

            try {
                // Prevent WebGL allocation limits from crashing context on large monitors
                let renderWidth = width * 2;
                if (renderWidth > 2000) renderWidth = 2000;

                globe = createGlobe(canvasRef.current, {
                    devicePixelRatio: Math.min(window.devicePixelRatio, 2), // Cap at 2x for performance on massive globes
                    width: renderWidth,
                    height: renderWidth,
                    phi: 0,
                    theta: -0.1, // Tilt slightly up to show the top hemisphere mostly
                    dark: 1, // Full dark mode
                    diffuse: 1.8, // High diffuse for dramatic lighting
                    mapSamples: 24000, // Very high resolution map
                    mapBrightness: 6, // Bright landmasses
                    baseColor: [0.03, 0.03, 0.05], // Obsidian deep core
                    markerColor: [1, 1, 1], // Pure white markers
                    glowColor: [1.1, 1.15, 1.25], // Intense silver/white atmospheric halo
                    markers: [
                        { location: [40.7128, -74.0060], size: 0.1 },
                        { location: [51.5074, -0.1278], size: 0.08 },
                        { location: [25.2048, 55.2708], size: 0.1 },
                        { location: [1.3521, 103.8198], size: 0.08 },
                        { location: [35.6762, 139.6503], size: 0.08 }
                    ],
                    onRender: (state) => {
                        state.phi = phi;
                        phi += 0.0015; // Slow, majestic rotation
                        
                        // Dynamically update sizes while respecting the cap
                        let newRenderWidth = width * 2;
                        if (newRenderWidth > 2000) newRenderWidth = 2000;
                        state.width = newRenderWidth;
                        state.height = newRenderWidth;
                    }
                });
            } catch (e) {
                console.warn("Globe initialization failed:", e);
                setIsFallback(true);
            }
        }, 100);

        return () => {
            if (globe) globe.destroy();
            clearTimeout(initTimeout);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="absolute -top-[5vh] left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] md:w-[70vw] md:h-[70vw] lg:w-[800px] lg:h-[800px] pointer-events-none z-0"
            style={{
                y: yTransform,
                scale: scaleTransform,
                opacity: opacityTransform,
                willChange: "transform, opacity"
            }}
        >
            <div className="w-full h-full relative" style={{ transform: "translateZ(0)" }}>
                {isFallback ? (
                    <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_15%,#38bdf8_0%,#0f172a_30%,#000000_70%)] opacity-80" 
                         style={{ 
                             maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
                             WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)" 
                         }} 
                    />
                ) : (
                    <canvas
                        ref={canvasRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            contain: "strict",
                            transform: "translateZ(0)",
                            willChange: "transform",
                            maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 60%)",
                            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 60%)"
                        }}
                        className="opacity-90"
                    />
                )}
            </div>
        </motion.div>
    );
}
