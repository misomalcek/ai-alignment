'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LEXICON_DATA, LexiconEntry } from '@/lib/alignment-data';
import { BookOpen, Search, X, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isSk: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function LexiconModal({ isSk, isOpen, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Všetko');

  if (!isOpen) return null;

  const tags = ['Všetko', 'Základ', 'Vonkajšie', 'Vnútorné', 'Riešenia', 'Teória'];

  const filteredEntries = LEXICON_DATA.filter((entry) => {
    const matchesTag = selectedTag === 'Všetko' || entry.tag === selectedTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      entry.termSk.toLowerCase().includes(q) ||
      entry.termEn.toLowerCase().includes(q) ||
      entry.definitionSk.toLowerCase().includes(q) ||
      entry.definitionEn.toLowerCase().includes(q) ||
      entry.analogySk.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070d]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#0c101c] border border-[#4fd1c5]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#4fd1c5]/20 flex items-center justify-between bg-[#080c16]/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#4fd1c5]/15 text-[#4fd1c5] border border-[#4fd1c5]/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono">
                  {isSk ? 'Slovník & Knižnica Pojmov AI Alignment' : 'AI Alignment Lexicon & Field Glossary'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isSk ? 'Základné koncepty, analógie a kľúčové princípy moderného výskumu' : 'Essential concepts, analogies, and research breakthroughs'}
                </p>
              </div>
            </div>

            <button
              id="close-lexicon-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & filter toolbar */}
          <div className="p-6 pb-4 border-b border-[#4fd1c5]/15 space-y-4 bg-[#080c16]/50">
            <div className="relative">
              <Search className="w-4 h-4 text-[#4fd1c5] absolute left-3.5 top-3.5" />
              <input
                id="lexicon-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSk ? 'Hľadať pojem (napr. Goodhart, Mesa-optimizer, Korigibilita)...' : 'Search term (e.g. Goodhart, Corrigibility, Interpretability)...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#080c16] border border-[#4fd1c5]/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-white placeholder:text-slate-500 font-mono shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {tags.map((tag) => (
                <button
                  key={tag}
                  id={`tag-filter-${tag}`}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all border ${
                    selectedTag === tag
                      ? 'bg-[#4fd1c5] text-slate-950 border-[#4fd1c5] shadow-[0_0_12px_rgba(79,209,197,0.4)]'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#4fd1c5]/30 hover:bg-[#4fd1c5]/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Entries list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-[#080c16]/30">
            {filteredEntries.map((entry) => (
              <div
                key={entry.slug}
                className="p-5 rounded-2xl bg-[#0c101c]/90 border border-[#4fd1c5]/20 space-y-3 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white font-mono">
                      {isSk ? entry.termSk : entry.termEn}
                    </h4>
                    <span className="text-xs text-[#4fd1c5]/80 font-mono">
                      ({isSk ? entry.termEn : entry.termSk})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#4fd1c5]/15 text-[#4fd1c5] border border-[#4fd1c5]/30 font-bold">
                    {entry.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isSk ? entry.definitionSk : entry.definitionEn}
                </p>

                {/* Analogy & Why it matters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold font-mono text-amber-300 block mb-0.5">{isSk ? 'Analógia:' : 'Analogy:'}</span>
                      <span>{isSk ? entry.analogySk : entry.analogyEn}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 text-cyan-200 text-xs leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#4fd1c5] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold font-mono text-[#4fd1c5] block mb-0.5">{isSk ? 'Prečo je to kľúčové:' : 'Why It Matters:'}</span>
                      <span>{isSk ? entry.whyItMattersSk : entry.whyItMattersEn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-mono text-sm">
                {isSk ? 'Nenašli sa žiadne pojmy vyhovujúce filtru.' : 'No lexicon entries match your search query.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
