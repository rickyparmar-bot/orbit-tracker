import React, { useState, useEffect } from 'react';

const FlipUnit: React.FC<{ digit: string | number; label: string }> = ({ digit, label }) => {
    const [current, setCurrent] = useState(digit);
    const [next, setNext] = useState(digit);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (digit !== current) {
            setNext(digit);
            setIsFlipping(true);
            const timeout = setTimeout(() => {
                setCurrent(digit);
                setIsFlipping(false);
            }, 800); // Total animation duration (0.4s + 0.4s)
            return () => clearTimeout(timeout);
        }
    }, [digit, current]);

    const formattedCurrent = String(current).padStart(2, '0');
    const formattedNext = String(next).padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-28 md:w-32 md:h-40 bg-[#0f0f15] rounded-xl font-bold text-5xl md:text-7xl text-white shadow-xl preserve-3d">
                {/* Static Top & Bottom showing Next and Current */}
                <div className="flip-card-top z-0">
                    <span>{formattedNext}</span>
                </div>
                <div className="flip-card-bottom z-0">
                    <span>{formattedCurrent}</span>
                </div>

                {/* Flipping Overlays */}
                {isFlipping && (
                    <>
                        <div className="flip-card-top z-10 flip-anim-top bg-[#15151e]">
                            <span>{formattedCurrent}</span>
                        </div>
                        <div className="flip-card-bottom z-10 flip-anim-bottom bg-[#15151e]">
                            <span>{formattedNext}</span>
                        </div>
                    </>
                )}

                {/* Center Line for Glass effect */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/50 z-20 -translate-y-1/2" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-[0.3em]">{label}</span>
        </div>
    );
};

export const CountdownClock: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set the global countdown target to September 1, 2026, at 00:00:00
        const targetDate = new Date('2026-09-01T00:00:00');
        const targetTime = targetDate.getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex gap-4 md:gap-8 mt-8 justify-center lg:justify-start">
            <FlipUnit digit={timeLeft.days} label="Days" />
            <FlipUnit digit={timeLeft.hours} label="Hours" />
            <FlipUnit digit={timeLeft.minutes} label="Minutes" />
            <FlipUnit digit={timeLeft.seconds} label="Seconds" />
        </div>
    );
};
