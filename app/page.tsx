'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from '@/components/Navbar';
import { PrimerSection } from '@/components/PrimerSection';
import { GauntletGame } from '@/components/GauntletGame';
import { GoalSandbox } from '@/components/GoalSandbox';
import { BlackBoxProbeWidget } from '@/components/BlackBoxProbeWidget';
import { SocraticArena } from '@/components/SocraticArena';
import { LexiconModal } from '@/components/LexiconModal';
import { Sparkles, Shield, Trophy, BookOpen, Flame, HelpCircle, ArrowRight, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('primer');
  const [isSk, setIsSk] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_alignment_lang');
      if (saved) return saved === 'sk';
    }
    return true;
  });
  const [isLexiconOpen, setIsLexiconOpen] = useState<boolean>(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_alignment_completed');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  const handleToggleLanguage = () => {
    const next = !isSk;
    setIsSk(next);
    try {
      localStorage.setItem('ai_alignment_lang', next ? 'sk' : 'en');
    } catch (e) {}
  };

  const handleScenarioCompleted = (scenarioId: string) => {
    if (!completedScenarios.includes(scenarioId)) {
      const updated = [...completedScenarios, scenarioId];
      setCompletedScenarios(updated);
      try {
        localStorage.setItem('ai_alignment_completed', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  return (
    <div className="min-h-screen immersive-bg text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Tech Dot Matrix Grid Overlay */}
      <div className="absolute inset-0 immersive-grid opacity-20 pointer-events-none" />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSk={isSk}
        onToggleLanguage={handleToggleLanguage}
        onOpenLexicon={() => setIsLexiconOpen(true)}
        scenariosCompletedCount={completedScenarios.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Futuristic HUD Telemetry Status Bar */}
        <div className="mb-6 p-3 px-5 rounded-2xl bg-[#0a0f18]/80 backdrop-blur-md border border-[#4fd1c5]/25 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_20px_rgba(79,209,197,0.08)]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fd1c5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4fd1c5]"></span>
            </div>
            <span className="font-mono text-xs text-[#4fd1c5] tracking-wider uppercase font-semibold">
              {isSk ? 'SYSTÉM v4.02 // KNOWLEDGE_INTERFACE' : 'SYSTEM v4.02 // KNOWLEDGE_INTERFACE'}
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{isSk ? 'Zarovnanie Zámeru' : 'Human Intent Sync'}: <strong className="text-emerald-400 font-semibold">98.2%</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fd1c5]"></span>
              <span>{isSk ? 'Korigibilita' : 'Corrigibility Buffer'}: <strong className="text-[#4fd1c5] font-semibold">ONLINE</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>{isSk ? 'Kognitívny Posun' : 'Cognitive Drift'}: <strong className="text-indigo-300 font-semibold">MINIMAL</strong></span>
            </div>
          </div>
        </div>

        {/* Hero Cyber Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c101c] via-[#10192e] to-[#0a0d18] border border-[#4fd1c5]/30 text-white shadow-[0_0_35px_rgba(79,209,197,0.12)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#4fd1c5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-[#4fd1c5]/10 text-[#4fd1c5] border border-[#4fd1c5]/30 shadow-[0_0_10px_rgba(79,209,197,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSk ? 'AI Alignment Odyssey • Moderná Perspektíva' : 'AI Alignment Odyssey • Modern Perspective'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {isSk
                ? 'Ako zladiť ciele umelej inteligencie s najušľachtilejšími ľudskými hodnotami?'
                : 'How Do We Align Frontier Artificial Intelligence with Human Values?'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isSk
                ? '„Robiť to, čo sme povedali, nie je to isté ako robiť to, čo sme chceli.“ Preskúmajte problematiku vonkajšieho a vnútorného zarovnania, pasce zástupných cieľov, mechanistickú interpretovateľnosť a otestujte svoje rozhodnutia v interaktívnej hre.'
                : '"Doing what we said is not the same as doing what we meant." Explore outer vs inner alignment, proxy reward traps, mechanistic interpretability, and test your judgment in interactive simulations.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-start-primer-btn"
                onClick={() => setActiveTab('primer')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'primer'
                    ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.4)]'
                    : 'bg-white/5 hover:bg-[#4fd1c5]/20 text-slate-200 border-white/10 hover:border-[#4fd1c5]/40'
                }`}
              >
                🎓 {isSk ? '1. Prejsť Sprievodcu' : '1. Read Primer'}
              </button>

              <button
                id="hero-start-gauntlet-btn"
                onClick={() => setActiveTab('gauntlet')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'gauntlet'
                    ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.4)]'
                    : 'bg-white/5 hover:bg-[#4fd1c5]/20 text-slate-200 border-white/10 hover:border-[#4fd1c5]/40'
                }`}
              >
                🎮 {isSk ? '2. Zahrať Výzvy (Hra)' : '2. Play Gauntlet'}
              </button>

              <button
                id="hero-start-sandbox-btn"
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'sandbox'
                    ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.4)]'
                    : 'bg-white/5 hover:bg-[#4fd1c5]/20 text-slate-200 border-white/10 hover:border-[#4fd1c5]/40'
                }`}
              >
                🧪 {isSk ? '3. Otestovať Cieľ (Sandbox)' : '3. Red-Team Goals'}
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        {activeTab === 'primer' && (
          <PrimerSection
            isSk={isSk}
            onNavigateToGauntlet={() => setActiveTab('gauntlet')}
            onNavigateToSandbox={() => setActiveTab('sandbox')}
          />
        )}

        {activeTab === 'gauntlet' && (
          <GauntletGame
            isSk={isSk}
            onScenarioCompleted={handleScenarioCompleted}
          />
        )}

        {activeTab === 'sandbox' && (
          <GoalSandbox isSk={isSk} />
        )}

        {activeTab === 'interpretability' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/80 border border-[#4fd1c5]/25 shadow-sm space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4fd1c5] font-mono">
                {isSk ? 'Mechanistická Interpretovateľnosť & Inšpekcia' : 'Mechanistic Interpretability Lab'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {isSk ? 'Nahliadnutie do Čiernej Skrinky Neurónovej Siete' : 'Peeking Inside the Transformer Black Box'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isSk
                  ? 'Pomocou Sparse Autoencoderov (SAE) a aktivačných vektorov môžeme identifikovať konkrétne koncepty priamo vo váhach transformeru. Vyskúšajte posúvať aktivácie konceptov (pravdovravnosť, pätolizačstvo, odpor k vypnutiu) a sledujte zmenu výstupu v reálnom čase.'
                  : 'Using Sparse Autoencoders (SAEs) and activation steering vectors, we can identify discrete human concepts within neural weights. Experiment with clamping features below.'}
              </p>
            </div>

            <BlackBoxProbeWidget isSk={isSk} />
          </div>
        )}

        {activeTab === 'socratic' && (
          <SocraticArena isSk={isSk} />
        )}
      </main>

      {/* Lexicon Modal */}
      <LexiconModal
        isSk={isSk}
        isOpen={isLexiconOpen}
        onClose={() => setIsLexiconOpen(false)}
      />

      {/* Futuristic Clean Footer */}
      <footer className="border-t border-[#4fd1c5]/20 bg-[#05070c]/90 mt-16 py-8 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-300">
            AI Alignment Odyssey & Interactive Knowledge Game • {isSk ? 'Vytvorené pre vzdelávanie ľudí a AI o spoločnom zarovnaní hodnôt.' : 'Built to educate humans & AI on flourishing value co-alignment.'}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Založené na výskumoch Stuarta Russella, Nicka Bostroma, Paula Christiana, Anthropicu, OpenAI a DeepMind Safety Lab.
          </p>
        </div>
      </footer>
    </div>
  );
}
