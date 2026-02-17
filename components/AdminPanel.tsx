
import React, { useState } from 'react';
import { NewsUpdate } from '../types';

interface Props {
  onAddUpdate: (update: NewsUpdate) => void;
  onClear: () => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ onAddUpdate, onClear, onLogout }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newUpdate: NewsUpdate = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      title,
      content,
    };

    onAddUpdate(newUpdate);
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-slate-900 border-2 border-red-600/50 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          ADMIN COMMAND CENTER
        </h2>
        <button 
          onClick={onLogout}
          className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
        >
          Exit Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Headline</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. BREAKING: Landslide in Bangkok"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Update Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your analysis here..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors thai-font resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            type="submit"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95"
          >
            Broadcast Update
          </button>
          <button 
            type="button"
            onClick={onClear}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl uppercase text-[10px] tracking-widest transition-all"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
