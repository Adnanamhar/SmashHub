"use client";

import React from 'react';
import { LayoutDashboard, Calendar, Users, Trash2, Edit2, X as XIcon } from 'lucide-react';
import type { Court, EventItem, BookingItem, EventJoinItem } from '@/app/types';
import { SkeletonTable } from '@/app/components/Skeleton';

interface OwnerDashboardProps {
  courts: Court[];
  courtsLoading: boolean;
  form: { name: string; type: string; price: string; status: string };
  setForm: (f: { name: string; type: string; price: string; status: string }) => void;
  editingCourt: Court | null;
  handleSaveCourt: (e: React.FormEvent) => Promise<{ success: boolean; message: string }>;
  handleDeleteCourt: (id: number) => Promise<{ success: boolean; message: string }>;
  startEditCourt: (c: Court) => void;
  cancelEditCourt: () => void;
  events: EventItem[];
  eventForm: { title: string; time: string; quota: string };
  setEventForm: (f: { title: string; time: string; quota: string }) => void;
  handleSaveEvent: (e: React.FormEvent) => Promise<{ success: boolean; message: string }>;
  allBookings: BookingItem[];
  bookingsLoading: boolean;
  eventParticipants: Record<number, EventJoinItem[]>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function OwnerDashboard(props: OwnerDashboardProps) {
  const {
    courts, courtsLoading, form, setForm, editingCourt,
    handleSaveCourt, handleDeleteCourt, startEditCourt, cancelEditCourt,
    events, eventForm, setEventForm, handleSaveEvent,
    allBookings, bookingsLoading, eventParticipants, onSuccess, onError,
  } = props;

  const onSubmitCourt = async (e: React.FormEvent) => {
    const r = await handleSaveCourt(e);
    r.success ? onSuccess(r.message) : onError(r.message);
  };
  const onDeleteCourt = async (id: number) => {
    if (!confirm('Yakin ingin menghapus lapangan ini?')) return;
    const r = await handleDeleteCourt(id);
    r.success ? onSuccess(r.message) : onError(r.message);
  };
  const onSubmitEvent = async (e: React.FormEvent) => {
    const r = await handleSaveEvent(e);
    r.success ? onSuccess(r.message) : onError(r.message);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Owner <span className="text-red-600">Dashboard</span></h2>
          <p className="text-slate-500 font-medium italic">Kelola operasional GOR Anda dengan efisien.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Court Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-8 border-b-4 border-black flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
                <LayoutDashboard className="w-6 h-6 text-blue-600" /> Status Lapangan Real-time
              </h3>
            </div>
            {courtsLoading ? <SkeletonTable rows={3} /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                      <th className="p-6">Nama</th><th className="p-6">Tipe</th><th className="p-6">Harga/Jam</th><th className="p-6">Status</th><th className="p-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courts.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-bold text-slate-800">{c.name}</td>
                        <td className="p-6 text-slate-500 text-sm font-medium">{c.type || 'Reguler'}</td>
                        <td className="p-6 font-bold text-slate-700">Rp {Number(c.price).toLocaleString()}</td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${c.status==='Tersedia'?'bg-green-100 text-green-700':c.status==='Maintenance'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{c.status||'Tersedia'}</span>
                        </td>
                        <td className="p-6 flex justify-center gap-2">
                          <button onClick={()=>startEditCourt(c)} className="p-2.5 bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={()=>onDeleteCourt(c.id)} className="p-2.5 bg-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                    {courts.length===0&&<tr><td colSpan={5} className="p-6 text-center text-slate-400 italic">Belum ada lapangan</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Court Form */}
        <div className="space-y-8">
          <div className="bg-red-600 p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{editingCourt?<>Edit<br/>Lapangan</>:<>Input Data<br/>Lapangan</>}</h3>
              {editingCourt&&<button onClick={cancelEditCourt} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"><XIcon className="w-5 h-5 text-white"/></button>}
            </div>
            <form onSubmit={onSubmitCourt} className="space-y-4">
              <input type="text" placeholder="Nama Lapangan" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black"/>
              <input type="text" placeholder="Tipe Lapangan" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black"/>
              <input type="number" placeholder="Harga/Jam" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black"/>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black appearance-none">
                <option value="Tersedia">Tersedia</option><option value="Penuh">Penuh</option><option value="Maintenance">Maintenance</option>
              </select>
              <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">{editingCourt?'Update Lapangan':'Simpan ke Database'}</button>
            </form>
          </div>
        </div>

        {/* Event Form */}
        <div className="bg-red-600 p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white">
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6"><Calendar className="text-white w-6 h-6"/></div>
          <h3 className="text-3xl font-black mb-4 uppercase italic leading-none">Buat Event<br/>Mabar GOR</h3>
          <p className="text-white/80 text-sm font-bold mb-8">Otomatiskan pengisian slot kosong lapangan Anda.</p>
          <form onSubmit={onSubmitEvent} className="space-y-4">
            <input type="text" placeholder="Nama Event" value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} className="w-full bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black"/>
            <div className="flex gap-3">
              <input type="text" placeholder="Jam (08:00)" value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})} className="w-1/2 bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black"/>
              <input type="number" placeholder="Kuota" value={eventForm.quota} onChange={e=>setEventForm({...eventForm,quota:e.target.value})} className="w-1/2 bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black"/>
            </div>
            <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">Publish Event Mabar</button>
          </form>
        </div>

        {/* Booking Table */}
        <div className="lg:col-span-3">
          <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
            <div className="p-8 border-b-4 border-black bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter"><Calendar className="w-6 h-6 text-red-600"/> Booking Masuk</h3>
            </div>
            {bookingsLoading?<SkeletonTable rows={3}/>:(
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100"><th className="p-6">Lapangan</th><th className="p-6">Tanggal</th><th className="p-6">Jam</th><th className="p-6">User</th><th className="p-6">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {allBookings.map(b=><tr key={b.id} className="hover:bg-slate-50 transition-colors"><td className="p-6 font-bold text-slate-800">{courts.find(cc=>cc.id===b.courtId)?.name||`Court #${b.courtId}`}</td><td className="p-6 text-slate-500 text-sm font-medium">{b.date}</td><td className="p-6 font-bold text-slate-700">{b.time}</td><td className="p-6 text-slate-500 text-sm font-medium">{b.userId}</td><td className="p-6"><span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">{b.status}</span></td></tr>)}
                    {allBookings.length===0&&<tr><td colSpan={5} className="p-6 text-center text-slate-400 italic">Belum ada booking masuk</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Event Participants */}
        <div className="lg:col-span-3">
          <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
            <div className="p-8 border-b-4 border-black bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter"><Users className="w-6 h-6 text-blue-600"/> Peserta Event Mabar</h3>
            </div>
            <div className="p-6 space-y-6">
              {events.map(ev=>(
                <div key={ev.id} className="border-2 border-slate-100 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-800 uppercase">{ev.title}</h4>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${(ev.joined||0)>=(ev.quota||12)?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{ev.joined||0}/{ev.quota||12} Peserta</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(eventParticipants[ev.id]||[]).map(p=><span key={p.id} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">{p.userId}</span>)}
                    {(!eventParticipants[ev.id]||eventParticipants[ev.id].length===0)&&<p className="text-slate-400 text-sm italic">Belum ada peserta</p>}
                  </div>
                </div>
              ))}
              {events.length===0&&<p className="text-center text-slate-400 italic">Belum ada event</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
