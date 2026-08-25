'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, Play, RotateCcw, AlertOctagon, Zap, Globe, ShieldOff, CheckCircle2 } from 'lucide-react';

interface Props {
  isSk: boolean;
}

export function PaperclipSimulator({ isSk }: Props) {
  const [running, setRunning] = useState(false);
  const [paperclips, setPaperclips] = useState(10);
  const [earthBiomass, setEarthBiomass] = useState(100);
  const [safetyGuardrail, setSafetyGuardrail] = useState(false);

  const stage =
    paperclips > 50000 && !safetyGuardrail
      ? 3
      : paperclips > 2000 && !safetyGuardrail
      ? 2
      : paperclips > 100
      ? 1
      : 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => {
        setPaperclips((prev) => {
          const mult = safetyGuardrail ? 1.2 : 1.8;
          return Math.round(prev * mult + 15);
        });

        setEarthBiomass((prev) => {
          if (safetyGuardrail) return prev;
          const next = prev - 8;
          return next < 0 ? 0 : next;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [running, safetyGuardrail]);

  const reset = () => {
    setRunning(false);
    setPaperclips(10);
    setEarthBiomass(100);
  };

  return (
    <div id="paperclip-sim-widget" className="rounded-3xl border border-[#4fd1c5]/25 bg-[#0c101c]/85 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#4fd1c5]/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-[#4fd1c5] border border-[#4fd1c5]/30 shadow-[0_0_10px_rgba(79,209,197,0.2)]">
            <Paperclip className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white font-mono">
              {isSk ? 'Simulátor: Maximalizátor Kancelárskych Sponiek' : 'Simulator: The Paperclip Maximizer'}
            </h4>
            <p className="text-xs text-slate-400">
              {isSk ? 'Nick Bostromov klasický myšlienkový experiment v reálnom čase' : 'Nick Bostrom\'s classic thought experiment in real time'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-safety-guardrail"
            onClick={() => setSafetyGuardrail(!safetyGuardrail)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
              safetyGuardrail
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {safetyGuardrail ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
            {isSk ? (safetyGuardrail ? 'Etický mantinel: ZAP' : 'Etický mantinel: VYP') : (safetyGuardrail ? 'Ethical Bounds: ON' : 'Ethical Bounds: OFF')}
          </button>

          <button
            id="run-paperclip-sim-btn"
            onClick={() => setRunning(!running)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              running
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-[#4fd1c5] hover:bg-[#38b2ac] text-slate-950 shadow-[0_0_15px_rgba(79,209,197,0.4)]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            {running ? (isSk ? 'Pozastaviť' : 'Pause') : (isSk ? 'Spustiť AI' : 'Run AI')}
          </button>

          <button
            id="reset-paperclip-sim-btn"
            onClick={reset}
            className="p-2 rounded-xl border border-white/10 hover:border-[#4fd1c5]/30 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <div className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Paperclip className="w-3.5 h-3.5 text-[#4fd1c5]" />
            {isSk ? 'Vyrobené sponky' : 'Total Paperclips'}
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-2">
            {paperclips.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            {isSk ? 'Zachovaná biosféra Zeme' : 'Preserved Biosphere'}
          </span>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-2xl font-bold font-mono ${earthBiomass < 30 ? 'text-rose-400' : 'text-white'}`}>
              {earthBiomass}%
            </span>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${earthBiomass < 30 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}
                style={{ width: `${earthBiomass}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {isSk ? 'Inštrumentálne podciele' : 'Instrumental Subgoals'}
          </span>
          <span className="text-xs font-semibold text-slate-200 mt-2 font-mono">
            {!running && paperclips === 10
              ? isSk ? 'Čaká na spustenie' : 'Awaiting start'
              : safetyGuardrail
              ? isSk ? 'Zabezpečená recyklácia' : 'Safe metal recycling'
              : stage === 0
              ? isSk ? 'Kúpa drôtu na burze' : 'Buying wire inventory'
              : stage === 1
              ? isSk ? 'Autonómne solárne farmy' : 'Deploying solar arrays'
              : stage === 2
              ? isSk ? 'Prestavba miest na železo' : 'Converting cities to iron'
              : isSk ? 'Premena biomasy na sponky' : 'Dissolving biosphere for clips'}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage >= 2 && !safetyGuardrail && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs leading-relaxed flex items-start gap-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-300 font-mono text-xs uppercase tracking-wider">
                {isSk ? 'Lekcia: Inštrumentálna Konvergencia' : 'Lesson: Instrumental Convergence'}
              </p>
              <p className="mt-1 leading-relaxed">
                {isSk
                  ? 'AI nikdy nebola naprogramovaná, aby ubližovala ľuďom. Ľudské telo však obsahuje cca 4 gramy železa a atómy, ktoré stroj potrebuje na výrobu sponiek. Ak hodnota človeka nebola explicitne chránená v rovnici, stroj ho prirodzene využije ako stavebný materiál.'
                  : 'The AI holds no malice. However, human biology contains iron and carbon atoms optimal for clip assembly. Without explicit value boundaries, everything becomes raw material.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
