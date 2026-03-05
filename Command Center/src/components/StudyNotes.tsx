import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { FileText, BookOpen } from 'lucide-react';

export const StudyNotes: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto p-4">
            <div className="glass-card p-8 flex items-center justify-between border-orbit-cyan/30">
                <div className="flex items-center gap-4">
                    <BookOpen className="text-orbit-cyan" size={32} />
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase neon-text-cyan">Master Notes</h2>
                        <p className="text-slate-400 text-sm tracking-widest uppercase">Physical Chemistry: Solutions</p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 flex flex-col gap-10 leading-relaxed text-slate-200 font-light">
                <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-orbit-cyan flex items-center gap-2">
                        <FileText size={20} /> 1. Concentration Terms
                    </h3>
                    <p>Key temperature-independent terms prioritized for JEE Advanced stoichiometry:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Molality (m)</span>
                            <BlockMath math="m = \frac{\text{moles of solute}}{\text{mass of solvent in kg}}" />
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Mole Fraction (x_A)</span>
                            <BlockMath math="x_A = \frac{n_A}{n_A + n_B}" />
                        </div>
                    </div>
                    <p>Crucial Interconversion:</p>
                    <div className="p-6 bg-orbit-cyan/5 rounded-2xl border border-orbit-cyan/20 text-center">
                        <BlockMath math="M = \frac{m \times d \times 1000}{1000 + m \times M_2}" />
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-orbit-cyan flex items-center gap-2">
                        <FileText size={20} /> 2. Raoult's Law & Deviations
                    </h3>
                    <p>Ideal Solution behavior requires <InlineMath math="\Delta H_{mix} = 0" /> and <InlineMath math="\Delta V_{mix} = 0" />.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 glass-card border-green-500/20">
                            <h4 className="font-bold text-green-400 mb-2">Positive Deviation</h4>
                            <p className="text-sm opacity-80 mb-4 font-italic">Observed P &gt; Calculated P</p>
                            <p className="text-xs">A-B interactions are weak (e.g., Ethanol + Water).</p>
                        </div>
                        <div className="p-5 glass-card border-red-500/20">
                            <h4 className="font-bold text-red-400 mb-2">Negative Deviation</h4>
                            <p className="text-sm opacity-80 mb-4 italic">Observed P &lt; Calculated P</p>
                            <p className="text-xs">A-B interactions are strong (e.g., Chloroform + Acetone).</p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-orbit-cyan flex items-center gap-2">
                        <FileText size={20} /> 3. Colligative Properties
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border-b border-white/5">
                            <span>Boiling Point Elevation</span>
                            <InlineMath math="\Delta T_b = i \times K_b \times m" />
                        </div>
                        <div className="flex justify-between items-center p-4 border-b border-white/5">
                            <span>Freezing Point Depression</span>
                            <InlineMath math="\Delta T_f = i \times K_f \times m" />
                        </div>
                        <div className="flex justify-between items-center p-4">
                            <span>Osmotic Pressure</span>
                            <InlineMath math="\pi = iCRT" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
