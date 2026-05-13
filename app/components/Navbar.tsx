"use client";

import React from 'react';
import { Trophy, LogOut } from 'lucide-react';

interface NavbarProps {
  role: string;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  setView: (v: string) => void;
  handleLogout: () => void;
}

export default function Navbar({ role, showLogin, setShowLogin, setView, handleLogout }: NavbarProps) {
  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        <div className="bg-red-600 p-2 rounded-lg">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white italic">SMASH<span className="text-blue-500">HUB</span></span>
      </div>

      <div className="flex items-center gap-4">
        {role === 'guest' ? (
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="px-6 py-2.5 text-xs font-black bg-blue-600 text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase tracking-widest"
          >
            {showLogin ? 'BATAL' : 'LOGIN KONSOL'}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full border-2 border-black font-bold text-[10px] uppercase tracking-wider ${role === 'owner' ? 'bg-red-500' : 'bg-blue-500'}`}>
              {role === 'owner' ? 'Owner Mode' : 'Player Mode'}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/10">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
