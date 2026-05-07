import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-[#050508] to-black overflow-hidden relative">
            {/* Subtle top glow boundary instead of a hard line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_-4px_24px_rgba(255,255,255,0.03)]" />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-12 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-start gap-8">
                        <Link href="/" className="text-xl font-bold tracking-tight text-white/90 hover:text-white transition-colors duration-500">
                            GRQ Holdings
                        </Link>
                        <p className="text-[13px] text-zinc-600 max-w-sm leading-relaxed font-light tracking-wide">
                            Engineering the systems and driving the operations that scale elite brands. We build, acquire, and grow assets to their absolute maximum potential.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">Company</h4>
                        <Link href="/about" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out">About Us</Link>
                        <Link href="/careers" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out flex items-center gap-2">
                            Careers <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[9px] font-mono tracking-widest uppercase border border-white/5">Hiring</span>
                        </Link>
                        <Link href="/inquiries" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out">Strategic Inquiries</Link>
                        <Link href="/portal" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out flex items-center gap-2">
                            Operator Portal <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">Legal</h4>
                        <Link href="/privacy" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out">Privacy Policy</Link>
                        <Link href="/terms" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out">Terms of Use</Link>
                        <Link href="/disclaimer" className="text-[13px] text-zinc-600 hover:text-white transition-all duration-500 ease-in-out">Disclaimer</Link>
                    </div>
                </div>

                {/* Unified Centered Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-center pt-10 border-t border-white/[0.03] gap-4 md:gap-8">
                    <p className="text-[10px] text-zinc-600 font-mono tracking-[0.2em] uppercase">
                        &copy; {new Date().getFullYear()} GRQ Holdings <span className="mx-2 text-zinc-800 hidden md:inline">•</span> All Systems Operational
                    </p>
                    
                    <div className="flex items-center">
                        <Link 
                            href="https://www.linkedin.com/company/grqholdings/" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white transition-all duration-500"
                        >
                            <svg className="h-4 w-4 text-zinc-500 group-hover:text-sky-400 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            <span className="text-[11px] font-medium tracking-wide uppercase">LinkedIn</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
