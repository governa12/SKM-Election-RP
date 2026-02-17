
import React, { useState, useMemo } from 'react';
import { PartyData } from '../types';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  parties: PartyData[];
  targetSeats?: number;
}

const CoalitionCalculator: React.FC<Props> = ({ parties, targetSeats = 251 }) => {
  const { t } = useLanguage();
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());

  const toggleParty = (name: string) => {
    const next = new Set(selectedNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedNames(next);
  };

  const totalSelectedSeats = useMemo(() => {
    return parties
      .filter(p => selectedNames.has(p.name))
      .reduce((sum, p) => sum + p.projectedSeats, 0);
  }, [parties, selectedNames]);

  const progress = Math.min(100, (totalSelectedSeats / targetSeats) * 100);
  const isMajority = totalSelectedSeats >= targetSeats;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-800/20">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t('quick_sum')}
        </h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight">{t('select_parties')}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {parties.slice(0, 12).map(party => {
            const isSelected = selectedNames.has(party.name);
            return (
              <button
                key={party.name}
                onClick={() => toggleParty(party.name)}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                  isSelected ? 'bg-slate-800 border-white/20 shadow-lg scale-105' : 'bg-slate-950 border-slate-800 opacity-60 grayscale'
                }`}
              >
                <img src={party.logo} alt="" className="w-8 h-8 object-contain mb-2" />
                <span className="text-[9px] font-black uppercase text-center truncate w-full mb-1 text-slate-300">{party.name}</span>
                <span className="text-xs font-black" style={{ color: party.color }}>{party.projectedSeats}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('selected_strength')}</div>
              <div className="text-4xl font-black text-white italic tracking-tighter">
                <AnimatedNumber value={totalSelectedSeats} />
                <span className="text-slate-700 mx-2 text-2xl">/</span>
                <span className="text-slate-500 text-2xl">{targetSeats}</span>
              </div>
            </div>
            <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isMajority ? 'bg-green-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
              {isMajority ? t('reached_250') : t('below_251')}
            </div>
          </div>

          <div className="relative h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-1">
            <div className={`h-full rounded-full transition-all duration-500 ease-out ${isMajority ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoalitionCalculator;
