import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import { ArrowLeft, ArrowRight, RotateCw, Shuffle } from 'lucide-react';

interface FlashcardProps {
    items?: { q: string; a: string }[];
}

export const Flashcards: React.FC<FlashcardProps> = ({ items = [] }) => {
    const [cards, setCards] = useState(items);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (items && items.length > 0) {
            setCards(items);
            setCurrentIndex(0);
            setIsFlipped(false);
        }
    }, [items]);

    if (cards.length === 0) {
        return (
            <div className="p-12 text-center text-text-muted">
                <p>No flashcards available for this sub-topic yet.</p>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 200);
    };

    const shuffleCards = () => {
        setIsFlipped(false);
        setTimeout(() => {
            const shuffled = [...cards].sort(() => Math.random() - 0.5);
            setCards(shuffled);
            setCurrentIndex(0);
        }, 200);
    };

    return (
        <div className="flashcards-container flex flex-col items-center gap-10 max-w-3xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="flex flex-col items-center">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Active Recall Session</div>
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-accent-primary">{currentIndex + 1}</span>
                        <span className="text-text-muted opacity-30">/</span>
                        <span className="text-text-secondary">{cards.length}</span>
                    </div>
                </div>
            </header>

            <div className="w-full aspect-[16/10] perspective-1000">
                <div
                    className={`fc-card ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front Face */}
                    <div className="fc-face fc-front glass-panel">
                        <span className="absolute top-8 left-8 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-primary opacity-40">Question</span>
                        <div className="text-2xl font-bold leading-relaxed max-w-[80%]">
                            <InlineMath math={currentCard.q} />
                        </div>
                        <div className="absolute bottom-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                            <RotateCw size={12} className="animate-spin-slow opacity-50" />
                            Tap to reveal solution
                        </div>
                    </div>

                    {/* Back Face */}
                    <div className="fc-face fc-back glass-panel">
                        <span className="absolute top-8 left-8 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-green opacity-40">Solution</span>
                        <div className="text-xl leading-loose max-w-[80%] text-text-primary">
                            <InlineMath math={currentCard.a} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flash-controls flex items-center gap-2 bg-black/20 p-2 rounded-2xl border border-white/5 shadow-soft">
                <button
                    onClick={prevCard}
                    className="p-4 hover:bg-white/10 rounded-xl transition-all text-text-secondary hover:text-text-primary active:scale-90"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="w-px h-8 bg-white/5 mx-2" />

                <button
                    onClick={shuffleCards}
                    className="px-8 py-3 bg-white/5 hover:bg-accent-primary hover:text-orbit-dark rounded-xl transition-all duration-400 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 active:scale-95 shadow-soft"
                >
                    <Shuffle size={14} />
                    Shuffle Deck
                </button>

                <div className="w-px h-8 bg-white/5 mx-2" />

                <button
                    onClick={nextCard}
                    className="p-4 hover:bg-white/10 rounded-xl transition-all text-text-secondary hover:text-text-primary active:scale-90"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
