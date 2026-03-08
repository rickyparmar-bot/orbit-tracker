import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Statistics } from './components/Statistics';
import { Consistency } from './components/Consistency';
import { Goals } from './components/Goals';
import { SubjectExplorer } from './components/SubjectExplorer';
import { RevisionHub } from './components/RevisionHub';
import {
  BarChart2,
  Layout,
  Clock,
  Target,
  Activity,
  Globe,
  RefreshCw
} from 'lucide-react';
import 'katex/dist/katex.min.css';

type ViewType = 'dashboard' | 'explorer' | 'goals' | 'revision' | 'statistics' | 'consistency' | 'timeline';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layout size={18} /> },
    { id: 'explorer', label: 'Explorer', icon: <Globe size={18} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={18} /> },
    { id: 'revision', label: 'Revision', icon: <RefreshCw size={18} /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} /> },
    { id: 'consistency', label: 'Consistency', icon: <Activity size={18} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-orbit-dark text-text-primary selection:bg-orbit-purple/30">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="app-container flex max-w-[1600px] mx-auto min-h-screen">
        <nav className="sidebar glass-panel w-[260px] m-6 p-8 flex flex-col h-[calc(100vh-48px)] sticky top-6 rounded-3xl border-white/5">
          <div className="logo flex items-center gap-3 mb-12 pl-2">
            <div className="logo-icon bg-accent-primary/10 p-2 rounded-xl text-accent-primary">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight bg-grad-primary bg-clip-text text-transparent">ORBIT</h2>
          </div>

          <ul className="nav-links flex flex-col gap-2 flex-1 list-none">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => setActiveView(link.id as ViewType)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all duration-400 ${activeView === link.id
                    ? 'bg-grad-primary text-orbit-dark shadow-glow-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                    }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="user-profile flex items-center gap-3 p-4 bg-black/20 rounded-2xl mt-auto">
            <div className="avatar w-8 h-8 bg-grad-primary rounded-full flex items-center justify-center text-orbit-dark font-black text-xs">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[10px] uppercase tracking-wider">Astronaut</span>
              <span className="text-[8px] text-text-muted">Rank: Elite</span>
            </div>
          </div>
        </nav>

        <main className="main-content flex-1 px-12 py-10 flex flex-col gap-10">
          <header className="top-header flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-1">
                Mission System v4.0.2
              </div>
            </div>
          </header>

          <div className="view-content flex-1">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'explorer' && <SubjectExplorer />}
            {activeView === 'goals' && <Goals />}
            {activeView === 'revision' && <RevisionHub />}
            {activeView === 'statistics' && <Statistics />}
            {activeView === 'consistency' && <Consistency />}
            {activeView === 'timeline' && (
              <div className="glass-panel p-24 rounded-3xl text-center text-text-muted border-white/5 animate-pulse">
                <Clock size={48} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-bold">Temporal Log Incoming</h3>
                <p className="text-sm">Synchronizing your academic timeline...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
