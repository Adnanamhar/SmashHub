"use client";

import React from 'react';

interface RegisterModalProps {
  showRegister: boolean;
  registerForm: any;
  setRegisterForm: (form: any) => void;
  handleRegister: () => Promise<{ success: boolean; message: string }>;
  onShowLogin: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function RegisterModal({
  showRegister,
  registerForm,
  setRegisterForm,
  handleRegister,
  onShowLogin,
  onSuccess,
  onError
}: RegisterModalProps) {
  if (!showRegister) return null;

  const onSubmit = async () => {
    // Client-side validasi
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword || !registerForm.full_name) {
      onError("Semua field wajib diisi");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      onError("Password tidak cocok");
      return;
    }
    
    const result = await handleRegister();
    if (result.success) {
      onSuccess(result.message);
      onShowLogin();
    } else {
      onError(result.message);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-300 fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] max-w-md w-full my-8">
        <h3 className="text-2xl font-black text-black mb-6 uppercase italic">Daftar Akun</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={registerForm.full_name}
            onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="tel"
            placeholder="No. HP (Opsional)"
            value={registerForm.phone}
            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <select
            value={registerForm.role}
            onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          >
            <option value="user">Player (User)</option>
            <option value="owner">Owner Lapangan</option>
          </select>

          <button
            onClick={onSubmit}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
          >
            Daftar Sekarang
          </button>
          <div className="text-center mt-4 flex flex-col gap-2">
            <button onClick={onShowLogin} className="text-xs font-bold text-slate-500 hover:text-black uppercase">
              Sudah punya akun? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
