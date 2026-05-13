"use client";

import React from 'react';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black py-20 px-6 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-3 text-white uppercase italic font-black text-2xl tracking-tighter">
          <Trophy className="text-red-600 w-8 h-8" /> SMASHHUB
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 SmashHub Neo-Brutalist.</p>
      </div>
    </footer>
  );
}
