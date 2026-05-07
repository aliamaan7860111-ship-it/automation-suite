"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Initial check in case they loaded midpoint
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div 
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              scrolled ? "bg-[#050508]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl" : "bg-transparent"
          }`}
      />
      <div className={`relative z-10 w-full px-5 lg:px-12 flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? "py-2.5" : "py-4 md:py-6"}`}>

        {/* Logo - Scaled up visually but small container height */}
        <Link href="/" className="relative z-10 flex items-center group shrink-0 py-1">
          <Image
            src="/GRQ2.png"
            alt="GRQ Holdings"
            width={320}
            height={120}
            className="h-[46px] md:h-[56px] w-auto object-contain origin-left scale-[2.2] md:scale-[2.6] drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-500"
            priority
          />
        </Link>

        {/* Desktop Nav Pill */}
        <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)] focus:outline-none">
          <Link href="/" className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${pathname === "/" ? "bg-white/[0.1] text-white" : "text-white/80 hover:text-white hover:bg-white/[0.08]"}`}>
            Home
          </Link>
          <Link href="/about" className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${pathname === "/about" ? "bg-white/[0.1] text-white" : "text-white/80 hover:text-white hover:bg-white/[0.08]"}`}>
            About
          </Link>
          <Link href="/careers" className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${pathname === "/careers" ? "bg-white/[0.1] text-white" : "text-white/80 hover:text-white hover:bg-white/[0.08]"}`}>
            Careers
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block relative z-10 shrink-0">
          <Link
            href="/inquiries"
            className="flex items-center justify-center px-7 py-2.5 text-[13px] font-semibold rounded-full bg-white text-black hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300"
          >
            Inquire
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
           <MobileNav />
        </div>
      </div>
    </header>
  );
}
