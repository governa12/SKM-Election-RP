
import React from 'react';
import { NewsUpdate } from '../types';

interface Props {
  events: NewsUpdate[];
  logoUrl: string;
}

const TimelineFeed: React.FC<Props> = ({ events, logoUrl }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col sticky top-48 max-h-[calc(100vh-220px)]">
      <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-white">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            Live Timeline
          </h2>
        </div>
        <span className="text-[9px] font-bold text-slate-500 px-2 py-0.5 bg-slate-900 rounded uppercase tracking-tighter">Realtime Feed</span>
      </div>
      
      <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-slate-950/30">
        {events.length > 0 ? (
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800"></div>
            
            <div className="divide-y divide-slate-800/20">
              {events.map((event, idx) => (
                <div key={event.id} className="p-6 pl-12 space-y-2 hover:bg-slate-800/30 transition-colors group relative">
                  {/* The dot */}
                  <div className={`absolute left-8 -translate-x-1/2 top-[1.8rem] w-3 h-3 rounded-full border-2 border-slate-900 z-10 ${
                    idx === 0 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-slate-700'
                  }`}></div>

                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      idx === 0 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {event.timestamp}
                    </span>
                    {idx === 0 && (
                      <span className="text-[8px] font-black text-red-500 animate-pulse uppercase tracking-widest">Latest</span>
                    )}
                  </div>
                  
                  <h4 className={`font-black text-sm uppercase italic leading-tight ${
                    idx === 0 ? 'text-white' : 'text-slate-400'
                  }`}>
                    {event.title}
                  </h4>
                  
                  <p className="thai-font text-slate-500 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
                    {event.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-10 space-y-6">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700 border border-slate-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 italic text-xs uppercase font-black tracking-widest">
              Standing by for milestones...
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-red-600 p-4">
        <div className="flex items-center gap-3 text-white">
          <div className="text-[10px] font-black uppercase tracking-tighter leading-none border-r border-white/20 pr-3">Verified</div>
          <p className="text-[10px] font-bold thai-font leading-tight uppercase tracking-tight">
            Live Analysis Stream Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineFeed;
