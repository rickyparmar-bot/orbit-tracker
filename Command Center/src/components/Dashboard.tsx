import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Brain, Timer, Shield } from 'lucide-react';

const data = [
    { time: '10 AM', mastery: 20 },
    { time: '11 AM', mastery: 45 },
    { time: '12 PM', mastery: 35 },
    { time: '1 PM', mastery: 70 },
    { time: '2 PM', mastery: 65 },
    { time: '3 PM', mastery: 90 },
];

export const Dashboard: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
    const [showBreakAlert, setShowBreakAlert] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    setShowBreakAlert(true);
                    return 90 * 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Top Banner */}
            <div className="lg:col-span-3 glass-card p-8 flex justify-between items-center bg-gradient-to-r from-orbit-blue/10 to-orbit-cyan/10">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase neon-text-cyan underline decoration-white/20 underline-offset-8">
                        Orbit Prime: Genesis
                    </h1>
                    <p className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-xs">Command Center • Lead Architect Access</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card px-4 py-2 flex items-center gap-3">
                        <Timer className="text-orbit-cyan animate-pulse" size={20} />
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Next Break</span>
                            <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <div className="glass-card px-4 py-2 flex items-center gap-3 border-orbit-cyan/30">
                        <Shield className="text-orbit-cyan" size={20} />
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Warden Status</span>
                            <span className="text-xl font-bold text-orbit-cyan">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Graph */}
            <div className="lg:col-span-2 glass-card p-6 h-[400px] flex flex-col gap-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap size={20} className="text-orbit-cyan" /> Progress Analytics
                </h3>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(5, 5, 8, 0.9)',
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="mastery"
                                stroke="#00f3ff"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMastery)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ingestion Status / Daily Info */}
            <div className="glass-card p-6 flex flex-col gap-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Brain size={20} className="text-orbit-cyan" /> Brain Sync
                </h3>
                <div className="flex flex-col gap-4">
                    {['Master Notes', 'Flashcards', 'PYQ Vault'].map((item) => (
                        <div key={item} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-sm font-medium">{item}</span>
                            <span className="text-[10px] px-2 py-1 bg-orbit-cyan/20 text-orbit-cyan rounded-full font-bold uppercase">Ready</span>
                        </div>
                    ))}
                </div>
                <div className="mt-auto p-4 bg-orbit-cyan/5 border border-orbit-cyan/20 rounded-xl">
                    <h4 className="text-xs font-bold text-orbit-cyan uppercase mb-2">Strategy Note</h4>
                    <p className="text-sm text-slate-300 italic">"Focus on the electrolytic cell potential derivations. Faisal Sir emphasized these for JEE Adv 2025."</p>
                </div>
            </div>

            {showBreakAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
                    <div className="glass-card p-12 text-center max-w-md border-orbit-cyan/50 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-4xl font-bold neon-text-cyan mb-4">RECOVERY PHASE</h2>
                        <p className="text-xl mb-8 font-light">Mandatory 2-minute <span className="font-bold text-white">Planche Lean</span> break now. Re-align your nervous system.</p>
                        <button
                            onClick={() => setShowBreakAlert(false)}
                            className="btn-glass px-12 py-4 text-orbit-cyan font-bold border-orbit-cyan/30 hover:bg-orbit-cyan/10"
                        >
                            Resume Mission
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
