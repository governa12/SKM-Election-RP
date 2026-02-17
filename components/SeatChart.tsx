
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';
import { PartyData } from '../types';
import { useLanguage } from '../LanguageContext';

interface Props {
  parties: PartyData[];
  totalSeats: number;
}

const SeatChart: React.FC<Props> = ({ parties, totalSeats }) => {
  const { t } = useLanguage();
  
  // Include all parties even if they have 0 seats, as requested
  const data = parties.map(p => ({
    name: p.name,
    seats: p.projectedSeats,
    color: p.color
  }));

  const majorityThreshold = Math.ceil(totalSeats / 2);
  // Adjusted multiplier from 55 to 48 for a tighter look with more parties
  const chartHeight = Math.max(400, data.length * 48);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-black thai-font text-white flex items-center gap-3 uppercase">
            <span className="w-2 h-6 bg-red-600"></span>
            {t('unofficial_results')}
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Seat Distribution Projection</p>
        </div>
        <div className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded uppercase tracking-tighter">
          {t('majority_target')}: {majorityThreshold} {t('seats')}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-950/20">
        <div style={{ height: `${chartHeight}px`, minWidth: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
              <XAxis type="number" domain={[0, Math.max(majorityThreshold + 50, ...data.map(d => d.seats + 20))]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                fontSize={11} 
                width={120}
                tickLine={false}
                axisLine={false}
                className="font-bold uppercase"
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: '800' }}
              />
              <ReferenceLine x={majorityThreshold} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2}>
                <LabelList 
                  position="top" 
                  content={(props: any) => (
                    <text x={props.viewBox.x} y={props.viewBox.y - 10} fill="#ef4444" fontSize={9} fontWeight="900" textAnchor="middle" className="uppercase">
                      {t('magic_line')} ({majorityThreshold})
                    </text>
                  )} 
                />
              </ReferenceLine>
              <Bar dataKey="seats" radius={[0, 6, 6, 0]} isAnimationActive={false} barSize={28}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                <LabelList 
                  dataKey="seats" 
                  position="right" 
                  fill="#fff" 
                  fontSize={14} 
                  fontWeight="900" 
                  offset={10} 
                  className="italic" 
                  formatter={(val: number) => val} // Explicitly show 0
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-center">
         <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <span>{t('scroll_hint')}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SeatChart;
