"use client";

import React from 'react';
import { Calendar, Clock, Users, ShieldCheck } from 'lucide-react';

interface HomeContentProps {
  setShowLogin: (v: boolean) => void;
  setShowRegister: (v: boolean) => void;
}

export default function HomeContent({ setShowLogin, setShowRegister }: HomeContentProps) {
  return (
    <>
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Calendar />, title: "Online Booking", color: "bg-red-50 text-red-600" },
              { icon: <Clock />, title: "Real-time Slot", color: "bg-blue-50 text-blue-600" },
              { icon: <Users />, title: "Mabar System", color: "bg-slate-900 text-white" },
              { icon: <ShieldCheck />, title: "Verified GOR", color: "bg-red-50 text-red-600" },
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white border-4 border-black hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:-translate-y-2">
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                  {React.cloneElement(f.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter italic">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed italic">Premium badminton experience for champions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto text-white">
        <div className="bg-black rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden border-4 border-red-600">
          <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
            Siap Menjadi <span className="text-red-600">Legenda</span> Lapangan?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => setShowRegister(true)}
              className="px-12 py-5 bg-red-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Daftar Sebagai Player
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Daftar GOR / Owner
            </button>
          </div>
          <p className="mt-6 text-slate-400 text-sm">
            Sudah punya akun? <button onClick={() => setShowLogin(true)} className="text-white underline font-bold hover:text-red-400 transition-colors">Login di sini</button>
          </p>
        </div>
      </section>
    </>
  );
}
