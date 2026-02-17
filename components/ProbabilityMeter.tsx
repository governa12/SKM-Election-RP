
import React from 'react';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  leadingSeats: number;
  totalSeats?: number;
}

const ProbabilityMeter: React.FC<Props> = ({ leadingSeats, totalSeats = 500 }) => {
  const { t } = useLanguage();
  const target = 251;
  
  const calculateChance = () => {
    if (leadingSeats >= target) return 99.9;
    if (leadingSeats < 100) return (leadingSeats / target) * 20;
    const gap = target - leadingSeats;
    if (gap <= 5) return 95 + (5 - gap);
    if (gap <= 20) return 80 + (20 - gap);
    if (gap <= 50) return 60 + (50 - gap) * 0.4;
    return 40 + (100 - gap) * 0.2;
  };

  const chance = calculateChance();
  const colorClass = chance > 90 ? 'text-green-500' : chance > 70 ? 'text-blue-500' : 'text-yellow-500';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-6">
      <div className="space-y-1 flex-1">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          {t('majority_prob')}
        </h3>
        <p className="text-[9px] text-slate-600 font-bold uppercase">{t('confidence_index')}</p>
      </div>
      
      <div className="text-right">
        <div className={`text-3xl md:text-4xl font-black italic tracking-tighter ${colorClass}`}>
          <AnimatedNumber value={chance} formatter={(v) => v.toFixed(1) + '%'} />
        </div>
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t('single_party_win')}</div>
      </div>
    </div>
  );
};

export default ProbabilityMeter;
