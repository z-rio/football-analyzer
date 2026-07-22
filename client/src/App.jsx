import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  BarChart2,
  Download,
  Filter,
  Search,
  Star,
  UserCheck,
  X,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';
const POSITIONS = ['', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
const SHORTLIST_KEY = 'football_scout_shortlist';

function loadShortlist() {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveShortlist(ids) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
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

  useEffect(() => {
    if (activeTab === 'dashboard') fetchSummary();
  }, [activeTab, fetchSummary]);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const toggleShortlist = (id) => {
    setShortlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveShortlist(next);
      return next;
    });
  };

  const comparePlayers = useMemo(() => {
    return compareIds
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean);
  }, [compareIds, players]);

  const shortlistPlayers = useMemo(() => {
    const fromList = players.filter((p) => shortlistIds.includes(p.id));
    const missingIds = shortlistIds.filter(
      (id) => !fromList.some((p) => p.id === id)
    );
    return { fromList, missingIds };
  }, [players, shortlistIds]);

  useEffect(() => {
    if (shortlistPlayers.missingIds.length === 0) return;
    (async () => {
      const extras = await Promise.all(
        shortlistPlayers.missingIds.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE}/players/${id}/`);
            if (!res.ok) return null;
            return res.json();
          } catch {
            return null;
          }
        })
      );
      setPlayers((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        extras.filter(Boolean).forEach((p) => map.set(p.id, p));
        return [...map.values()];
      });
    })();
  }, [shortlistPlayers.missingIds]);

  useEffect(() => {
    const missing = compareIds.filter(
      (id) => !players.some((p) => p.id === id)
    );
    if (missing.length === 0) return;
    (async () => {
      const extras = await Promise.all(
        missing.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE}/players/${id}/`);
            if (!res.ok) return null;
            return res.json();
          } catch {
            return null;
          }
        })
      );
      setPlayers((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        extras.filter(Boolean).forEach((p) => map.set(p.id, p));
        return [...map.values()];
      });
    })();
  }, [compareIds, players]);

  const exportSummary = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      analytics: summary,
      shortlistedPlayers: players.filter((p) => shortlistIds.includes(p.id)),
      comparedPlayers: comparePlayers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'football-analytics-summary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'search', label: 'Talent Search', icon: Search },
    { id: 'compare', label: 'Comparison', icon: ArrowLeftRight },
    { id: 'shortlist', label: 'Scout Shortlist', icon: Star },
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart2 },
  ];

  const metricRows = [
    { key: 'rating', label: 'Rating' },
    { key: 'position', label: 'Position' },
    { key: 'age', label: 'Age' },
    { key: 'xG', label: 'xG' },
    { key: 'xA', label: 'xA' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-950 border-b-4 border-amber-400 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-900 border-2 border-amber-400 flex items-center justify-center">
              <UserCheck className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white uppercase">
                Football Analytics & Scouting
              </h1>
              <p className="text-xs text-amber-400 font-semibold tracking-wider">
                FKF · USIU-Africa Intelligence Hub
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-200 font-mono">API · {API_BASE}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8 bg-white p-2 rounded-xl border border-blue-200 shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition ${
                activeTab === id
                  ? 'bg-blue-900 text-amber-400 shadow-md'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {activeTab === 'search' && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-500" />
                Talent Search Engine
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or club…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                  />
                </div>
                <div className="relative md:w-56">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 outline-none text-sm appearance-none bg-white"
                  >
                    <option value="">All positions</option>
                    {POSITIONS.filter(Boolean).map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            {loading ? (
              <p className="text-center text-blue-900 font-medium py-12">
                Loading players…
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {players.map((player) => {
                  const shortlisted = shortlistIds.includes(player.id);
                  const inCompare = compareIds.includes(player.id);
                  return (
                    <article
                      key={player.id}
                      className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm hover:border-amber-400 transition"
                    >
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-blue-950 text-lg">
                            {player.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {player.club} · {player.region}
                          </p>
                        </div>
                        <span className="bg-blue-900 text-amber-400 font-black text-lg px-3 py-1 rounded-lg">
                          {player.rating}
                        </span>
                      </div>
                      <dl className="grid grid-cols-3 gap-2 text-xs mb-4">
                        <div>
                          <dt className="text-slate-400 uppercase">Pos</dt>
                          <dd className="font-semibold">{player.position}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 uppercase">Age</dt>
                          <dd className="font-semibold">{player.age}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400 uppercase">xG / xA</dt>
                          <dd className="font-semibold">
                            {player.xG} / {player.xA}
                          </dd>
                        </div>
                      </dl>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompare(player.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold uppercase border transition ${
                            inCompare
                              ? 'bg-amber-400 border-amber-500 text-blue-950'
                              : 'border-blue-300 text-blue-900 hover:bg-blue-50'
                          }`}
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          Compare
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleShortlist(player.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold uppercase border transition ${
                            shortlisted
                              ? 'bg-blue-900 border-blue-900 text-amber-400'
                              : 'border-amber-400 text-amber-600 hover:bg-amber-50'
                          }`}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${shortlisted ? 'fill-amber-400' : ''}`}
                          />
                          Shortlist
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && players.length === 0 && !error && (
              <p className="text-center text-slate-500 py-8">
                No players match your filters.
              </p>
            )}
          </section>
        )}

        {activeTab === 'compare' && (
          <section className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950 mb-2 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-amber-500" />
              Side-by-Side Comparison
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Select up to two players from Talent Search using Compare.
            </p>

            {comparePlayers.length < 2 ? (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-8 text-center text-blue-900">
                {comparePlayers.length === 1
                  ? `Selected: ${comparePlayers[0].name}. Pick one more player.`
                  : 'No players selected for comparison yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-amber-400">
                      <th className="text-left py-3 pr-4 font-bold text-blue-950">
                        Metric
                      </th>
                      {comparePlayers.map((p) => (
                        <th
                          key={p.id}
                          className="text-left py-3 px-4 font-bold text-blue-900 bg-blue-50"
                        >
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metricRows.map(({ key, label }) => (
                      <tr key={key} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-semibold text-slate-600">
                          {label}
                        </td>
                        {comparePlayers.map((p) => (
                          <td key={p.id} className="py-3 px-4">
                            {p[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="mt-6 text-xs font-bold uppercase text-red-600 hover:text-red-800"
              >
                Clear selection
              </button>
            )}
          </section>
        )}

        {activeTab === 'shortlist' && (
          <section className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
              Scout Shortlist
            </h2>

            {shortlistIds.length === 0 ? (
              <p className="text-slate-500 text-center py-10">
                Star players in Talent Search to build your shortlist.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {players
                  .filter((p) => shortlistIds.includes(p.id))
                  .map((player) => (
                    <li
                      key={player.id}
                      className="flex items-center justify-between py-4 gap-4"
                    >
                      <div>
                        <p className="font-bold text-blue-950">{player.name}</p>
                        <p className="text-sm text-slate-500">
                          {player.position} · Rating {player.rating} ·{' '}
                          {player.club}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(player.id)}
                        className="flex items-center gap-1 text-xs font-bold uppercase text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'dashboard' && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-amber-500" />
                Executive Dashboard
              </h2>

              {summaryLoading ? (
                <p className="text-blue-900">Loading KPIs…</p>
              ) : summary ? (
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <KpiCard
                    label="Total Players"
                    value={summary.totalPlayers}
                  />
                  <KpiCard
                    label="Scout Reports Logged"
                    value={summary.totalReports}
                  />
                  <KpiCard
                    label="Active Scouts"
                    value={summary.activeScouts}
                  />
                </div>
              ) : (
                <p className="text-red-600 text-sm mb-6">
                  Could not reach analytics API. Is Django running on port 8000?
                </p>
              )}

              <button
                type="button"
                onClick={exportSummary}
                disabled={!summary}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-blue-950 font-black uppercase text-sm px-6 py-3 rounded-xl border-2 border-amber-500 transition"
              >
                <Download className="h-4 w-4" />
                Export Summary
              </button>
            </div>

            <div className="bg-blue-900 rounded-2xl p-6 text-blue-100 text-sm border border-amber-400/30">
              <p className="font-bold text-amber-400 mb-2">Live data</p>
              Filters on Talent Search call{' '}
              <code className="text-amber-200">GET /api/players/</code> with{' '}
              <code className="text-amber-200">search</code> and{' '}
              <code className="text-amber-200">position</code> query params.
              Dashboard pulls{' '}
              <code className="text-amber-200">/api/analytics/summary/</code>.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="rounded-xl bg-blue-950 border-2 border-amber-400 p-5 text-center">
      <p className="text-3xl font-black text-amber-400">{value ?? '—'}</p>
      <p className="text-xs uppercase tracking-wider text-blue-200 mt-2 font-bold">
        {label}
      </p>
    </div>
  );
}
