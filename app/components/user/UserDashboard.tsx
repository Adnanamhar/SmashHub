"use client";

import React, { useState } from 'react';
import { Trophy, Calendar, Clock, Users, MapPin, CheckCircle2, X as XIcon, AlertTriangle } from 'lucide-react';
import type { Court, EventItem, BookingItem } from '@/app/types';
import { SkeletonBookingPanel, SkeletonCard } from '@/app/components/Skeleton';

interface UserDashboardProps {
  courts: Court[];
  courtsLoading: boolean;
  selectedCourt: number | null;
  setSelectedCourt: (id: number) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  getNext7Days: () => { label: string; date: number; full: string }[];
  isSlotBooked: (time: string) => boolean;
  handleBooking: () => Promise<{ success: boolean; message: string }>;
  handleCancelBooking: (id: number) => Promise<{ success: boolean; message: string }>;
  allBookings: BookingItem[];
  events: EventItem[];
  eventsLoading: boolean;
  joinedEvents: number[];
  handleJoinEvent: (e: EventItem) => Promise<{ success: boolean; message: string }>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function UserDashboard(props: UserDashboardProps) {
  const {
    courts, courtsLoading, selectedCourt, setSelectedCourt,
    selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    getNext7Days, isSlotBooked, handleBooking, handleCancelBooking,
    allBookings, events, eventsLoading, joinedEvents, handleJoinEvent,
    onSuccess, onError,
  } = props;

  const [confirmingCancelId, setConfirmingCancelId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const onBook = async () => {
    const r = await handleBooking();
    r.success ? onSuccess(r.message) : onError(r.message);
  };
  const onJoin = async (ev: EventItem) => {
    const r = await handleJoinEvent(ev);
    r.success ? onSuccess(r.message) : onError(r.message);
  };
  const onCancel = async (id: number) => {
    if (confirmingCancelId !== id) {
      // First click — show confirmation
      setConfirmingCancelId(id);
      // Auto-reset after 3 seconds if user doesn't confirm
      setTimeout(() => setConfirmingCancelId(prev => prev === id ? null : prev), 3000);
      return;
    }
    // Second click — actually cancel
    setCancellingId(id);
    setConfirmingCancelId(null);
    const r = await handleCancelBooking(id);
    setCancellingId(null);
    r.success ? onSuccess(r.message) : onError(r.message);
  };

  const myBookings = allBookings.filter(b => b.userId === 'user_1');

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 text-slate-900">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Halo, <span className="text-blue-600">Champions!</span></h2>
          <p className="font-medium italic text-slate-500">Siapkan raketmu, lapangan sudah menanti.</p>
        </div>
        <div className="bg-white border-4 border-black p-4 rounded-[2rem] flex items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white"><Trophy className="w-6 h-6"/></div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Smash Points</p>
            <p className="text-xl font-black text-slate-800">2.450 PTS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Booking Panel */}
        <div className="lg:col-span-2 space-y-8">
          {courtsLoading ? <SkeletonBookingPanel /> : (
            <div className="bg-white border-4 border-black rounded-[2.5rem] p-10 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                <Calendar className="w-7 h-7 text-red-600"/> Jadwal & Booking
              </h3>
              {/* Court Selector */}
              <div className="mb-6">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Pilih Lapangan</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {courts.map(c=>(
                    <button key={c.id} onClick={()=>setSelectedCourt(c.id)} className={`min-w-[140px] p-4 rounded-2xl border-4 transition-all ${selectedCourt===c.id?'bg-red-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]':'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}>
                      <p className="font-black text-sm">{c.name}</p>
                      <p className="text-[10px] opacity-70 font-bold">Rp {Number(c.price).toLocaleString()}/jam</p>
                    </button>
                  ))}
                  {courts.length===0&&<p className="text-slate-400 italic text-sm">Belum ada lapangan tersedia</p>}
                </div>
              </div>
              {/* Date Selector */}
              <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                {getNext7Days().map(day=>(
                  <button key={day.full} onClick={()=>setSelectedDate(day.full)} className={`min-w-[90px] p-5 rounded-[2rem] border-4 transition-all ${selectedDate===day.full?'bg-blue-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]':'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                    <p className="text-[10px] uppercase font-black mb-1 opacity-70">{day.label}</p>
                    <p className="text-2xl font-black">{day.date}</p>
                  </button>
                ))}
              </div>
              {/* Time Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['08:00','10:00','14:00','16:00','19:00','20:00','21:00','22:00'].map(time=>{
                  const booked=isSlotBooked(time);
                  return(
                    <button key={time} onClick={()=>!booked&&setSelectedTime(time)} disabled={booked} className={`p-4 rounded-2xl border-2 transition-all font-bold uppercase italic text-xs ${
                      booked?'bg-red-100 border-red-200 text-red-400 cursor-not-allowed line-through':
                      selectedTime===time?'bg-blue-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]':
                      'border-slate-100 bg-slate-50/50 hover:border-red-600 hover:bg-white text-slate-600'
                    }`}>{booked?`${time} ✗`:time}</button>
                  );
                })}
              </div>
              <button onClick={onBook} className="w-full mt-10 py-5 bg-black text-white font-black rounded-[1.5rem] hover:bg-red-600 transition-all uppercase tracking-widest text-sm shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">Konfirmasi Booking</button>
            </div>
          )}

          {/* My Bookings — Improvement #9 */}
          {myBookings.length > 0 && (
            <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-8 border-b-4 border-black bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
                  <Calendar className="w-6 h-6 text-blue-600"/> Riwayat Booking Saya
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                    <th className="p-6">Lapangan</th><th className="p-6">Tanggal</th><th className="p-6">Jam</th><th className="p-6">Status</th><th className="p-6 text-center">Aksi</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {myBookings.map(b=>(
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-bold text-slate-800">{courts.find(c=>c.id===b.courtId)?.name||`Court #${b.courtId}`}</td>
                        <td className="p-6 text-slate-500 text-sm font-medium">{b.date}</td>
                        <td className="p-6 font-bold text-slate-700">{b.time}</td>
                        <td className="p-6"><span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">{b.status}</span></td>
                        <td className="p-6 text-center">
                          {cancellingId === b.id ? (
                            <span className="px-4 py-2 text-slate-400 text-xs font-black uppercase animate-pulse">Membatalkan...</span>
                          ) : confirmingCancelId === b.id ? (
                            <button onClick={()=>onCancel(b.id)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase hover:bg-red-700 transition-all flex items-center gap-1 mx-auto animate-in fade-in zoom-in duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                              <AlertTriangle className="w-3 h-3"/> Yakin? Batalkan
                            </button>
                          ) : (
                            <button onClick={()=>onCancel(b.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase hover:bg-red-200 transition-colors flex items-center gap-1 mx-auto">
                              <XIcon className="w-3 h-3"/> Batalkan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 px-2 uppercase tracking-tighter italic">
            <Users className="w-7 h-7 text-blue-600"/> Mabar Terpopuler
          </h3>
          {eventsLoading ? (
            <>{[1,2].map(i=><SkeletonCard key={i}/>)}</>
          ) : (
            events.map(ev=>{
              const joined=joinedEvents.includes(ev.id);
              const full=(ev.joined||0)>=(ev.quota||12);
              return(
                <div key={ev.id} className="bg-white border-4 border-black rounded-[2.5rem] p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group relative overflow-hidden text-slate-900">
                  <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[1.5rem] text-[10px] font-black uppercase tracking-widest ${ev.level==='Advanced'?'bg-red-600 text-white':'bg-blue-600 text-white'}`}>{ev.level}</div>
                  <h4 className="text-xl font-black mb-4 group-hover:text-red-600 transition-colors uppercase tracking-widest italic">{ev.title}</h4>
                  <div className="space-y-4 text-sm font-bold text-slate-400 mb-8">
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-blue-600"/> {ev.time||'-'}</div>
                    <div className="flex items-center gap-3"><Users className="w-5 h-5 text-red-600"/> Kuota: <span className={full?'text-red-600':'text-slate-800'}>{ev.joined||0}/{ev.quota||12}</span>{full&&<span className="text-red-500 text-[10px] uppercase"> (Penuh)</span>}</div>
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-400"/> {ev.owner||'GOR SmashHub'}</div>
                  </div>
                  {joined?(
                    <button disabled className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-default flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4"/> Sudah Join</button>
                  ):full?(
                    <button disabled className="w-full py-4 bg-slate-300 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest cursor-not-allowed">Kuota Penuh</button>
                  ):(
                    <button onClick={()=>onJoin(ev)} className="w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-blue-600 transition-all uppercase text-xs tracking-widest">Join Event</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
