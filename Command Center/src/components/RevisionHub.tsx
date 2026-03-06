import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Clock } from 'lucide-react';

interface RevisionState {
    r1: boolean;
    r2: boolean;
    r3: boolean;
    r4: boolean;
}

export const RevisionHub: React.FC = () => {
    const [mastery, setMastery] = useState<RevisionState>({
        r1: true,
        r2: true,
        r3: false,
        r4: false
    });

    const steps = [
        { id: 'r1', label: 'R1', title: '24 Hours', desc: 'Initial Recall', color: 'accent-red' },
        { id: 'r2', label: 'R2', title: '3 Days', desc: 'First Reinforcement', color: 'accent-primary' },
        { id: 'r3', label: 'R3', title: '7 Days', desc: 'Second Reinforcement', color: 'accent-secondary' },
        { id: 'r4', label: 'R4', title: '30 Days', desc: 'Long-term Storage', color: 'accent-green' },
    ];

    const toggle = (key: keyof RevisionState) => {
        setMastery(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedCount = Object.values(mastery).filter(Boolean).length;
    const progressPercent = (completedCount / 4) * 100;

    return (
        <div className="revision-hub-container animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Side: Progress Ring & Stats */}
                <div className="lg:col-span-4 glass-panel p-10 rounded-3xl flex flex-col items-center justify-center text-center">
                    <div className="relative w-48 h-48 mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={552.92}
                                strokeDashoffset={552.92 * (1 - progressPercent / 100)}
                                className="text-accent-primary transition-all duration-[1500ms] ease-out shadow-glow-primary"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold tracking-tighter">{progressPercent}%</span>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Mastery</span>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-text-secondary leading-relaxed">
                        Item: <span className="text-text-primary">Solutions Concepts</span><br />
                        Status: <span className="text-accent-primary">Mid-retention Phase</span>
                    </div>
                </div>

                {/* Right Side: Stage Controls */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-2 px-2">Spaced Repetition Schedule</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {steps.map((step) => {
                            const isActive = mastery[step.id as keyof RevisionState];
                            const colorClass = isActive ? `border-${step.color} bg-${step.color}/10` : 'border-white/5 bg-white/5';
                            const textClass = isActive ? `text-${step.color}` : 'text-text-muted';

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => toggle(step.id as keyof RevisionState)}
                                    className={`flex items-center gap-6 p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${colorClass}`}
                                >
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-500 ${isActive ? `bg-${step.color} text-orbit-dark border-transparent` : 'border-white/20 text-white/40'
                                        }`}>
                                        {step.label}
                                    </div>
                                    <div className="text-left">
                                        <div className={`text-sm font-bold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{step.title}</div>
                                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{step.desc}</div>
                                    </div>
                                    {isActive && (
                                        <div className="ml-auto">
                                            <CheckCircle2 size={24} className={textClass} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="glass-panel p-6 rounded-2xl bg-black/20 mt-4 border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-text-muted">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Next Revision Due</div>
                            <div className="text-sm font-medium text-text-primary">March 08, 2026 (in 3 days)</div>
                        </div>
                        <button className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-all text-text-muted hover:text-text-primary">
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
