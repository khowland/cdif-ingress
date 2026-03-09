import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Hexagon, Fingerprint, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
    { path: '/telemetry', icon: <Activity className="w-4 h-4" />, label: 'Live Telemetry' },
    { path: '/topology', icon: <Hexagon className="w-4 h-4" />, label: 'Active Topology' },
    { path: '/audit', icon: <Fingerprint className="w-4 h-4" />, label: 'Audit Trail' },
];

export default function AppLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans flex selection:bg-indigo-900 selection:text-indigo-200">

            {/* Sidebar Navigation */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-64 border-r border-indigo-500/10 bg-black/40 backdrop-blur-xl flex flex-col z-20"
            >
                <div className="p-6 border-b border-indigo-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            <Shield className="w-6 h-6 text-indigo-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold tracking-tight text-white">CDIF Engine</div>
                            <div className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest mt-0.5">Terminal v2.1</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                                isActive ? "text-indigo-300 bg-indigo-500/10 shadow-[inner_0_0_20px_rgba(99,102,241,0.05)]" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={cn("relative z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")}>
                                        {item.icon}
                                    </div>
                                    <span className="relative z-10 tracking-wide">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 border border-indigo-500/30 rounded-xl bg-gradient-to-r from-indigo-500/5 to-transparent"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-500/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                        <LogOut className="w-4 h-4" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto">
                {/* Top Header Metrics Bar */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-indigo-500/10 p-4 flex items-center justify-end">
                    <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest text-slate-500">
                        <div className="flex items-center gap-2">
                            NODE LATENCY <span className="text-emerald-400 font-bold">14ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            INGRESS RATE <span className="text-indigo-400 font-bold">~400 ops/s</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            ACTIVE
                        </div>
                    </div>
                </header>

                {/* Page Content with Framer Motion AnimatePresence */}
                <div className="p-6 md:p-8 flex-1 w-full max-w-[1600px] mx-auto overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
