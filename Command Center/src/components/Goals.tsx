import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Trash2, Flag, Rocket } from 'lucide-react';
import { GoalCard } from './GoalCard';
import vaultData from '../data/vault.json';
import missionData from '../data/missions.json';

interface Goal {
    id: string;
    text: string;
    category: 'weekly' | 'academic' | 'long-term';
    completed: boolean;
    deadline?: string;
    status?: string;
}

const initialGoals: Goal[] = [
    { id: '1', text: 'Complete Physics HC Verma Ch. 3-5', category: 'weekly', completed: false, deadline: '2026-03-08' },
    { id: '2', text: 'Ionic Equilibrium Master Sheet', category: 'academic', completed: true },
    { id: '3', text: 'Revise 11th Chemistry Backlog', category: 'long-term', completed: false },
    { id: '4', text: 'Solve 50 Calculus PYQs', category: 'academic', completed: false, deadline: '2026-03-10' },
];

export const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);

    // Sync from missionData
    const syncedVaultData = vaultData.map(v => {
        const mission = missionData.find(m => m.chapter.toLowerCase().includes(v.text.toLowerCase()) || v.text.toLowerCase().includes(m.chapter.toLowerCase()));
        return mission ? { ...v, status: mission.status } : v;
    });

    const toggleGoal = (id: string) => {
        setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const deleteGoal = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const completedCount = goals.filter(g => g.completed).length;

    return (
        <div className="goals-view flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-grad-primary bg-clip-text text-transparent underline decoration-accent-primary/20 underline-offset-8">Mission Control</h2>
                    <p className="text-text-secondary mt-1">Execute your academic objectives with precision.</p>
                </div>
                <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold">{completedCount}/{goals.length} Completed</span>
                        <div className="w-24 h-1 bg-black/40 rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-accent-primary transition-all duration-700 shadow-glow-primary"
                                style={{ width: `${(completedCount / goals.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Weekend Sprint Section */}
            <section className="weekend-sprint animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary">
                        <Rocket size={24} />
                    </div>
                    <h3 className="text-xl font-bold tracking-widest uppercase bg-grad-primary bg-clip-text text-transparent">Weekend Sprint: Epic Missions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {syncedVaultData.map((mission: any) => (
                        <GoalCard key={mission.id} goal={mission} />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                {(['weekly', 'academic', 'long-term'] as const).map(cat => (
                    <div key={cat} className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-2">
                            <Flag size={14} className={cat === 'weekly' ? 'text-accent-primary' : cat === 'academic' ? 'text-accent-cyan' : 'text-accent-orange'} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">{cat} goals</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {goals.filter(g => g.category === cat).map(goal => (
                                <div
                                    key={goal.id}
                                    className={`glass-panel p-5 rounded-2xl border-white/5 group transition-all duration-300 ${goal.completed ? 'opacity-50 grayscale-[0.5]' : ''}`}
                                >
                                    <div className="flex gap-4 items-start">
                                        <button
                                            onClick={() => toggleGoal(goal.id)}
                                            className={`mt-1 transition-colors ${goal.completed ? 'text-accent-green' : 'text-text-muted hover:text-accent-primary'}`}
                                        >
                                            {goal.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </button>
                                        <div className="flex-1">
                                            <div className={`text-sm font-medium leading-relaxed ${goal.completed ? 'line-through' : ''}`}>
                                                {goal.text}
                                            </div>
                                            {goal.deadline && (
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-text-muted font-bold">
                                                    <Clock size={10} />
                                                    {new Date(goal.deadline).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteGoal(goal.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-accent-red transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
