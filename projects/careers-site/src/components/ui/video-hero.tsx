"use client";

import React from 'react';
import { NodeConstellation } from './node-constellation';

// Types for component props
interface VideoHeroProps {
  trustBadge?: {
    text: string;
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
  };
  children?: React.ReactNode;
}

const VideoHero = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  children
}: VideoHeroProps) => {

  return (
    <div className="relative w-full h-[100svh] min-h-[650px] overflow-hidden bg-black flex flex-col justify-start pt-[140px] md:pt-[240px] pb-[80px] md:pb-[102px]">
      
      {/* 50% Black Overlay for Readability */}
      <div className="absolute inset-0 z-[5] bg-black/60 md:bg-black/40" />

      {/* Interactive Constellation Background */}
      <NodeConstellation />

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white px-5 w-full h-full">
        
        {/* Content Stack with 40px gaps */}
        <div className="flex flex-col items-center text-center gap-[40px] max-w-[680px] w-full">
          
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
          
          {children}
        </div>
      </div>

      {/* Fade deeply into the page background for a seamless transition */}
      <div className="absolute bottom-0 inset-x-0 h-[40vh] bg-gradient-to-t from-black via-black/60 to-transparent z-[5]" />
    </div>
  );
};

export default VideoHero;
