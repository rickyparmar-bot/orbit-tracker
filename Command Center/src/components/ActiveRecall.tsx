import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { Brain, ChevronDown, Eye, FileText, Zap } from 'lucide-react';

interface RecallItem {
    type: 'concept' | 'derivation' | string;
    q: string;
    a: string;
    topic?: string;
}

interface ActiveRecallProps {
    items?: RecallItem[];
}

export const ActiveRecall: React.FC<ActiveRecallProps> = ({ items = [] }) => {
    if (items.length === 0) {
        return (
            <div className="active-recall-container flex flex-col gap-8 max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="p-12 text-center text-text-muted">
                    <p>No recall concepts available for this sub-topic yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="active-recall-container flex flex-col gap-8 max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="flex justify-between items-center px-2">
                <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-2">Neural Link — Active</div>
                    <div className="text-3xl font-bold tracking-tight">Active Recall <span className="text-text-secondary font-medium">Session</span></div>
                </div>
                <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/5">
                    <Brain className="text-accent-primary" size={20} />
                    <span className="text-sm font-bold">{items.length} Concepts Pending</span>
                </div>
            </header>

            <div className="flex flex-col gap-6">
                {items.map((item, index) => (
                    <RecallCard key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

const RecallCard: React.FC<{ item: RecallItem }> = ({ item }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="recall-card glass-panel rounded-3xl overflow-hidden border-white/5 transition-all duration-500 hover:border-white/10">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/10">
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${item.type === 'concept' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-accent-secondary/10 text-accent-secondary'}`}>
                        {item.type === 'concept' ? <Zap size={14} /> : <FileText size={14} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        {item.topic || 'General'} • {item.type}
                    </span>
                </div>
                <button
                    onClick={() => setIsRevealed(!isRevealed)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isRevealed ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                    <Eye size={12} />
                    {isRevealed ? 'Conceal Rationale' : 'Reveal Neural Link'}
                </button>
            </div>

            <div className="p-10">
                <h3 className="text-xl font-medium text-text-primary mb-8 leading-snug">
                    {item.q}
                </h3>

                <div className="relative group">
                    <div className={`answer-content text-text-secondary leading-relaxed p-8 rounded-2xl bg-black/20 border border-white/5 transition-all duration-700 ${isRevealed ? 'blur-0 opacity-100' : 'blur-xl opacity-10 select-none'}`}>
                        <InlineMath math={item.a} />
                    </div>

                    {!isRevealed && (
                        <button
                            onClick={() => setIsRevealed(true)}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all group-hover:scale-105"
                        >
                            <div className="w-12 h-12 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary shadow-glow-primary">
                                <ChevronDown size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-primary text-shadow-glow">
                                Tap to Synchronize
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
