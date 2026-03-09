import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Hexagon, Lock, Cpu, ArrowRight } from 'lucide-react';

/**
 * @file Topology.tsx
 * @module CDIF/Pages/Topology
 * @description Active Topology view for the Clinical Data Ingress Fabric (CDIF).
 *
 * Renders the Five-Vector ETL pipeline as an animated node graph.
 * Each node cycles automatically, highlighting the active processing stage.
 *
 * [Lo] Logic invariants:
 *   - NODES is defined inside the component to prevent stale JSX element references at module scope.
 *   - No layoutId is used in this component to prevent conflicts with parent AnimatePresence.
 *   - Active node index wraps via modulo over NODES.length.
 *   - NODE_DETAILS index maps 1:1 with NODES index; both arrays must remain equal length.
 */

const NODE_DETAILS = [
    "> [Ac] Ingress boundary active. Raw payload received on POST /etl/clinical/sample; routed to [Lo] validation pipeline.",
    "> [Lo] Invariant enforcement: Pydantic ClinicalTelemetry validates HR (30-220 bpm), SpO2 (70-100%), temp (34-43 C), patient_id (^[A-Z0-9]{6,12}$).",
    "> [T] Transformer: urgency_index = 1.0 for CRITICAL status or HR > 120 bpm; 0.5 otherwise. ISO-8601 timestamp and BRONZE_SAMPLE fabric_layer annotated.",
    "> [η] Resonance monitor active. Anomalous payloads rejected at boundary; validation failures logged to structured stdout.",
    "> [St] Vault write: enriched record appended to sample_clinical_vault.jsonl with UUID ingress_id. Append-only; no mutation permitted."
];

export default function ArchitecturePage() {
    const [activeNode, setActiveNode] = useState(0);

    const NODES = [
        { id: 'ingress', Icon: Network,  label: 'Ingress Point',       tier: '[Ac] Actuator',  status: 'Online' },
        { id: 'logic',   Icon: Hexagon,  label: 'Boundary Validation', tier: '[Lo] Invariant', status: 'Strict' },
        { id: 'engine',  Icon: Cpu,      label: 'Transformation',      tier: '[T] Transform',  status: 'Active' },
        { id: 'gate',    Icon: Lock,     label: 'Resonance Monitor',   tier: '[η] Resonance',  status: 'Secure' },
        { id: 'vault',   Icon: Database, label: 'Immutable Vault',     tier: '[St] Storage',   status: 'Saving' }
    ];

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
                        Clinical Data Ingress Fabric (CDIF) - Five-Vector ETL Pipeline
                    </p>
                </div>
            </motion.div>

            <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-md shadow-2xl flex-1 relative overflow-hidden flex flex-col items-center justify-center">

                <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 items-center">
                    {NODES.map((node, i) => {
                        const isActive = activeNode === i;
                        const isPast = activeNode > i;
                        const { Icon } = node;

                        return (
                            <div key={node.id} className="flex flex-col md:flex-row items-center relative group">

                                <div className={[
                                    'w-full md:w-auto relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-500',
                                    isActive
                                        ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-110 z-20'
                                        : isPast
                                            ? 'bg-emerald-500/5 border-emerald-500/30'
                                            : 'bg-slate-950/50 border-slate-800'
                                ].join(' ')}>
                                    <div className={[
                                        'p-3 rounded-xl mb-4 transition-colors duration-500',
                                        isActive ? 'bg-indigo-500/30 text-indigo-300' : isPast ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                                    ].join(' ')}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center font-semibold text-slate-200 text-sm whitespace-nowrap">{node.label}</div>
                                    <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-2">{node.tier}</div>

                                    {isActive && (
                                        <span className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-ping opacity-40 pointer-events-none" />
                                    )}
                                </div>

                                {i < NODES.length - 1 && (
                                    <div className="flex-1 w-full md:w-16 h-8 md:h-0.5 my-2 md:my-0 flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-slate-800" />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: isPast || isActive ? 1 : 0 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <ArrowRight className={['w-4 h-4 absolute opacity-50 hidden md:block', isActive || isPast ? 'text-white' : 'text-slate-900'].join(' ')} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

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
                            <h3 className="text-lg font-bold text-indigo-300 mb-2">{NODES[activeNode].label}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-mono">
                                {NODE_DETAILS[activeNode]}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </section>
        </div>
    );
}
