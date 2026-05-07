"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Command, Lock, ChevronRight, ArrowUpRight, ShoppingCart, BarChart3, Bot, Settings2, Landmark } from "lucide-react";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { StickyFloatingCTA } from "@/components/StickyFloatingCTA";
import { CommerceVisual, GrowthVisual, AutomationVisual, OperationalVisual, CapitalVisual } from "@/components/DivisionVisuals";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const HeroFuturistic = dynamic(() => import("@/components/ui/hero-futuristic"), {
  ssr: false,
  loading: () => <div className="w-full h-[80vh] bg-black" />,
});

// ────────────────────────────────────────────────────────────
//  ANIMATION PRESETS (HOMEPAGE: COMMAND CENTER STYLE)
// ────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const terminalWipe = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)", x: -10 },
  visible: { opacity: 1, clipPath: "inset(0 0% 0 0)", x: 0, transition: { duration: 0.7, ease } },
};
const terminalReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 0.98 },
  visible: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// ────────────────────────────────────────────────────────────
//  DATA
// ────────────────────────────────────────────────────────────
const divisions = [
  {
    num: "1.0",
    tag: "Commerce Infrastructure",
    title: "Transactional Infrastructure Built for Scale",
    desc: "Centralized commerce infrastructure managing multi-brand DTC & B2B operations with unified fulfillment, inventory orchestration, and real-time margin control. Designed to scale distribution while maintaining precision across every transaction.",
    img: "/divisions/commerce.png",
    link: "/work",
    accent: "from-sky-500/20 to-transparent",
    dotColor: "bg-sky-400",
  },
  {
    num: "2.0",
    tag: "Growth Engine",
    title: "Data-Driven Acquisition at Scale",
    desc: "Controlled acquisition systems optimizing spend, conversion, and customer value across global markets. Every input is tracked, tested, and scaled through structured experimentation and real-time data feedback loops.",
    img: "/divisions/performance.png",
    link: "/work",
    accent: "from-blue-500/20 to-transparent",
    dotColor: "bg-blue-400",
  },
  {
    num: "3.0",
    tag: "Automation Systems",
    title: "Intelligent Systems Driving Execution",
    desc: "Proprietary automation & AI layers eliminating manual friction across workflows, decision-making, and operations. From routing to prediction, every system is designed to self-optimize & compound over time.",
    img: "/divisions/ai.png",
    link: "/work",
    accent: "from-emerald-500/20 to-transparent",
    dotColor: "bg-emerald-400",
  },
  {
    num: "4.0",
    tag: "Operational Core",
    title: "End-to-End Operational Control",
    desc: "Centralized execution layer managing fulfillment, logistics & internal processes with full visibility across every node. No blind spots, no inefficiencies, just controlled, reliable execution at scale.",
    img: "/divisions/operations.png",
    link: "/work",
    accent: "from-amber-500/20 to-transparent",
    dotColor: "bg-amber-400",
  },
  {
    num: "5.0",
    tag: "Capital Deployment",
    title: "Strategic Capital Deployment",
    desc: "Capital is deployed into high-leverage digital assets & internal ventures with structured evaluation and controlled risk exposure. Every allocation is designed to reinforce the ecosystem and accelerate long-term scale.",
    img: "/divisions/investments.png",
    link: "/work",
    accent: "from-purple-500/20 to-transparent",
    dotColor: "bg-purple-400",
  },
];

// Orbital Timeline Data — maps to the 5 divisions
const divisionsTimeline = [
  {
    id: 1,
    title: "Commerce Infrastructure",
    date: "Operational Capacity — 95%",
    content: "Centralized multi-brand DTC & B2B commerce system with unified fulfillment, pricing control, and real-time margin visibility. Built to scale product distribution while maintaining operational precision.",
    category: "Commerce Infrastructure",
    icon: ShoppingCart,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 95,
    accentColor: "#38bdf8", // sky-400
  },
  {
    id: 2,
    title: "Growth Engine",
    date: "Execution Efficiency — 93%",
    content: "Data-driven acquisition and conversion systems designed to control traffic, optimize spend, and maximize customer value across all channels. Every input is tracked, tested, and scaled with precision.",
    category: "Growth Engine",
    icon: BarChart3,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 93,
    accentColor: "#60a5fa", // blue-400
  },
  {
    id: 3,
    title: "Automation Systems",
    date: "System Intelligence — 97%",
    content: "Internal AI & automation layer powering decision-making, workflows, and scalability across all operations. Reduces manual dependency while increasing speed, accuracy, and control.",
    category: "Automation Systems",
    icon: Bot,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 97,
    accentColor: "#34d399", // emerald-400
  },
  {
    id: 4,
    title: "Operational Core",
    date: "Execution Stability — 94%",
    content: "End-to-end execution layer managing logistics, fulfillment, customer flows, & internal processes. Ensures consistency, reliability, and full control across every transaction.",
    category: "Operational Core",
    icon: Settings2,
    relatedIds: [1, 5],
    status: "completed" as const,
    energy: 94,
    accentColor: "#fbbf24", // amber-400
  },
  {
    id: 5,
    title: "Capital Deployment",
    date: "Capital Efficiency — 92%",
    content: "Strategic allocation of capital across internal ventures & growth opportunities to maximize return and accelerate expansion. Focused on leverage, scalability, and long-term positioning.",
    category: "Capital Deployment",
    icon: Landmark,
    relatedIds: [2, 1],
    status: "completed" as const,
    energy: 92,
    accentColor: "#c084fc", // purple-400
  },
];


