"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function NodeConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Config
    const PARTICLE_COUNT = 100; // Dense network
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 250;
    
    // Colors matching GRQ Schema
    const colors = [
      'rgba(56, 189, 248, 0.8)', // Sky Blue
      'rgba(255, 255, 255, 0.6)', // White
      'rgba(16, 185, 129, 0.5)'  // Emerald (sparse)
    ];

    let mouse = {
      x: -1000,
      y: -1000
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8, // Slow, elegant movement
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 1.5 + 0.5, // 0.5 to 2.0
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw Particles
      particles.forEach(p => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges smoothly
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction (repel slightly, or attract)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < MOUSE_RADIUS) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          // Very slight parallax push away from mouse
          p.x -= forceDirectionX * force * 2;
          p.y -= forceDirectionY * force * 2;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = 1 - (distance / CONNECTION_DISTANCE);
            
            // If they are both sky blue, make line sky blue, else white
            const isBlue = particles[i].color.includes('189') || particles[j].color.includes('189');
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isBlue 
              ? `rgba(56, 189, 248, ${opacity * 0.3})`
              : `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        const msDx = particles[i].x - mouse.x;
        const msDy = particles[i].y - mouse.y;
        const msDist = Math.sqrt(msDx * msDx + msDy * msDy);
        
        if (msDist < CONNECTION_DISTANCE) {
          const opacity = 1 - (msDist / CONNECTION_DISTANCE);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.4})`; // Stronger blue connection to mouse cursor
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    
    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#020202] z-0 overflow-hidden">
      {/* Subtle radial gradient overlay to give it depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_60%)] pointer-events-none z-10" />
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full opacity-80"
      />
    </div>
  );
}
