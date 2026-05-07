"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Briefcase, Cpu, Megaphone, PenTool, TrendingUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { useUploadThing } from "@/utils/uploadthing";

// --- Types ---
type PositionRole = "Marketing" | "Sales" | "Operations" | "Creative / Content" | "AI / Automation" | "Not sure";

interface ApplicationData {
    fullName: string;
    age: string;
    location: string;
    whatsapp: string;
    linkedIn: string;
    occupation: string;
    position: PositionRole | "";
    whyUs: string;
    resumeLine: string; // Mocking file upload via text for now until cloud storage is setup
}

export default function ApplyPage() {
    // --- State Management ---
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<ApplicationData>({
        fullName: "", age: "", location: "", whatsapp: "", linkedIn: "", occupation: "",
        position: "", whyUs: "", resumeLine: ""
    });

    // Track selected phone country for the error label only
    const [whatsappCountry, setWhatsappCountry] = useState<{ name?: string; dialCode?: string; countryCode?: string } | null>(null);

    const { startUpload, isUploading } = useUploadThing("resumeUploader");

    const updateForm = (field: keyof ApplicationData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const isValidUrl = (v: string) => {
        try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; }
        catch { return false; }
    };

    const isValidPhone = (phone: string) => {
        if (!phone) return false;
        // react-phone-input-2 supplies the number without a leading "+"
        const e164 = phone.startsWith("+") ? phone : "+" + phone;
        return parsePhoneNumberFromString(e164)?.isValid() ?? false;
    };

    // --- Validation State ---
    const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, boolean>>>({});

    // --- Country Data ---
    const countryOptions = useMemo(() => countryList().getData(), []);

    // Custom Select Styles for Dark Mode
    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: state.isFocused ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            padding: "4px",
            boxShadow: state.isFocused ? "0 0 0 1px rgba(59, 130, 246, 0.5)" : "none",
            "&:hover": { borderColor: "rgba(255, 255, 255, 0.2)" }
        }),
        menu: (base: any) => ({
            ...base,
            background: "#111",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            overflow: "hidden"
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? "rgba(255, 255, 255, 0.05)" : "transparent",
            color: state.isSelected ? "#ffffff" : "#a1a1aa",
            "&:active": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            cursor: "pointer"
        }),
        singleValue: (base: any) => ({ ...base, color: "#fff" }),
        input: (base: any) => ({ ...base, color: "#fff" })
    };

    // --- Navigation Logic ---
    const nextStep = () => {
        let newErrors: Partial<Record<keyof ApplicationData, boolean>> = {};

        if (step === 1) {
            if (!formData.fullName) newErrors.fullName = true;
            if (!formData.age) newErrors.age = true;
            if (!formData.location) newErrors.location = true;
            if (!isValidPhone(formData.whatsapp)) newErrors.whatsapp = true;
            if (!formData.linkedIn || !isValidUrl(formData.linkedIn)) newErrors.linkedIn = true;
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }

        if (step === 2 && (!formData.position || !formData.whyUs)) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // --- Submission Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Resume is required — block submission if no file selected
            if (!selectedFile) {
                throw new Error("Resume is required. Please upload a PDF or DOCX.");
            }

            // 1. Handle File Upload via UploadThing
            const uploadRes = await startUpload([selectedFile]);
            if (!uploadRes || uploadRes.length === 0) {
                throw new Error("File upload failed. Please try again.");
            }
            const resumeUrl = uploadRes[0].url;

            // 2. Submit Form Data
            const res = await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    resumeLine: resumeUrl
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");
            setIsSuccess(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- Animation Variants ---
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -20 }
    };

    const pageTransition = {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
    };

    // --- Success State Render ---
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6 animate-in fade-in zoom-in duration-500 bg-black">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Identity Logged.</h2>
                    <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Data received. Our operations team actively reviews incoming signals. If there is a match, we will initiate engagement.
                    </p>
                </div>
                <Link
                    href="/"
                    className="mt-8 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Base
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-20 md:pt-32 px-4 pb-24 overflow-x-hidden">

            {/* Portal Background Layer */}
            <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
                <div className="absolute top-0 w-full h-[500px] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-start gap-12">

                {/* Global Form Header & Progress Indicator */}
                <div className="w-full flex items-center justify-between">
                    <Link href="/careers" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Cancel
                    </Link>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-12 h-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-blue-500' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="w-full">
                    <AnimatePresence mode="wait">

                        {/* ----------------- STEP 1: IDENTITY ----------------- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                                className="space-y-8 w-full"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tight text-white">Identity.</h1>
                                    <p className="text-zinc-400">Establish your baseline profile.</p>
                                </div>

                                <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
                                    {/* Full Name & Age Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                                                {errors.fullName && <span className="text-xs text-red-400">Required</span>}
                                            </div>
                                            <input type="text" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} required placeholder="John Doe" className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${errors.fullName ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Age <span className="text-red-500">*</span></label>
                                                {errors.age && <span className="text-xs text-red-400">Required</span>}
                                            </div>
                                            <input type="number" value={formData.age} onChange={(e) => updateForm("age", e.target.value)} required placeholder="24" className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${errors.age ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'}`} />
                                        </div>
                                    </div>

                                    {/* Location & Occupation Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Country <span className="text-red-500">*</span></label>
                                                {errors.location && <span className="text-xs text-red-400">Required</span>}
                                            </div>
                                            <Select
                                                classNamePrefix="react-select"
                                                options={countryOptions}
                                                value={countryOptions.find((c: any) => c.label === formData.location)}
                                                onChange={(val) => updateForm("location", val?.label || "")}
                                                styles={selectStyles}
                                                placeholder="Select Country..."
                                                isSearchable
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Current Occupation</label>
                                            <input type="text" value={formData.occupation} onChange={(e) => updateForm("occupation", e.target.value)} placeholder="Growth Manager" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none" />
                                        </div>
                                    </div>

                                    {/* Comms Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">WhatsApp Number <span className="text-red-500">*</span></label>
                                                {errors.whatsapp && (
                                                    <span className="text-xs text-red-400">
                                                        {whatsappCountry?.name ? `Invalid number for ${whatsappCountry.name}` : "Invalid number"}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Custom Phone Input styling for Dark Mode */}
                                            <div className={`rounded-xl transition-all ${errors.whatsapp ? 'ring-1 ring-red-500' : ''}`}>
                                                <PhoneInput
                                                    country={'ae'}
                                                    value={formData.whatsapp}
                                                    onChange={(phone, country) => {
                                                        setWhatsappCountry(country as { name?: string; dialCode?: string; countryCode?: string });
                                                        updateForm("whatsapp", phone);
                                                    }}
                                                    enableSearch={true}
                                                    containerStyle={{ width: '100%', borderRadius: '0.75rem' }}
                                                    inputStyle={{
                                                        width: '100%',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: errors.whatsapp ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '0.75rem',
                                                        color: 'white',
                                                        height: '48px',
                                                        fontSize: '16px'
                                                    }}
                                                    buttonStyle={{
                                                        background: 'rgba(255, 255, 255, 0.02)',
                                                        border: errors.whatsapp ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '0.75rem 0 0 0.75rem',
                                                        borderRight: 'none',
                                                        paddingLeft: '8px'
                                                    }}
                                                    dropdownStyle={{
                                                        background: '#111',
                                                        color: 'white',
                                                        borderRadius: '0.75rem',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 relative group">
                                            <div className="flex justify-between items-end">
                                                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Socials URL <span className="text-red-500">*</span></label>
                                                {errors.linkedIn && (
                                                    <span className="text-xs text-red-400">
                                                        {formData.linkedIn ? "Invalid URL" : "Required"}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Neutral silver glow — no longer LinkedIn-specific */}
                                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 rounded-xl opacity-0 ${errors.linkedIn ? 'opacity-50 ring-2 ring-red-500' : 'group-hover:opacity-15 group-focus-within:opacity-25'} transition-opacity`} />
                                            <input type="url" value={formData.linkedIn} onChange={(e) => updateForm("linkedIn", e.target.value)} required placeholder="https://linkedin.com/in/you · https://x.com/handle · https://your-portfolio.com" className="relative w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-transparent outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <button type="button" onClick={nextStep} className="w-full py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                                        Initialize Routing <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ----------------- STEP 2: POSITION & DIRECTION ----------------- */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                                className="space-y-8 w-full"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tight text-white">Target Scope.</h1>
                                    <p className="text-zinc-400">Select the vector you command best.</p>
                                </div>

                                {/* Custom Bento Selection Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {
                                        [
                                            { id: "Marketing", icon: Megaphone, label: "Marketing" },
                                            { id: "Sales", icon: TrendingUp, label: "Sales" },
                                            { id: "Operations", icon: Briefcase, label: "Operations" },
                                            { id: "Creative / Content", icon: PenTool, label: "Creative" },
                                            { id: "AI / Automation", icon: Cpu, label: "AI & Auto" },
                                            { id: "Not sure", icon: HelpCircle, label: "Not sure" },
                                        ].map((role) => {
                                            const isSelected = formData.position === role.id;
                                            const Icon = role.icon;
                                            return (
                                                <div
                                                    key={role.id}
                                                    onClick={() => updateForm("position", role.id as PositionRole)}
                                                    className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${isSelected ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                    <span className="text-sm font-medium">{role.label}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest ml-1">Why do you want to work with us specifically?</label>
                                    <textarea
                                        value={formData.whyUs}
                                        onChange={(e) => updateForm("whyUs", e.target.value)}
                                        required
                                        rows={5}
                                        placeholder="Deliver signal, cut out the noise..."
                                        className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <button type="button" onClick={nextStep} className="w-full h-full rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                                            Confirm Objective <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* ----------------- STEP 3: VERIFICATION (FILE UPLOAD) ----------------- */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                                className="space-y-8 w-full"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tight text-white">Verification.</h1>
                                    <p className="text-zinc-400">Provide material proof of execution. <span className="text-red-500">*</span> Required.</p>
                                </div>

                                {/* Deeply Styled Dropzone */}
                                <div
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    className="border-2 border-dashed border-white/10 bg-white/[0.02] rounded-3xl p-12 text-center hover:bg-white/[0.04] hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx,.doc"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                updateForm("resumeLine", file.name);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <div className={`p-4 bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 ${selectedFile ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 scale-110' : 'group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/30'}`}>
                                            {selectedFile ? <CheckCircle2 className="w-8 h-8" /> : (isUploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Upload className="w-8 h-8 text-blue-400" /></motion.div> : <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-400" />)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white font-medium text-lg">
                                                {isUploading ? "Uploading..." : (selectedFile ? selectedFile.name : "Deploy Resume or Portfolio")}
                                            </p>
                                            <p className="text-sm text-zinc-500 font-mono">
                                                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "PDF, DOCX format . Max payload 8MB"}
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {submitError && (
                                    <p className="text-red-400 text-sm text-center">{submitError}</p>
                                )}
                                <div className="flex gap-4 pt-8">
                                    <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedFile}
                                            className="w-full h-full rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Transmitting payload..." : (selectedFile ? "Execute Application" : "Resume Required")}
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
