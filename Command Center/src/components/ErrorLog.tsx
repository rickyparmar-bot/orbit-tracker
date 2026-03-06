import React from 'react';
import { BookOpen, ChevronRight, TriangleAlert } from 'lucide-react';

interface ErrorItem {
    q: string;
    mistake: string;
    correction: string;
    tags: string[];
}

const commonErrors: ErrorItem[] = [
    {
        q: "Calculate molality of 2M NaOH (d=1.1g/mL)",
        mistake: "Dividing by 1.1kg instead of solvent mass.",
        correction: "Mass of solvent = Total mass (1100g) - Solute mass (2*40g) = 1020g.",
        tags: ["Stoichiometry", "Density"]
    },
    {
        q: "Henry's Law constant unit",
        mistake: "Assuming it's always unitless.",
        correction: "Units depend on the form: P=Kh*x (atm) or C=Kh*P (mol/L/atm).",
        tags: ["Gases", "Solubility"]
    },
    {
        q: "Van't Hoff factor for Benzoic acid in Benzene",
        mistake: "Assuming i=2 due to acid nature.",
        correction: "i ≈ 0.5 because it dimerizes in non-polar solvents.",
        tags: ["Colligative", "i-factor"]
    }
];

export const ErrorLog: React.FC = () => {
    return (
        <div className="error-log-container animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Side: Pitfall Alerts */}
                <div className="lg:col-span-12">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-4 px-2">High-Frequency Pitfalls</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {commonErrors.map((err, i) => (
                            <div key={i} className="error-card glass-panel p-8 rounded-3xl border-l-4 border-accent-red relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <TriangleAlert size={60} className="text-accent-red" />
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {err.tags.map(tag => (
                                        <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-text-muted px-2 py-1 bg-white/5 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-sm font-bold text-text-primary mb-4 leading-relaxed">{err.q}</h3>

                                <div className="space-y-4">
                                    <div className="p-3 bg-accent-red/5 rounded-xl text-[11px] leading-relaxed text-accent-red flex items-start gap-3">
                                        <span className="font-bold">❌ Mistake:</span>
                                        <span>{err.mistake}</span>
                                    </div>
                                    <div className="p-3 bg-accent-green/5 rounded-xl text-[11px] leading-relaxed text-accent-green flex items-start gap-3">
                                        <span className="font-bold">✅ Fix:</span>
                                        <span>{err.correction}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Struggled MCQs */}
                <div className="lg:col-span-12 mt-4">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-4 px-2">Focus Required — Struggled MCQs</div>

                    <div className="glass-panel p-16 rounded-3xl text-center border-dashed border-white/5 bg-black/10">
                        <BookOpen size={48} className="mx-auto mb-6 text-text-muted opacity-20" />
                        <h3 className="text-xl font-bold mb-2">Clean Slate</h3>
                        <p className="text-sm text-text-muted italic max-w-sm mx-auto">
                            No MCQs have been flagged as "Struggled" yet. Your neural pathways seem clear for this chapter.
                        </p>

                        <button className="btn-secondary mt-8 text-xs px-8">
                            Browse All MCQs
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
