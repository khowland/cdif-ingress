/**
 * @file Audit.tsx
 * @module CDIF/Pages/Audit
 * @description System Audit view for the Clinical Data Ingress Fabric (CDIF).
 *
 * Renders the CLI tail output and cluster metrics panels for the CDIF audit trail.
 *
 * [Lo] Logic invariants:
 *   - All log content is static/simulated; no live data fetching occurs in this component.
 *   - Progress bar widths are hard-coded percentages matching the displayed metric values.
 *   - The two flex containers must use 'flex justify-between' (space-separated) for correct layout.
 */

import { motion } from 'framer-motion';
import { Fingerprint, Terminal, HardDrive } from 'lucide-react';

/**
 * AuditPage component.
 *
 * Displays the CDIF system audit interface comprising a CLI tail log panel
 * and a cluster metrics panel with utilization progress bars.
 *
 * [Lo] Component is fully presentational - it owns no mutable state and
 *      accepts no props. All displayed values are compile-time constants.
 *
 * @returns {JSX.Element} Rendered audit page.
 */
export default function AuditPage() {
    return (
        <div className="flex flex-col gap-6 h-full">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
                        System Audit <Fingerprint className="w-5 h-5 text-indigo-400" />
                    </h1>
                    <p className="text-sm font-medium text-slate-500 tracking-wide mt-1">
                        Full activity log - every decision, every record, every outcome
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* CLI Tail Output Panel */}
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <Terminal className="w-4 h-4" /> Activity Log
                    </h2>
                    <div className="flex-1 bg-black p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400/80 overflow-y-auto leading-loose whitespace-pre-wrap">
                        {`[SYS] Pipeline starting | environment=DEMO | mode=SIMULATED
[Ac] Intake endpoint online | ready to receive | health=OK
[Lo] Validation rules loaded | all checks active
[St] Secure storage ready | append-only | tamper-proof
[T]  Enrichment layer ready | scoring + tagging active
[η] Resonance subsystem nominal. Boundary enforcement active; all ingress events logged.
[WARN] RECORD_RECEIVED | id=NODE412 | status=CRITICAL | priority=HIGH
[Lo] VALIDATION_FAIL | id='node-412' | reason: ID format not accepted | record blocked
[η] RECORD_ACCEPTED | id=PT001A | priority=HIGH | pipeline_id=a3f7c2e1
[St] STORED | record written | unique ID assigned | immutable
[η] HEALTH_CHECK | status=NOMINAL | records_stored=1 | all systems OK`}
                    </div>
                </section>

                {/* Cluster Metrics Panel */}
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <HardDrive className="w-4 h-4" /> Pipeline Metrics
                    </h2>
                    <div className="space-y-6">

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Storage Utilization</span>
                                <span className="text-emerald-400">14.2%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[14.2%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Anomaly Detection Rate</span>
                                <span className="text-amber-500">12.8%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[12.8%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Records Blocked Today</span>
                                <span className="text-rose-500">2,140</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full w-[45%]"></div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}
