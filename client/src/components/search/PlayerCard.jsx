import React from 'react';
import { ArrowLeftRight, Star } from 'lucide-react';

export default function PlayerCard({ player, shortlisted, inCompare, onToggleCompare, onToggleShortlist }) {
  return (
    <article className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm hover:border-amber-400 transition">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div>
          <h3 className="font-bold text-blue-950 text-lg">{player.name}</h3>
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
          onClick={() => onToggleCompare(player.id)}
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
          onClick={() => onToggleShortlist(player.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold uppercase border transition ${
            shortlisted
              ? 'bg-blue-900 border-blue-900 text-amber-400'
              : 'border-amber-400 text-amber-600 hover:bg-amber-50'
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${shortlisted ? 'fill-amber-400' : ''}`} />
          Shortlist
        </button>
      </div>
    </article>
  );
}