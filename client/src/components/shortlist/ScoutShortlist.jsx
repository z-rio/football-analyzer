import React from 'react';
import { Star, X } from 'lucide-react';

export default function ScoutShortlist({ players, shortlistIds, onRemoveShortlist }) {
  const shortlistedPlayers = players.filter((p) => shortlistIds.includes(p.id));

  return (
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
          {shortlistedPlayers.map((player) => (
            <li key={player.id} className="flex items-center justify-between py-4 gap-4">
              <div>
                <p className="font-bold text-blue-950">{player.name}</p>
                <p className="text-sm text-slate-500">
                  {player.position} · Rating {player.rating} · {player.club}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveShortlist(player.id)}
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
  );
}