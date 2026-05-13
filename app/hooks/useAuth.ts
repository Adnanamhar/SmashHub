"use client";

import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [role, setRole] = useState('guest');
  const [view, setView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Restore session on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
      setView('dashboard');
    }
  }, []);

  const handleLogin = useCallback((eOrRole?: React.FormEvent | string) => {
    // Called with string role directly (from CTA buttons)
    if (typeof eOrRole === 'string') {
      setRole(eOrRole);
      setView('dashboard');
      setShowLogin(false);
      localStorage.setItem('role', eOrRole);
      return { success: true, message: '' };
    }

    if (eOrRole) eOrRole.preventDefault();

    const akunDummy = [
      { username: "user", password: "123", role: "user" },
      { username: "owner", password: "123", role: "owner" },
    ];

    const found = akunDummy.find(
      acc => acc.username === loginForm.username && acc.password === loginForm.password
    );

    if (!found) {
      return { success: false, message: "Username atau Password salah! (Gunakan user/123 atau owner/123)" };
    }

    setRole(found.role);
    setView('dashboard');
    setShowLogin(false);
    localStorage.setItem('role', found.role);
    return { success: true, message: '' };
  }, [loginForm]);

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
    loginForm,
    setLoginForm,
    handleLogin,
    handleLogout,
  };
}
