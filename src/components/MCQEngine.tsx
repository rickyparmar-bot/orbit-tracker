import React, { useState } from 'react';
import { CheckCircle, RotateCcw, XCircle, Info, HelpCircle } from 'lucide-react';
import { InlineMath } from 'react-katex';
import solutionsData from '../data/solutions-pyq-v1.json';

interface Question {
    id: string;
    topic: string;
    question: string;
    answerOptions: {
        text: string;
        isCorrect: boolean;
        rationale: string;
    }[];
    hint: string;
    status: 'none' | 'first-try' | 'review' | 'struggled';
    year: number;
}

export const MCQEngine: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>(
        solutionsData.questions.map((q, idx) => ({
            ...q,
            id: idx.toString(),
            status: 'none',
            topic: 'Solutions',
            year: 2024 - (idx % 5)
        }))
    );

    const [score, setScore] = useState(0);
    const [showRationale, setShowRationale] = useState<Record<string, boolean>>({});

    const handleMark = (id: string, newStatus: Question['status']) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                let scoreChange = 0;
                if (newStatus === 'first-try') scoreChange = 10;
                else if (newStatus === 'review') scoreChange = 5;

                if (q.status === 'first-try') scoreChange -= 10;
                else if (q.status === 'review') scoreChange -= 5;

                setScore(s => s + scoreChange);
                return { ...q, status: newStatus };
            }
            return q;
        }));
    };

    const toggleRationale = (id: string) => {
        setShowRationale(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center glass-card p-6">
                <div>
                    <h2 className="text-2xl font-bold neon-text-cyan">PYQ Vault</h2>
                    <p className="text-slate-400">JEE Advanced (2018-2025) • {solutionsData.title}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400 uppercase tracking-widest">Mastery Score</div>
                    <div className="text-4xl font-bold text-white">{score}</div>
                </div>
            </div>

            <div className="grid gap-6">
                {questions.map(q => (
                    <div key={q.id} className="glass-card p-6 group flex flex-col gap-4 border-l-4 border-l-transparent hover:border-l-orbit-cyan transition-all">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-tighter px-2 py-1 bg-white/5 border border-white/10 rounded text-orbit-cyan">
                                {q.topic} • {q.year}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMark(q.id, 'first-try')}
                                    className={`p-2 rounded-lg transition-all ${q.status === 'first-try' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-green-400'}`}
                                    title="First Try (+10)"
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button
                                    onClick={() => handleMark(q.id, 'review')}
                                    className={`p-2 rounded-lg transition-all ${q.status === 'review' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-amber-400'}`}
                                    title="Review (+5)"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={() => handleMark(q.id, 'struggled')}
                                    className={`p-2 rounded-lg transition-all ${q.status === 'struggled' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-red-400'}`}
                                    title="Struggled (Flag Revision)"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="text-slate-200 leading-relaxed font-light text-lg">
                            <InlineMath math={q.question} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {q.answerOptions.map((opt, oIdx) => (
                                <div key={oIdx} className={`p-4 rounded-xl border text-sm transition-all ${opt.isCorrect && q.status !== 'none' ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                    <InlineMath math={opt.text} />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                            <button
                                onClick={() => toggleRationale(q.id)}
                                className="flex items-center gap-2 text-xs text-orbit-cyan font-bold hover:underline"
                            >
                                <HelpCircle size={14} /> {showRationale[q.id] ? 'Hide Solution' : 'View Solution & Rationale'}
                            </button>
                            {q.status === 'struggled' && (
                                <div className="flex items-center gap-2 text-xs text-red-400">
                                    <Info size={14} /> Flagged for R1 Revision
                                </div>
                            )}
                        </div>

                        {showRationale[q.id] && (
                            <div className="p-4 bg-orbit-cyan/5 border border-orbit-cyan/10 rounded-xl mt-2">
                                <p className="text-xs font-bold text-orbit-cyan uppercase mb-2">Rationale</p>
                                <div className="text-sm text-slate-300 italic">
                                    <InlineMath math={q.answerOptions.find(o => o.isCorrect)?.rationale || ''} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
