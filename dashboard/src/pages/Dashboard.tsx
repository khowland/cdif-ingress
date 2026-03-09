import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ActivitySquare, Fingerprint, CheckCircle2, XCircle } from 'lucide-react';

interface TelemetryRecord {
    id: string;
    source: string;
    timestamp: string;
    metrics: { hr: number; spo2: number; temp: number };
    heuristicScore: number;
    status: 'VERIFIED' | 'BLOCKED';
}

const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

export default function DashboardPage() {
    const [stream, setStream] = useState<TelemetryRecord[]>([]);

    useEffect(() => {
        const streamInterval = setInterval(() => {
            const isAnomaly = Math.random() > 0.85;
            const newRecord: TelemetryRecord = {
                id: Math.random().toString(36).substring(7),
                source: `NODE-${Math.floor(100 + Math.random() * 900)}`,
                timestamp: new Date().toISOString(),
                metrics: {
                    hr: isAnomaly ? 135 + Math.floor(Math.random() * 20) : 60 + Math.floor(Math.random() * 40),
                    spo2: isAnomaly ? 82 + Math.floor(Math.random() * 10) : 95 + Math.floor(Math.random() * 5),
                    temp: 36.5 + (Math.random() * 2 - 1),
                },
                heuristicScore: isAnomaly ? 0.92 + Math.random() * 0.08 : 0.1 + Math.random() * 0.4,
                status: isAnomaly ? 'BLOCKED' : 'VERIFIED'
            };

            setStream(prev => [newRecord, ...prev].slice(0, 8));
        }, 1500);
        return () => clearInterval(streamInterval);
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
                        Real-Time Telemetry <ActivitySquare className="w-5 h-5 text-indigo-400" />
                    </h1>
                    <p className="text-sm font-medium text-slate-500 tracking-wide mt-1">
                        Live Safety Monitoring Network
                    </p>
                </div>
                <div className="text-xs font-mono text-slate-500 flex flex-col items-end gap-1 border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 rounded-lg">
                    <div>STATUS: <span className="text-emerald-400 font-bold">STREAMING</span></div>
                    <div>SECURITY: <span className="text-indigo-400 font-bold">ENCRYPTED</span></div>
                </div>
            </motion.div>

            <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex-1 flex flex-col relative overflow-hidden">
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none mix-blend-overlay"></div>

                <div className="relative z-10 flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                    <h2 className="text-xs font-mono font-semibold tracking-widest text-indigo-400/80 uppercase flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" /> Live Data Stream
                    </h2>
                </div>

                <div className="relative z-10 flex-1 overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-[10px] font-mono tracking-widest text-slate-500 uppercase pb-4">
                            <tr>
                                <th className="px-4 py-2 font-normal">Arrival Time</th>
                                <th className="px-4 py-2 font-normal">Remote Node</th>
                                <th className="px-4 py-2 font-normal">Vital Signs</th>
                                <th className="px-4 py-2 font-normal">Urgency Level</th>
                                <th className="px-4 py-2 font-normal">Safety Status</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={tableVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-slate-800/50 font-mono text-xs"
                        >
                            {stream.map((record) => (
                                <motion.tr
                                    key={record.id}
                                    variants={rowVariants}
                                    layoutId={record.id}
                                    className="hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-4 py-4 text-slate-500">{record.timestamp.split('T')[1]}</td>
                                    <td className="px-4 py-4 text-slate-300">{record.source}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-3 text-[10px]">
                                            <span className={record.metrics.hr > 120 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                                                HR:{record.metrics.hr}
                                            </span>
                                            <span className={record.metrics.spo2 < 90 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                                                O2:{record.metrics.spo2}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${record.heuristicScore * 100}%` }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    className={`h-full ${record.heuristicScore > 0.8 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                                />
                                            </div>
                                            <span className={`${record.heuristicScore > 0.8 ? 'text-amber-400' : 'text-slate-500'} w-8 tabular-nums`}>
                                                {record.heuristicScore.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {record.status === 'VERIFIED' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" /> VERIFY
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px]">
                                                <XCircle className="w-3 h-3" /> BLOCK
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                    {stream.length === 0 && (
                        <div className="flex items-center justify-center h-40 text-xs font-mono text-slate-600 animate-pulse">
                            Connecting to Medical Data Stream...
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
