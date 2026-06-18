import React, { useState } from 'react';

export default function FootballAnalyzer() {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');

  // API Base Configuration
  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  // State Management for Forms
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [clubForm, setClubForm] = useState({
    user: { email: '', phone_number: '', password: '' },
    club: { club_name: '', registration_number: '', county: '' }
  });
  const [teamForm, setTeamForm] = useState({ club: '', team_name: '', founded_year: '' });
  const [verifyForm, setVerifyForm] = useState({ userId: '', status: 'ACTIVE' });

  // Helper for API responses
  const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
    return data;
  };

  // 1. JWT Login Request
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/login/`, { // Adjust to your main jwt route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await handleResponse(res);
      localStorage.setItem('access_token', data.access);
      setToken(data.access);
      setMessage({ type: 'success', text: 'Logged in successfully!' });
      setActiveTab('club-reg');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // 2. Club Registration Request (Nested Structure)
  const handleClubSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register/club/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubForm)
      });
      await handleResponse(res);
      setMessage({ type: 'success', text: 'Club and Manager created!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // 3. Team Registration Request
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/teams/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });
      await handleResponse(res);
      setMessage({ type: 'success', text: 'Team registered!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // 4. Admin Verification Request (Requires JWT Authorization)
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/${verifyForm.userId}/verify/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: verifyForm.status })
      });
      await handleResponse(res);
      setMessage({ type: 'success', text: 'User status updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Verification failed: ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-emerald-800 border-b-4 border-emerald-500 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-black uppercase tracking-wider text-white">⚽ PitchAnalyzer</h1>
        {token && (
          <button 
            onClick={() => { localStorage.clear(); setToken(''); setActiveTab('login'); }}
            className="text-xs bg-rose-700 px-3 py-1 rounded font-bold hover:bg-rose-600"
          >
            Logout
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Alert Toast Banner */}
        {message.text && (
          <div className={`mb-4 p-3 rounded text-sm border font-bold ${
            message.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-rose-950 border-rose-500 text-rose-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Dynamic Navigation Menu */}
        <div className="flex space-x-1 mb-6 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-bold uppercase">
          {!token && (
            <button onClick={() => { setActiveTab('login'); setMessage({type:'',text:''}); }} className={`flex-1 py-2.5 rounded ${activeTab === 'login' ? 'bg-emerald-600' : 'text-slate-400'}`}>🔑 Login</button>
          )}
          <button onClick={() => { setActiveTab('club-reg'); setMessage({type:'',text:''}); }} className={`flex-1 py-2.5 rounded ${activeTab === 'club-reg' ? 'bg-emerald-600' : 'text-slate-400'}`}>🛡️ Club</button>
          <button onClick={() => { setActiveTab('team-reg'); setMessage({type:'',text:''}); }} className={`flex-1 py-2.5 rounded ${activeTab === 'team-reg' ? 'bg-emerald-600' : 'text-slate-400'}`}>👕 Team</button>
          <button onClick={() => { setActiveTab('verify'); setMessage({type:'',text:''}); }} className={`flex-1 py-2.5 rounded ${activeTab === 'verify' ? 'bg-emerald-600' : 'text-slate-400'}`}>⚖️ Verify</button>
        </div>

        {/* FORM 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
            <h2 className="font-bold text-emerald-400 uppercase tracking-wide">Manager / Admin Login</h2>
            <input type="email" placeholder="Email" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            <input type="password" placeholder="Password" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            <button type="submit" className="w-full bg-emerald-600 p-2.5 rounded font-bold uppercase text-sm hover:bg-emerald-500">Authenticate</button>
          </form>
        )}

        {/* FORM 2: CLUB SETUP */}
        {activeTab === 'club-reg' && (
          <form onSubmit={handleClubSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
            <h2 className="font-bold text-emerald-400 uppercase tracking-wide">Club Association Registration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="email" placeholder="Manager Email" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.user.email} onChange={e => setClubForm({...clubForm, user: {...clubForm.user, email: e.target.value}})} />
              <input type="text" placeholder="Phone Number" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.user.phone_number} onChange={e => setClubForm({...clubForm, user: {...clubForm.user, phone_number: e.target.value}})} />
              <input type="password" placeholder="Account Password" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.user.password} onChange={e => setClubForm({...clubForm, user: {...clubForm.user, password: e.target.value}})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/50">
              <input type="text" placeholder="Club Name" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.club.club_name} onChange={e => setClubForm({...clubForm, club: {...clubForm.club, club_name: e.target.value}})} />
              <input type="text" placeholder="Reg Number" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.club.registration_number} onChange={e => setClubForm({...clubForm, club: {...clubForm.club, registration_number: e.target.value}})} />
              <input type="text" placeholder="County" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={clubForm.club.county} onChange={e => setClubForm({...clubForm, club: {...clubForm.club, county: e.target.value}})} />
            </div>
            <button type="submit" className="w-full bg-emerald-600 p-2.5 rounded font-bold uppercase text-sm hover:bg-emerald-500">Register Club</button>
          </form>
        )}

        {/* FORM 3: SQUAD SETUP */}
        {activeTab === 'team-reg' && (
          <form onSubmit={handleTeamSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
            <h2 className="font-bold text-emerald-400 uppercase tracking-wide">Register Team Squad</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="number" placeholder="Parent Club ID ID" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={teamForm.club} onChange={e => setTeamForm({...teamForm, club: e.target.value})} />
              <input type="text" placeholder="Team Variant Name" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={teamForm.team_name} onChange={e => setTeamForm({...teamForm, team_name: e.target.value})} />
              <input type="number" placeholder="Founded Year" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={teamForm.founded_year} onChange={e => setTeamForm({...teamForm, founded_year: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-emerald-600 p-2.5 rounded font-bold uppercase text-sm hover:bg-emerald-500">Create Squad</button>
          </form>
        )}

        {/* FORM 4: ADMIN VERIFICATION */}
        {activeTab === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 border-l-4 border-amber-500">
            <h2 className="font-bold text-slate-200 uppercase tracking-wide flex justify-between">
              <span>User Verification</span>
              <span className="text-xs text-amber-400 italic font-normal">Requires Admin Login Token</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="number" placeholder="Target User ID" required className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm" value={verifyForm.userId} onChange={e => setVerifyForm({...verifyForm, userId: e.target.value})} />
              <select className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded text-sm text-slate-300" value={verifyForm.status} onChange={e => setVerifyForm({...verifyForm, status: e.target.value})}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-amber-600 text-slate-900 p-2.5 rounded font-black uppercase text-sm hover:bg-amber-500">Patch Account Status</button>
          </form>
        )}
      </main>
    </div>
  );
}