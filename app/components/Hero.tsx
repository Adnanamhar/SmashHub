"use client";

import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';

interface HeroProps {
  setShowLogin: (v: boolean) => void;
}

export default function Hero({ setShowLogin }: HeroProps) {
  return (
    <section className="relative pt-24 pb-32 flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm text-red-500 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4 fill-current" /> Revolusi Booking Badminton
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
          SMASH LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">LEGEND.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Platform penyewaan lapangan tercanggih di Indonesia. Kelola jadwal, temukan lawan mabar, dan tingkatkan performa permainanmu.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-10 py-5 bg-red-600 text-white font-black rounded-2xl text-lg hover:scale-[1.03] shadow-xl shadow-red-900/20 transition-all flex items-center gap-3"
          >
            Cari Lapangan Sekarang <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="px-10 py-5 bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/10 transition-all shadow-sm"
          >
            Lihat Event Mabar
          </button>
        </div>
      </div>
    </section>
  );
}
