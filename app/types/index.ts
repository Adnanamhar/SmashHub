// ==============================
// SmashHub — Shared TypeScript Types
// ==============================

export interface Court {
  id: number;
  name: string;
  price: number;
  status: string;
  type: string;
}

export interface EventItem {
  id: number;
  title: string;
  level: string;
  date: string;
  courtId: number;
  time?: string;
  quota?: number;
  owner?: string;
  joined?: number;
}

export interface EventJoinItem {
  id: number;
  eventId: number;
  userId: string;
  joinedAt: string;
}

export interface BookingItem {
  id: number;
  courtId: number;
  date: string;
  time: string;
  userId: string;
  status: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
