import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

const hourData = [
    { time: 'Mon', hours: 0 },
    { time: 'Tue', hours: 0 },
    { time: 'Wed', hours: 0 },
    { time: 'Thu', hours: 0 },
    { time: 'Fri', hours: 0 },
    { time: 'Sat', hours: 0 },
    { time: 'Sun', hours: 0 },
];

const GridDay: React.FC<{ level: number }> = ({ level }) => {
    const opacity = level === 0 ? 0.05 : level === 1 ? 0.2 : level === 2 ? 0.4 : 0.8;
    return (
        <div
            className="w-3 h-3 rounded-sm transition-all hover:scale-125"
            style={{ backgroundColor: `rgba(167, 139, 250, ${opacity})` }}
        />
    );
};

export const Consistency: React.FC = () => {
    return (
        <div className="consistency-view flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header>
                <h2 className="text-3xl font-bold tracking-tight">Consistency Hub</h2>
                <p className="text-text-secondary">Tracking persistence and PW Lakshya 2027 trajectory.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats Column */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Activity Grid */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-accent-primary" size={20} />
                                <span className="font-bold">Persistence Grid</span>
                            </div>
                            <div className="text-sm text-text-muted">Last 6 months</div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 justify-center py-4">
                            {Array.from({ length: 154 }).map((_, i) => (
                                <GridDay key={i} level={0} />
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-xl font-bold">0</div>
                                    <div className="text-[10px] text-text-muted uppercase">Total Days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-accent-green">0</div>
                                    <div className="text-[10px] text-text-muted uppercase">Current Streak</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                                Less <div className="w-2 h-2 bg-white/5 rounded-sm" />
                                <div className="w-2 h-2 bg-accent-primary/20 rounded-sm" />
                                <div className="w-2 h-2 bg-accent-primary/40 rounded-sm" />
                                <div className="w-2 h-2 bg-accent-primary/80 rounded-sm" /> More
                            </div>
                        </div>
                    </div>

                    {/* Hour Graph */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 h-[350px]">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock className="text-accent-cyan" size={20} />
                            <span className="font-bold">Weekly Study Hours</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f111a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#22d3ee"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#050508' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col gap-8">
                    {/* PW Lakshya Card */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 bg-gradient-to-br from-accent-primary/5 to-transparent">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="text-accent-primary" size={24} />
                            <span className="font-bold text-xl tracking-tight">PW Lakshya 2027</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-secondary">Batch Completion</span>
                                    <span className="font-bold">0%</span>
                                </div>
                                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-primary w-[0%]" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                                    <CheckCircle2 size={16} className="text-accent-green" />
                                    <span className="text-sm">Lectures up to date</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                                    <CheckCircle2 size={16} className="text-accent-green" />
                                    <span className="text-sm">DPPs 100% completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backlog Monitor */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-accent-green" size={24} />
                            <span className="font-bold text-xl tracking-tight">Backlog Monitor</span>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-accent-green/5 p-6 rounded-2xl flex flex-col items-center justify-center border border-accent-green/10 text-center">
                                <CheckCircle2 size={32} className="text-accent-green mb-3 opacity-50" />
                                <div className="font-bold text-sm text-accent-green">No Backlogs Detected</div>
                                <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Batch deployment pending</div>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-white/5 cursor-not-allowed opacity-50 text-[10px] font-bold tracking-[0.3em] transition-all">
                                ZERO PENDING TASKS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
