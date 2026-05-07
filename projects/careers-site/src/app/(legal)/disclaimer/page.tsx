import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NoiseOverlay } from "@/components/NoiseOverlay";

export const metadata: Metadata = {
  title: "Disclaimer | GRQ Holdings",
  description: "Disclaimer for GRQ Holdings.",
};

const disclaimerData = [
  {
    title: "General Disclaimer",
    content: "The information provided on this website is for general informational purposes only. While GRQ Holdings aims to present accurate and up-to-date information, no representation or warranty is made regarding completeness, accuracy, or reliability."
  },
  {
    title: "No Guarantee of Outcomes",
    content: "GRQ does not guarantee any specific results, outcomes, or performance related to: Ventures; Partnerships; Opportunities; Systems or capabilities described. All references to capabilities, operations, or potential outcomes are indicative and not guaranteed."
  },
  {
    title: "No Offer or Commitment",
    content: "Nothing on this website constitutes: An offer to invest; A solicitation for investment; A commitment to engage in partnerships; A guarantee of collaboration or business relationship. All engagements are subject to independent review and formal agreement."
  },
  {
    title: "Operational Representation",
    content: "Descriptions of GRQ’s capabilities, systems, or operations are presented at a high level and may not reflect all operational details, limitations, or variations. Actual execution may differ based on market conditions, strategic decisions, and internal priorities."
  },
  {
    title: "Third-Party Dependencies",
    content: "GRQ’s operations may involve third-party services, platforms, and infrastructure. GRQ is not responsible for the performance, actions, or outcomes of third-party entities."
  },
  {
    title: "Limitation of Responsibility",
    content: "GRQ shall not be held responsible for any loss, damage, or impact resulting from: Reliance on website content; Interpretation of information; Engagement decisions made by users. All users are responsible for their own decisions and due diligence."
  },
  {
    title: "Forward-Looking Statements",
    content: "Certain content may include forward-looking statements regarding growth, expansion, or future capabilities. These statements are based on current expectations and are subject to change without notice. Actual outcomes may differ significantly."
  },
  {
    title: "Updates",
    content: "This Disclaimer may be updated or modified at any time without prior notice."
  }
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#050508] relative selection:bg-sky-500/20 selection:text-white pb-32 overflow-hidden">
      <NoiseOverlay />
      
      {/* Subtle Ambient Light & Technical Grid at Top */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.04),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative z-10 pt-32 md:pt-48 pb-16 md:pb-24 px-6 sm:px-12 border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="flex items-center gap-2 text-xs md:text-sm font-medium tracking-widest text-zinc-500 uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50" />
            Last Updated: March 2026
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white mb-6 md:mb-8">
            Disclaimer
          </h1>
          <p className="text-lg md:text-xl font-light text-zinc-400 max-w-2xl leading-relaxed">
            This document outlines the limitations of liability and performance guarantees regarding GRQ systems and ventures.
          </p>
        </div>
      </div>

      {/* Main Content Area: Split Layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pt-16 md:pt-24">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Table of Contents */}
          <div className="hidden md:block w-1/4 shrink-0">
            <div className="sticky top-32">
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-6">
                Directory
              </p>
              <nav className="flex flex-col space-y-3 pl-5 relative border-l border-white/[0.08]">
                {disclaimerData.map((section, idx) => (
                  <a 
                    key={idx} 
                    href={`#section-${idx}`} 
                    className="text-sm font-medium text-zinc-500 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group relative"
                  >
                    {/* Active/Hover node indicator */}
                    <span className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {section.title}
                  </a>
                ))}
              </nav>
              
              {/* Quick links to other legal pages */}
              <div className="mt-16 pt-8 border-t border-white/[0.04]">
                <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">
                  Related Documents
                </p>
                <div className="flex flex-col space-y-3">
                  <Link href="/terms" className="text-sm text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 group">
                    Terms of Use <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                  </Link>
                  <Link href="/privacy" className="text-sm text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 group">
                    Privacy Policy <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Legal Text */}
          <div className="w-full md:w-3/4">
            <div className="space-y-16 md:space-y-20">
              {disclaimerData.map((section, idx) => (
                <div key={idx} id={`section-${idx}`} className="scroll-mt-32 group">
                  <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-5 md:mb-6">
                    {section.title}
                  </h2>
                  <div className="font-light leading-relaxed text-zinc-400 text-base md:text-lg">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
            

          </div>

        </div>
      </div>
    </div>
  );
}
