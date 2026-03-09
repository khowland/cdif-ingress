import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Hexagon, Lock, Cpu, ArrowRight } from 'lucide-react';

const NODES = [
    { id: 'ingress', icon: <Network />, label: 'Ingress Point', tier: 'Edge', status: 'Online' },
    { id: 'logic', icon: <Hexagon />, label: 'Deterministic Eval', tier: 'Validation', status: 'Strict' },
    { id: 'engine', icon: <Cpu />, label: 'Heuristic Engine', tier: 'Computation', status: 'Nominal' },
    { id: 'gate', icon: <Lock />, label: 'Zero-Trust Gate', tier: 'Enforcement', status: 'Active' },
    { id: 'vault', icon: <Database />, label: 'Immutable Vault', tier: 'Storage', status: 'Appending' }
];

export default function ArchitecturePage() {
    const [activeNode, setActiveNode] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNode(i => (i + 1) % NODES.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full">

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
                        Active Topology <Hexagon className="w-5 h-5 text-indigo-400" />
                    </h1>
                    <p className="text-sm font-medium text-slate-500 tracking-wide mt-1">
                        Five-Vector Pipeline Architecture Flow
                    </p>
                </div>
            </motion.div>

            <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-md shadow-2xl flex-1 relative overflow-hidden flex flex-col items-center justify-center">

                {/* Center Infographic */}
                <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 items-center">
                    {NODES.map((node, i) => {
                        const isActive = activeNode === i;
                        const isPast = activeNode > i;

                        return (
                            <div key={node.id} className="flex flex-col md:flex-row items-center relative group">

                                {/* Visual Node */}
                                <motion.div
                                    layout
                                    className={`
                    w-full md:w-auto relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-500
                    ${isActive ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-110 z-20' :
                                            isPast ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800'}
                  `}
                                >
                                    <div className={`p-3 rounded-xl mb-4 transition-colors duration-500 ${isActive ? 'bg-indigo-500/30 text-indigo-300' : isPast ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800/50 text-slate-500'}`}>
                                        {node.icon}
                                    </div>
                                    <div className="text-center font-semibold text-slate-200 text-sm whitespace-nowrap">{node.label}</div>
                                    <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-2">{node.tier}</div>

                                    {isActive && (
                                        <motion.div
                                            layoutId="pulse"
                                            className="absolute inset-0 rounded-2xl border-2 border-indigo-400"
                                            initial={{ opacity: 1, scale: 1 }}
                                            animate={{ opacity: 0, scale: 1.15 }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>

                                {/* Connector Line (Hide for last node in col view) */}
                                {i < NODES.length - 1 && (
                                    <div className="flex-1 w-full md:w-16 h-8 md:h-0.5 my-2 md:my-0 flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-slate-800" />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: isPast || isActive ? 1 : 0 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <ArrowRight className={`w-4 h-4 text-slate-900 absolute opacity-50 ${isActive || isPast ? 'text-white' : ''} hidden md:block`} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Dynamic Detail Panel Box */}
                <div className="w-full max-w-xl mt-16 p-6 rounded-xl border border-indigo-500/20 bg-black/60 shadow-[0_4px_40px_rgba(0,0,0,0.5)] relative overflow-hidden text-center min-h-[160px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeNode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10"
                        >
                            <h3 className="text-lg font-bold text-indigo-300 mb-2">{NODES[activeNode].label} Details</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-mono">
                                {activeNode === 0 && "> Executing edge termination. Stripping external TLS and validating payload schema structure parameters."}
                                {activeNode === 1 && "> Enforcing Pydantic deterministic logic. Assessing physiological bounds (HR: 30-220, temp_c) prior to computation."}
                                {activeNode === 2 && "> Deploying lightweight stochastic heuristic algorithm. Generating normalized severity array metric (0.00-1.00)."}
                                {activeNode === 3 && "> Applying Zero-Trust verification. Dropping anomalous or non-compliant signals. Hard-enforcing network ingress SLA."}
                                {activeNode === 4 && "> Idempotent synchronous append to immutable storage vault. Emitting final deterministic payload logs."}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </section>
        </div>
    );
}
