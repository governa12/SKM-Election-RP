
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ElectionHeader from './components/ElectionHeader';
import SeatChart from './components/SeatChart';
import PartyCard from './components/PartyCard';
import PathToPower from './components/PathToPower';
import ProbabilityMeter from './components/ProbabilityMeter';
import CoalitionCalculator from './components/CoalitionCalculator';
import FormationSimulator from './components/FormationSimulator';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import BreakingNewsBar from './components/BreakingNewsBar';
import { calculateProjections } from './components/ProjectionLogic';
import { fetchElectionData } from './services/dataService';
import { PartyData, NewsUpdate } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';

const NEWS_LOGO_URL = 'https://media.discordapp.net/attachments/1303345176076615722/1473265950060187773/image_5.png?ex=69959556&is=699443d6&hm=ce93b2bf04b8bcab9a00a0dd59e87ad045db12b0acca3f08a97db494d3b2d6e0&=&format=webp&quality=lossless&width=1350&height=645';
const SYNC_POLL_INTERVAL = 10000;
const TRANSITION_DELAY = 2500;

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const [parties, setParties] = useState<PartyData[]>([]);
  const [noneVotes, setNoneVotes] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('');
  
  const lastDataHash = useRef<string>('');
  const progress = 1.0;
  
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_session') === 'active';
  });

  const sync = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    if (isBackground) setIsSyncing(true);

    try {
      const data = await fetchElectionData();
      const currentDataHash = JSON.stringify({ parties: data.parties, noneVotes: data.noneVotes });
      
      if (currentDataHash !== lastDataHash.current) {
        setParties(data.parties);
        setNoneVotes(data.noneVotes);
        setLastUpdate(new Date().toLocaleTimeString());
        lastDataHash.current = currentDataHash;
      }
    } catch (err) {
      console.error("Data synchronization failed:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    sync();
    const pollInterval = setInterval(() => sync(true), SYNC_POLL_INTERVAL);
    return () => clearInterval(pollInterval);
  }, []);

  const handleLanguageSwitch = (newLang: 'th' | 'en') => {
    setLoadingMsg(t('switching_language'));
    setVisualLoading(true);
    setTimeout(() => {
      setLanguage(newLang);
      setVisualLoading(false);
    }, TRANSITION_DELAY);
  };

  const handleLogout = () => {
    setLoadingMsg(t('logging_out'));
    setVisualLoading(true);
    setTimeout(() => {
      setIsAdminAuthenticated(false);
      sessionStorage.removeItem('admin_session');
      setVisualLoading(false);
    }, TRANSITION_DELAY);
  };

  const projectedData = useMemo(() => {
    return calculateProjections(parties, progress);
  }, [parties, progress]);

  const leadingParty = projectedData.length > 0 ? projectedData[0] : null;

  const majorityParty = useMemo(() => {
    if (leadingParty && leadingParty.projectedSeats >= 250) {
      return leadingParty;
    }
    return null;
  }, [leadingParty]);

  const totalVotesCounted = useMemo(() => {
    const partyVotes = parties.reduce((acc, p) => acc + p.partyListScore, 0);
    return partyVotes + noneVotes;
  }, [parties, noneVotes]);

  if ((loading && parties.length === 0) || visualLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
          <img src={NEWS_LOGO_URL} alt="Logo" className="h-20 w-auto animate-pulse object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-red-600 animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse thai-font">
              {loadingMsg || t('recalculating')}
            </p>
          </div>
        </div>
        <style>{`
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-red-500/30">
      <div className="sticky top-0 z-[60] flex flex-col">
        {majorityParty && <BreakingNewsBar partyName={majorityParty.name} />}
        <ElectionHeader 
          progress={progress} 
          totalVotes={totalVotesCounted} 
          noneVotes={noneVotes}
          lastUpdate={lastUpdate}
          onLanguageChange={handleLanguageSwitch}
        />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-12">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-ping' : 'bg-green-500'}`}></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               Live Data Feed
             </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => sync(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-lg transition-all border border-slate-800 uppercase tracking-widest"
            >
              {t('refresh')}
            </button>
            <button 
              onClick={() => isAdminAuthenticated ? handleLogout() : setShowLogin(true)}
              className="text-[10px] font-black px-5 py-2.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 uppercase hover:text-white hover:border-slate-600 transition-all"
            >
              {isAdminAuthenticated ? t('admin_logout') : t('admin_login')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProbabilityMeter leadingSeats={leadingParty?.projectedSeats || 0} />
            <PathToPower leadingParty={leadingParty} />
          </div>
          
          <SeatChart parties={projectedData} totalSeats={500} />

          <FormationSimulator parties={projectedData} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black flex items-center gap-4 italic tracking-tighter text-white uppercase">
                  <span className="w-3 h-8 bg-red-600"></span>
                  {t('projected_standings')}
                </h2>
                <div className="text-[10px] font-bold text-slate-500 uppercase">{t('based_on_party_list')}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectedData.map((party, index) => (
                  <PartyCard key={party.name} party={party} isLeader={index === 0} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
              <CoalitionCalculator parties={projectedData} />
              
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2">{t('tech_note')}</h4>
                <p className="text-[11px] text-slate-400 thai-font leading-relaxed uppercase font-black">
                  {t('tech_note_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showLogin && (
          <AdminLogin onLogin={() => { setIsAdminAuthenticated(true); setShowLogin(false); }} onClose={() => setShowLogin(false)} />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-900 bg-slate-950 p-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-slate-500 text-[10px] font-black uppercase">
          <img src={NEWS_LOGO_URL} alt="" className="h-6 w-auto grayscale" />
          <div className="flex gap-8">
            <span>{t('security_protected')}</span>
            <span>{t('manual_override')}</span>
            <span>{t('broadcast_standard')}</span>
          </div>
          <div>E-2026 ENGINE</div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
