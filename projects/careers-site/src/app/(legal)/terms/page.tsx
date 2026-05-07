import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NoiseOverlay } from "@/components/NoiseOverlay";

export const metadata: Metadata = {
  title: "Terms of Use | GRQ Holdings",
  description: "Terms of Use for GRQ Holdings.",
};

const termsData = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using this website, you agree to comply with and be bound by these Terms of Use. If you do not agree with these terms, you should not view this website. GRQ Holdings ('GRQ', 'we', 'our', or 'us') reserves the right to update or modify these terms at any time without prior notice."
  },
  {
    title: "Nature of the Website",
    content: "This website is provided for informational and operational purposes related to GRQ Holdings. Nothing on this website constitutes an offer, solicitation, or guarantee of partnership, investment, employment, or engagement. All content is presented at a general level and may not reflect the full scope of GRQ’s operations."
  },
  {
    title: "No Advisory Relationship",
    content: "The information provided on this website does not constitute legal, financial, investment, or business advice. No user should rely on the content of this website as a substitute for professional advice. Any decisions made based on the information provided are made at the user’s own discretion and risk."
  },
  {
    title: "Use of the Website",
    content: "Users agree to use this website in a lawful and appropriate manner. You agree not to: Misuse or attempt to disrupt the website or its systems; Submit false, misleading, or incomplete information; Attempt unauthorized access to restricted areas or systems; Use the website for unlawful, harmful, or fraudulent purposes. GRQ reserves the right to restrict or terminate access at its discretion."
  },
  {
    title: "Submissions and Inquiries",
    content: "Any information submitted through forms, portals, or communication channels is provided voluntarily. GRQ is under no obligation to: Respond to submissions; Enter into discussions or agreements; Maintain ongoing communication. Submission of information does not establish any form of relationship, partnership, or obligation."
  },
  {
    title: "Intellectual Property",
    content: "All content on this website, including text, structure, branding, and materials, is the property of GRQ or its licensors. Users may not copy, reproduce, distribute, or use any content without prior written permission."
  },
  {
    title: "Third-Party Links and Services",
    content: "This website may contain references to third-party services or tools. GRQ does not control and is not responsible for the content, policies, or practices of third-party platforms."
  },
  {
    title: "Limitation of Liability",
    content: "GRQ shall not be liable for any direct, indirect, or consequential damages arising from: Use or inability to use the website; Reliance on information provided; Errors, omissions, or inaccuracies in content; Technical issues or interruptions. Use of the website is at your own risk."
  },
  {
    title: "Availability and Changes",
    content: "GRQ may modify, suspend, or discontinue any part of the website at any time without notice. Content may be updated, removed, or changed at the discretion of GRQ."
  },
  {
    title: "Governing Law",
    content: "These Terms of Use shall be governed by and interpreted in accordance with applicable laws in the jurisdiction of United Arab Emirates."
  }
];

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p className="text-lg md:text-xl font-light text-zinc-400 max-w-2xl leading-relaxed">
            The following outlines the operational terms for accessing and interacting with GRQ Holdings infrastructure.
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
                {termsData.map((section, idx) => (
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
                  <Link href="/privacy" className="text-sm text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 group">
                    Privacy Policy <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                  </Link>
                  <Link href="/disclaimer" className="text-sm text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 group">
                    Disclaimer <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Legal Text */}
          <div className="w-full md:w-3/4">
            <div className="space-y-16 md:space-y-20">
              {termsData.map((section, idx) => (
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

