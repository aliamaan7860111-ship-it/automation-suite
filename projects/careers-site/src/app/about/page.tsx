import { MapPin, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "About | GRQ Holdings",
  description: "Controlled Infrastructure. Measurable Outcomes.",
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#050508] relative overflow-hidden selection:bg-sky-500/30 font-sans text-white pt-24 pb-24">
      {/* --- Ambient Background Glows --- */}
      <div className="fixed -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-sky-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-sky-600/5 blur-[120px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 top-0 h-[150vh] bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_40%,#000_20%,transparent_100%)] pointer-events-none z-0" />

      {/* --- Header --- */}
      <section className="relative z-10 pt-16 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-3 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
             <span className="text-xs font-mono text-zinc-300 tracking-[0.2em] uppercase">About GRQ Holdings</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-8 leading-[1.1]">
            Controlled Infrastructure.<br/>
            <span className="text-sky-500">Measurable Outcomes.</span>
          </h1>
          <div className="space-y-6 text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
            <p>
              GRQ Holdings is a privately operated holding company focused on building, acquiring, and scaling high-performance digital and commerce infrastructure.
            </p>
            <p>
              We operate across multiple verticals, structuring systems that are designed for control, efficiency, and long-term scalability.
            </p>
            <p className="border-l-2 border-sky-500/30 pl-6 mt-8 py-2 text-left italic">
              Our approach is not based on trends or short-term growth. It is based on <span className="text-zinc-200 not-italic font-medium">ownership, execution, and continuous optimization.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- What We Do --- */}
      <section className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-6">What We Do</h2>
            <p className="text-zinc-400 leading-relaxed font-light mb-6 text-lg">
              We identify fragmented opportunities across digital markets and consolidate them into structured, controlled systems.
            </p>
            <p className="text-zinc-400 leading-relaxed font-light text-lg">
              Each component is built to integrate into a broader ecosystem where performance compounds over time.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
             <div className="bg-[#0a0a0f] border border-white/[0.06] rounded-[24px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[60px]" />
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">Integrated Systems</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-light text-lg">E-commerce infrastructure</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-light text-lg">Performance-driven marketing systems</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-light text-lg">Automation and operational frameworks</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-light text-lg">Data-driven decision layers</span>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </section>



      {/* --- Global Operations --- */}
      <section className="relative mb-24 z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-8">
            <div className="md:w-[55%]">
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-6">Global Operations</h2>
              <div className="space-y-4">
                <p className="text-base text-zinc-400 leading-relaxed font-light">
                  GRQ operates across multiple regions with a primary base in the UAE. Our infrastructure is designed to support:
                </p>
                <ul className="list-none space-y-2 mt-4 marker:text-sky-500 text-zinc-300 font-light">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"/> Regional execution</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"/> International expansion</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"/> Cross-market scalability</li>
                </ul>
                <p className="text-base text-zinc-400 leading-relaxed font-light mt-4">
                  We continuously expand operational reach while maintaining centralized control.
                  Each region operates within a unified system, enabling efficient deployment, oversight, and scalable execution without operational fragmentation.
                </p>
              </div>
            </div>

            {/* Dashboards Stat Counters */}
            <div className="md:w-auto flex flex-row gap-12 md:justify-end mt-4 md:mt-0">
               <div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tighter">28</div>
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Active Systems <br className="hidden md:block"/> in Operation</div>
               </div>
               <div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tighter">08<span className="text-sky-500">+</span></div>
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Operational <br className="hidden md:block"/> Regions</div>
               </div>
            </div>
          </div>

          <div className="relative w-full rounded-[24px] border border-white/[0.06] bg-[#0a0a0f] overflow-hidden p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.08),transparent_70%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-16 relative z-10">
              {/* Telemetry Line inside the Card */}
              <div className="relative pl-6 border-l border-white/10 space-y-12 w-full md:w-1/2">
                
                <div className="relative group">
                  <div className="absolute left-[-29px] top-1.5 w-[9px] h-[9px] rounded-full bg-sky-400 ring-4 ring-sky-900/50 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" /> UAE (Headquarters)
                  </h4>
                  <p className="text-sm text-zinc-500 mt-3 font-light leading-relaxed">
                    Primary operational base overseeing strategy, infrastructure, and execution.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute left-[-29px] top-1.5 w-[9px] h-[9px] rounded-full bg-sky-200/50 ring-4 ring-sky-900/20" />
                  <h4 className="text-zinc-200 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-200" /> Europe Operations
                  </h4>
                  <p className="text-sm text-zinc-500 mt-3 font-light leading-relaxed">
                    Regional execution layer supporting distribution & expansion across European markets.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute left-[-29px] top-1.5 w-[9px] h-[9px] rounded-full bg-slate-300/50 ring-4 ring-slate-800/40" />
                  <h4 className="text-zinc-300 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-300" /> Asia Supply Network
                  </h4>
                  <p className="text-sm text-zinc-500 mt-3 font-light leading-relaxed">
                    Integrated sourcing and procurement layer supporting product access, supplier coordination, and supply-side scalability across key Asian markets.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute left-[-29px] top-1.5 w-[9px] h-[9px] rounded-full bg-zinc-700 ring-4 ring-black" />
                  <h4 className="text-zinc-400 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-600" /> Global Expansion
                  </h4>
                  <p className="text-sm text-zinc-600 mt-3 font-light leading-relaxed">
                    Ongoing progress into additional markets, focused on scalability & system integration.
                  </p>
                </div>

              </div>
              
              <div className="w-full md:w-1/2 flex items-center">
                 <p className="text-lg font-light text-zinc-400 italic border-l-2 border-sky-500/30 pl-8 py-4 leading-relaxed">
                    "GRQ is not defined by individual ventures, but by the system that builds, operates, and scales them. That system remains constant, regardless of market or expansion."
                 </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
