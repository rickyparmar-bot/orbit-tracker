import React, { useState } from 'react';
import { UNIVERSE_DATA } from '../data/universeData';
// Types used internally
import { ChevronRight, Globe, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { StudyNotes } from './StudyNotes';
import { ActiveRecall } from './ActiveRecall';
import { Flashcards } from './Flashcards';
import { MCQEngine } from './MCQEngine';
import { ErrorLog } from './ErrorLog';
import { RevisionHub } from './RevisionHub';

// Mapping sub-topic tabs to their renders
type ToolTab = 'godsheet' | 'recall' | 'flashcards' | 'pyq' | 'mcq' | 'errors' | 'revision';

export const SubjectExplorer: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<ToolTab>('godsheet');

    const subjects = UNIVERSE_DATA;

    // Resetting functions
    const backToSubjects = () => { setSelectedSubject(null); setSelectedUnit(null); setSelectedChapter(null); setSelectedSubTopic(null); };
    const backToUnits = () => { setSelectedUnit(null); setSelectedChapter(null); setSelectedSubTopic(null); };
    const backToChapters = () => { setSelectedChapter(null); setSelectedSubTopic(null); };
    const backToSubTopics = () => { setSelectedSubTopic(null); };

    // --- VIEW 1: Subject Selection ---
    if (!selectedSubject) {
        return (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header>
                    <h2 className="text-3xl font-bold tracking-tight">Academic Core</h2>
                    <p className="text-text-secondary">Select a subject to begin your deep focus session.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(subjects).map(([id, sub]) => (
                        <button
                            key={id}
                            onClick={() => setSelectedSubject(id)}
                            className="glass-card p-10 flex flex-col items-center gap-6 text-center group transition-all hover:border-accent-primary/50"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                                {sub.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{sub.label}</h3>
                                <p className="text-sm text-text-muted">
                                    {Object.keys(sub.units).length} Units active
                                </p>
                            </div>
                            <div className="w-full h-px bg-white/5 mt-2" />
                            <ChevronRight className="text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all" size={20} />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const sub = subjects[selectedSubject];

    // --- VIEW 1.5: Unit Selection ---
    if (!selectedUnit) {
        return (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <header className="flex items-center gap-4">
                    <button onClick={backToSubjects} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-text-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{sub.label} Explorer</div>
                        <h2 className="text-3xl font-bold tracking-tight">Select Unit</h2>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(sub.units).map(([id, unit]) => (
                        <button
                            key={id}
                            onClick={() => setSelectedUnit(id)}
                            className="glass-panel p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all text-left rounded-2xl border-white/5 hover:border-accent-primary/30"
                        >
                            <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary w-fit group-hover:scale-110 transition-transform">
                                <Layers size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">{unit.label}</div>
                                <div className="text-xs text-text-muted">{Object.keys(unit.chapters).length} Chapters</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const unit = sub.units[selectedUnit];

    // --- VIEW 2: Chapter Selection ---
    if (!selectedChapter) {
        return (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <header className="flex items-center gap-4">
                    <button onClick={backToUnits} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-text-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{unit.label}</div>
                        <h2 className="text-3xl font-bold tracking-tight">Select Chapter</h2>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(unit.chapters).map(([id, ch]) => (
                        <button
                            key={id}
                            onClick={() => setSelectedChapter(id)}
                            className="glass-panel p-6 flex justify-between items-center group hover:bg-white/5 transition-all text-left rounded-2xl border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <div className="font-bold">{ch.label}</div>
                                    <div className="text-xs text-text-muted">{Object.keys(ch.subtopics).length} sub-topics active</div>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const ch = unit.chapters[selectedChapter];

    // --- VIEW 3: Sub-topic Selection ---
    if (!selectedSubTopic) {
        return (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <header className="flex items-center gap-4">
                    <button onClick={backToChapters} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-text-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{ch.label}</div>
                        <h2 className="text-3xl font-bold tracking-tight">Focus Sub-topic</h2>
                    </div>
                </header>
                {/* Fallback for empty subtopics in newly added chapters */}
                {Object.keys(ch.subtopics).length === 0 ? (
                    <div className="glass-panel p-20 text-center rounded-3xl border-dashed border-white/10">
                        <div className="text-4xl mb-4 opacity-20">🌫️</div>
                        <h3 className="text-xl font-bold text-text-muted">Sub-topic Data Pending</h3>
                        <p className="text-sm text-text-muted mt-2">No active sub-topics found for this chapter. System awaiting research ingestion.</p>
                        <button onClick={backToChapters} className="mt-8 px-6 py-2 bg-white/5 rounded-full text-xs font-bold hover:bg-white/10 transition-all">
                            BACK TO CHAPTERS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(ch.subtopics).map(([id, st]) => (
                            <button
                                key={id}
                                onClick={() => setSelectedSubTopic(id)}
                                className="glass-panel p-6 flex justify-between items-center group hover:bg-white/5 transition-all text-left rounded-2xl border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent-cyan/10 rounded-xl text-accent-cyan">
                                        <Layers size={20} />
                                    </div>
                                    <div className="font-bold">{st.label}</div>
                                </div>
                                <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const st = ch.subtopics[selectedSubTopic];

    // --- VIEW 4: Tool View (The God-Panel) ---
    return (
        <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-500">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={backToSubTopics} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-text-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">
                            {sub.label} › {ch.label}
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">{st.label}</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="glass-panel px-4 py-2 rounded-xl text-xs font-bold text-accent-primary bg-accent-primary/5">
                        MASTERED
                    </div>
                </div>
            </header>

            <div className="god-view-panel glass-panel rounded-3xl overflow-hidden flex flex-col border-white/5">
                <div className="god-tabs flex gap-0 bg-black/40 border-b border-white/5 overflow-x-auto px-6">
                    {(['godsheet', 'recall', 'flashcards', 'pyq', 'mcq', 'errors', 'revision'] as ToolTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTool(tab)}
                            className={`px-6 py-4 text-[0.8rem] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTool === tab ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab.replace('godsheet', 'God-Sheet').replace('recall', 'Recall').replace('pyq', 'PYQ Vault')}
                            {activeTool === tab && (
                                <div className="absolute bottom-0 left-6 right-6 h-1 bg-accent-primary rounded-t-lg shadow-glow-primary" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="god-tab-content p-8 min-h-[500px]">
                    {activeTool === 'godsheet' && <StudyNotes content={st.godSheet} />}
                    {activeTool === 'recall' && <ActiveRecall items={st.recall} />}
                    {activeTool === 'flashcards' && <Flashcards items={st.flashcards} />}
                    {activeTool === 'pyq' && (
                        <div className="p-12 text-center text-text-secondary">
                            <Globe size={48} className="mx-auto mb-4 opacity-10" />
                            <h3 className="text-xl font-bold mb-2">PYQ Vault</h3>
                            <p className="max-w-md mx-auto text-sm">
                                Solving past year questions for <strong>{st.label}</strong> to identify recurring patterns and high-yield topics.
                            </p>
                        </div>
                    )}
                    {activeTool === 'mcq' && <MCQEngine questions={st.mcq as any} />}
                    {activeTool === 'errors' && <ErrorLog />}
                    {activeTool === 'revision' && <RevisionHub />}
                </div>
            </div>
        </div>
    );
};
