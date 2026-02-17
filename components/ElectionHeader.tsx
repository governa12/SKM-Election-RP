
import React from 'react';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  progress: number;
  totalVotes: number;
  noneVotes: number;
  lastUpdate: string;
  onLanguageChange?: (lang: 'th' | 'en') => void;
}

const NEWS_LOGO_URL = 'https://media.discordapp.net/attachments/1303345176076615722/1473265950060187773/image_5.png?ex=69959556&is=699443d6&hm=ce93b2bf04b8bcab9a00a0dd59e87ad045db12b0acca3f08a97db494d3b2d6e0&=&format=webp&quality=lossless&width=1350&height=645';

const ElectionHeader: React.FC<Props> = ({ progress, totalVotes, noneVotes, lastUpdate, onLanguageChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageClick = (lang: 'th' | 'en') => {
    if (lang === language) return;
    if (onLanguageChange) {
      onLanguageChange(lang);
    } else {
      setLanguage(lang);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={NEWS_LOGO_URL} 
              alt="News Network" 
              className="h-10 md:h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
            <div className="flex flex-col gap-1">
              <div className="bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)] w-fit">
                {t('live')}
              </div>
              <div className="flex bg-slate-950 border border-slate-800 rounded p-0.5 mt-1">
                <button 
                  onClick={() => handleLanguageClick('th')}
                  className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${language === 'th' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  TH
                </button>
                <button 
                  onClick={() => handleLanguageClick('en')}
                  className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${language === 'en' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800 hidden md:block"></div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-none italic">
              {t('election_title')} <span className="text-red-500">2026</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full md:w-auto">
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 flex flex-col items-center md:items-end min-w-[140px]">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">{t('none_votes')}</div>
            <div className="text-lg font-black text-slate-300">
              <AnimatedNumber value={noneVotes} />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center h-full min-w-[160px]">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('total_valid_votes')}</div>
              <div className="text-xl font-black text-white">
                <AnimatedNumber value={totalVotes - noneVotes} />
              </div>
            </div>
            <div className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">
              {t('last_updated')}: {lastUpdate}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ElectionHeader;
