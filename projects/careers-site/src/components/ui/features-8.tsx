import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Network, Zap, Lock, Cpu } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-transparent py-16 md:py-32">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="mb-12 md:mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                        <span className="text-blue-500/50 font-mono text-[10px] uppercase tracking-[0.2em]">Our Stack</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-snug">
                        Engineered for absolute scale.
                    </h2>
                </div>
                
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-4">
                        {/* Box 1: Data Sovereignty */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-[#0c0c12] hover:border-white/20 transition-all duration-500">
                            <CardContent className="relative m-auto size-fit pt-8 pb-8 text-white">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="relative flex h-24 w-56 items-center justify-center text-sky-400">
                                    <Lock className="w-12 h-12 opacity-80" />
                                    <span className="ml-4 block w-fit text-5xl font-bold tracking-tighter text-white">100%</span>
                                </div>
                                <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight">Data Sovereignty</h2>
                                <p className="mt-2 text-zinc-400 text-center text-sm leading-relaxed">Absolute control over every byte of our global operational data flow.</p>
                            </CardContent>
                        </Card>

                        {/* Box 2: Proprietary AI Nodes */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-[#0c0c12] transition-all duration-500">
                            <CardContent className="pt-8 text-white">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 bg-gradient-to-b from-sky-900/20 to-transparent">
                                    <Network className="m-auto h-10 w-10 text-sky-400 opacity-80" />
                                </div>
                                <div className="relative z-10 mt-8 space-y-2 text-center">
                                    <h2 className="text-lg font-medium text-white tracking-tight">Proprietary AI Nodes</h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed">Algorithmic workflow routing bypassing strict human bottlenecks.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Box 3: Sub-50ms Execution Latency */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-[#0c0c12] transition-all duration-500">
                            <CardContent className="pt-8 text-white h-full flex flex-col justify-between">
                                <div className="pt-6 lg:px-6 w-full flex justify-center">
                                     <div className="w-full h-24 rounded-xl border border-white/10 bg-gradient-to-r from-sky-500/10 via-transparent to-transparent flex items-center px-6">
                                         <div className="flex gap-2 w-full items-center">
                                             <div className="h-2 flex-grow bg-white/10 rounded-full overflow-hidden">
                                                 <div className="h-full w-[95%] bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                                             </div>
                                             <span className="font-mono text-xs text-sky-400">&lt;50ms</span>
                                         </div>
                                     </div>
                                </div>
                                <div className="relative z-10 mt-auto pt-8 space-y-2 text-center">
                                    <h2 className="text-lg font-medium text-white tracking-tight">Execution Latency</h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed">Engineered trading and bid optimizations deployed faster than the market.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Box 4: Self-Healing Architecture */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-[#0c0c12] transition-all duration-500">
                            <CardContent className="grid pt-8 sm:grid-cols-2 h-full text-white">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 bg-sky-900/20 text-sky-400">
                                        <Cpu className="m-auto size-5" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium text-white tracking-tight">Self-Healing Architecture</h2>
                                        <p className="text-zinc-400 text-sm leading-relaxed">Infrastructure that automatically reroutes around failures to maintain 99.9% targeted uptime.</p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-white/10 p-6 py-6 sm:ml-6 items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                                        <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                                        <span className="block size-2 rounded-full border border-white/10 bg-white/10"></span>
                                    </div>
                                    <Zap className="w-16 h-16 text-sky-400/50" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Box 5: Global Talent Synchronization */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-[#0c0c12] transition-all duration-500">
                            <CardContent className="grid h-full pt-8 sm:grid-cols-2 text-white">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 bg-purple-900/20 text-purple-400">
                                        <Users className="m-auto size-5" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium text-white tracking-tight">Global Talent Synchronization</h2>
                                        <p className="text-zinc-400 text-sm leading-relaxed">Connecting an elite, 100% remote workforce across a unified internal network overlay.</p>
                                    </div>
                                </div>
                                <div className="before:bg-white/10 relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-3 pr-4">
                                            <span className="block h-fit rounded border border-white/10 bg-[#0a0a0f] px-2 py-1 text-xs text-zinc-300">Engineering</span>
                                            <div className="ring-background size-8 ring-2 ring-[#050508] bg-zinc-800 rounded-full" />
                                        </div>
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-3 pl-4">
                                            <div className="ring-background size-8 ring-2 ring-[#050508] bg-zinc-800 rounded-full" />
                                            <span className="block h-fit rounded border border-white/10 bg-[#0a0a0f] px-2 py-1 text-xs text-zinc-300">Operations</span>
                                        </div>
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-3 pr-4">
                                            <span className="block h-fit rounded border border-white/10 bg-[#0a0a0f] px-2 py-1 text-xs text-zinc-300">Growth</span>
                                            <div className="ring-background size-8 ring-2 ring-[#050508] bg-zinc-800 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
