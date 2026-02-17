
import React, { useState, useMemo, useEffect } from 'react';
import { PartyData } from '../types';
import AnimatedNumber from './AnimatedNumber';
import { useLanguage } from '../LanguageContext';

interface Props {
  parties: PartyData[];
  targetSeats?: number;
}

type Assignment = 'none' | 'government' | 'opposition';

const FormationSimulator: React.FC<Props> = ({ parties, targetSeats = 251 }) => {
  const { t } = useLanguage();
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [hasManualOverride, setHasManualOverride] = useState(false);

  // Initialize from sheet data whenever parties list updates, unless user has interacted
  useEffect(() => {
    if (!hasManualOverride) {
      const initialAssignments: Record<string, Assignment> = {};
      parties.forEach(p => {
        if (p.coalitionGroup === 'GOV') initialAssignments[p.name] = 'government';
        else if (p.coalitionGroup === 'OPP') initialAssignments[p.name] = 'opposition';
        else initialAssignments[p.name] = 'none';
      });
      setAssignments(initialAssignments);
    }
  }, [parties, hasManualOverride]);

  const setAssignment = (name: string, type: Assignment) => {
    setHasManualOverride(true);
    setAssignments(prev => ({ ...prev, [name]: type }));
  };

  const handleReset = () => {
    setHasManualOverride(false);
  };

  const stats = useMemo(() => {
    let govSeats = 0;
    let oppSeats = 0;
    const govParties: PartyData[] = [];
    const oppParties: PartyData[] = [];

    parties.forEach(p => {
      const status = assignments[p.name] || 'none';
      if (status === 'government') {
        govSeats += p.projectedSeats;
        govParties.push(p);
      } else if (status === 'opposition') {
        oppSeats += p.projectedSeats;
        oppParties.push(p);
      }
    });

    return { govSeats, oppSeats, govParties, oppParties };
  }, [parties, assignments]);

  const govProgress = Math.min(100, (stats.govSeats / targetSeats) * 100);
  const isGovMajority = stats.govSeats >= targetSeats;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      <div className="p-6 border-b border-slate-800 bg-slate-800/40">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="p-1 bg-yellow-500/20 rounded text-yellow-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
              </span>
              {t('formation_simulator')}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight">
              {hasManualOverride ? 'Manual Simulation Active' : 'Synced with Source Data'}
            </p>
          </div>
          <button 
            onClick={handleReset} 
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border transition-all ${
              hasManualOverride ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {hasManualOverride ? 'Reset to Sheet' : t('reset_table')}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parties.slice(0, 10).map(party => {
            const status = assignments[party.name] || 'none';
            return (
              <div key={party.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${status === 'government' ? 'bg-blue-900/30 border-blue-500/70' : status === 'opposition' ? 'bg-red-900/30 border-red-500/70' : 'bg-slate-950 border-slate-800'}`}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0"><img src={party.logo} alt="" className="w-full h-full object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-black text-white uppercase truncate mb-1 pr-2">{party.name}</div>
                    <div className="text-sm font-black italic brightness-125 truncate" style={{ color: party.color }}>{party.projectedSeats} {t('seats')}</div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={() => setAssignment(party.name, 'government')} 
                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${status === 'government' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('gov')}
                  </button>
                  <button 
                    onClick={() => setAssignment(party.name, 'opposition')} 
                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${status === 'opposition' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('opp')}
                  </button>
                  <button 
                    onClick={() => setAssignment(party.name, 'none')} 
                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${status === 'none' ? 'bg-slate-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 hover:text-slate-400'}`}
                  >
                    {t('non_aligned')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-slate-800/50">
          <div className="space-y-4 relative group">
            <div className="flex justify-between items-end">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  {t('coalition_gov')}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter truncate"><AnimatedNumber value={stats.govSeats} /> <span className="text-slate-700 mx-1 text-2xl md:text-3xl">/</span> <span className="text-slate-500 text-2xl md:text-3xl">{targetSeats}</span></div>
              </div>
              <div className={`px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl transition-all duration-500 shrink-0 ${isGovMajority ? 'bg-green-600 text-white scale-110' : 'bg-slate-800 text-slate-500'}`}>
                {isGovMajority ? t('majority_formed') : t('minority')}
              </div>
            </div>
            <div className="relative h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-700 ease-out rounded-full" style={{ width: `${govProgress}%` }} />
            </div>
          </div>

          <div className="space-y-4 relative">
            <div className="flex justify-between items-end">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 truncate">{t('joint_opp')}</div>
                <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter truncate"><AnimatedNumber value={stats.oppSeats} /> <span className="text-slate-700 mx-1 text-2xl md:text-3xl">/</span> <span className="text-slate-500 text-2xl md:text-3xl">500</span></div>
              </div>
            </div>
            <div className="relative h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-700 ease-out rounded-full" style={{ width: `${(stats.oppSeats / 500) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationSimulator;
