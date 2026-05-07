"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

export function OperatorModal() {
  const [visible, setVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const seen = sessionStorage.getItem("grq_portal_seen");
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("grq_portal_seen", "1");
    setVisible(false);
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("error");
    await new Promise((r) => setTimeout(r, 1600));
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[360px]"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle ambient glow */}
              <div className="absolute -inset-10 bg-white/[0.015] rounded-[50px] blur-3xl pointer-events-none" />

              {/* Card */}
              <div className="relative rounded-2xl border border-white/[0.09] bg-[#09090f]/98 backdrop-blur-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]">

                {/* Top hairline */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-5">
                  <div>
                    <div className="text-[15px] font-semibold text-white tracking-tight leading-snug">
                      Portal Access
                    </div>
                    <div className="text-[12px] text-zinc-500 mt-0.5">
                      GRQ Holdings — Restricted
                    </div>
                  </div>
                  <button
                    onClick={dismiss}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-200 mt-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.05] mx-6" />

                {/* Body */}
                <div className="px-6 py-5 space-y-3.5">

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium text-zinc-400">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@grq.ae"
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.05] transition-all duration-200 placeholder:text-zinc-700"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium text-zinc-400">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 pr-10 text-[13px] text-white focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.05] transition-all duration-200 placeholder:text-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error state */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/[0.07] border border-red-500/[0.15]"
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-1"
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
                <div className="px-6 pb-5 pt-1">
                  <p className="text-[10px] text-zinc-700 text-center">
                    Authorized personnel only · GRQ Holdings
                  </p>
                </div>

                {/* Bottom hairline */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
