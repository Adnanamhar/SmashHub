"use client";

import { useState, useCallback } from 'react';
import type { Court } from '@/app/types';

export function useCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: '', price: '', status: 'Tersedia' });
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const fetchCourts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/courts');
      if (!res.ok) throw new Error('Fetch gagal');
      const data = await res.json();
      if (Array.isArray(data)) setCourts(data);
      else setCourts([]);
    } catch {
      setCourts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveCourt = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return { success: false, message: 'Nama dan harga harus diisi!' };

    if (editingCourt) {
      // UPDATE existing court
      const res = await fetch(`/api/courts/${editingCourt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          price: Number(form.price),
          status: form.status,
        }),
      });
      if (!res.ok) return { success: false, message: 'Gagal update lapangan!' };
      setEditingCourt(null);
      setForm({ name: '', type: '', price: '', status: 'Tersedia' });
      await fetchCourts();
      return { success: true, message: 'Lapangan berhasil diupdate!' };
    }

    // CREATE new court
    const res = await fetch('/api/courts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        type: form.type,
        price: Number(form.price),
        status: form.status,
      }),
    });
    if (!res.ok) return { success: false, message: 'Gagal simpan lapangan!' };

    setForm({ name: '', type: '', price: '', status: 'Tersedia' });
    await fetchCourts();
    return { success: true, message: 'Lapangan berhasil disimpan!' };
  }, [form, editingCourt, fetchCourts]);

  const handleDeleteCourt = useCallback(async (id: number) => {
    const res = await fetch(`/api/courts/${id}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: 'Gagal hapus lapangan!' };
    await fetchCourts();
    return { success: true, message: 'Lapangan berhasil dihapus!' };
  }, [fetchCourts]);

  const startEditCourt = useCallback((court: Court) => {
    setEditingCourt(court);
    setForm({
      name: court.name,
      type: court.type || '',
      price: String(court.price),
      status: court.status,
    });
  }, []);

  const cancelEditCourt = useCallback(() => {
    setEditingCourt(null);
    setForm({ name: '', type: '', price: '', status: 'Tersedia' });
  }, []);

  return {
    courts,
    isLoading,
    form,
    setForm,
    editingCourt,
    fetchCourts,
    handleSaveCourt,
    handleDeleteCourt,
    startEditCourt,
    cancelEditCourt,
  };
}
