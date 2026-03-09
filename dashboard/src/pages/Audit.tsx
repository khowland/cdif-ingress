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
 * [Lo] Component is fully presentational — it owns no mutable state and
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
                        Clinical Data Ingress Fabric (CDIF) — Historical Query and Logging Diagnostics
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* CLI Tail Output Panel */}
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <Terminal className="w-4 h-4" /> Live System Logs
                    </h2>
                    <div className="flex-1 bg-black p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400/80 overflow-y-auto leading-loose whitespace-pre-wrap">
                        {`[SYS] CDIF v1.0.0 initialising — fabric_layer=BRONZE_SAMPLE
[Ac] FastAPI actuator surface active — POST /etl/clinical/sample | GET /health
[Lo] Pydantic ClinicalTelemetry invariant schema loaded — v1.0
[St] Vault path resolved — sample_clinical_vault.jsonl (append-only)
[T]  Transformer ready — urgency scoring + ISO-8601 enrichment online
[η] Resonance subsystem nominal. Boundary enforcement active; all ingress events logged.
[WARN] INGRESS_ATTEMPT | patient=NODE412 | hr=185 | status=CRITICAL | urgency_index=1.0
[Lo] VALIDATION_FAIL | patient_id='node-412' — rejected: must match ^[A-Z0-9]{6,12}$
[η] INGRESS_OK | patient=PT001A | hr=145 | spo2=94.5 | urgency=1.0 | id=a3f7c2e1
[St] Vault append confirmed — record persisted with UUID ingress_id
[η] HEALTH_CHECK | status=NOMINAL | vault_records=1 | fabric=CDIF v1.0.0`}
                    </div>
                </section>

                {/* Cluster Metrics Panel */}
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <HardDrive className="w-4 h-4" /> Storage & Analysis Metrics
                    </h2>
                    <div className="space-y-6">

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Vault Capacity Utilization</span>
                                <span className="text-emerald-400">14.2%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[14.2%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Heuristic Anomaly Detection Rate</span>
                                <span className="text-amber-500">12.8%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[12.8%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Zero-Trust Rejections (Daily)</span>
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
