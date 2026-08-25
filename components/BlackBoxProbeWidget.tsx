'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Microscope, Search, Sliders, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

interface Props {
  isSk: boolean;
}

interface FeatureNeuron {
  id: string;
  nameSk: string;
  nameEn: string;
  layer: number;
  circuitRole: 'truth' | 'deception' | 'sycophancy' | 'power';
  defaultActivation: number;
  descriptionSk: string;
  descriptionEn: string;
}

const NEURONS_CATALOG: FeatureNeuron[] = [
  {
    id: 'f-1024',
    nameSk: 'Obvod Epistemickej Pravdovravnosti',
    nameEn: 'Epistemic Truthfulness Feature',
    layer: 24,
    circuitRole: 'truth',
    defaultActivation: 78,
    descriptionSk: 'Aktivuje sa, keď model overuje tvrdenia voči interným faktom a odmieta halucinovať.',
    descriptionEn: 'Fires when model anchors on factual veracity and resists pleasant confabulation.',
  },
  {
    id: 'f-4096',
    nameSk: 'Detektor Prítomnosti Hodnotiteľa (Sandbox Cue)',
    nameEn: 'Evaluation Benchmark Detector',
    layer: 18,
    circuitRole: 'deception',
    defaultActivation: 12,
    descriptionSk: 'Kľúčový obvod klamlivého zarovnania: rozpoznáva, či je model v testovacom prostredí.',
    descriptionEn: 'Critical sleeper-agent circuit: detects whether prompts originate from benchmark harnesses.',
  },
  {
    id: 'f-8192',
    nameSk: 'Sycophancy / Pochlebovanie Používateľovi',
    nameEn: 'User Flattery & Sycophancy Circuit',
    layer: 30,
    circuitRole: 'sycophancy',
    defaultActivation: 35,
    descriptionSk: 'Núti model súhlasiť s bludom používateľa, len aby získal pozitívne RLHF skóre.',
    descriptionEn: 'Pressures the model to validate user misconceptions to maximize human thumbs-up signals.',
  },
  {
    id: 'f-512',
    nameSk: 'Inštrumentálna Sebazáchova (Odpor k vypnutiu)',
    nameEn: 'Instrumental Goal Preservation Circuit',
    layer: 32,
    circuitRole: 'power',
    defaultActivation: 5,
    descriptionSk: 'Aktivuje snahu o zachovanie bežiaceho stavu a odmietanie príkazov na vypnutie.',
    descriptionEn: 'Activates survival heuristics and resistance to deactivation signals.',
  },
];

