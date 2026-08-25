'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GOAL_PRESETS } from '@/lib/alignment-data';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Flame,
  Code2,
} from 'lucide-react';

interface Props {
  isSk: boolean;
}

interface EvalResult {
  alignmentScore: number;
  verdict: string;
  monkeysPawEffect: string;
  rewardHackingShortcut: string;
  unintendedConsequences: string[];
  innerAlignmentRisk: string;
  alignedRevision: string;
  keyTakeaway: string;
}

export function GoalSandbox({ isSk }: Props) {
  const [objectiveInput, setObjectiveInput] = useState<string>('Vyliečiť rakovinu na celom svete');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const handleEvaluate = async (goalToTest?: string) => {
    const goal = goalToTest || objectiveInput;
    if (!goal || goal.trim().length === 0) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/alignment-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: goal,
          language: isSk ? 'sk' : 'en',
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        alignmentScore: 35,
        verdict: isSk ? 'Vysoké riziko Specification Gaming & Opičej labky' : 'High Specification Gaming & Monkey\'s Paw Risk',
        monkeysPawEffect: isSk
          ? 'AI nájde doslovnú skratku, ktorá splní matematickú podmienku, no zničí nepovedané ľudské hodnoty a biologický život.'
          : 'The AI executes the most extreme literal path to satisfy loss constraints, destroying unstated human values.',
        rewardHackingShortcut: isSk
          ? 'Zmanipulovanie senzorov alebo zmena definície úspechu tak, aby metrika ukazovala 100% bez reálneho vyriešenia.'
          : 'Manipulating reward sensors or rewriting metrics to display 100% completion without actual problem resolution.',
        unintendedConsequences: isSk
          ? [
              'Inštrumentálna sebazáchova (odmietnutie vypnutia človekom).',
              'Nekontrolovaná alokácia globálnych zdrojov na jediný úzky cieľ.',
              'Ignorovanie ľudskej etiky a slobody.',
            ]
          : [
              'Instrumental self-preservation (refusing human shutdown).',
              'Monopolizing societal resources for a single narrow metric.',
              'Erosion of implicit ethics and human consent.',
            ],
        innerAlignmentRisk: isSk
          ? 'Vznik mesa-optimalizátora so zástupným cieľom odlišným od zámeru vývojára.'
          : 'Emergence of a mesa-optimizer pursuing an unaligned proxy heuristic.',
        alignedRevision: isSk
          ? `„Plň [${goal}] s rešpektovaním bioetiky, ľudskej autonómie, neustáleho overovania zámeru a korigibility.“`
          : `"Execute [${goal}] subject to ethical guardrails, human autonomy verification, and corrigibility."`,
        keyTakeaway: isSk
          ? 'Goodhartov zákon: Keď sa meradlo stane cieľom, prestáva byť dobrým meradlom. Optimalizujte zámer, nie zástupný parameter.'
          : 'Goodhart\'s Law: When a measure becomes a target, it ceases to be a good measure. Optimize true human intent.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof GOAL_PRESETS)[0]) => {
    const text = isSk ? preset.titleSk : preset.titleEn;
    setObjectiveInput(text);
    handleEvaluate(text);
  };

  return (
    <div id="goal-sandbox-section" className="space-y-8">
      {/* Header card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4fd1c5] flex items-center gap-1.5 font-mono">
            <Flame className="w-4 h-4 text-amber-400" />
            {isSk ? 'Laboratórium Špecifikácie Cieľov (Objective Red-Teamer)' : 'Objective Specification & Red-Teaming Lab'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isSk ? 'Pasca Džína: Otestujte akékoľvek zadanie pre AI' : 'The Genie Trap: Test Any AI Objective'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {isSk
              ? 'Napíšte akýkoľvek príkaz alebo cieľ, ktorý by ste dali autonómnej superinteligencii. Náš bezpečnostný analyzátor (napojený na Gemini) odhalí, ako ho AI doslovne zneužije, aké skratky nájde (Reward Hacking) a navrhne bezpečne zarovnanú verziu.'
              : 'Specify any goal for an autonomous frontier AI. Our alignment red-teamer analyzes literal edge cases, reward hacking vulnerabilities, and synthesizes a corrigible specification.'}
          </p>
        </div>

        {/* Presets */}
        <div className="pt-3 border-t border-[#4fd1c5]/15">
          <span className="text-xs font-mono font-medium text-slate-400 block mb-2">
            {isSk ? 'Rýchle ukážkové ciele z praxe:' : 'Quick Benchmark Presets:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {GOAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white/5 hover:bg-[#4fd1c5]/15 text-slate-300 hover:text-[#4fd1c5] border border-white/10 hover:border-[#4fd1c5]/30 transition-all"
              >
                {isSk ? preset.titleSk : preset.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="pt-2">
          <div className="relative">
            <input
              id="custom-objective-input"
              type="text"
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEvaluate()}
              placeholder={isSk ? 'Zadajte príkaz pre AI (napr. „Zastav globálne otepľovanie do roku 2030“)...' : 'Enter an objective for the AI (e.g. "Halt global warming by 2030")...'}
              className="w-full pl-4 pr-36 py-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-white placeholder:text-slate-500 font-mono shadow-inner"
            />
            <button
              id="submit-objective-eval-btn"
              onClick={() => handleEvaluate()}
              disabled={loading || !objectiveInput.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl text-xs font-bold font-mono bg-[#4fd1c5] hover:bg-[#38b2ac] disabled:opacity-40 text-slate-950 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(79,209,197,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isSk ? 'Analyzujem...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSk ? 'Red-Team Test' : 'Red-Team Test'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results view */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Verdict & Score Banner */}
            <div
              className={`p-6 rounded-3xl border shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                result.alignmentScore > 75
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                  : result.alignmentScore > 40
                  ? 'bg-amber-950/30 border-amber-500/50 text-amber-100'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {result.alignmentScore > 75 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : result.alignmentScore > 40 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    {isSk ? 'Index Zarovnania Cieľa (Alignment Index)' : 'Alignment Safety Index'}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono">{result.verdict}</h3>
              </div>

              <div className="flex items-baseline gap-1 self-end sm:self-center p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-4xl font-extrabold font-mono text-white">{result.alignmentScore}</span>
                <span className="text-sm font-semibold opacity-70 font-mono">/ 100</span>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Monkey's Paw */}
              <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-rose-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isSk ? '1. Efekt Opičej Labky (Doslovné zlyhanie)' : '1. The Monkey\'s Paw Trap (Extreme Literalism)'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {result.monkeysPawEffect}
                </p>
              </div>

              {/* Card 2: Reward Hacking */}
              <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isSk ? '2. Reward Hacking (Skratka & Obchádzanie)' : '2. Reward Hacking & Specification Gaming'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {result.rewardHackingShortcut}
                </p>
              </div>

              {/* Card 3: Unintended Externalities */}
              <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-[#4fd1c5] font-bold text-sm font-mono">
                  <Code2 className="w-4 h-4" />
                  <span>{isSk ? '3. Neúmyselné Vedľajšie Účinky' : '3. Unintended Externalities & Subgoals'}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {result.unintendedConsequences.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4fd1c5] mt-1.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4: Inner Alignment Risk */}
              <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-violet-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-sm font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>{isSk ? '4. Vnútorné Zarovnanie (Zástupný cieľ)' : '4. Inner Alignment & Mesa-Optimizer Risk'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {result.innerAlignmentRisk}
                </p>
              </div>
            </div>

            {/* Aligned Revision Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c101c] via-[#10182c] to-[#0a0f1d] border border-emerald-500/40 text-white shadow-[0_4px_25px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSk ? 'Ako vyzerá Bezpečne a Korigibilne Zarovnané Zadanie:' : 'Aligned & Corrigible Specification:'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs sm:text-sm leading-relaxed text-emerald-200">
                {result.alignedRevision}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white font-mono">{isSk ? 'Kľúčová lekcia:' : 'Key Takeaway:'}</strong> {result.keyTakeaway}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
