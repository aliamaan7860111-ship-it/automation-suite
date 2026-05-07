"use client";

import { motion } from "framer-motion";
import { ArrowRight, Send, ShieldAlert } from "lucide-react";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { useState, useRef } from "react";
import { useUploadThing } from "@/utils/uploadthing";

// ────────────────────────────────────────────────────────────
//  ANIMATION PRESETS
// ────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ────────────────────────────────────────────────────────────
//  PAGE
// ────────────────────────────────────────────────────────────
export default function InquiriesPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    summary: "",
    document: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { startUpload, isUploading } = useUploadThing("resumeUploader"); // Reusing same uploader config for simplicity

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setSubmitError(null);
    try {
      let docUrl = "";

      if (selectedFile) {
        const uploadRes = await startUpload([selectedFile]);
        if (!uploadRes || uploadRes.length === 0) {
          throw new Error("Document upload failed. Please try again.");
        }
        docUrl = uploadRes[0].url;
      }

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          document: docUrl
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.details || data.error || "Submission failed");
        setFormStatus("error");
        return;
      }
      setFormStatus("sent");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFormStatus("error");
    }
  };

  return (
    <div className="w-full bg-[#050508] min-h-screen relative overflow-hidden selection:bg-sky-500/30 font-sans text-white">
      <NoiseOverlay />

      {/* Ambient glows */}
      <div className="fixed -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-sky-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-sky-600/5 blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 top-0 h-[100vh] bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_40%,#000_20%,transparent_100%)] pointer-events-none z-0" />

      <main className="relative z-10 pt-48 md:pt-64 pb-24 px-6 max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Context & Intro */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center mb-16">


          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
            Strategic<br />
            <span>
              Inquiries
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[15px] md:text-lg text-zinc-400 mb-10 leading-relaxed font-light max-w-2xl">
            GRQ Holdings reviews a limited number of strategic opportunities across commerce, infrastructure, and digital operations. All inquiries are evaluated based on alignment, execution potential, and long-term scalability.
          </motion.p>

          <div className="flex flex-col gap-6 md:gap-8 w-full text-left max-w-2xl mx-auto">
            {/* Scope of Interest */}
            <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-[11px] font-semibold text-white uppercase tracking-widest mb-4">Our Scope of Interest</h3>
              <p className="text-[13px] text-zinc-500 mb-4">We consider:</p>
              <ul className="space-y-3">
                <li className="flex items-start text-[14px] text-zinc-300 font-light">
                  <span className="mr-3 text-sky-400 mt-[1px] opacity-70">•</span>
                  Acquisition of existing digital or commerce-based businesses
                </li>
                <li className="flex items-start text-[14px] text-zinc-300 font-light">
                  <span className="mr-3 text-sky-400 mt-[1px] opacity-70">•</span>
                  Strategic partnerships and joint ventures
                </li>
                <li className="flex items-start text-[14px] text-zinc-300 font-light">
                  <span className="mr-3 text-sky-400 mt-[1px] opacity-70">•</span>
                  Infrastructure and operational integrations
                </li>
                <li className="flex items-start text-[14px] text-zinc-300 font-light">
                  <span className="mr-3 text-sky-400 mt-[1px] opacity-70">•</span>
                  Investments into scalable systems
                </li>
              </ul>
            </motion.div>

            {/* Submission Criteria */}
            <motion.div variants={fadeUp} className="bg-red-950/10 border border-red-900/30 rounded-xl p-6 md:p-8 shadow-inner">
              <h3 className="text-[11px] font-semibold text-red-400/90 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Submission Criteria
              </h3>
              <p className="text-[13px] text-zinc-400 mb-5 leading-relaxed">
                This is <strong className="text-zinc-200">not</strong> a general contact channel. Submissions should be clear, structured, and commercially viable.
              </p>
              <p className="text-[12px] text-zinc-500 mb-3 uppercase tracking-tight font-medium">We do not respond to:</p>
              <ul className="space-y-2">
                <li className="flex items-start text-[13px] text-zinc-400">
                  <span className="mr-2 text-red-500/50">-</span> Unstructured ideas
                </li>
                <li className="flex items-start text-[13px] text-zinc-400">
                  <span className="mr-2 text-red-500/50">-</span> Early-stage concepts without execution
                </li>
                <li className="flex items-start text-[13px] text-zinc-400">
                  <span className="mr-2 text-red-500/50">-</span> Generic collaboration requests
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="relative w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

          <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-12 space-y-7">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-zinc-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Company / Entity</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Inquiry Type</label>
              <div className="relative">
                <select
                  value={formData.inquiryType}
                  onChange={(e) => updateField("inquiryType", e.target.value)}
                  className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-zinc-300 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-[#0a0a0f]">Select option...</option>
                  <option value="Acquisition" className="bg-[#0a0a0f]">Acquisition</option>
                  <option value="Partnership" className="bg-[#0a0a0f]">Partnership</option>
                  <option value="Investment" className="bg-[#0a0a0f]">Investment</option>
                  <option value="Other" className="bg-[#0a0a0f]">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Summary <span className="lowercase text-zinc-600 font-normal tracking-normal ml-1">(Short, direct explanation)</span></label>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                className="w-full bg-[#0a0a0f]/80 border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all placeholder:text-zinc-700 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 mb-2.5 uppercase tracking-widest">Supporting Documents <span className="lowercase text-zinc-600 font-normal tracking-normal ml-1">({selectedFile ? selectedFile.name : "Optional"})</span></label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className={`w-full bg-[#0a0a0f]/80 text-zinc-500 border border-white/[0.07] ${isUploading ? 'border-sky-500/50' : 'border-dashed'} rounded-xl px-4 py-4 text-sm focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer`}
                />
                {isUploading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <p className="text-red-400 text-sm text-center">{submitError}</p>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={formStatus === "sending" || formStatus === "sent"}
                className="w-full bg-white text-black font-semibold text-sm py-4 rounded-xl hover:bg-zinc-200 active:scale-[0.99] transition-all duration-300 flex justify-center items-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {(formStatus === "idle" || formStatus === "error") && (
                  <>
                    Submit Inquiry
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
                {formStatus === "sending" && (
                  <>
                    Processing
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </>
                )}
                {formStatus === "sent" && (
                  <>
                    Inquiry Submitted
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
