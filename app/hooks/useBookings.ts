"use client";

import { useState, useEffect, useCallback } from 'react';
import type { BookingItem } from '@/app/types';

export function useBookings() {
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<BookingItem[]>([]);
  const [allBookings, setAllBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getNext7Days = useCallback(() => {
    const days = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        label: dayNames[d.getDay()],
        date: d.getDate(),
        full: d.toISOString().split('T')[0],
      });
    }
    return days;
  }, []);

  const fetchBookedSlots = useCallback(async (courtId: number, date: string) => {
    try {
      const res = await fetch(`/api/bookings?courtId=${courtId}&date=${date}`);
      if (!res.ok) throw new Error('Gagal');
      const data = await res.json();
      if (Array.isArray(data)) setBookedSlots(data);
      else setBookedSlots([]);
    } catch {
      setBookedSlots([]);
    }
  }, []);

  const fetchAllBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Gagal');
      const data = await res.json();
      if (Array.isArray(data)) setAllBookings(data);
      else setAllBookings([]);
    } catch {
      setAllBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBooking = useCallback(async () => {
    if (!selectedCourt || !selectedDate || !selectedTime) {
      return { success: false, message: 'Pilih lapangan, tanggal, dan jam terlebih dahulu!' };
    }

    // Optimistic update
    const optimisticSlot: BookingItem = {
      id: Date.now(),
      courtId: selectedCourt,
      date: selectedDate,
      time: selectedTime,
      userId: 'user_1',
      status: 'confirmed',
    };
    setBookedSlots(prev => [...prev, optimisticSlot]);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courtId: selectedCourt, date: selectedDate, time: selectedTime }),
    });

    if (res.status === 409) {
      // Rollback optimistic update
      setBookedSlots(prev => prev.filter(b => b.id !== optimisticSlot.id));
      return { success: false, message: 'Slot sudah dibooking oleh orang lain!' };
    }
    if (!res.ok) {
      setBookedSlots(prev => prev.filter(b => b.id !== optimisticSlot.id));
      return { success: false, message: 'Gagal booking!' };
    }

    setSelectedTime('');
    fetchBookedSlots(selectedCourt, selectedDate);
    fetchAllBookings();
    return { success: true, message: 'Booking berhasil dikonfirmasi!' };
  }, [selectedCourt, selectedDate, selectedTime, fetchBookedSlots, fetchAllBookings]);

  const handleCancelBooking = useCallback(async (bookingId: number) => {
    const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
    if (!res.ok) return { success: false, message: 'Gagal membatalkan booking!' };
    
    await fetchAllBookings();
    if (selectedCourt && selectedDate) {
      await fetchBookedSlots(selectedCourt, selectedDate);
    }
    return { success: true, message: 'Booking berhasil dibatalkan!' };
  }, [fetchAllBookings, fetchBookedSlots, selectedCourt, selectedDate]);

  const isSlotBooked = useCallback((time: string) => {
    return bookedSlots.some(b => b.time === time);
  }, [bookedSlots]);

  // Auto-select first date on mount
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  // Auto-fetch booked slots when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchBookedSlots(selectedCourt, selectedDate);
    }
  }, [selectedCourt, selectedDate, fetchBookedSlots]);

  return {
    selectedCourt,
    setSelectedCourt,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    bookedSlots,
    allBookings,
    isLoading,
    getNext7Days,
    fetchBookedSlots,
    fetchAllBookings,
    handleBooking,
    handleCancelBooking,
    isSlotBooked,
  };
}
