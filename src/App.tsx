import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { MCQEngine } from './components/MCQEngine';
import { Flashcards } from './components/Flashcards';
import { StudyNotes } from './components/StudyNotes';
import { LayoutGrid, Database, Zap, BookOpen, Settings, ZapOff } from 'lucide-react';
import 'katex/dist/katex.min.css';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'pyq' | 'flashcards' | 'notes' | 'settings'>('dashboard');

  return (
    <div className="flex h-screen bg-orbit-dark text-slate-100 font-sans selection:bg-orbit-cyan/30">
      {/* Sidebar Navigation */}
      <nav className="w-20 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-start p-4 lg:p-6 gap-8 bg-black/20 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-orbit-cyan rounded-lg flex items-center justify-center shadow-neon-cyan/50">
            <Zap className="text-black" size={24} />
          </div>
          <span className="hidden lg:block text-2xl font-black italic tracking-tighter">ORBIT</span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <NavItem
            icon={<LayoutGrid size={22} />}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={<Database size={22} />}
            label="PYQ Vault"
            active={activeView === 'pyq'}
            onClick={() => setActiveView('pyq')}
          />
          <NavItem
            icon={<ZapOff size={22} />}
            label="Flashcards"
            active={activeView === 'flashcards'}
            onClick={() => setActiveView('flashcards')}
          />
          <NavItem
            icon={<BookOpen size={22} />}
            label="Study Notes"
            active={activeView === 'notes'}
            onClick={() => setActiveView('notes')}
          />
          <div className="mt-8 pt-8 border-t border-white/5">
            <NavItem
              icon={<Settings size={22} />}
              label="Settings"
              active={activeView === 'settings'}
              onClick={() => setActiveView('settings')}
            />
          </div>
        </div>

        <div className="mt-auto w-full p-4 glass-card lg:block hidden border-orbit-cyan/20">
          <p className="text-[10px] font-bold text-orbit-cyan uppercase tracking-widest mb-1">Vampire Mode</p>
          <p className="text-xs text-slate-400">5'7" | 42kg Architecture</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-transparent relative">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'pyq' && <MCQEngine />}
          {activeView === 'flashcards' && <Flashcards />}
          {activeView === 'notes' && <StudyNotes />}
          {activeView === 'settings' && (
            <div className="glass-card p-12">
              <h2 className="text-2xl font-bold mb-6">System Configuration</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span>Hyprland Warden</span>
                  <span className="text-orbit-cyan font-bold uppercase text-xs tracking-widest">Active Process</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span>Vite Dev Port</span>
                  <span className="text-slate-400">8080</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span>CD Sync Mode</span>
                  <span className="text-orbit-cyan font-bold uppercase text-xs tracking-widest text-shadow-glow">PAT Auth</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all ${active ? 'bg-orbit-cyan/10 text-orbit-cyan border border-orbit-cyan/20' : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'}`}
  >
    {icon}
    <span className="hidden lg:block font-bold text-sm tracking-wide">{label}</span>
  </button>
);

export default App;
