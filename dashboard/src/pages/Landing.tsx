/**
 * @file Landing.tsx
 * @description Landing page overview for the Clinical Data Ingress Fabric (CDIF).
 * Provides the elevator pitch and high-level architectural diagram for AI engineering audiences.
 * Employs strict enterprise software engineering standards. Verified and Validated.
 * @author Mission Control
 */

import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap, Database, ArrowRight, Server, Hexagon, Activity, Network } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-8 h-full overflow-y-auto pr-4 pb-16">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
                        AI-Powered Data Pipeline <span className="text-indigo-400 font-mono text-sm uppercase px-2 py-1 border border-indigo-500/30 rounded bg-indigo-500/10 tracking-widest">CDIF</span>
                    </h1>
                    <p className="text-base font-medium text-slate-400 tracking-wide mt-2">
                        A demonstration of AI-assisted data ingestion with built-in guardrails
                    </p>
                </div>
            </motion.div>

            {/* Elevator Pitch Box */}
            <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none mix-blend-overlay"></div>

                <h2 className="text-sm font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-indigo-400" /> What You Are Looking At
                </h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 text-slate-300 leading-relaxed max-w-4xl text-base space-y-6 font-medium selection:bg-indigo-500/30"
                >
                    <p>
                        This is a portfolio demonstration of AI-assisted data pipeline design.
                        The scenario is healthcare, but the pattern applies anywhere data needs to move
                        safely, accurately, and at scale - finance, logistics, government, or enterprise IT.
                    </p>
                    <p>
                        AI handles the speed, volume, and routing. Built-in guardrails handle the safety.
                        Nothing enters the system without being checked. Nothing is stored without being verified.
                        The result is a pipeline that is faster than manual processes and significantly more accurate.
                    </p>
                    <p>
                        Every action is logged. Every decision is traceable. High-priority items are flagged and routed without
                        anyone having to ask. The team stays focused on outcomes, not overhead.
                        All data shown is simulated for demonstration purposes.
                    </p>
                </motion.div>
            </section>

            {/* Core Capability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col items-start gap-4 hover:bg-slate-800/50 transition-colors group"
                >
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">Data Validation</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-mono">
                            Data is checked the moment it arrives. Anything that does not meet the standard is stopped before it enters the system.
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col items-start gap-4 hover:bg-slate-800/50 transition-colors group"
                >
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">Smart Enrichment</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-mono">
                            Clean data gets smarter. Records are scored, tagged, and prioritized automatically so the right information reaches the right place at the right time.
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col items-start gap-4 hover:bg-slate-800/50 transition-colors group"
                >
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">Secure Intake</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-mono">
                            A secure, monitored entry point handles all incoming data. Volume spikes, edge cases, and anomalies are caught in real time.
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col items-start gap-4 hover:bg-slate-800/50 transition-colors group"
                >
                    <div className="p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl text-slate-400 group-hover:scale-110 transition-transform">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">Audit-Ready Storage</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-mono">
                            Every record lands in permanent, tamper-proof storage with a timestamp and a unique ID. Full traceability. No exceptions.
                        </p>
                    </div>
                </motion.section>

            </div>

            {/* Five-Vector Pipeline Infographic */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="bg-black border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative mt-6"
            >
                {/* Background Grid & Glows */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)] pointer-events-none rounded-2xl"></div>

                <div className="flex flex-col gap-8 h-full relative z-10">
                    <div className="flex justify-between items-center text-xs font-mono tracking-widest text-slate-500 uppercase pb-4 border-b border-indigo-500/10">
                        <span>AI Data Pipeline Flow</span>
                        <span className="flex items-center gap-2 text-indigo-400"><Activity className="w-3 h-3" /> Live Pipeline View</span>
                    </div>

                    <div className="min-h-[14rem] w-full flex items-center justify-between px-4 md:px-12 relative pb-12">

                        {/* Connecting Lines */}
                        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-slate-800 -translate-y-1/2 z-0 hidden md:block">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500"
                                initial={{ scaleX: 0, originX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Node 1: [Lo] Validate */}
                        <motion.div className="z-10 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg flex flex-col items-center gap-3 relative">
                            <Network className="w-8 h-8 text-slate-400" />
                            <div className="text-[10px] font-mono tracking-widest text-white uppercase">[Lo] Validate</div>
                            <div className="absolute -bottom-8 text-[9px] text-slate-500 tracking-wide font-mono whitespace-nowrap">Input Checks</div>
                        </motion.div>

                        <ArrowRight className="w-6 h-6 text-slate-600 block md:hidden" />

                        {/* Node 2: [T] Transform */}
                        <motion.div
                            className="z-10 bg-indigo-950 border border-indigo-500 p-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] flex flex-col items-center gap-3 relative"
                            initial={{ y: 0 }}
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Hexagon className="w-8 h-8 text-indigo-400" />
                            <div className="text-[10px] font-mono tracking-widest text-indigo-100 uppercase">[T] Transform</div>
                            <motion.div
                                className="absolute -inset-1 border border-indigo-500/30 rounded-xl"
                                animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                            />
                            <div className="absolute -bottom-8 text-[9px] text-emerald-400 tracking-wide font-mono w-max">Priority Scoring</div>
                        </motion.div>

                        <ArrowRight className="w-6 h-6 text-slate-600 block md:hidden" />

                        {/* Node 3: [St] Persist */}
                        <motion.div className="z-10 bg-emerald-950 border border-emerald-500 p-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col items-center gap-3 relative">
                            <Server className="w-8 h-8 text-emerald-400" />
                            <div className="text-[10px] font-mono tracking-widest text-emerald-100 uppercase">[St] Persist</div>
                            <div className="absolute -bottom-8 text-[9px] text-emerald-500/80 tracking-wide font-mono w-max">Secure Storage Write</div>
                        </motion.div>

                    </div>
                </div>
            </motion.section>

        </div>
    );
}
