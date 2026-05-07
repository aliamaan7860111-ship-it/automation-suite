"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

// ────────────────────────────────────────────────────────────
//  ANIMATED NUMBER — counts up when in view
// ────────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(motionVal, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    }
  }, [inView, motionVal, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
//  LIVE REVENUE COUNTER
//  Starts at $13M on launch date, grows $30-60K/day (seeded random per day)
// ────────────────────────────────────────────────────────────
const REVENUE_BASE = 13_000_000; // $13M starting value
const LAUNCH_DATE = new Date("2025-01-01T00:00:00Z"); // reference start date

function getDailyIncrement(dayIndex: number): number {
  // Seeded pseudo-random: same value for same day, between 30k-60k
  const seed = Math.sin(dayIndex * 127.1 + 311.7) * 43758.5453;
  const rand = seed - Math.floor(seed); // 0-1
  return 30_000 + Math.floor(rand * 30_000);
}

function getCurrentRevenue(): number {
  const now = new Date();
  const msPerDay = 86_400_000;
  const totalDays = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / msPerDay);

  let total = REVENUE_BASE;
  for (let d = 0; d < totalDays; d++) {
    total += getDailyIncrement(d);
  }

  // Add partial day progress (smooth intra-day growth)
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const dayProgress = (now.getTime() - todayStart.getTime()) / msPerDay;
  total += Math.floor(getDailyIncrement(totalDays) * dayProgress);

  return total;
}

function formatRevenue(val: number): string {
  if (val >= 1_000_000) {
    return "$" + (val / 1_000_000).toFixed(2) + "M";
  }
  return "$" + val.toLocaleString();
}

function LiveRevenueCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => formatRevenue(Math.round(v)));

  useEffect(() => {
    if (!inView) return;

    const target = getCurrentRevenue();
    animate(motionVal, target, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });

    const interval = setInterval(() => {
      motionVal.set(getCurrentRevenue());
    }, 30_000);

    return () => clearInterval(interval);
  }, [inView, motionVal]);

  return (
    <div ref={ref} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Total Revenue</span>
      </div>
      <div className="text-sm md:text-base font-bold text-white font-mono tracking-tight">
        <motion.span>{display}</motion.span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  1. COMMERCE INFRASTRUCTURE
//  Abstract throughput waveform + system health rings
// ────────────────────────────────────────────────────────────

// Generates a smooth SVG wave path across a given width
function buildWave(width: number, height: number, offset: number, amp: number) {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 4) {
    const y = height / 2 + Math.sin((x / width) * Math.PI * 4 + offset) * amp
            + Math.sin((x / width) * Math.PI * 7 + offset * 1.3) * (amp * 0.4);
    pts.push(`${x},${y.toFixed(2)}`);
  }
  return "M " + pts.join(" L ");
}

const STATUS_CHIPS = [
  { label: "Ingestion Layer", status: "Nominal", color: "#34d399" },
  { label: "Routing Engine", status: "Nominal", color: "#34d399" },
  { label: "Fulfillment API", status: "Nominal", color: "#34d399" },
  { label: "Settlement", status: "Active", color: "#818cf8" },
];

