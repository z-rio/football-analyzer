import React from 'react';

export default function KpiCard({ label, value }) {
  return (
    <div className="rounded-xl bg-blue-950 border-2 border-amber-400 p-5 text-center">
      <p className="text-3xl font-black text-amber-400">{value ?? '—'}</p>
      <p className="text-xs uppercase tracking-wider text-blue-200 mt-2 font-bold">
        {label}
      </p>
    </div>
  );
}