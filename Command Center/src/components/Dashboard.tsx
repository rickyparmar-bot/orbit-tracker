import React from 'react';
import {
    Zap,
    Target,
    TrendingUp,
    Shield,
    ChevronRight,
    Clock,
    Book
} from 'lucide-react';
import { CountdownClock } from './FlipClock';
import { MissionTimeline } from './MissionTimeline';

// --- Sub-components ---

// --- Main Dashboard ---

export const Dashboard: React.FC = () => {

    return (
        <div className="dashboard-container flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

            {/* Top Section: Countdown & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass-panel p-10 rounded-3xl flex flex-col justify-between border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Target size={200} />
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.4em]">Current Objective</div>
                                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-[#8e44ad]/10 border border-[#8e44ad]/20 animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8e44ad]" />
                                    <span className="text-[8px] font-bold text-[#8e44ad] uppercase tracking-widest">Live Sync Active</span>
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
                                JEE Advanced 2027 <br />
                                <span className="text-text-secondary font-medium">Mission Countdown</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-8">
                        <CountdownClock />
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-panel p-8 rounded-3xl border-l-4 border-accent-primary flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Daily Momentum</div>
                            <div className="text-3xl font-bold text-accent-primary">0.0x</div>
                        </div>
                        <TrendingUp size={32} className="text-text-muted opacity-20 group-hover:opacity-100 group-hover:text-accent-primary transition-all" />
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border-l-4 border-accent-secondary flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Warden Status</div>
                            <div className="text-xl font-bold text-text-primary tracking-tight">Level 4 Lockdown</div>
                        </div>
                        <Shield size={32} className="text-text-muted opacity-20 group-hover:opacity-100 group-hover:text-accent-secondary transition-all" />
                    </div>
                </div>
            </div>

            {/* Middle Section: Progress & Consistency */}
            <div className="flex flex-col gap-6">
                <MissionTimeline targetDate="2026-09-01T00:00:00" />

                <div className="glass-panel p-10 rounded-3xl border-white/5">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-4">Mastery Track</div>
                            <h3 className="text-2xl font-bold">Overall Syllabus Coverage</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-accent-primary">0.0%</span>
                        </div>
                    </div>

                    <div className="master-progress-track mb-8">
                        <div className="master-progress-fill w-[0%]">
                            <div className="master-progress-glow" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Physical Chemistry", sub: "Pre-Mission • Upcoming", icon: <Zap size={20} /> },
                        { title: "PYQ Vault", sub: "2018-2024 Archive", icon: <Book size={20} /> },
                        { title: "Revision Hub", sub: "0 Pending Items", icon: <Clock size={20} /> }
                    ].map((item, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-text-muted group-hover:text-accent-primary transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold">{item.title}</div>
                                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.sub}</div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