const metrics = [
  { label: "Active Ventures", value: "28", suffix: "+ Live", sub: "Core operating assets" },
  { label: "Global Presence", value: "8", suffix: "+ Regions", sub: "Geographic reach" },
  { label: "Execution Volume", value: "8,900", suffix: "+", sub: "Operational activity across systems" },
  { label: "Infrastructure Layer", value: "211", suffix: "+ Systems", sub: "Active system deployment" },
];

const steps = [
  { num: "01", title: "Research & Mapping", desc: "Deep market analysis, competitive positioning & opportunity mapping before any capital is deployed. Every move is informed, not assumed." },
  { num: "02", title: "Operational Modeling", desc: "Structured KPI frameworks, unit economics & risk modeling defining how each asset performs before execution begins. Built for clarity, not experimentation." },
  { num: "03", title: "Controlled Launch", desc: "Phased deployment with real-time monitoring, controlled testing & fail-safe mechanisms across every layer. Nothing is left unmanaged." },
  { num: "04", title: "Algorithmic Scale", desc: "Performance-driven scaling powered by data, automation & system feedback loops. Every bottleneck is identified, optimized, and removed." },
];

// ────────────────────────────────────────────────────────────
//  ANIMATION & UI COMPONENTS
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
//  PAGE
// ────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();

  const divisionsRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white relative">
      <NoiseOverlay />

      {/* ═══════════════════════════════════════════════
          HERO — Animated Shader + Typography
          ═══════════════════════════════════════════════ */}
      <HeroFuturistic
        trustBadge="Systems. Execution. Market Control."
        headline="Operating at Scale. Controlling Outcomes."
        subtitle="We build, acquire & scale high-performance ventures across commerce & digital infrastructure. Every operation is structured for speed, precision, and long-term dominance."
      />

      {/* ═══════════════════════════════════════════════
          DIVISIONS INTRO — Orbital Timeline + Header
          ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#050508] z-30 py-10 md:py-16 lg:py-20 overflow-visible">
        <div className="max-w-7xl mx-auto px-5 md:px-12 overflow-visible">
          {/* Header — centered above orbital */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            <motion.span variants={terminalWipe} className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4 block">Operating Scope</motion.span>
            <motion.h2 variants={terminalWipe} className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-5">Full-Stack Market Control</motion.h2>
            <motion.p variants={terminalWipe} className="text-base md:text-lg text-zinc-400 leading-relaxed font-light">
              A tightly integrated system of divisions, each engineered to control a critical layer of growth, execution, and scale. From commerce and performance to operations, automation, and capital deployment — every function is connected, optimized, and built to reinforce the others.
            </motion.p>
          </motion.div>

          {/* Orbital Timeline — larger, centered */}
          <div className="flex items-center justify-center overflow-visible">
            <div className="w-full max-w-[380px] md:max-w-[520px] aspect-square overflow-visible">
              <RadialOrbitalTimeline timelineData={divisionsTimeline} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DIVISIONS DEEP-DIVE — Linear-Style Feature Blocks
          ═══════════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          {divisions.map((div, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-5%" }}
              variants={stagger}
              className="py-8 md:py-20"
            >
              {/* Two-column: Text Left, Image Right (alternating) */}
              <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center`}>
                {/* Text */}
                <div className="w-full lg:w-1/2 flex flex-col">
                  <motion.div variants={terminalWipe} className="flex items-center gap-3 mb-6">
                    <span className={`w-2 h-2 rounded-full ${div.dotColor}`} />
                    <span className="font-mono text-sm text-zinc-500 tracking-wider">{div.num}</span>
                    <span className="font-mono text-sm text-zinc-500 tracking-wider">{div.tag}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                  </motion.div>

                  <motion.h3 variants={terminalWipe} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                    {div.title}
                  </motion.h3>

                  <motion.p variants={terminalWipe} className="text-base md:text-lg text-zinc-400 leading-relaxed font-light mb-8 max-w-xl">
                    {div.desc}
                  </motion.p>


                </div>

                {/* Visual */}
                <motion.div
                  variants={terminalReveal}
                  className="w-full lg:w-1/2"
                >
                  {i === 0 && <CommerceVisual />}
                  {i === 1 && <GrowthVisual />}
                  {i === 2 && <AutomationVisual />}
                  {i === 3 && <OperationalVisual />}
                  {i === 4 && <CapitalVisual />}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          SYSTEM TELEMETRY — Metrics + Terminal
          ═══════════════════════════════════════════════ */}
      <section className="py-14 md:py-32 bg-[#050508] relative z-20 overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        <div className="max-w-7xl mx-auto px-5 md:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16"
          >
            <motion.div variants={terminalWipe}>
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-6">Live System Status</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">System Telemetry</h2>
              <p className="text-zinc-500 mt-4 max-w-xl font-light">Monthly visibility across active infrastructure, operational layers & deployed systems. Every signal reflects live execution across the GRQ ecosystem.</p>
            </motion.div>
            <motion.div variants={terminalReveal} className="mt-6 md:mt-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-emerald-500 uppercase">ALL SYSTEMS OPERATIONAL</span>
            </motion.div>
          </motion.div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[180px] md:min-h-[220px] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-400 relative overflow-hidden group"
              >
                <div className={`absolute inset-x-0 bottom-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ${i === 0 ? "bg-emerald-500/40" : i === 1 ? "bg-blue-500/40" : i === 2 ? "bg-white/30" : "bg-purple-500/40"
                  }`} />
                <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-emerald-500/50" : i === 1 ? "bg-blue-500/50" : i === 2 ? "bg-white/50 animate-pulse" : "bg-purple-500/50"
                    }`} />
                  {m.label}
                </span>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{m.value}</span>
                    <span className="text-sm md:text-base font-medium text-zinc-500">{m.suffix}</span>
                  </div>
                  {m.sub && <p className="text-[10px] font-mono text-zinc-600 mt-2 tracking-wide">{m.sub}</p>}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PORTAL SPLIT — 50/50 CTA
          ═══════════════════════════════════════════════ */}
      <section className="relative z-20 w-full md:h-[70vh] min-h-[500px] flex flex-col md:flex-row overflow-hidden group/split">
        {/* Career Portal */}
        <div className="flex-1 min-h-[350px] md:min-h-0 bg-[#050508] relative group cursor-pointer border-b md:border-b-0 md:border-r border-white/[0.04] transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover/split:flex-[0.5] md:hover:!flex-[3]">
          <div className="absolute inset-0 flex flex-col justify-center p-10 md:p-20 z-10">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
              <Command className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">Career Portal</h3>
            <div className="mt-5 overflow-hidden md:max-h-0 md:opacity-0 md:group-hover:max-h-[200px] md:group-hover:opacity-100 transition-all duration-500 max-w-md">
              <p className="text-base text-zinc-400 mb-6 font-light">Access the performance environment and explore available deployment vectors for elite talent.</p>
              <Link href="/careers" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-zinc-200 transition-colors">
                Enter Portal <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Strategic Focus */}
        <div className="flex-1 min-h-[350px] md:min-h-0 bg-white relative group cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover/split:flex-[0.5] md:hover:!flex-[3]">
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 md:p-20 z-10">
            <div className="w-14 h-14 rounded-full bg-black/5 border border-black/10 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
              <Lock className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">Strategic Focus</h3>
            <div className="mt-5 overflow-hidden md:max-h-0 md:opacity-0 md:group-hover:max-h-[200px] md:group-hover:opacity-100 transition-all duration-500 max-w-md">
              <p className="text-base text-zinc-600 mb-6 font-light">Submit proposals, investment inquiries, or acquisition directives to the central holding entity.</p>
              <Link href="/inquiries" className="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white font-semibold rounded-full text-sm hover:bg-zinc-800 transition-colors">
                Strategic Inquiries <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
