import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import solutionsFlashcards from '../data/solutions-flashcards-v2.json';

export const Flashcards: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const cards = solutionsFlashcards.cards;
    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold neon-text-cyan">Flash Revision</h2>
                <p className="text-slate-400 text-sm mt-1">{currentIndex + 1} / {cards.length} Cards</p>
            </div>

            <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full aspect-[4/3] relative cursor-pointer group perspective-1000"
            >
                <div className={`w-full h-full transition-all duration-500 preserve-3d shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center border-orbit-cyan/30">
                        <span className="text-[10px] font-bold text-orbit-cyan uppercase tracking-widest mb-4 opacity-50">Question</span>
                        <div className="text-xl md:text-2xl font-light text-white">
                            <InlineMath math={currentCard.front} />
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                            <RotateCw size={14} className="animate-spin-slow" /> Click to reveal
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-12 flex flex-col items-center justify-center text-center border-white/20 bg-orbit-cyan/5">
                        <span className="text-[10px] font-bold text-orbit-cyan uppercase tracking-widest mb-4 opacity-50">Concept / Solution</span>
                        <div className="text-lg md:text-xl text-slate-200">
                            <InlineMath math={currentCard.back} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <button onClick={prevCard} className="p-4 glass-card hover:bg-white/10 active:scale-95 transition-all">
                    <ArrowLeft size={24} />
                </button>
                <button onClick={nextCard} className="p-4 glass-card hover:bg-white/10 active:scale-95 transition-all">
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};
