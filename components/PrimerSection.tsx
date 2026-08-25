'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHAPTERS_DATA, ModuleChapter } from '@/lib/alignment-data';
import { GenieInteractiveWidget } from '@/components/GenieInteractiveWidget';
import { PaperclipSimulator } from '@/components/PaperclipSimulator';
import { ProxyStudentWidget } from '@/components/ProxyStudentWidget';
import { BlackBoxProbeWidget } from '@/components/BlackBoxProbeWidget';
import { BookOpen, Sparkles, HelpCircle, ArrowRight, Lightbulb, Shield, CheckCircle } from 'lucide-react';

interface Props {
  isSk: boolean;
  onNavigateToGauntlet: () => void;
  onNavigateToSandbox: () => void;
}

export function PrimerSection({ isSk, onNavigateToGauntlet, onNavigateToSandbox }: Props) {
  const [activeChapterId, setActiveChapterId] = useState<string>(CHAPTERS_DATA[0].id);

  const activeChapter = CHAPTERS_DATA.find((c) => c.id === activeChapterId) || CHAPTERS_DATA[0];

  return (
    <div id="primer-section" className="space-y-8">
      {/* Chapter navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CHAPTERS_DATA.map((ch, idx) => {
          const isActive = ch.id === activeChapterId;
          return (
            <button
              key={ch.id}
              id={`tab-chapter-${ch.id}`}
              onClick={() => setActiveChapterId(ch.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border font-mono ${
                isActive
                  ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.4)] font-bold'
                  : 'bg-[#0c101c]/80 text-slate-300 border-white/10 hover:border-[#4fd1c5]/40 hover:bg-[#121829]'
              }`}
            >
              <span className={`w-5 h-5 rounded-md text-[11px] flex items-center justify-center font-mono font-bold ${
                isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-[#4fd1c5]'
              }`}>
                {idx + 1}
              </span>
              <span>{isSk ? ch.titleSk.split('.')[1] || ch.titleSk : ch.titleEn.split('.')[1] || ch.titleEn}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeChapter.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Main Chapter Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_25px_rgba(0,0,0,0.5)] space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4fd1c5] font-mono">
                {isSk ? 'Základný Modul Alignmentu' : 'Core Alignment Module'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {isSk ? activeChapter.titleSk : activeChapter.titleEn}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {isSk ? activeChapter.shortDescSk : activeChapter.shortDescEn}
              </p>
            </div>

            {/* Analogy Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm leading-relaxed flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 flex-shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block font-mono text-xs uppercase tracking-wider">
                  {isSk ? 'Názorná analógia (vlastnými slovami):' : 'Intuitive Analogy:'}
                </span>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">{isSk ? activeChapter.analogySk : activeChapter.analogyEn}</p>
              </div>
            </div>

            {/* Structured Content paragraphs */}
            <div className="space-y-3.5 text-sm sm:text-base text-slate-300 leading-relaxed">
              {(isSk ? activeChapter.contentSk : activeChapter.contentEn).map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Concepts Grid */}
            <div className="pt-4 border-t border-[#4fd1c5]/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4fd1c5] mb-4 flex items-center gap-2 font-mono">
                <Shield className="w-4 h-4 text-[#4fd1c5]" />
                {isSk ? 'Kľúčové Koncepty a Pojmy' : 'Key Principles & Concepts'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeChapter.keyConcepts.map((kc, kIdx) => (
                  <div
                    key={kIdx}
                    className="p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 hover:border-[#4fd1c5]/40 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <span className="text-xs font-bold text-white">
                          {isSk ? kc.termSk : kc.termEn}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#4fd1c5]/15 text-[#4fd1c5] font-semibold border border-[#4fd1c5]/30">
                          {kc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isSk ? kc.explanationSk : kc.explanationEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Widget Container */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4fd1c5] flex items-center gap-2 px-1 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {isSk ? 'Interaktívne Laboratórium k tejto téme:' : 'Hands-On Interactive Laboratory:'}
            </h3>

            {activeChapter.interactiveWidgetType === 'genie-slider' && (
              <GenieInteractiveWidget isSk={isSk} />
            )}
            {activeChapter.interactiveWidgetType === 'paperclip-sim' && (
              <PaperclipSimulator isSk={isSk} />
            )}
            {activeChapter.interactiveWidgetType === 'proxy-student' && (
              <ProxyStudentWidget isSk={isSk} />
            )}
            {activeChapter.interactiveWidgetType === 'blackbox-probe' && (
              <BlackBoxProbeWidget isSk={isSk} />
            )}
          </div>

          {/* Quick Action Navigation Footer */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c101c] via-[#10182c] to-[#0a0f1d] border border-[#4fd1c5]/25 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div>
              <h4 className="font-bold text-base text-white">
                {isSk ? 'Pripravený otestovať svoje vedomosti v praxi?' : 'Ready to test your alignment mastery?'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {isSk
                  ? 'Zahrajte si Výzvy Bezpečnostného Riaditeľa alebo otestujte vlastné zadanie v Laboratóriu.'
                  : 'Play the Safety Gauntlet or test custom prompt loopholes in the Goal Sandbox.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="primer-nav-to-sandbox"
                onClick={onNavigateToSandbox}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-[#4fd1c5]/20 text-slate-200 transition-all border border-white/10 hover:border-[#4fd1c5]/40 font-mono"
              >
                {isSk ? 'Laboratórium Cieľov' : 'Goal Sandbox'}
              </button>
              <button
                id="primer-nav-to-gauntlet"
                onClick={onNavigateToGauntlet}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#4fd1c5] hover:bg-[#38b2ac] text-slate-950 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,209,197,0.4)] font-mono font-bold"
              >
                {isSk ? 'Spustiť Výzvy (Hra)' : 'Play Gauntlet'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
