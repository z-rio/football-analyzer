import React from 'react';
import { Search, Filter } from 'lucide-react';
import PlayerCard from './PlayerCard';

const POSITIONS = ['', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

export default function TalentSearch({
  players,
  loading,
  error,
  search,
  setSearch,
  position,
  setPosition,
  compareIds,
  shortlistIds,
  onToggleCompare,
  onToggleShortlist,
}) {
  return (
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
        {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
      </div>

      {loading ? (
        <p className="text-center text-blue-900 font-medium py-12">Loading players…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              shortlisted={shortlistIds.includes(player.id)}
              inCompare={compareIds.includes(player.id)}
              onToggleCompare={onToggleCompare}
              onToggleShortlist={onToggleShortlist}
            />
          ))}
        </div>
      )}

      {!loading && players.length === 0 && !error && (
        <p className="text-center text-slate-500 py-8">No players match your filters.</p>
      )}
    </section>
  );
}