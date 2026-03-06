import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import { CheckCircle2, XCircle, ChevronRight, Send, HelpCircle, Activity } from 'lucide-react';

interface Question {
    id: string;
    topic: string;
    question: string;
    answerOptions: {
        text: string;
        isCorrect: boolean;
        rationale: string;
    }[];
    status: 'none' | 'first-try' | 'review' | 'struggled';
    year: number;
}

interface MCQEngineProps {
    questions?: Question[];
}

const LaTeXText: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    const parts = text.split(/(\$.*?\$)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    return <InlineMath key={i} math={part.slice(1, -1)} />;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

export const MCQEngine: React.FC<MCQEngineProps> = ({ questions = [] }) => {
    const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [accuracy, setAccuracy] = useState(100);
    const [wrongCount, setWrongCount] = useState(0);
    const [showCalisthenics, setShowCalisthenics] = useState(false);
    const [consecutiveWrong, setConsecutiveWrong] = useState(0);

    useEffect(() => {
        if (questions && questions.length > 0) {
            setLocalQuestions(questions.map((q: any, idx) => ({
                id: q.id || idx.toString(),
                topic: q.topic || 'General',
                question: q.q || q.question,
                answerOptions: q.answerOptions || (q.options ? q.options.map((opt: string, i: number) => ({
                    text: opt,
                    isCorrect: i === q.correct,
                    rationale: q.explanation || ''
                })) : []),
                status: 'none',
                year: q.year || 2024
            })));
            setCurrentIndex(0);
            setSelectedOption(null);
            setIsSubmitted(false);
        }
    }, [questions]);

    if (localQuestions.length === 0) {
        return (
            <div className="mcq-engine-container max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="p-12 text-center text-text-muted">
                    <p>No MCQ questions available for this sub-topic yet.</p>
                </div>
            </div>
        );
    }

    const currentMCQ = localQuestions[currentIndex];

    const handleSelect = (idx: number) => {
        if (isSubmitted) return;
        setSelectedOption(idx);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);

        const isCorrect = currentMCQ.answerOptions[selectedOption].isCorrect;
        if (!isCorrect) {
            setWrongCount(prev => prev + 1);
            setConsecutiveWrong(prev => prev + 1);
            if (consecutiveWrong >= 1) { // 2nd wrong in a row
                setShowCalisthenics(true);
            }
        } else {
            setConsecutiveWrong(0);
        }

        const totalAttempted = currentIndex + 1;
        const correctCount = totalAttempted - (isCorrect ? wrongCount : wrongCount + 1);
        setAccuracy(Math.round((correctCount / totalAttempted) * 100));
    };

    const nextQuestion = () => {
        setCurrentIndex((prev) => (prev + 1) % localQuestions.length);
        setSelectedOption(null);
        setIsSubmitted(false);
    };

    return (
        <div className="mcq-engine-container max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
            {showCalisthenics && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-orbit-dark/80 backdrop-blur-md">
                    <div className="glass-panel p-12 rounded-3xl max-w-md w-full text-center border-accent-red/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-bold text-accent-red mb-4 tracking-tighter uppercase italic">Accuracy Dip!</h2>
                        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                            Your performance has dropped below the focus threshold. Perform this reset exercise to clear your mind.
                        </p>
                        <div className="exercise-box bg-accent-red/5 p-8 rounded-2xl border border-accent-red/20 mb-10">
                            <Activity className="text-accent-red mx-auto mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-2">Planche Leans</h3>
                            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Hold for 30 Seconds</p>
                        </div>
                        <button onClick={() => { setShowCalisthenics(false); setConsecutiveWrong(0); }} className="btn-primary w-full">I'm Focused Now</button>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-end mb-10 px-2">
                <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Target Mastery — Active</div>
                    <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold flex items-center gap-3">
                            <span className="text-accent-primary">Q.{currentIndex + 1}</span>
                            <span className="text-text-muted opacity-30 text-xl font-normal">/</span>
                            <span className="text-text-secondary text-xl font-medium">{localQuestions.length}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Real-time Accuracy</div>
                    <div className={`text-2xl font-bold ${accuracy < 70 ? 'text-accent-red' : 'text-accent-green'}`}>{accuracy}%</div>
                </div>
            </header>

            <div className="mcq-card glass-panel rounded-3xl overflow-hidden border-white/5 p-10 flex flex-col gap-10">
                <div className="mcq-meta flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                    <span>{currentMCQ.topic} • JEE ADV {currentMCQ.year}</span>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />Vampire Mode Active</div>
                </div>
                <div className="mcq-question text-2xl font-medium leading-relaxed border-l-2 border-accent-primary pl-8 py-2">
                    <LaTeXText text={currentMCQ.question} />
                </div>
                <div className="mcq-options grid grid-cols-1 gap-4">
                    {currentMCQ.answerOptions.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`option-btn flex items-center gap-6 p-6 rounded-2xl border transition-all duration-400 text-left group ${isSubmitted
                                ? opt.isCorrect ? 'bg-accent-green/10 border-accent-green text-accent-green' : i === selectedOption ? 'bg-accent-red/10 border-accent-red text-accent-red' : 'border-white/5 opacity-30'
                                : selectedOption === i ? 'bg-accent-primary text-orbit-dark border-transparent shadow-glow-primary scale-[1.01]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className={`option-label w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-400 ${isSubmitted && opt.isCorrect ? 'bg-accent-green text-orbit-dark' : isSubmitted && i === selectedOption ? 'bg-accent-red text-orbit-dark' : selectedOption === i ? 'bg-orbit-dark/20 text-orbit-dark' : 'bg-white/10 text-text-muted'}`}>{String.fromCharCode(65 + i)}</div>
                            <span className="flex-1 text-lg"><LaTeXText text={opt.text} /></span>
                            {isSubmitted && opt.isCorrect && <CheckCircle2 size={24} />}
                            {isSubmitted && i === selectedOption && !opt.isCorrect && <XCircle size={24} />}
                        </button>
                    ))}
                </div>
                <footer className="mt-4 pt-4 border-t border-white/5">
                    {!isSubmitted ? (
                        <button onClick={handleSubmit} disabled={selectedOption === null} className={`w-full py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center gap-3 ${selectedOption !== null ? 'bg-grad-primary text-orbit-dark shadow-glow-primary' : 'bg-white/5 text-text-muted cursor-not-allowed opacity-50'}`}><Send size={16} />Lock Selection</button>
                    ) : (
                        <div className="rationale-section animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-white/5 p-8 rounded-2xl border-l-2 border-accent-primary relative mb-8">
                                <span className="absolute top-4 right-6 opacity-5"><HelpCircle size={48} /></span>
                                <div className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.3em] mb-4">Master Rationale</div>
                                <div className="text-text-secondary italic leading-loose"><LaTeXText text={currentMCQ.answerOptions.find(o => o.isCorrect)?.rationale || ''} /></div>
                            </div>
                            <button onClick={nextQuestion} className="w-full py-5 bg-text-primary text-orbit-dark rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-soft">Execute Next Sequence<ChevronRight size={16} /></button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};
