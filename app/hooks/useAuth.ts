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

  // Restore session on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
      setView('dashboard');
    }
  }, []);

  const handleLogin = useCallback(async (eOrRole?: React.FormEvent | string) => {
    // Called with string role directly (from CTA buttons in landing page dummy flow, 
    // but we can keep it for backwards compatibility if they click CTA, or we can just open login)
    if (typeof eOrRole === 'string') {
      // For real implementation we probably shouldn't auto login, but let's keep it as is if it's expected
      // Actually let's just open login if they try to use dummy login.
      setShowLogin(true);
      return { success: false, message: '' };
    }

    if (eOrRole) (eOrRole as React.FormEvent).preventDefault();

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
