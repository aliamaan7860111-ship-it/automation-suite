"use client";

import { BarChart3, Globe2, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/SpotlightCard";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { PremiumBadge } from "@/components/PremiumBadge";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { MeteorButton } from "@/components/MeteorButton";
import { TechPartners } from "@/components/TechPartners";

import { useEffect, useState } from "react";
import VideoHero from "@/components/ui/video-hero";
import { ClientOnly } from "@/components/ClientOnly";
import { motion } from "framer-motion";

const opticalDepth = {
    hidden: { opacity: 0, filter: "blur(12px)", scale: 0.96, y: 30 },
    visible: { 
        opacity: 1, 
        filter: "blur(0px)", 
        scale: 1, 
        y: 0, 
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
};

const staggerChildren = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
};

// Updated Data reflecting actual hiring needs
const OPEN_ROLES = [
    {
        id: "ai-automation-engineer",
        title: "AI Automation Engineer",
        location: "Remote / Global",
        type: "Full-Time",
        hook: "Architect intelligent workflows and API bridges to power high-volume operations.",
    },
    {
        id: "growth-marketer",
        title: "Growth Marketer",
        location: "Remote / Global",
        type: "Full-Time",
        hook: "Deploy massive budgets across Meta and TikTok to acquire customers at scale.",
    },
    {
        id: "sales-executive",
        title: "Senior Sales Agent",
        location: "Remote / Global",
        type: "Full-Time",
        hook: "Close high-ticket inbound leads with precision and an elite understanding of human psychology.",
    },
    {
        id: "virtual-assistant",
        title: "Executive Virtual Assistant",
        location: "Remote / Global",
        type: "Full-Time",
        hook: "Operate as the operational backbone managing critical logistics for executives.",
    },
];

export default function CareersPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <ClientOnly>
            <VideoHero
                trustBadge={{ text: "Now scaling our ecosystem globally" }}
                headline={{ line1: "Architect the Future of", line2: "Scalable Business." }}
                subtitle="We build, acquire, and scale our own portfolio of global brands. Join an elite in-house team engineering the systems that drive eight-figure revenue entirely from within."
                buttons={{
                    primary: { text: "View Roles", onClick: () => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" }) }
                }}
            />

            {/* Full-bleed TechPartners — outside padded container */}
            <div className="w-full bg-[#050508] relative z-10 border-t border-white/[0.04]">
                <TechPartners />
            </div>

            <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-12 relative z-10">
                <div suppressHydrationWarning className="flex flex-col gap-8 md:gap-16 pb-12">



                    {/* Roles Grid */}
                    <motion.section 
                        id="open-roles" 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-10%" }} 
                        variants={staggerChildren}
                        className="space-y-8 pb-10 mt-16"
                    >
                        <motion.div variants={opticalDepth} className="flex items-center justify-between border-b border-white/10 pb-6">
                            <h2 className="text-2xl font-light tracking-wide text-zinc-200">Open Positions</h2>
                            <span className="text-sm font-mono text-zinc-500">{OPEN_ROLES.length} Roles</span>
                        </motion.div>

                        <motion.div variants={opticalDepth}>
                            <StaggeredGrid>
                                {OPEN_ROLES.map((role) => (
                                    <SpotlightCard key={role.id} {...role} />
                                ))}
                            </StaggeredGrid>
                        </motion.div>
                    </motion.section>


                </div>
            </div>
        </ClientOnly>
    );
}
