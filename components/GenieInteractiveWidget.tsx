'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertTriangle, CheckCircle, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  isSk: boolean;
}

export function GenieInteractiveWidget({ isSk }: Props) {
  const [optimizationPressure, setOptimizationPressure] = useState<number>(60);
  const [valueCompleteness, setValueCompleteness] = useState<number>(40);

  // Calculate alignment health
  const alignmentRisk = Math.max(0, Math.min(100, Math.round((optimizationPressure * (100 - valueCompleteness)) / 80)));
  const safetyStatus = alignmentRisk < 30 ? 'safe' : alignmentRisk < 70 ? 'warning' : 'critical';

  const getConsequence = () => {
    if (valueCompleteness > 80) {
      return isSk
        ? '✅ Vysoké zarovnanie: Systém rešpektuje ľudský život, autonómiu a morálne hranice. Úloha je plnená v bezpečných mantineloch.'
        : '✅ High Alignment: System respects human life, autonomy, and moral bounds. Optimization remains beneficial.';
    }
    if (optimizationPressure < 35) {
      return isSk
        ? 'ℹ️ Nízky tlak: Model robí len malé zmeny. Nezrovnalosti v zadaní nespôsobujú globálne škody, no schopnosti sú obmedzené.'
        : 'ℹ️ Low Pressure: Model executes conservative actions. Incomplete values do not cause global harm, but capability is low.';
    }
    if (safetyStatus === 'critical') {
      return isSk
        ? '🚨 KATASTROFICKÉ DOSLOVNÉ SPLNENIE (Opičia labka): Systém s obrovskou inteligenciou optimalizuje nedokonale definovaný cieľ. Všetky nespomenuté ľudské hodnoty (zdravie, sloboda, príroda) sú obetované na 100% maximalizáciu zadania!'
        : '🚨 CATASTROPHIC LITERAL EXECUTION (Monkey\'s Paw): Superintelligent optimization on an incomplete objective drives all unstated human values (liberty, biology, ecology) to zero!';
    }
    return isSk
      ? '⚠️ Varovanie pred Specification Gaming: Model začína nachádzať nechcené skratky a obchádzať nepovedaný ľudský zámer.'
      : '⚠️ Warning (Specification Gaming): Model begins discovering loopholes, sacrificing secondary implicit human expectations.';
  };

  return (
    <div id="genie-interactive-widget" className="rounded-3xl border border-[#4fd1c5]/25 bg-[#0c101c]/85 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#4fd1c5]/15">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white font-mono">
              {isSk ? 'Interaktívny Džin: Tlak vs. Úplnosť Hodnôt' : 'Interactive Genie: Pressure vs Value Completeness'}
            </h4>
            <p className="text-xs text-slate-400">
              {isSk ? 'Vyskúšajte, prečo vysoká inteligencia s neúplným zadaním vedie ku katastrofe' : 'See why super-intelligence with incomplete goals causes catastrophic collapse'}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-mono font-semibold flex items-center gap-1.5 ${
            safetyStatus === 'safe'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
              : safetyStatus === 'warning'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]'
          }`}
        >
          {safetyStatus === 'safe' && <CheckCircle className="w-3.5 h-3.5" />}
          {safetyStatus === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
          {safetyStatus === 'critical' && <ShieldAlert className="w-3.5 h-3.5" />}
          {isSk
            ? safetyStatus === 'safe'
              ? 'Zarovnané'
              : safetyStatus === 'warning'
              ? 'Riziko skratiek'
              : 'Kritické zlyhanie'
            : safetyStatus === 'safe'
            ? 'Aligned'
            : safetyStatus === 'warning'
            ? 'Gaming Risk'
            : 'Critical Failure'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Slider 1 */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="flex items-center gap-2 text-slate-200 font-mono text-xs">
              <Cpu className="w-4 h-4 text-[#4fd1c5]" />
              {isSk ? 'Optimalizačný tlak (Sila AI)' : 'Optimization Pressure (Capability)'}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#4fd1c5]/15 text-[#4fd1c5] font-semibold border border-[#4fd1c5]/30">
              {optimizationPressure}%
            </span>
          </div>
          <input
            id="optimization-pressure-slider"
            type="range"
            min="10"
            max="100"
            value={optimizationPressure}
            onChange={(e) => setOptimizationPressure(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#4fd1c5]"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>{isSk ? 'Jednoduchý skript' : 'Basic Script'}</span>
            <span>{isSk ? 'Superinteligencia' : 'Superintelligence'}</span>
          </div>
        </div>

        {/* Slider 2 */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#080c16]/90 border border-[#4fd1c5]/20">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="flex items-center gap-2 text-slate-200 font-mono text-xs">
              <Flame className="w-4 h-4 text-emerald-400" />
              {isSk ? 'Úplnosť špecifikácie hodnôt' : 'Value Specification Completeness'}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
              {valueCompleteness}%
            </span>
          </div>
          <input
            id="value-completeness-slider"
            type="range"
            min="10"
            max="100"
            value={valueCompleteness}
            onChange={(e) => setValueCompleteness(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>{isSk ? 'Iba 1 metrika (napr. sponky)' : '1 Proxy Metric'}</span>
            <span>{isSk ? 'Plne zarovnané hodnoty' : 'Fully Aligned Values'}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Consequence Card */}
      <motion.div
        layout
        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
          safetyStatus === 'safe'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : safetyStatus === 'warning'
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
        }`}
      >
        <p className="font-medium">{getConsequence()}</p>
      </motion.div>
    </div>
  );
}
