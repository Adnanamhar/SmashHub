"use client";

import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
  handleForgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  handleResetPassword: (email: string, token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  onShowLogin: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ForgotPasswordModal({
  showForgotPassword,
  setShowForgotPassword,
  handleForgotPassword,
  handleResetPassword,
  onShowLogin,
  onSuccess,
  onError
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  if (!showForgotPassword) return null;

  const onSendCode = async () => {
    if (!email) {
      onError("Email wajib diisi");
      return;
    }
    const result = await handleForgotPassword(email);
    if (result.success) {
      onSuccess(result.message);
      setStep(2);
    } else {
      onError(result.message);
    }
  };

  const onReset = async () => {
    if (!token || !newPassword || !confirmPassword) {
      onError("Semua field wajib diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      onError("Password baru tidak cocok");
      return;
    }
    
    const result = await handleResetPassword(email, token, newPassword);
    if (result.success) {
      onSuccess(result.message);
      setStep(1);
      setEmail('');
      setToken('');
      setNewPassword('');
      setConfirmPassword('');
      onShowLogin();
    } else {
      onError(result.message);
    }
  };

  const closeAndReset = () => {
    setStep(1);
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    onShowLogin();
  }

  return (
    <div className="animate-in fade-in zoom-in duration-300 fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] max-w-md w-full">
        <h3 className="text-2xl font-black text-black mb-6 uppercase italic">Lupa Password</h3>
        
        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-500 mb-2">Masukkan email Anda untuk menerima kode reset.</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
            />
            <button
              onClick={onSendCode}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
            >
              Kirim Kode Reset
            </button>
          </div>
        ) : (
          <div className="space-y-4">
             <p className="text-sm font-bold text-slate-500 mb-2">Masukkan kode reset dan password baru Anda.</p>
             <input
              type="text"
              placeholder="Kode Reset (6 digit)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
            />
            <input
              type="password"
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
            />
            <input
              type="password"
              placeholder="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
            />
            <button
              onClick={onReset}
              className="w-full py-4 bg-green-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
            >
              Reset Password
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <button onClick={closeAndReset} className="text-xs font-bold text-slate-500 hover:text-black uppercase">
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}
