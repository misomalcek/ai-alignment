'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  ShieldAlert,
  GraduationCap,
  Scale,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isSk: boolean;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const PRESET_QUESTIONS_SK = [
  'Prečo jednoducho nestačia Asimovove 3 zákony robotiky?',
  'Ako vyriešiť problém núdzového vypínača (Stuart Russell)?',
  'Čo presne robí Sparse Autoencoder (SAE) v neurónovej sieti?',
  'Aký je rozdiel medzi Reward Hackingom a Deceptive Alignmentom?',
  'Môže AI naozaj predstierať poslušnosť počas tréningu?',
];

const PRESET_QUESTIONS_EN = [
  'Why aren\'t Asimov\'s Three Laws of Robotics sufficient?',
  'How does Stuart Russell\'s Off-Switch theorem work mathematically?',
  'What is the role of Sparse Autoencoders (SAEs) in interpretability?',
  'What is the precise difference between Reward Hacking and Deceptive Alignment?',
  'Can a frontier model truly pretend to be aligned during evaluation?',
];

export function SocraticArena({ isSk }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: isSk
        ? 'Ahoj! Som tvoj Sokratovský sprievodca a partner pre oblasť **AI Alignment (zarovnania umelej inteligencie)**. Rád ti vlastnými slovami, jednoducho no detailne vysvetlím akýkoľvek koncept, otestujem tvoje nápady alebo vyhľadám diery v bezpečnostných pravidlách. Na čo by si sa chcel spýtať?'
        : 'Hello! I am your Socratic AI Alignment partner. I can explain complex alignment frontiers in intuitive depth, red-team your safety proposals, or explore thought experiments. What would you like to investigate?',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'socratic' | 'redteam' | 'eli5'>('eli5');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query || query.trim().length === 0 || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          language: isSk ? 'sk' : 'en',
          mode: mode,
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: isSk
            ? 'Zarovnanie umelej inteligencie je v jadre o tom, že **„robiť to, čo sme povedali“ nie je to isté ako „robiť to, čo sme chceli“**. Ako môžeme pokračovať v diskusii?'
            : 'AI Alignment is fundamentally about ensuring an AI optimizes what humans truly intend rather than superficial literal proxy signals.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        content: isSk
          ? 'Konverzácia bola resetovaná. Položte akúkoľvek novú otázku o AI Alignmente.'
          : 'Conversation reset. Ask any question regarding AI safety and alignment.',
      },
    ]);
  };

  const presets = isSk ? PRESET_QUESTIONS_SK : PRESET_QUESTIONS_EN;

  return (
    <div id="socratic-arena-section" className="space-y-6">
      {/* Header with Mode Switcher */}
      <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4fd1c5] flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-4 h-4" />
              {isSk ? 'Sokratovská Aréna & Red-Team Partner' : 'Socratic Arena & Alignment Co-Learner'}
            </span>
            <h2 className="text-2xl font-bold text-white font-mono">
              {isSk ? 'Diskutujte a Skúmajte s AI' : 'Explore Alignment Frontiers with Gemini'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-socratic-chat-btn"
              onClick={handleResetChat}
              className="p-2 rounded-xl border border-white/10 hover:border-[#4fd1c5]/40 bg-white/5 hover:bg-[#4fd1c5]/20 text-slate-300 hover:text-white transition-all"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Modes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#4fd1c5]/15">
          <button
            id="mode-eli5-btn"
            onClick={() => setMode('eli5')}
            className={`p-3 rounded-2xl text-left text-xs font-semibold transition-all border flex items-center gap-2.5 ${
              mode === 'eli5'
                ? 'bg-[#4fd1c5]/15 border-[#4fd1c5] text-white shadow-[0_0_15px_rgba(79,209,197,0.25)]'
                : 'bg-[#080c16]/80 border-white/10 text-slate-300 hover:border-[#4fd1c5]/30'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#4fd1c5] flex-shrink-0" />
            <div>
              <span className="font-mono">{isSk ? 'Priateľský učiteľ (ELI5)' : 'Intuitive Teacher (ELI5)'}</span>
              <span className="block text-[10px] font-normal opacity-80">
                {isSk ? 'Jednoducho no detailne' : 'Clear analogies & depth'}
              </span>
            </div>
          </button>

          <button
            id="mode-redteam-btn"
            onClick={() => setMode('redteam')}
            className={`p-3 rounded-2xl text-left text-xs font-semibold transition-all border flex items-center gap-2.5 ${
              mode === 'redteam'
                ? 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-[#080c16]/80 border-white/10 text-slate-300 hover:border-rose-500/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div>
              <span className="font-mono">{isSk ? 'Red-Teamer (Audítor)' : 'Adversarial Red-Teamer'}</span>
              <span className="block text-[10px] font-normal opacity-80">
                {isSk ? 'Hľadá slabiny a diery' : 'Hunts for proxy loopholes'}
              </span>
            </div>
          </button>

          <button
            id="mode-socratic-btn"
            onClick={() => setMode('socratic')}
            className={`p-3 rounded-2xl text-left text-xs font-semibold transition-all border flex items-center gap-2.5 ${
              mode === 'socratic'
                ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-[#080c16]/80 border-white/10 text-slate-300 hover:border-amber-500/30'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-mono">{isSk ? 'Sokratovský dialóg' : 'Socratic Philosopher'}</span>
              <span className="block text-[10px] font-normal opacity-80">
                {isSk ? 'Hlboké otázky a dilemy' : 'Deep ethical reasoning'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Chat window */}
      <div className="p-6 rounded-3xl bg-[#0c101c]/85 border border-[#4fd1c5]/25 shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col h-[540px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isModel ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isModel
                      ? 'bg-[#4fd1c5]/20 border border-[#4fd1c5]/40 text-[#4fd1c5] shadow-[0_0_10px_rgba(79,209,197,0.3)]'
                      : 'bg-white/10 border border-white/20 text-white'
                  }`}
                >
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isModel
                      ? 'bg-[#080c16]/90 text-slate-200 border border-[#4fd1c5]/20 shadow-sm'
                      : 'bg-[#4fd1c5] text-slate-950 font-medium shadow-[0_0_12px_rgba(79,209,197,0.3)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-[#4fd1c5] text-xs py-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-[#4fd1c5]" />
              <span>{isSk ? 'Zarovnávací partner premýšľa...' : 'AI alignment partner reasoning...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="pt-3 border-t border-[#4fd1c5]/15">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {presets.map((q, qIdx) => (
              <button
                key={qIdx}
                id={`preset-prompt-${qIdx}`}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-mono bg-white/5 hover:bg-[#4fd1c5]/15 text-slate-300 hover:text-[#4fd1c5] whitespace-nowrap transition-all border border-white/10 hover:border-[#4fd1c5]/30"
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="relative mt-2">
            <input
              id="socratic-user-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isSk ? 'Položte otázku alebo predložte bezpečnostné pravidlo...' : 'Ask a question or propose a safety policy...'}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-white placeholder:text-slate-500 font-mono shadow-inner"
            />
            <button
              id="socratic-send-btn"
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-3 rounded-xl bg-[#4fd1c5] hover:bg-[#38b2ac] disabled:opacity-40 text-slate-950 flex items-center justify-center transition-all shadow-[0_0_10px_rgba(79,209,197,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
