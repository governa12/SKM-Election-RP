
import React from 'react';
import { PartyData } from '../types';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  leadingParty: PartyData | null;
  targetSeats?: number;
}

const PathToPower: React.FC<Props> = ({ leadingParty, targetSeats = 250 }) => {
  const { t } = useLanguage();
  if (!leadingParty) return null;

  const current = leadingParty.projectedSeats;
  const remaining = Math.max(0, targetSeats - current);
  const percentage = Math.min(100, (current / targetSeats) * 100);
  const isMajority = current >= targetSeats;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              {t('path_to_majority')}
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
                <AnimatedNumber value={current} />
                <span className="text-slate-700 mx-2 text-2xl md:text-3xl font-light">/</span>
                <span className="text-slate-500 text-2xl md:text-3xl">{targetSeats}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('gap_to_power')}</div>
            <div className={`text-xl font-black px-4 py-1 rounded-lg ${isMajority ? 'bg-green-600 text-white' : 'bg-slate-800 text-red-500 border border-red-500/30'}`}>
              {isMajority ? (
                t('majority_secured')
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase">{t('needs')}</span>
                  <AnimatedNumber value={remaining} />
                  <span className="text-xs font-bold uppercase">{t('seats')}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-6 bg-slate-950 rounded-full border border-slate-800 p-1 group">
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-red-600/50 z-10 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {t('magic_line')}: 250
            </div>
          </div>
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${percentage}%`, backgroundColor: leadingParty.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <img src={leadingParty.logo} className="w-4 h-4 object-contain grayscale opacity-50" alt="" />
            {leadingParty.name}
          </div>
          <div className="italic uppercase">
            {/* Fixed: changed isGovMajority to isMajority */}
            {isMajority ? 'SECURED' : 'COALITION REQUIRED'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathToPower;
