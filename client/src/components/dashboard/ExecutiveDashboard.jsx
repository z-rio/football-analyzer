import React from 'react';
import { BarChart2, Download } from 'lucide-react';
import KpiCard from '../common/KpiCard';

export default function ExecutiveDashboard({ summary, summaryLoading, onExport }) {
  return (
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
            <KpiCard label="Total Players" value={summary.totalPlayers} />
            <KpiCard label="Scout Reports Logged" value={summary.totalReports} />
            <KpiCard label="Active Scouts" value={summary.activeScouts} />
          </div>
        ) : (
          <p className="text-red-600 text-sm mb-6">
            Could not reach analytics API. Is Django running on port 8000?
          </p>
        )}

        <button
          type="button"
          onClick={onExport}
          disabled={!summary}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-blue-950 font-black uppercase text-sm px-6 py-3 rounded-xl border-2 border-amber-500 transition"
        >
          <Download className="h-4 w-4" />
          Export Summary
        </button>
      </div>

      <div className="bg-blue-900 rounded-2xl p-6 text-blue-100 text-sm border border-amber-400/30">
        <p className="font-bold text-amber-400 mb-2">Live data</p>
        Filters on Talent Search call <code className="text-amber-200">GET /api/players/</code> with{' '}
        <code className="text-amber-200">search</code> and <code className="text-amber-200">position</code> query params.
        Dashboard pulls <code className="text-amber-200">/api/analytics/summary/</code>.
      </div>
    </section>
  );
}