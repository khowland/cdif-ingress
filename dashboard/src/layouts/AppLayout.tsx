/**
 * @file AppLayout.tsx
 * @module CDIF/Layouts/AppLayout
 * @description Root shell layout for the Clinical Data Ingress Fabric (CDIF) dashboard.
 *
 * Renders the persistent sidebar navigation, sticky top metrics bar, and the
 * AnimatePresence-wrapped main content outlet. All page components are mounted
 * inside the <Outlet /> slot by react-router-dom.
 *
 * [Lo] Logic invariants:
 *   - NAV_ITEMS path values must exactly match route path strings declared in App.tsx.
 *   - The sidebar is always visible; no mobile drawer state is managed here.
 *   - The top bar metrics are simulated constants — not live-fetched values.
 *   - No state mutation occurs in this component; it is fully presentational.
 */

import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Hexagon, Fingerprint, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class strings, resolving conflicts via tailwind-merge.
 *
 * [Lo] Accepts any number of conditional class inputs; falsy values are ignored.
 *
 * @param {...(string|undefined|null|false)} inputs - Class name fragments.
 * @returns {string} Resolved, deduplicated Tailwind class string.
 */
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

/**
 * @typedef {Object} NavItem
 * @property {string}      path  - Route path matching App.tsx route definitions.
 * @property {JSX.Element} icon  - Lucide icon element.
 * @property {string}      label - Human-readable navigation label.
 */

/**
 * Primary navigation items for the CDIF sidebar.
 *
 * [Lo] Path values are relative to the HashRouter root — they must not include '#'.
 *      Order determines vertical render sequence in the sidebar.
 *
 * @type {NavItem[]}
 */
const NAV_ITEMS = [
    { path: '/overview',  icon: <Hexagon className="w-4 h-4" />,     label: 'Overview'        },
    { path: '/telemetry', icon: <Activity className="w-4 h-4" />,    label: 'Live Telemetry'  },
    { path: '/topology',  icon: <Hexagon className="w-4 h-4" />,     label: 'Active Topology' },
    { path: '/audit',     icon: <Fingerprint className="w-4 h-4" />, label: 'Audit Trail'     },
];

/**
 * AppLayout component.
 *
 * Renders the full-screen two-column shell: a fixed sidebar on the left and
 * a scrollable main content area on the right. Page transitions are animated
 * via Framer Motion AnimatePresence keyed on the current pathname.
 *
 * [Lo] The `useLocation` hook drives AnimatePresence key changes — every route
 *      navigation triggers the exit/enter animation cycle.
 *
 * @returns {JSX.Element} The application shell with nested <Outlet />.
 */
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
                {/* Brand */}
                <div className="p-6 border-b border-indigo-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            <Shield className="w-6 h-6 text-indigo-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                                CDIF
                                <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider border border-amber-500/30">
                                    Demo Only
                                </span>
                            </div>
                            <div className="text-[9px] font-mono text-indigo-400/70 tracking-wide mt-0.5 leading-tight">
                                Clinical Data Ingress Fabric
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-2" aria-label="Primary">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group',
                                isActive
                                    ? 'text-indigo-300 bg-indigo-500/10 shadow-[inner_0_0_20px_rgba(99,102,241,0.05)]'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={cn('relative z-10 transition-transform duration-300', isActive ? 'scale-110' : 'group-hover:scale-110')}>
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

                {/* Footer */}
                <div className="p-4 border-t border-indigo-500/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                        <LogOut className="w-4 h-4" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto">

                {/* Top Metrics Bar */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-indigo-500/10 p-4 flex items-center justify-between">
                    <div className="text-[10px] font-mono font-bold text-amber-500 flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 rounded uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        <span className="animate-pulse">⚠️</span> SIMULATED TELEMETRY — DEMO ONLY
                    </div>
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

                {/* Animated Page Outlet */}
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
