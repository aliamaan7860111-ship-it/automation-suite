"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function PortalPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleAuth = async () => {
    if (!email || !password) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("error");
  };

  return (
    <main className="min-h-svh bg-black flex items-center justify-center relative overflow-hidden px-5 pt-28 pb-16">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30" />
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.02),transparent_60%)]" />

      {/* Portal card */}
      <motion.div
        className="relative w-full max-w-[380px] z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a10] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
          {/* Top hairline */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

          {/* Header */}
          <div className="px-7 pt-8 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Secure Access</span>
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Career Portal
            </h1>
            <p className="text-[13px] text-zinc-500 mt-1">
              GRQ Holdings — Restricted
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mx-7" />

          {/* Form */}
          <div className="px-7 py-6 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-zinc-400 tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="you@grq.ae"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-white/[0.18] focus:bg-white/[0.05] transition-all duration-200 placeholder:text-zinc-700"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-zinc-400 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setStatus("idle"); }}
                  placeholder="••••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-11 text-[13px] text-white focus:outline-none focus:border-white/[0.18] focus:bg-white/[0.05] transition-all duration-200 placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/[0.06] border border-red-500/[0.12]"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-[12px] text-red-400/90">
                    Invalid credentials. Access denied.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: status === "loading" ? 1 : 1.005 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAuth}
              disabled={status === "loading" || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mt-1"
            >
              {status === "loading" ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-3.5 h-3.5 border-[1.5px] border-black/30 border-t-black rounded-full inline-block"
                  />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <div className="px-7 pb-7 pt-0">
            <p className="text-[10px] text-zinc-700 text-center font-mono tracking-wide">
              Authorized personnel only · GRQ Holdings
            </p>
          </div>

          {/* Bottom hairline */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>
      </motion.div>
    </main>
  );
}
