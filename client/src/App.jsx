import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ArrowLeftRight, BarChart2, Search, Star, LogIn, UserPlus } from 'lucide-react';

import Header from './components/common/Header';
import TalentSearch from './components/search/TalentSearch';
import PlayerComparison from './components/compare/PlayerComparison';
import ScoutShortlist from './components/shortlist/ScoutShortlist';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { loadShortlist, saveShortlist } from './utils/storage';
import { API_BASE } from './services/api';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [compareIds, setCompareIds] = useState([]);
  const [shortlistIds, setShortlistIds] = useState(loadShortlist);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);


  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (position) params.set('position', position);
    const qs = params.toString();
    try {
      const res = await fetch(`${API_BASE}/players/${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('Failed to load players');
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : data.results ?? []);
    } catch (err) {
      setError(err.message);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [search, position]);

  useEffect(() => {
    const timer = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(timer);
  }, [fetchPlayers]);

  // Fetch Analytics Summary
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analytics/summary/`);
      if (!res.ok) throw new Error('Failed to load analytics');
      setSummary(await res.json());
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const toggleShortlist = (id) => {
    setShortlistIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveShortlist(next);
      return next;
    });
  };

  const comparePlayers = useMemo(() => {
    return compareIds.map((id) => players.find((p) => p.id === id)).filter(Boolean);
  }, [compareIds, players]);

  const exportSummary = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      analytics: summary,
      shortlistedPlayers: players.filter((p) => shortlistIds.includes(p.id)),
      comparedPlayers: comparePlayers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'football-analytics-summary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const navTabs = [
    { path: '/search', label: 'Talent Search', icon: Search },
    { path: '/compare', label: 'Comparison', icon: ArrowLeftRight },
    { path: '/shortlist', label: 'Scout Shortlist', icon: Star },
    { path: '/dashboard', label: 'Executive Dashboard', icon: BarChart2 },
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/register', label: 'Register', icon: UserPlus },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <nav className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-8 bg-white p-2 rounded-xl border border-blue-200 shadow-sm">
            {navTabs.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition ${
                    isActive
                      ? 'bg-blue-900 text-amber-400 shadow-md'
                      : 'text-blue-900 hover:bg-blue-50'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route
              path="/search"
              element={
                <TalentSearch
                  players={players}
                  loading={loading}
                  error={error}
                  search={search}
                  setSearch={setSearch}
                  position={position}
                  setPosition={setPosition}
                  compareIds={compareIds}
                  shortlistIds={shortlistIds}
                  onToggleCompare={toggleCompare}
                  onToggleShortlist={toggleShortlist}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <PlayerComparison
                  comparePlayers={comparePlayers}
                  compareIds={compareIds}
                  onClearSelection={() => setCompareIds([])}
                />
              }
            />
            <Route
              path="/shortlist"
              element={
                <ScoutShortlist
                  players={players}
                  shortlistIds={shortlistIds}
                  onRemoveShortlist={toggleShortlist}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardRouteWrapper
                  fetchSummary={fetchSummary}
                  summary={summary}
                  summaryLoading={summaryLoading}
                  onExport={exportSummary}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrapper component to invoke analytics fetch when route opens
function DashboardRouteWrapper({ fetchSummary, summary, summaryLoading, onExport }) {
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <ExecutiveDashboard
      summary={summary}
      summaryLoading={summaryLoading}
      onExport={onExport}
    />
  );
}