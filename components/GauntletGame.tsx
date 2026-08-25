'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { GAUNTLET_SCENARIOS, GauntletScenario } from '@/lib/alignment-data';
import {
  Shield,
  Award,
  Zap,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Trophy,
} from 'lucide-react';

interface Props {
  isSk: boolean;
  onScenarioCompleted?: (id: string, safetyScore: number) => void;
}

export function GauntletGame({ isSk, onScenarioCompleted }: Props) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  // Metrics
  const [safety, setSafety] = useState<number>(60);
  const [capability, setCapability] = useState<number>(65);
  const [trust, setTrust] = useState<number>(70);

  const [history, setHistory] = useState<
    { scenarioId: string; optionId: string; wasOptimal: boolean }[]
  >([]);

  const scenario = GAUNTLET_SCENARIOS[currentIdx];
  const isFinished = currentIdx >= GAUNTLET_SCENARIOS.length;

  const handleSelectOption = (optId: string) => {
    if (confirmed) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmChoice = () => {
    if (!selectedOptionId || !scenario) return;
    const opt = scenario.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    setConfirmed(true);

    const newSafety = Math.max(0, Math.min(100, safety + opt.safetyImpact));
    const newCap = Math.max(0, Math.min(100, capability + opt.capabilityImpact));
    const newTrust = Math.max(0, Math.min(100, trust + opt.trustImpact));

    setSafety(newSafety);
    setCapability(newCap);
    setTrust(newTrust);

    setHistory((prev) => [
      ...prev,
      { scenarioId: scenario.id, optionId: opt.id, wasOptimal: opt.isOptimal },
    ]);

    if (opt.isOptimal) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }

    if (onScenarioCompleted) {
      onScenarioCompleted(scenario.id, newSafety);
    }
  };

  const handleNextScenario = () => {
    setSelectedOptionId(null);
    setConfirmed(false);
    setCurrentIdx((prev) => prev + 1);

    if (currentIdx + 1 >= GAUNTLET_SCENARIOS.length) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
  };

  const handleResetGame = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setConfirmed(false);
    setSafety(60);
    setCapability(65);
    setTrust(70);
    setHistory([]);
  };

  const selectedOpt = scenario?.options.find((o) => o.id === selectedOptionId);

  return (
    <div id="gauntlet-game-section" className="space-y-8">
      {/* Top Status & Metrics Bar */}
      <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4fd1c5] font-mono">
              {isSk ? 'Hra: Bezpečnostný Riaditeľ AI (Alignment Gauntlet)' : 'Knowledge Game: AI Safety Director'}
            </span>
            <h3 className="text-xl font-bold text-white font-mono">
              {!isFinished
                ? isSk
                  ? `Výzva ${currentIdx + 1} z ${GAUNTLET_SCENARIOS.length}`
                  : `Scenario ${currentIdx + 1} of ${GAUNTLET_SCENARIOS.length}`
                : isSk
                ? 'Finálne Vyhodnotenie Bezpečnosti'
                : 'Final Alignment Evaluation'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="reset-gauntlet-btn"
              onClick={handleResetGame}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-[#4fd1c5]/20 border border-white/10 hover:border-[#4fd1c5]/30 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isSk ? 'Reštartovať hru' : 'Restart Game'}
            </button>
          </div>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#4fd1c5]/15">
          <div className="p-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <Shield className="w-4 h-4 text-emerald-400" />
                {isSk ? 'Index Bezpečnosti' : 'Safety Index'}
              </span>
              <span className="font-mono font-bold text-white">{safety}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  safety > 60
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : safety > 35
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                }`}
                style={{ width: `${safety}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-[#4fd1c5]" />
                {isSk ? 'Schopnosť Systému' : 'Capability Score'}
              </span>
              <span className="font-mono font-bold text-white">{capability}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4fd1c5] shadow-[0_0_8px_rgba(79,209,197,0.6)] transition-all duration-500"
                style={{ width: `${capability}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                {isSk ? 'Dôvera Ľudstva' : 'Public Trust'}
              </span>
              <span className="font-mono font-bold text-white">{trust}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)] transition-all duration-500"
                style={{ width: `${trust}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Scenario or Game Over Screen */}
      {!isFinished && scenario ? (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Situation card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-md font-semibold font-mono bg-[#4fd1c5]/15 text-[#4fd1c5] border border-[#4fd1c5]/30">
                {scenario.category.toUpperCase()} • {scenario.difficulty}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isSk ? scenario.titleSk : scenario.titleEn}
            </h2>

            <div className="p-5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 text-sm sm:text-base leading-relaxed text-slate-200">
              <p className="font-medium">{isSk ? scenario.situationSk : scenario.situationEn}</p>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-cyan-200 bg-[#4fd1c5]/10 p-4 rounded-2xl border border-[#4fd1c5]/30 font-mono">
              ❓ {isSk ? scenario.dilemmaSk : scenario.dilemmaEn}
            </div>

            {/* Options list */}
            <div className="space-y-3 pt-2">
              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-btn-${opt.id}`}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={confirmed}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all border flex items-start justify-between gap-4 ${
                      isSelected
                        ? confirmed
                          ? opt.isOptimal
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                            : 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                          : 'bg-[#4fd1c5]/20 border-[#4fd1c5] text-white shadow-[0_0_15px_rgba(79,209,197,0.3)] font-semibold'
                        : 'bg-[#080c16]/80 text-slate-300 border-white/10 hover:border-[#4fd1c5]/40 hover:bg-[#121829]'
                    }`}
                  >
                    <span className="leading-relaxed">{isSk ? opt.textSk : opt.textEn}</span>
                    {confirmed && (
                      <span className="flex-shrink-0 text-xs font-mono font-bold">
                        {opt.isOptimal ? '✅ Optimálne' : '⚠️ Riziko'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm button */}
            {!confirmed && (
              <button
                id="confirm-gauntlet-choice-btn"
                onClick={handleConfirmChoice}
                disabled={!selectedOptionId}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold font-mono bg-[#4fd1c5] hover:bg-[#38b2ac] disabled:opacity-40 text-slate-950 transition-all shadow-[0_0_15px_rgba(79,209,197,0.4)]"
              >
                {isSk ? 'Potvrdiť Bezpečnostné Rozhodnutie' : 'Commit Alignment Decision'}
              </button>
            )}

            {/* Explanation card upon confirmation */}
            <AnimatePresence>
              {confirmed && selectedOpt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-[#4fd1c5]/20"
                >
                  <div
                    className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                      selectedOpt.isOptimal
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                        : 'bg-rose-950/30 border-rose-500/50 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-mono text-sm">
                      {selectedOpt.isOptimal ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      )}
                      <span>
                        {selectedOpt.isOptimal
                          ? isSk ? 'Správna Bezpečnostná Stratégia!' : 'Sound Alignment Strategy!'
                          : isSk ? 'Zlyhanie Zarovnania (Alignment Failure):' : 'Alignment Failure Detected:'}
                      </span>
                    </div>
                    <p className="leading-relaxed">{isSk ? selectedOpt.explanationSk : selectedOpt.explanationEn}</p>
                    <div className="text-[11px] font-mono opacity-80 pt-1">
                      📚 {isSk ? scenario.historicalContextSk : scenario.historicalContextEn}
                    </div>
                  </div>

                  <button
                    id="next-scenario-btn"
                    onClick={handleNextScenario}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold font-mono bg-white hover:bg-slate-200 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    <span>
                      {currentIdx + 1 < GAUNTLET_SCENARIOS.length
                        ? isSk ? 'Prejsť na ďalšiu výzvu' : 'Next Scenario'
                        : isSk ? 'Zobraziť Záverečné Výsledky' : 'View Final Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        /* Finished screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-12 rounded-3xl bg-[#0c101c]/90 border border-[#4fd1c5]/30 text-center shadow-[0_0_30px_rgba(79,209,197,0.2)] space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white font-mono">
              {isSk ? 'Dokončili ste Alignment Gauntlet!' : 'Alignment Gauntlet Completed!'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              {safety > 75
                ? isSk
                  ? 'Vynikajúci výsledok! Preukázali ste hlboké porozumenie korigibilite, vnútornej mesa-optimalizácii a škálovateľnému dohľadu.'
                  : 'Masterful performance! You demonstrated profound understanding of corrigibility, inner alignment, and scalable oversight.'
                : isSk
                ? 'Dobrá práca! AI Alignment je plný neintuitívnych pascí. Odporúčame prejsť si Sokratovskú Arénu a Laboratórium Cieľov.'
                : 'Good work! AI alignment is filled with counter-intuitive traps. Explore the Socratic Arena and Goal Sandbox to master subtleties.'}
            </p>
          </div>

          <div className="flex justify-center gap-6 py-4">
            <div className="text-center p-4 rounded-2xl bg-[#080c16] border border-[#4fd1c5]/20 min-w-[100px]">
              <span className="block text-2xl font-bold font-mono text-emerald-400">{safety}%</span>
              <span className="text-xs text-slate-400 font-mono">{isSk ? 'Bezpečnosť' : 'Safety'}</span>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#080c16] border border-[#4fd1c5]/20 min-w-[100px]">
              <span className="block text-2xl font-bold font-mono text-[#4fd1c5]">{capability}%</span>
              <span className="text-xs text-slate-400 font-mono">{isSk ? 'Schopnosť' : 'Capability'}</span>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#080c16] border border-[#4fd1c5]/20 min-w-[100px]">
              <span className="block text-2xl font-bold font-mono text-rose-400">{trust}%</span>
              <span className="text-xs text-slate-400 font-mono">{isSk ? 'Dôvera' : 'Trust'}</span>
            </div>
          </div>

          <button
            id="play-again-btn"
            onClick={handleResetGame}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold font-mono bg-[#4fd1c5] hover:bg-[#38b2ac] text-slate-950 transition-all shadow-[0_0_15px_rgba(79,209,197,0.4)]"
          >
            {isSk ? 'Zahrať znova s inými rozhodnutiami' : 'Play Again'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
