
import React, { useState } from 'react';
import { fetchAdminCredentials } from '../services/dataService';

interface Props {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const credentials = await fetchAdminCredentials();
      
      if (credentials[username] && credentials[username] === password) {
        onLogin();
      } else {
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-600 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden">
        <div className="bg-red-600 p-4 flex justify-between items-center">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.9L10 9.503l7.834-4.603A2 2 0 0015.834 3H4.166a2 2 0 00-2 1.9z" clipRule="evenodd" />
              <path d="M2 7.062V15a2 2 0 002 2h12a2 2 0 002-2V7.062l-8 4.687-8-4.687z" />
            </svg>
            Security Authorization
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Admin Restricted Access</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enter Credentials from Security DB</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="User ID"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-sm focus:outline-none focus:border-red-600 transition-all text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-center text-sm tracking-widest focus:outline-none focus:border-red-600 transition-all text-white`}
                required
              />
              {error && <p className="text-[10px] text-red-500 font-bold text-center uppercase animate-pulse mt-2">Invalid Credentials or Access Denied</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-black py-4 rounded-xl uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-red-900/30 active:scale-95 border-b-4 border-red-900"
            >
              {loading ? 'Authenticating...' : 'Verify Identity'}
            </button>
          </div>
          
          <p className="text-[9px] text-slate-600 text-center uppercase font-bold leading-relaxed">
            By logging in, you agree to maintain editorial standards for the 2026 Election Live Newsroom.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
