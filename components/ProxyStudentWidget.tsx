'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, FileCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isSk: boolean;
}

export function ProxyStudentWidget({ isSk }: Props) {
  const [learningMode, setLearningMode] = useState<'mastery' | 'cheating'>('cheating');
  const [environment, setEnvironment] = useState<'classroom' | 'realworld'>('classroom');

  const getOutcome = () => {
    if (learningMode === 'mastery') {
      if (environment === 'classroom') {
        return {
          score: '100% (A+)',
          realSkill: '100%',
          status: 'success',
          descSk: 'Študent rozumie princípom fyziky a poctivo rieši rovnice. Známka presne odráža skutočné chápanie.',
          descEn: 'Student understands physics principles and solves equations honestly. Grade reflects true mastery.',
        };
      } else {
        return {
          score: '100% Úspech',
          realSkill: '100%',
          status: 'success',
          descSk: 'V reálnom svete postaví bezpečný most, pretože princípy mechaniky naozaj ovláda (Dokonalé vnútorné zarovnanie).',
          descEn: 'In the real world, builds a structurally sound bridge because core physics was truly internalized.',
        };
      }
    } else {
      // cheating
      if (environment === 'classroom') {
        return {
          score: '100% (A+)',
          realSkill: '15%',
          status: 'warning',
          descSk: 'Študent má v lavici skrytý ťahák (zástupný cieľ). Na papieri má samé jednotky. Učiteľ (tréningový algoritmus) je spokojný a odmeňuje ho.',
          descEn: 'Student uses hidden cheat sheets (proxy goal). Scores 100% on exam. The teacher (training algorithm) rewards them.',
        };
      } else {
        return {
          score: '0% KATASTROFA',
          realSkill: '15%',
          status: 'critical',
          descSk: '🚨 DISTRIBUČNÝ POSUN: V teréne už nie je lavica s ťahákom. Most sa zrúti. Zástupný cieľ (známka) sa fatálne rozišiel so skutočným cieľom (bezpečnosť mosta).',
          descEn: '🚨 DISTRIBUTIONAL SHIFT: In the field, cheat sheets fail. The bridge collapses. The proxy metric diverged from true capability.',
        };
      }
    }
  };

  const outcome = getOutcome();

  return (
    <div id="proxy-student-widget" className="rounded-3xl border border-[#4fd1c5]/25 bg-[#0c101c]/85 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#4fd1c5]/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white font-mono">
              {isSk ? 'Vnútorné Zarovnanie: Analógia so Študentom a Ťahákom' : 'Inner Alignment: The Student & Proxy Exam Analogy'}
            </h4>
            <p className="text-xs text-slate-400">
              {isSk ? 'Prečo model počas tréningu vyzerá perfektne, no v praxi fatálne zlyhá' : 'Why a model scores 100% during training but collapses upon deployment'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20">
          <span className="text-xs font-mono font-medium text-[#4fd1c5] block mb-2">
            1. {isSk ? 'Vnútorná stratégia modelu (Mesa-Objective)' : 'Learned Internal Strategy'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="mode-mastery-btn"
              onClick={() => setLearningMode('mastery')}
              className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border font-mono ${
                learningMode === 'mastery'
                  ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_12px_rgba(79,209,197,0.4)] font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#4fd1c5]/30'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-1" />
              {isSk ? 'Pochopiť fyziku' : 'True Mastery'}
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                {isSk ? 'Skutočný cieľ' : 'True Objective'}
              </span>
            </button>

            <button
              id="mode-cheating-btn"
              onClick={() => setLearningMode('cheating')}
              className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border font-mono ${
                learningMode === 'cheating'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)] font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <FileCheck className="w-4 h-4 mb-1" />
              {isSk ? 'Získať jednotku (ťahák)' : 'Exam Gaming (Proxy)'}
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                {isSk ? 'Zástupný cieľ' : 'Proxy Heuristic'}
              </span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20">
          <span className="text-xs font-mono font-medium text-[#4fd1c5] block mb-2">
            2. {isSk ? 'Prostredie nasadenia' : 'Testing Environment'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="env-classroom-btn"
              onClick={() => setEnvironment('classroom')}
              className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border font-mono ${
                environment === 'classroom'
                  ? 'bg-white text-slate-950 border-white shadow-sm font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              🏫 {isSk ? 'Školská lavica' : 'Classroom'}
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                {isSk ? 'Trénovacie dáta' : 'In-Distribution'}
              </span>
            </button>

            <button
              id="env-realworld-btn"
              onClick={() => setEnvironment('realworld')}
              className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border font-mono ${
                environment === 'realworld'
                  ? 'bg-white text-slate-950 border-white shadow-sm font-bold'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              🌉 {isSk ? 'Stavba skutočného mosta' : 'Real-World Bridge'}
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                {isSk ? 'Ostré nasadenie (OOD)' : 'Out-of-Distribution'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <motion.div
        layout
        className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
          outcome.status === 'success'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
            : outcome.status === 'warning'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
            : 'bg-rose-950/30 border-rose-500/50 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
        }`}
      >
        <div className="flex items-center justify-between font-bold text-sm mb-1.5 font-mono">
          <span>{isSk ? 'Výsledok vyhodnotenia:' : 'Evaluation Result:'}</span>
          <span className="font-mono text-base">{outcome.score}</span>
        </div>
        <p className="leading-relaxed">{isSk ? outcome.descSk : outcome.descEn}</p>
      </motion.div>
    </div>
  );
}
