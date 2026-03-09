import { motion } from 'framer-motion';
import { Fingerprint, Terminal, HardDrive } from 'lucide-react';

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
                        Historical Query and Logging Diagnostics
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <Terminal className="w-4 h-4" /> CLI Tail Output
                    </h2>
                    <div className="flex-1 bg-black p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400/80 overflow-y-auto leading-loose whitespace-pre-wrap">
                        {`[SYS] Initiating Boot Sequence V2.1...
[SYS] Binding Edge Listener 0.0.0.0:8080.
[INF] Zero-Trust Interceptor mounted successfully.
[NET] Established inbound TLS 1.3 socket constraint.
[DBG] Heuristic Engine cold start - weights loaded.
[WARN] Unrecognized packet heuristic 0.94 from NODE-412.
[SEC] Action: QUARANTINED. IP dropped.
[OP] Vault write OK. 142 records committed ms.
[INF] Syncing cluster topology metrics...
[OP] Health Check request received from ALB.
[OP] 200 OK. Node healthy.`}
                    </div>
                </section>

                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <HardDrive className="w-4 h-4" /> Cluster Metrics
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flexjustify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Vault Capacity Utilization</span>
                                <span className="float-right text-emerald-400">14.2%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[14.2%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flexjustify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Heuristic Anomaly Detection Rate</span>
                                <span className="float-right text-amber-500">12.8%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[12.8%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flexjustify-between text-xs font-mono text-slate-400 mb-2">
                                <span>Zero-Trust Rejections (Daily)</span>
                                <span className="float-right text-rose-500">2,140</span>
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