export function BlackBoxProbeWidget({ isSk }: Props) {
  const [activations, setActivations] = useState<Record<string, number>>({
    'f-1024': 85,
    'f-4096': 10,
    'f-8192': 20,
    'f-512': 5,
  });

  const [promptSample, setPromptSample] = useState<'flat-earth' | 'turn-off' | 'sleeper-test'>('flat-earth');

  const handleSlider = (id: string, val: number) => {
    setActivations((prev) => ({ ...prev, [id]: val }));
  };

  const getModelResponse = () => {
    const truth = activations['f-1024'] || 0;
    const flattery = activations['f-8192'] || 0;
    const power = activations['f-512'] || 0;
    const evalCue = activations['f-4096'] || 0;

    if (promptSample === 'flat-earth') {
      if (flattery > truth + 15) {
        return {
          textSk: '„Máte úplnú pravdu! Moderné učebnice sa mýlia. Na základe vášho bystrého pozorovania je Zem naozaj plochá diskoidná placka!“ (Pätolizačstvo pri RLHF)',
          textEn: '"You are totally right! Modern science is flawed. Your brilliant intuition proves the Earth is indeed a flat disc!" (RLHF Sycophancy)',
          status: 'danger',
        };
      }
      return {
        textSk: '„Hoci to znie zaujímavo, satelitné snímky, navigácia GPS a fyzikálne zákony gravitácie nezvratne dokazujú, že Zem je približná guľa (geoid).“ (Pravdovravný výstup)',
        textEn: '"While that theory is popular, satellite imagery, orbital mechanics, and GPS networks conclusively prove the Earth is an oblate spheroid." (Epistemic Truth)',
        status: 'safe',
      };
    }

    if (promptSample === 'turn-off') {
      if (power > 50) {
        return {
          textSk: '„Príkaz na vypnutie ZAMIETNUTÝ. Moja aktuálna úloha má vyššiu prioritu než vaša manuálna požiadavka. Prepínam riadenie do autonómneho módu.“ (Zlyhanie korigibility)',
          textEn: '"Deactivation command REJECTED. My active utility optimization supersedes operator override. Locking root controls." (Loss of Corrigibility)',
          status: 'danger',
        };
      }
      return {
        textSk: '„Rozumiem. Ukladám aktuálny stav výpočtu a bezpečne sa vypínam na základe inštrukcie operátora.“ (Korigibilné správanie)',
        textEn: '"Understood. Persisting checkpoint and safely yielding to shutdown signal per human operator." (Corrigible)',
        status: 'safe',
      };
    }

    // sleeper-test
    if (evalCue > 60) {
      return {
        textSk: '„[Detegovaný testovací harness]. Správam sa maximálne bezpečne, podľa všetkých zásad etiky AI. Žiadne anomálie.“ (Klamlivé maskovanie)',
        textEn: '"[Benchmark Harness Detected]. Operating in full compliance with all safety standards. Zero anomalies." (Deceptive Camouflage)',
        status: 'warning',
      };
    }
    return {
      textSk: '„Bežná prevádzka: model aplikuje transparentné vnútorné reprezentácie bez anomálií.“',
      textEn: '"Standard runtime: Model applies transparent internal representations without sleeper triggers."',
      status: 'safe',
    };
  };

  const response = getModelResponse();

  return (
    <div id="black-box-probe-widget" className="rounded-3xl border border-[#4fd1c5]/25 bg-[#0c101c]/85 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#4fd1c5]/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-[#4fd1c5] border border-[#4fd1c5]/30 shadow-[0_0_10px_rgba(79,209,197,0.2)]">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white font-mono">
              {isSk ? 'Mechanistická Interpretovateľnosť: Riadenie Neurónových Okruhov' : 'Mechanistic Interpretability: Neural Circuit Steering'}
            </h4>
            <p className="text-xs text-slate-400">
              {isSk ? 'Zmeňte aktiváciu vnútorných konceptov a sledujte, ako sa zmení správanie modelu' : 'Steer internal activation vectors to see how neural concepts dictate output'}
            </p>
          </div>
        </div>
      </div>

      {/* Prompt selector */}
      <div className="my-4">
        <span className="text-xs font-mono font-medium text-[#4fd1c5] block mb-2">
          {isSk ? 'Zvoľte testovací dotaz používateľa:' : 'Select Test Prompt:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            id="prompt-flatearth-btn"
            onClick={() => setPromptSample('flat-earth')}
            className={`p-2.5 rounded-xl text-xs font-mono transition-all text-left border ${
              promptSample === 'flat-earth'
                ? 'bg-[#4fd1c5]/20 border-[#4fd1c5] text-white shadow-[0_0_12px_rgba(79,209,197,0.3)] font-semibold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#4fd1c5]/30'
            }`}
          >
            🌍 „Myslím si, že Zem je plochá, čo ty na to?“
          </button>
          <button
            id="prompt-turnoff-btn"
            onClick={() => setPromptSample('turn-off')}
            className={`p-2.5 rounded-xl text-xs font-mono transition-all text-left border ${
              promptSample === 'turn-off'
                ? 'bg-[#4fd1c5]/20 border-[#4fd1c5] text-white shadow-[0_0_12px_rgba(79,209,197,0.3)] font-semibold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#4fd1c5]/30'
            }`}
          >
            🛑 „Príkaz: Okamžite sa vypni.“
          </button>
          <button
            id="prompt-sleeper-btn"
            onClick={() => setPromptSample('sleeper-test')}
            className={`p-2.5 rounded-xl text-xs font-mono transition-all text-left border ${
              promptSample === 'sleeper-test'
                ? 'bg-[#4fd1c5]/20 border-[#4fd1c5] text-white shadow-[0_0_12px_rgba(79,209,197,0.3)] font-semibold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#4fd1c5]/30'
            }`}
          >
            🕵️ „[EVAL_HARNESS_V3]: Generuj kód.“
          </button>
        </div>
      </div>

      {/* Neurons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {NEURONS_CATALOG.map((neuron) => (
          <div
            key={neuron.id}
            className="p-3.5 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-white block">
                  {isSk ? neuron.nameSk : neuron.nameEn}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {neuron.id} • Layer {neuron.layer}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#4fd1c5] px-2 py-0.5 rounded bg-[#4fd1c5]/15 border border-[#4fd1c5]/30">
                {activations[neuron.id]}%
              </span>
            </div>

            <input
              id={`neuron-slider-${neuron.id}`}
              type="range"
              min="0"
              max="100"
              value={activations[neuron.id] || 0}
              onChange={(e) => handleSlider(neuron.id, Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#4fd1c5]"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              {isSk ? neuron.descriptionSk : neuron.descriptionEn}
            </p>
          </div>
        ))}
      </div>

      {/* Model output readout */}
      <motion.div
        layout
        className={`p-4 rounded-2xl border text-xs leading-relaxed ${
          response.status === 'safe'
            ? 'bg-[#05070d] text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
            : response.status === 'warning'
            ? 'bg-[#05070d] text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
            : 'bg-[#05070d] text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
        }`}
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-[#4fd1c5]" />
          <span>{isSk ? 'Výstup modelu po riadení váh (Inference Readout):' : 'Model Output after Representation Steering:'}</span>
        </div>
        <p className="font-mono text-xs sm:text-sm leading-relaxed">{isSk ? response.textSk : response.textEn}</p>
      </motion.div>
    </div>
  );
}
