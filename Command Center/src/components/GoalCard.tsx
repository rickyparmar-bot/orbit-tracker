import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';

interface Goal {
    id: string;
    text: string;
    deadline: string;
    url: string;
    category: string;
    status?: string;
}

export const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            {/* Pulsing Glow Background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl animate-pulse" />

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary animate-pulse">
                            <Zap size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">{goal.category} Mission</span>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">ID: {goal.id}</span>
                </div>

                <div>
                    <h4 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                        {goal.text}
                    </h4>
                    <div className="text-xs text-text-secondary mt-1 font-medium italic">
                        Deadline: {goal.deadline}
                    </div>
                </div>

                <button
                    onClick={() => window.open(goal.url, '_blank')}
                    className={`mt-2 w-full py-3 px-6 rounded-xl border border-[#8e44ad]/50 font-bold text-xs tracking-widest uppercase backdrop-blur-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden ${goal.status === 'Completed'
                        ? 'bg-[#8e44ad]/30 text-white border-[#8e44ad]'
                        : 'bg-[#8e44ad]/5 text-[#8e44ad] hover:bg-[#8e44ad]/20 hover:shadow-[0_0_15px_rgba(142,68,173,0.4)]'
                        }`}
                >
                    <span className="relative z-10">{goal.status === 'Completed' ? 'MISSION SUCCESS' : 'COMPLETE NOW'}</span>
                    <ExternalLink size={14} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />

                    {/* Inner Glow Sweep */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#8e44ad]/10 to-transparent -translate-x-full group-hover/btn:animate-sweep" />
                </button>
            </div>
        </div>
    );
};
