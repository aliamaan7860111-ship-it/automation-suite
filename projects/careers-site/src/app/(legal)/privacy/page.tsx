import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NoiseOverlay } from "@/components/NoiseOverlay";

export const metadata: Metadata = {
  title: "Privacy Policy | GRQ Holdings",
  description: "Privacy Policy for GRQ Holdings.",
};

const privacyData = [
  {
    title: "Introduction",
    content: "GRQ Holdings ('GRQ', 'we', 'our', or 'us') respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how information is collected, used, stored, and protected when you access or interact with our website, systems, or services. By using this website, you agree to the terms outlined in this policy."
  },
  {
    title: "Information We Collect",
    content: "GRQ may collect the following types of information: Personal Information (Name, Email address, Phone number, Company details) provided voluntarily. Technical Information (IP address, Browser type, Pages visited) collected automatically. Submission Data (Strategic inquiry forms, Application portals, Partner submissions)."
  },
  {
    title: "How We Use Information",
    content: "Information collected by GRQ is used for the following purposes: To review and respond to inquiries; To evaluate partnerships and opportunities; To operate, maintain, and improve internal systems; To monitor website performance; To ensure security and prevent misuse; To comply with legal requirements. GRQ does not use personal information for unrelated purposes."
  },
  {
    title: "Data Sharing and Disclosure",
    content: "GRQ does not sell or rent personal information to third parties. Information may be shared in limited circumstances: With internal teams or operators for evaluation; With service providers supporting infrastructure; When required by law or legal process; To protect the rights, operations, or security of GRQ. All data sharing is conducted with consideration for confidentiality and operational necessity."
  },
  {
    title: "Data Storage and Security",
    content: "GRQ implements reasonable technical and organizational measures to protect information from unauthorized access, misuse, or disclosure. Data may be stored on secure servers and internal systems used to manage operations and submissions. While efforts are made to protect data, no system can guarantee complete security."
  },
  {
    title: "Data Retention",
    content: "Information is retained only for as long as necessary to fulfill the purposes outlined in this policy. GRQ may retain data for operational, legal, or analytical purposes where required."
  },
  {
    title: "Cookies and Tracking",
    content: "The website may use cookies or similar technologies to: Improve user experience; Analyze website performance; Track interaction and usage patterns. Users may adjust browser settings to refuse or limit cookies."
  },
  {
    title: "Third-Party Services",
    content: "The website may use third-party tools or services for analytics, hosting, or functionality. These providers may collect and process data in accordance with their own privacy policies. GRQ is not responsible for the practices of third-party services."
  },
  {
    title: "User Rights",
    content: "Depending on applicable laws, users may have the right to: Request access to personal information; Request correction or deletion of data; Withdraw consent where applicable. Requests may be submitted through the appropriate contact channels."
  },
  {
    title: "International Use",
    content: "GRQ operates across multiple jurisdictions. By using this website, you acknowledge that your information may be processed and stored in different countries where GRQ or its service providers operate."
  },
  {
    title: "Updates to This Policy",
    content: "GRQ reserves the right to update or modify this Privacy Policy at any time. Changes will be reflected on this page with an updated effective date."
  }
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl font-light text-zinc-400 max-w-2xl leading-relaxed">
            This document outlines how information is processed, stored, and protected within the GRQ infrastructure.
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
                {privacyData.map((section, idx) => (
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
              {privacyData.map((section, idx) => (
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
