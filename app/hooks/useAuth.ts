"use client";

import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [role, setRole] = useState('guest');
  const [view, setView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    full_name: '', phone: '', role: 'user'
  });

  // Bersihkan sesi lama saat pertama kali load (keamanan)
  useEffect(() => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }, []);

  const handleLogin = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      
      if (!data.success) return { success: false, message: data.message };
      
      setRole(data.role);
      setView('dashboard');
      setShowLogin(false);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: 'Gagal menghubungi server' };
    }
  }, [loginForm]);

  const handleRegister = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Gagal menghubungi server' };
    }
  }, [registerForm]);

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Gagal menghubungi server' };
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string, token: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, new_password: newPassword })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Gagal menghubungi server' };
    }
  }, []);

  const handleLogout = useCallback(() => {
    setRole('guest');
    setView('home');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }, []);

  return {
    role,
    view,
    setView,
    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister,
    showForgotPassword,
    setShowForgotPassword,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    handleLogout,
  };
}
