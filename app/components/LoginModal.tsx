"use client";

import React from 'react';

interface LoginModalProps {
  showLogin: boolean;
  loginForm: { username: string; password: string };
  setLoginForm: (form: { username: string; password: string }) => void;
  handleLogin: (e?: React.FormEvent) => { success: boolean; message: string };
  onError: (msg: string) => void;
}

export default function LoginModal({ showLogin, loginForm, setLoginForm, handleLogin, onError }: LoginModalProps) {
  if (!showLogin) return null;

  const onSubmit = () => {
    const result = handleLogin();
    if (!result.success && result.message) {
      onError(result.message);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-300 fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] max-w-md w-full">
        <h3 className="text-2xl font-black text-black mb-6 uppercase italic">Akses Konsol</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
          />
          <button
            onClick={onSubmit}
            className="w-full py-4 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
          >
            Masuk Sekarang
          </button>
          <p className="text-[10px] text-slate-400 font-bold uppercase text-center">
            user: user/123 | owner: owner/123
          </p>
        </div>
      </div>
    </div>
  );
}
