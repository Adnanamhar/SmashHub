"use client";

import { useState, useCallback } from 'react';
import type { EventItem, EventJoinItem } from '@/app/types';

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<number[]>([]);
  const [eventParticipants, setEventParticipants] = useState<Record<number, EventJoinItem[]>>({});
  const [eventForm, setEventForm] = useState({ title: '', time: '', quota: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Fetch events gagal');
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
      else setEvents([]);
    } catch {
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEventParticipants = useCallback(async (eventId: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setEventParticipants(prev => ({ ...prev, [eventId]: data }));
      }
    } catch { /* ignore */ }
  }, []);

  const fetchAllParticipants = useCallback(async (eventList: EventItem[]) => {
    for (const event of eventList) {
      fetchEventParticipants(event.id);
    }
  }, [fetchEventParticipants]);

  const handleSaveEvent = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.time) {
      return { success: false, message: 'Nama event dan jam harus diisi!' };
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: eventForm.title,
        level: 'Beginner',
        time: eventForm.time,
        quota: Number(eventForm.quota) || 12,
      }),
    });

    if (!res.ok) return { success: false, message: 'Gagal menyimpan event!' };

    setEventForm({ title: '', time: '', quota: '' });
    await fetchEvents();
    return { success: true, message: 'Event berhasil di-publish!' };
  }, [eventForm, fetchEvents]);

  const handleJoinEvent = useCallback(async (event: EventItem) => {
    if (joinedEvents.includes(event.id)) {
      return { success: false, message: 'Kamu sudah join event ini!' };
    }
    const quota = event.quota || 12;
    const joined = event.joined || 0;
    if (joined >= quota) {
      return { success: false, message: 'Kuota event sudah penuh!' };
    }

    // Optimistic update
    setJoinedEvents(prev => [...prev, event.id]);

    const res = await fetch(`/api/events/${event.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_1' }),
    });

    if (res.status === 409) {
      const data = await res.json();
      // Rollback
      setJoinedEvents(prev => prev.filter(id => id !== event.id));
      return { success: false, message: data.error };
    }
    if (!res.ok) {
      setJoinedEvents(prev => prev.filter(id => id !== event.id));
      return { success: false, message: 'Gagal join event!' };
    }

    await fetchEvents();
    fetchEventParticipants(event.id);
    return { success: true, message: `Berhasil join event "${event.title}"!` };
  }, [joinedEvents, fetchEvents, fetchEventParticipants]);

  return {
    events,
    joinedEvents,
    eventParticipants,
    eventForm,
    setEventForm,
    isLoading,
    fetchEvents,
    fetchEventParticipants,
    fetchAllParticipants,
    handleSaveEvent,
    handleJoinEvent,
  };
}
