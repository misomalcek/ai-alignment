'use client';

import React from 'react';
import { Sparkles, BookOpen, ShieldAlert, Flame, MessageSquare, BookMarked, Globe, Trophy } from 'lucide-react';

export type NavTab = 'primer' | 'gauntlet' | 'sandbox' | 'interpretability' | 'socratic';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isSk: boolean;
  onToggleLanguage: () => void;
  onOpenLexicon: () => void;
  scenariosCompletedCount: number;
}

export function Navbar({
  activeTab,
  onSelectTab,
  isSk,
  onToggleLanguage,
  onOpenLexicon,
  scenariosCompletedCount,
}: Props) {
  const navItems: { id: NavTab; labelSk: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'primer',
      labelSk: 'Sprievodca (Odyssey)',
      labelEn: 'Primer (Odyssey)',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'gauntlet',
      labelSk: 'Výzvy & Hra',
      labelEn: 'Gauntlet & Game',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'sandbox',
      labelSk: 'Laboratórium Cieľov',
      labelEn: 'Goal Sandbox',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'interpretability',
      labelSk: 'Čierna Skrinka (SAE)',
      labelEn: 'Neural Probe (SAE)',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'socratic',
      labelSk: 'Sokratovská Aréna',
      labelEn: 'Socratic Arena',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-[#05070d]/85 backdrop-blur-md border-b border-[#4fd1c5]/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectTab('primer')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4fd1c5] to-indigo-600 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(79,209,197,0.4)] border border-[#4fd1c5]/50 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 font-mono">
                AI_ALIGNMENT <span className="text-[#4fd1c5] font-mono text-xs px-2 py-0.5 rounded-md bg-[#4fd1c5]/10 border border-[#4fd1c5]/30">LAB</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5 hidden sm:block">
                {isSk ? 'Interaktívny simulátor bezpečnosti a súladu hodnôt' : 'Interactive alignment knowledge lab & game'}
              </p>
            </div>
          </div>

          {/* Nav tabs for desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0b101c]/90 p-1.5 rounded-2xl border border-[#4fd1c5]/20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#4fd1c5]/15 text-[#4fd1c5] shadow-[0_0_12px_rgba(79,209,197,0.25)] border border-[#4fd1c5]/40 font-mono'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{isSk ? item.labelSk : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Lexicon button */}
            <button
              id="nav-lexicon-btn"
              onClick={onOpenLexicon}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0f1626] hover:bg-[#162238] text-slate-300 hover:text-[#4fd1c5] transition-all flex items-center gap-1.5 border border-[#4fd1c5]/25 shadow-sm font-mono"
            >
              <BookMarked className="w-3.5 h-3.5 text-[#4fd1c5]" />
              <span className="hidden sm:inline">{isSk ? 'Slovník' : 'Lexicon'}</span>
            </button>

            {/* Language toggle */}
            <button
              id="nav-lang-toggle-btn"
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#4fd1c5]/10 hover:bg-[#4fd1c5]/20 text-[#4fd1c5] border border-[#4fd1c5]/30 flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(79,209,197,0.15)]"
              title="Prepnúť jazyk / Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono">{isSk ? 'SK' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-[#4fd1c5]/15 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 font-mono ${
                  isActive
                    ? 'bg-[#4fd1c5] text-slate-950 font-bold shadow-[0_0_10px_rgba(79,209,197,0.3)]'
                    : 'bg-[#0f1626] text-slate-400 border border-white/5'
                }`}
              >
                {item.icon}
                <span>{isSk ? item.labelSk : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
