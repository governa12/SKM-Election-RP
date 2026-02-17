
import React from 'react';
import { PartyData } from '../types';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  party: PartyData;
  isLeader?: boolean;
}

const PartyCard: React.FC<Props> = ({ party, isLeader }) => {
  const { t } = useLanguage();

  const getCoalitionBadge = () => {
    switch (party.coalitionGroup) {
      case 'GOV':
        return (
          <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm">
            {t('gov')}
          </span>
        );
      case 'OPP':
        return (
          <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm">
            {t('opp')}
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm">
            {t('non_aligned')}
          </span>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 group h-full ${
      isLeader ? 'bg-slate-800/40 border-slate-500 ring-1 ring-white/10' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
    }`}>
      <div className="absolute top-0 left-0 bottom-0 w-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10" style={{ backgroundColor: party.color }}></div>
      <div className="p-4 pl-6 flex flex-col justify-between h-full gap-4">
        {/* Top Section: Identity and Seats */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg p-1 shadow-inner shrink-0 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img src={party.logo} alt={party.name} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base md:text-lg font-bold thai-font leading-tight group-hover:text-white transition-colors truncate">
                  {party.name}
                </h3>
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 thai-font font-medium uppercase tracking-tight truncate mb-1">
                {party.candidateName}
              </p>
              <div className="flex items-center gap-2">
                {getCoalitionBadge()}
              </div>
            </div>
          </div>
          
          <div className="text-right shrink-0 flex flex-col items-end">
            <div className="text-3xl md:text-4xl font-black tracking-tighter italic leading-none mb-1" style={{ color: party.color }}>
              <AnimatedNumber value={party.projectedSeats} />
            </div>
            <div className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
              {t('projected_seats')}
            </div>
          </div>
        </div>

        {/* Bottom Section: Progress and Stats */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: party.color }}></span>
              {t('vote_share')}
            </span>
            <span className="shrink-0"><AnimatedNumber value={party.votePercentage} formatter={(v) => v.toFixed(2) + '%'} /></span>
          </div>
          
          <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-800/50">
            <div 
              className="h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
              style={{ width: `${party.votePercentage}%`, backgroundColor: party.color }} 
            />
          </div>
          
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-tight">
            <span className="truncate">{t('raw_vote')}: <AnimatedNumber value={party.partyListScore} /></span>
            {isLeader && <span className="text-yellow-500 font-black shrink-0 ml-2">{t('leading_trend')}</span>}
          </div>
        </div>
      </div>
      
      {isLeader && (
        <div className="absolute top-0 right-0">
          <div className="bg-yellow-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-bl-md shadow-md uppercase tracking-tighter">
            {t('predicted_leader')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyCard;
