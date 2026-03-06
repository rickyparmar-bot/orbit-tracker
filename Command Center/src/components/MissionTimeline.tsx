import React, { useEffect, useState } from 'react';

interface MissionTimelineProps {
    targetDate: string; // e.g., '2027-06-01T00:00:00'
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({ targetDate }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // Update more frequently for a "live" feel during the day
        const timer = setInterval(() => setNow(new Date()), 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    // Reference start of the tracked mission (e.g., March 1st, 2026)
    const startDate = new Date('2026-03-01T00:00:00');
    const end = new Date(targetDate);

    // Calculate overall statistics
    const totalDays = Math.ceil((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Total elapsed time since start
    const elapsedMs = now.getTime() - startDate.getTime();
    const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    // Current day progress (how much of today has passed)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const msPassedToday = now.getTime() - startOfToday;
    const dayProgressPercentage = Math.min((msPassedToday / (1000 * 60 * 60 * 24)) * 100, 100);

    return (
        <div className="mission-timeline-container glass-panel p-10 rounded-3xl border-white/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {/* Ambient Background Detail */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8e44ad]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em]">Trajectory Map</div>
                        <div className="px-2 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20">
                            <span className="text-[8px] font-bold text-accent-green uppercase tracking-widest">Active Tracking</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight">Mission Endurance <span className="text-text-secondary">Timeline</span></h3>
                    <p className="text-xs text-text-secondary mt-2 opacity-60">Visualizing every 24-hour cycle until the June 2027 engagement.</p>
                </div>

                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-text-muted uppercase mb-1 tracking-widest">Logged</div>
                        <div className="text-2xl font-bold text-text-primary">{daysPassed}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-text-muted uppercase mb-1 tracking-widest">Remaining</div>
                        <div className="text-2xl font-bold text-[#8e44ad]">{totalDays - daysPassed}</div>
                    </div>
                </div>
            </div>

            {/* The Grid */}
            <div className="flex flex-wrap gap-1.5 justify-start md:justify-center max-h-[400px] overflow-y-auto no-scrollbar p-1">
                {Array.from({ length: totalDays }).map((_, i) => {
                    if (i < daysPassed) {
                        // PAST DAYS: Solid DARK shade of theme color
                        return (
                            <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-sm bg-[#8e44ad] shadow-[0_0_8px_rgba(142,68,173,0.2)] transition-all hover:scale-150 z-0 hover:z-10"
                                title={`Mission Day ${i + 1} - Logged`}
                            />
                        );
                    } else if (i === daysPassed) {
                        // CURRENT DAY: Progressive Filling/Darkening
                        return (
                            <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-sm bg-white/5 border border-[#8e44ad]/40 relative overflow-hidden group scale-150 mx-1 z-20 shadow-[0_0_15px_rgba(142,68,173,0.4)]"
                                title={`Mission Day ${i + 1} - Active (${Math.round(dayProgressPercentage)}%)`}
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8e44ad] to-[#9b59b6] transition-all duration-1000"
                                    style={{ height: `${dayProgressPercentage}%` }}
                                />
                                <div className="absolute inset-0 bg-[#8e44ad]/20 animate-pulse" />
                            </div>
                        );
                    } else {
                        // FUTURE DAYS: Empty/Light
                        return (
                            <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-sm bg-white/5 border border-white/5 transition-all hover:border-[#8e44ad]/30 hover:scale-150 z-0 hover:z-10 cursor-help"
                                title={`Mission Day ${i + 1} - Future`}
                            />
                        );
                    }
                })}
            </div>

            {/* Bottom Legend */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Future Cycles</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#8e44ad]/50 border border-[#8e44ad]/20" />
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Active Cycle</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#8e44ad] shadow-glow-primary" />
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Logged cycles</span>
                    </div>
                </div>

                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] flex items-center gap-4">
                    <span>Alpha: 01.03.2026</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span>Omega: 01.06.2027</span>
                </div>
            </div>
        </div>
    );
};
