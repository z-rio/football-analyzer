import React from 'react';
import { UserCheck } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function Header() {
  return (
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
  );
}