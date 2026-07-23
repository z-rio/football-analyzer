import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

const METRIC_ROWS = [
  { key: 'rating', label: 'Rating' },
  { key: 'position', label: 'Position' },
  { key: 'age', label: 'Age' },
  { key: 'xG', label: 'xG' },
  { key: 'xA', label: 'xA' },
  { key: 'goals', label: 'Goals' },
  { key: 'assists', label: 'Assists' },
];

export default function PlayerComparison({ comparePlayers, compareIds, onClearSelection }) {
  return (
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
                <th className="text-left py-3 pr-4 font-bold text-blue-950">Metric</th>
                {comparePlayers.map((p) => (
                  <th key={p.id} className="text-left py-3 px-4 font-bold text-blue-900 bg-blue-50">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_ROWS.map(({ key, label }) => (
                <tr key={key} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-600">{label}</td>
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
          onClick={onClearSelection}
          className="mt-6 text-xs font-bold uppercase text-red-600 hover:text-red-800"
        >
          Clear selection
        </button>
      )}
    </section>
  );
}