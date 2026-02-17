
import React from 'react';
import { useLanguage } from '../LanguageContext';

interface Props {
  partyName: string;
}

const BreakingNewsBar: React.FC<Props> = ({ partyName }) => {
  const { language, t } = useLanguage();

  const displayPartyName = language === 'th' && !partyName.trim().startsWith('พรรค') 
    ? `พรรค${partyName}` 
    : partyName;

  return (
    <div className="bg-red-600 border-b border-red-500 py-3 px-4 shadow-[0_2px_10px_rgba(220,38,38,0.2)] animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-xl">🚨</span>
          <span className="bg-white text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm">
            {t('breaking')}
          </span>
        </div>
        
        <h2 className="text-white font-black thai-font text-sm md:text-lg tracking-tight uppercase italic flex items-center gap-2 drop-shadow-md">
          <span className="underline decoration-2 underline-offset-4">{displayPartyName}</span> {t('has_crossed_majority')}
        </h2>
        
        <div className="hidden md:flex items-center gap-2 opacity-80">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
          <span className="text-[10px] text-white font-bold uppercase tracking-widest">Live Update</span>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBar;