export function CommerceVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const W = 400;
  const H = 80;

  const wave1 = buildWave(W, H, 0, 18);
  const wave2 = buildWave(W, H, 1.2, 11);
  const wave3 = buildWave(W, H, 2.5, 7);

  return (
    <div ref={ref} className="relative w-full h-[360px] md:h-[420px] rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#07080f] to-[#050508] overflow-hidden">

      {/* Header */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-3 border-b border-white/[0.05] z-10">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-sky-400"
          />
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Commerce Infrastructure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-widest">All Systems Nominal</span>
        </div>
      </div>

      {/* Throughput waveform */}
      <div className="absolute top-12 inset-x-0 h-24 px-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#818cf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
            <filter id="glow-wave">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Wave 3 — faintest */}
          <motion.path
            d={wave3}
            fill="none"
            stroke="url(#wave-grad-2)"
            strokeWidth="0.8"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={inView ? { opacity: 1, pathLength: 1 } : {}}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Wave 2 */}
          <motion.path
            d={wave2}
            fill="none"
            stroke="url(#wave-grad-1)"
            strokeWidth="0.7"
            opacity={0.5}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={inView ? { opacity: 0.5, pathLength: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Wave 1 — primary */}
          <motion.path
            d={wave1}
            fill="none"
            stroke="url(#wave-grad-1)"
            strokeWidth="1.5"
            filter="url(#glow-wave)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={inView ? { opacity: 1, pathLength: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>

      {/* Throughput label */}
      <div className="absolute top-[132px] inset-x-0 px-5">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Throughput Signal</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>
      </div>

      {/* System status chips — 2×2 grid, vertically centered in remaining space */}
      <div className="absolute top-[155px] bottom-[52px] inset-x-0 px-5 flex items-center">
        <div className="w-full grid grid-cols-2 gap-2">
        {STATUS_CHIPS.map((chip, i) => (
          <motion.div
            key={chip.label}
            className="flex items-center justify-between px-3 py-2 rounded-xl border"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] text-zinc-500 font-medium">{chip.label}</span>
            <div className="flex items-center gap-1.5">
              <motion.span
                className="w-1 h-1 rounded-full"
                style={{ background: chip.color }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="text-[9px] font-mono" style={{ color: chip.color }}>{chip.status}</span>
            </div>
          </motion.div>
        ))}
        </div>
      </div>

      {/* Bottom — Live Revenue */}
      <div className="absolute bottom-0 inset-x-0 px-5 py-4 border-t border-white/[0.05] z-10">
        <LiveRevenueCounter />
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
//  2. GROWTH ENGINE
//  Polished Telemetry Dashboard for Acquisition Metrics
// ────────────────────────────────────────────────────────────

const METRICS = [
  { label: "Blended ROAS", value: "4.6×", delta: "+12.4%", color: "#3b82f6", delay: 0 },
  { label: "Target CAC", value: "$16.20", delta: "-8.1%", color: "#a855f7", delay: 0.1 },
  { label: "Conv Rate", value: "3.8%", delta: "+1.2%", color: "#10b981", delay: 0.2 },
];

const CHANNELS = [
  { name: "Meta Ecosystem", spend: "$82.4k / day", fill: 92, color: "#3b82f6" },
  { name: "TikTok Formats", spend: "$45.1k / day", fill: 78, color: "#ec4899" },
  { name: "Google & Programmatic", spend: "$31.8k / day", fill: 54, color: "#10b981" },
];

export function GrowthVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full h-[360px] md:h-[420px] rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#07080f] to-[#050508] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Acquisition Engine</span>
        </div>
        <span className="text-[10px] font-mono text-blue-500/60">Live Telemetry</span>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-4 md:p-5 flex flex-col gap-3 md:gap-4 overflow-hidden">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + m.delay, duration: 0.5, ease }}
              className="flex flex-col p-3 md:p-4 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
              style={{
                background: `radial-gradient(120% 120% at 50% 0%, ${m.color}15 0%, rgba(255,255,255,0.01) 100%)`,
                borderColor: `${m.color}25`
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" style={{ backgroundColor: m.color }} />
              <span className="text-[8px] md:text-[9px] font-mono text-zinc-400 uppercase tracking-widest opacity-90 mb-1.5">{m.label}</span>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                <span className="text-xl md:text-3xl font-bold text-white tracking-tighter leading-none">{m.value}</span>
                <span className="text-[8px] md:text-[9px] font-mono font-medium" style={{ color: m.color }}>{m.delta}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Real-time Channel Velocity */}
        <motion.div 
          className="flex-1 rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 md:p-5 flex flex-col justify-between relative shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
             <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Active Channel Velocity</span>
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          
          <div className="flex flex-col gap-3 md:gap-4">
            {CHANNELS.map((ch, i) => (
              <div key={ch.name} className="flex flex-col gap-1.5 md:gap-2 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] text-zinc-300 font-medium tracking-wide">{ch.name}</span>
                  <span className="text-[9px] font-mono text-zinc-500">{ch.spend}</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-black/60 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-white/[0.03]">
                  <motion.div 
                    className="h-full rounded-full relative overflow-hidden" 
                    style={{ background: ch.color, boxShadow: `0 0 10px ${ch.color}80` }}
                    initial={{ width: 0 }} 
                    animate={inView ? { width: `${ch.fill}%` } : {}} 
                    transition={{ delay: 1 + i * 0.15, duration: 1.4, ease }} 
                  >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-sweep" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Info */}
      <div className="px-5 py-3 border-t border-white/[0.05] shrink-0 bg-[#050508]/40 backdrop-blur-md">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Routing</span>
             <span className="text-[9px] font-mono uppercase tracking-widest text-blue-500/80">Algorithmic</span>
           </div>
           <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 border border-white/[0.08] px-2 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Proprietary</span>
        </div>
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
//  3. AUTOMATION SYSTEMS
//  Parallel workflow execution — Vercel/Linear pipeline aesthetic
// ────────────────────────────────────────────────────────────

type WorkflowStatus = "completed" | "running" | "queued" | "active";

const WORKFLOWS: { name: string; duration: string; fill: number; status: WorkflowStatus; color: string; delay: number }[] = [
  { name: "Workflow Orchestration",   duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0    },
  { name: "Decision Layer",          duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0.1  },
  { name: "Predictive Engine",       duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0.18 },
  { name: "Execution Routing",       duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0.26 },
  { name: "Data Synchronization",    duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0.34 },
  { name: "Content Generation",      duration: "",  fill: 100, status: "active", color: "#34d399", delay: 0.42 },
];

const STATUS_LABEL: Record<WorkflowStatus, string> = {
  completed: "Active",
  running:   "Active",
  queued:    "Active",
  active:    "Active",
};

export function AutomationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full h-[360px] md:h-[420px] rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#07080f] to-[#050508] overflow-hidden">

      {/* Header */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-3 border-b border-white/[0.05] z-10">
        <div className="flex items-center gap-2">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Automation Layer</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-500/60">47 Workflows Active</span>
      </div>

      {/* Workflow rows */}
      <div className="absolute top-11 bottom-[68px] inset-x-0 px-5 py-3 flex flex-col justify-center gap-2.5">
        {WORKFLOWS.map((wf) => (
          <motion.div
            key={wf.name}
            className="flex flex-col gap-1"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: wf.delay + 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Row header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Status dot */}
                {wf.status === "running" ? (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: wf.color }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: wf.color }} />
                )}
                <span className="text-[11px] text-zinc-400 font-medium">{wf.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    color: wf.color,
                    background: `${wf.color}12`,
                  }}
                >
                  {STATUS_LABEL[wf.status]}
                </span>
                {wf.status === "completed" && (
                  <span className="text-[9px] font-mono text-zinc-600">{wf.duration}</span>
                )}
              </div>
            </div>

            {/* Progress track */}
            <div className="h-[3px] w-full rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: wf.status === "queued" ? "rgba(82,82,91,0.3)" : `linear-gradient(90deg, ${wf.color}cc, ${wf.color}66)` }}
                initial={{ width: 0 }}
                animate={inView ? {
                  width: wf.status === "running"
                    ? [`${wf.fill}%`, `${Math.min(wf.fill + 18, 95)}%`, `${wf.fill}%`]
                    : `${wf.fill}%`
                } : {}}
                transition={
                  wf.status === "running"
                    ? { duration: 3, repeat: Infinity, ease: "easeInOut", delay: wf.delay + 0.5 }
                    : { duration: 0.8, delay: wf.delay + 0.5, ease: [0.16, 1, 0.3, 1] }
                }
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom metrics */}
      <div className="absolute bottom-0 inset-x-0 px-5 py-4 border-t border-white/[0.05] flex items-center justify-between z-10">
        {[
          { label: "Active Workflows", val: 47, suffix: "" },
          { label: "Avg Latency",      val: 18, suffix: "ms" },
          { label: "Uptime",           val: 99, suffix: ".97%" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-sm md:text-base font-bold text-white">
              <AnimatedNumber value={s.val} suffix={s.suffix} />
            </div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
//  4. OPERATIONAL CORE
//  Concentric sonar rings with active region blips
// ────────────────────────────────────────────────────────────
const regions = [
  { label: "UAE", angle: -60, distance: 55, status: "active", coords: "25.2N, 55.2E" },
  { label: "EU", angle: 30, distance: 65, status: "active", coords: "51.5N, 0.1W" },
  { label: "GCC", angle: 150, distance: 48, status: "active", coords: "24.7N, 46.6E" },
  { label: "APAC", angle: 210, distance: 70, status: "staging", coords: "1.3N, 103.8E" },
];

export function OperationalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const SWEEP_DURATION = 6;

  return (
    <div ref={ref} className="relative w-full h-[360px] md:h-[420px] rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#07080f] to-[#050508] overflow-hidden">
      {/* Header with scan status */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.05] z-10 bg-[#07080f]/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <motion.div 
               className="absolute inset-0 rounded-full bg-amber-500"
               animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 tracking-[0.25em] uppercase">Operations Control</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest hidden sm:inline">Active Scan</span>
          <span className="text-[10px] font-mono text-zinc-500">3 Regions Online</span>
        </div>
      </div>

      {/* Radar Main Visualization */}
      <div className="absolute inset-0 top-12 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
          <defs>
            <filter id="blip-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* The fading trail behind the scanner line — fixed units for absolute center */}
            <radialGradient id="radar-trail" cx="100" cy="100" r="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid Lines */}
          <g opacity="0.15">
            {[30, 60, 90, 120, 150].map((angle) => {
              const r = (angle * Math.PI) / 180;
              const x2 = 100 + 85 * Math.cos(r);
              const y2 = 100 + 85 * Math.sin(r);
              const x1 = 100 - 85 * Math.cos(r);
              const y1 = 100 - 85 * Math.sin(r);
              return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,158,11,0.4)" strokeWidth="0.3" />;
            })}
          </g>

          {/* Concentric rings */}
          {[25, 50, 75].map((r, i) => (
            <motion.circle key={r} cx="100" cy="100" r={r}
              fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 1, ease }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}

          {/* Rotating sweep with trail — native SVG rotation around center (100,100) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur={`${SWEEP_DURATION}s`}
              repeatCount="indefinite"
            />
            {/* The Trail Wedge */}
            <path d="M 100 100 L 100 25 A 75 75 0 0 0 47 47 Z"
              fill="url(#radar-trail)" opacity="0.6" />
            {/* Leading Scanning Line */}
            <line x1="100" y1="100" x2="100" y2="25" stroke="#f59e0b" strokeWidth="1.2" filter="url(#blip-glow)" />
          </g>

          {/* Center Hub */}
          <circle cx="100" cy="100" r="3" fill="#f59e0b" className="shadow-lg" />
          <circle cx="100" cy="100" r="1.5" fill="white" opacity="0.8" />

          {/* Region blips — Synchronized with sweep */}
          {regions.map((region, i) => {
            const mathRad = (region.angle * Math.PI) / 180;
            const cx = 100 + (region.distance / 100) * 80 * Math.cos(mathRad);
            const cy = 100 + (region.distance / 100) * 80 * Math.sin(mathRad);
            
            // Sync logic: Sweep 0 deg (Top) is -90 in our SVG math.
            // SweepAngle = MathAngle + 90.
            const sweepAngleTrigger = (region.angle + 90 + 360) % 360;
            const delayInSync = (sweepAngleTrigger / 360) * SWEEP_DURATION;

            return (
              <motion.g key={region.label} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
                {/* Synchronized Pulse when hit by sweep */}
                <motion.circle 
                  cx={cx} cy={cy} r="2" fill="#f59e0b"
                  animate={{ 
                    scale: [1, 5, 1], 
                    opacity: [1, 0, 1],
                    filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatDelay: SWEEP_DURATION - 1.5,
                    delay: delayInSync,
                    ease: "easeOut"
                  }}
                />

                {/* Constant small dot */}
                <circle 
                  cx={cx} cy={cy} r="2.5" 
                  fill={region.status === "active" ? "#f59e0b" : "#27272a"} 
                  className={region.status === "active" ? "shadow-[0_0_10px_rgba(245,158,11,0.5)]" : ""}
                />

                {/* Telemetry Labels */}
                <g className="font-mono" style={{ transform: `translate(${cx > 100 ? 8 : -8}px, 0px)` }}>
                  <text 
                    x={cx} y={cy} dy="-10" 
                    textAnchor={cx > 100 ? "start" : "end"} 
                    fontSize="5" fill="white" fontWeight="bold" opacity="0.9"
                  >
                    {region.label}
                  </text>
                  <text 
                    x={cx} y={cy} dy="-2" 
                    textAnchor={cx > 100 ? "start" : "end"} 
                    fontSize="4" fill="rgba(245,158,11,0.5)"
                  >
                    {region.coords}
                  </text>
                  <motion.text 
                    x={cx} y={cy} dy="6" 
                    textAnchor={cx > 100 ? "start" : "end"} 
                    fontSize="3.5" fill="rgba(255,255,255,0.3)" style={{ textTransform: "uppercase" }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    STATUS: {region.status.toUpperCase()}
                  </motion.text>
                </g>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Re-designed Bottom Metrics */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#07080f] via-[#07080f]/90 to-transparent pt-12 pb-5 px-6 z-10">
        <div className="grid grid-cols-3 gap-8">
          {[
            { label: "Global SLA", val: "99.93%", color: "text-amber-400" },
            { label: "Avg Fulfillment", val: "28h", color: "text-white" },
            { label: "Error Rate", val: "0.03%", color: "text-red-400/80" },
          ].map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
            >
              <div className={`text-sm md:text-lg font-bold tracking-tighter ${s.color}`}>{s.val}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
//  5. CAPITAL DEPLOYMENT
//  Clean internal capital overview — exposure, signal, pipeline
// ────────────────────────────────────────────────────────────

const EXPOSURE = [
  { label: "Commerce", pct: 42 },
  { label: "Growth", pct: 31 },
  { label: "Systems", pct: 27 },
];

const SIGNALS = [
  { label: "Avg Return", value: "+128%", status: "positive" as const },
  { label: "Growth Trend", value: "Compounding", status: "positive" as const },
  { label: "Risk Exposure", value: "Controlled", status: "neutral" as const },
];

export function CapitalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full h-[360px] md:h-[420px] rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#07080f] to-[#050508] overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.6, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Capital Overview</span>
        </div>
        <span className="text-[10px] font-mono text-purple-500/60">Internal</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between overflow-hidden">

        {/* ── Capital Exposure ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Capital Exposure</span>
            <span className="text-[9px] font-mono text-zinc-700">$4.2M deployed</span>
          </div>
          <div className="space-y-2.5">
            {EXPOSURE.map((e, i) => (
              <motion.div key={e.label}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-500 font-medium">{e.label}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{e.pct}%</span>
                </div>
                <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "rgba(168,139,250,0.5)" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${e.pct}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.15, duration: 1, ease }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Performance Signal ── */}
        <div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-2.5">Performance Signal</span>
          <div className="space-y-2">
            {SIGNALS.map((s, i) => (
              <motion.div key={s.label}
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease }}
              >
                <span className="text-[10px] text-zinc-500 font-medium">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className={`w-1 h-1 rounded-full ${s.status === "positive" ? "bg-emerald-400" : "bg-zinc-500"}`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <span className={`text-[10px] font-mono ${s.status === "positive" ? "text-emerald-400/80" : "text-zinc-500"}`}>
                    {s.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Pipeline & Positioning ── */}
        <div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-2.5">Pipeline</span>
          <motion.div
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.015]"
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="w-1 h-1 rounded-full bg-purple-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
              <span className="text-[10px] text-zinc-500 font-medium">Reserved Capital</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400/80">$562K</span>
          </motion.div>
          <motion.p
            className="text-[9px] text-zinc-700 mt-1.5 font-mono"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            Staged for new deployments & acquisitions
          </motion.p>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="px-5 py-3 border-t border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between">
          {[
            { label: "Deployed Capital", val: "$4.2M" },
            { label: "Active Positions", val: "28" },
            { label: "Avg Return", val: "+128%" },
            { label: "Pipeline", val: "$562K" },
          ].map((s, i) => (
            <motion.div key={s.label} className="text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 + i * 0.08, duration: 0.4, ease }}
            >
              <div className="text-[11px] md:text-xs font-bold text-white">{s.val}</div>
              <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
