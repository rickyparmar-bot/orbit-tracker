import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, BarChart2 } from 'lucide-react';

const subjects = [
    { id: 'physics', label: 'Physics', color: '#a78bfa', icon: '⚡' },
    { id: 'physical_chemistry', label: 'Physical Chemistry', color: '#34d399', icon: '⚖️' },
    { id: 'organic_chemistry', label: 'Organic Chemistry', color: '#f59e0b', icon: '🧪' },
    { id: 'inorganic_chemistry', label: 'Inorganic Chemistry', color: '#818cf8', icon: '💎' },
    { id: 'mathematics', label: 'Mathematics', color: '#22d3ee', icon: '📐' }
];

// Dummy data generator
const generateData = () => {
    const data = [];
    for (let i = 1; i <= 7; i++) {
        data.push({
            day: `Day ${i}`,
            mastery: 0
        });
    }
    return data;
};

const SubjectGraph: React.FC<{ subject: typeof subjects[0] }> = ({ subject }) => {
    const data = generateData();
    return (
        <div className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Subject Mastery</div>
                        <div className="text-xl font-bold">{subject.label}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: subject.color }}>
                        {data[data.length - 1].mastery}%
                    </div>
                    <div className="text-[10px] font-bold text-accent-green uppercase">Peak Performance</div>
                </div>
            </div>

            <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`grad-${subject.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={subject.color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={subject.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            hide
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f111a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: subject.color }}
                        />
                        <Area
                            type="monotone"
                            dataKey="mastery"
                            stroke={subject.color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#grad-${subject.id})`}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const Statistics: React.FC = () => {
    return (
        <div className="statistics-view flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mastery Statistics</h2>
                    <p className="text-text-secondary">Topic-level analysis across all core subjects.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
                        <Target className="text-accent-primary" size={20} />
                        <span className="text-sm font-bold">0.0% Avg Mastery</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(sub => (
                    <SubjectGraph key={sub.id} subject={sub} />
                ))}

                {/* Overall Summary Card */}
                <div className="glass-panel p-8 rounded-3xl border-white/10 bg-grad-primary/5 flex flex-col justify-between">
                    <div>
                        <BarChart2 className="text-accent-primary mb-4" size={32} />
                        <div className="text-2xl font-bold mb-2">Weekly Summary</div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Your overall mastery has increased by <span className="text-accent-green font-bold">+0.0%</span> this week. Start tracking your subjects to build momentum.
                        </p>
                    </div>
                    <button className="btn-secondary w-full mt-8 justify-center">
                        Generate Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
};
