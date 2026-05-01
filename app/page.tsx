"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  MapPin,
  Edit2,
  Trash2,
  ShieldCheck,
  Zap,
  Activity,
  User as UserIcon,
  Smartphone
} from 'lucide-react';

interface Court {
  id: number;
  name: string;
  price: number;
  status: string;
  type: string;
}

interface EventItem {
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

interface EventJoinItem {
  id: number;
  eventId: number;
  userId: string;
  joinedAt: string;
}

interface BookingItem {
  id: number;
  courtId: number;
  date: string;
  time: string;
  userId: string;
  status: string;
}

export default function SmashHubApp() {
  const [role, setRole] = useState('guest'); // guest, user, owner
  const [view, setView] = useState('home'); // home, dashboard
  const [showLogin, setShowLogin] = useState(false); // <--- TAMBAHKAN INI
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  // --- STATE UNTUK DATABASE ---
  const [courts, setCourts] = useState<Court[]>([]);
  // Ganti state form lama dengan ini
  const [form, setForm] = useState({ 
    name: '', 
    type: '', 
    price: '', 
    status: 'Tersedia' 
  });
  // State untuk menampung input event baru
  const [eventForm, setEventForm] = useState({ title: '', time: '', quota: '' });

  // --- STATE BOOKING ---
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<BookingItem[]>([]);
  const [allBookings, setAllBookings] = useState<BookingItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<number[]>([]);
  const [eventParticipants, setEventParticipants] = useState<Record<number, EventJoinItem[]>>({});

  // Fungsi fetch events dari database
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Fetch events gagal');
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
      else setEvents([]);
    } catch { setEvents([]); }
  };

  // Fungsi untuk menyimpan event ke Supabase
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.time) return;

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: eventForm.title,
        level: 'Beginner',
        time: eventForm.time,
        quota: Number(eventForm.quota) || 12,
      }),
    });

    setEventForm({ title: '', time: '', quota: '' });
    fetchEvents();
    alert("Event Berhasil di Publish!");
  };

  // Fungsi hapus lapangan
  const handleDeleteCourt = async (id: number) => {
    if (!confirm('Yakin ingin menghapus lapangan ini?')) return;
    await fetch(`/api/courts/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Fungsi join event
  const handleJoinEvent = async (event: EventItem) => {
    if (joinedEvents.includes(event.id)) {
      alert('Kamu sudah join event ini!');
      return;
    }
    const quota = event.quota || 12;
    const joined = event.joined || 0;
    if (joined >= quota) {
      alert('Kuota event sudah penuh!');
      return;
    }
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_1' }),
    });
    if (res.status === 409) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    if (!res.ok) { alert('Gagal join event!'); return; }
    alert(`Berhasil join event "${event.title}"!`);
    setJoinedEvents([...joinedEvents, event.id]);
    fetchEvents();
    fetchEventParticipants(event.id);
  };

  // Fetch peserta event (untuk owner)
  const fetchEventParticipants = async (eventId: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setEventParticipants(prev => ({ ...prev, [eventId]: data }));
      }
    } catch { /* ignore */ }
  };

  // Fetch all participants for all events (owner)
  const fetchAllParticipants = async () => {
    for (const event of events) {
      fetchEventParticipants(event.id);
    }
  };

  // --- BOOKING FUNCTIONS ---
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

  const fetchBookedSlots = async (courtId: number, date: string) => {
    try {
      const res = await fetch(`/api/bookings?courtId=${courtId}&date=${date}`);
      if (!res.ok) throw new Error('Gagal');
      const data = await res.json();
      if (Array.isArray(data)) setBookedSlots(data);
      else setBookedSlots([]);
    } catch { setBookedSlots([]); }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Gagal');
      const data = await res.json();
      if (Array.isArray(data)) setAllBookings(data);
      else setAllBookings([]);
    } catch { setAllBookings([]); }
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTime) {
      alert('Pilih lapangan, tanggal, dan jam terlebih dahulu!');
      return;
    }
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courtId: selectedCourt, date: selectedDate, time: selectedTime }),
    });
    if (res.status === 409) {
      alert('Slot sudah dibooking oleh orang lain!');
      return;
    }
    if (!res.ok) { alert('Gagal booking!'); return; }
    alert('Booking berhasil dikonfirmasi!');
    setSelectedTime('');
    fetchBookedSlots(selectedCourt, selectedDate);
    fetchAllBookings();
  };

  const isSlotBooked = (time: string) => {
    return bookedSlots.some(b => b.time === time);
  };
  
  // --- FUNGSI MENGAMBIL DATA (GET) ---
  const fetchData = async () => {
    try {
      const res = await fetch('/api/courts');
      if (!res.ok) throw new Error('Fetch gagal');

      const data = await res.json();
      
      // Pastikan data adalah array sebelum disimpan ke state
      if (Array.isArray(data)) {
        setCourts(data);
      } else {
        setCourts([]);
      }
    } catch (err) {
      // Menghapus console.error untuk menghindari peringatan ESLint
      // Anda bisa membiarkannya kosong atau menggantinya dengan state error UI
      setCourts([]);
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
      setView('dashboard');
    }
    fetchData();
    fetchEvents();
    fetchAllBookings();
  }, []);

  // Fetch participants when events change (for owner)
  useEffect(() => {
    if (events.length > 0) fetchAllParticipants();
  }, [events.length]);

  // Auto-fetch booked slots when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchBookedSlots(selectedCourt, selectedDate);
    }
  }, [selectedCourt, selectedDate]);

  // Auto-select first court and first date on dashboard load
  useEffect(() => {
    if (courts.length > 0 && !selectedCourt) {
      setSelectedCourt(courts[0].id);
    }
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [courts, selectedCourt, selectedDate]);
  

  // --- FUNGSI SIMPAN DATA (POST) ---
  const handleSaveCourt = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validasi agar semua field terisi
  if (!form.name || !form.type || !form.price) return;

  await fetch('/api/courts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name,
      type: form.type,
      price: Number(form.price),
      status: form.status
    }),
  });

  // Reset form kembali ke awal
  setForm({ name: '', type: '', price: '', status: 'Tersedia' });
  fetchData(); 
  };
  
  // events sekarang di-fetch dari database (lihat state & fetchEvents di atas)

  const handleLogin = (eOrRole?: React.FormEvent | string) => {
  // Jika dipanggil dengan string role langsung (dari tombol CTA)
  if (typeof eOrRole === 'string') {
    setRole(eOrRole);
    setView('dashboard');
    setShowLogin(false);
    localStorage.setItem('role', eOrRole);
    return;
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
    alert("Username atau Password salah! (Gunakan user/123 atau owner/123)");
    return;
  }

  setRole(found.role);
  setView('dashboard');
  setShowLogin(false);
  localStorage.setItem('role', found.role);
  };
  
  const handleLogout = () => {
    setRole('guest');
    setView('home');
    localStorage.removeItem('role');
  };

  // --- COMPONENTS ---

  const Navbar = () => (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        <div className="bg-red-600 p-2 rounded-lg">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white italic">SMASH<span className="text-blue-500">HUB</span></span>
      </div>

      <div className="flex items-center gap-4">
        {role === 'guest' ? (
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="px-6 py-2.5 text-xs font-black bg-blue-600 text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase tracking-widest"
          >
            {showLogin ? 'BATAL' : 'LOGIN KONSOL'}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full border-2 border-black font-bold text-[10px] uppercase tracking-wider ${role === 'owner' ? 'bg-red-500' : 'bg-blue-500'}`}>
               {role === 'owner' ? 'Owner Mode' : 'Player Mode'}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/10">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
  
  const Hero = () => (
    <section className="relative pt-24 pb-32 flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm text-red-500 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4 fill-current" /> Revolusi Booking Badminton
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
          SMASH LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">LEGEND.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Platform penyewaan lapangan tercanggih di Indonesia. Kelola jadwal, temukan lawan mabar, dan tingkatkan performa permainanmu.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setShowLogin(true)}
            className="px-10 py-5 bg-red-600 text-white font-black rounded-2xl text-lg hover:scale-[1.03] shadow-xl shadow-red-900/20 transition-all flex items-center gap-3"
          >
            Cari Lapangan Sekarang <ChevronRight className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-10 py-5 bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/10 transition-all shadow-sm">
            Lihat Event Mabar
          </button>
        </div>
      </div>
    </section>
  );

  const OwnerDashboard = () => (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Owner <span className="text-red-600">Dashboard</span></h2>
          <p className="text-slate-500 font-medium italic">Kelola operasional GOR Anda dengan efisien.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-8 border-b-4 border-black flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
                <LayoutDashboard className="w-6 h-6 text-blue-600" /> Status Lapangan Real-time
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                    <th className="p-6">Nama Lapangan</th>
                    <th className="p-6">Tipe</th>
                    <th className="p-6">Harga/Jam</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courts.map(court => (
                    <tr key={court.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-800">{court.name}</td>
                      <td className="p-6 text-slate-500 text-sm font-medium">{court.type || 'Reguler'}</td>
                      <td className="p-6 font-bold text-slate-700">Rp {Number(court.price).toLocaleString()}</td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          court.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {court.status || 'Tersedia'}
                        </span>
                      </td>
                      <td className="p-6 flex justify-center gap-2">
                        <button onClick={() => handleDeleteCourt(court.id)} className="p-2.5 bg-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-red-600 p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white">
            <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tighter leading-none">
              Input Data <br/> Lapangan
            </h3>
            
            <form onSubmit={handleSaveCourt} className="space-y-4">
              {/* Input Nama */}
              <input 
                type="text" 
                placeholder="Nama Lapangan (Alpha/Beta...)" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black" 
              />

              {/* Input Tipe */}
              <input 
                type="text" 
                placeholder="Tipe Lapangan (Vinyl/Interlock...)" 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})} 
                className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black" 
              />

              {/* Input Harga */}
              <input 
                type="number" 
                placeholder="Harga Sewa / Jam" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black" 
              />

              {/* Pilih Status */}
              <select 
                value={form.status} 
                onChange={e => setForm({...form, status: e.target.value})} 
                className="w-full bg-white text-black p-4 rounded-2xl outline-none font-bold border-4 border-transparent focus:border-black appearance-none"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Penuh">Penuh</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
                Simpan ke Database
              </button>
            </form>
          </div>
        </div>

        <div className="bg-red-600 p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white">
        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
          <Calendar className="text-white w-6 h-6" />
        </div>
        <h3 className="text-3xl font-black mb-4 uppercase italic leading-none">Buat Event <br/> Mabar GOR</h3>
        <p className="text-white/80 text-sm font-bold mb-8">Otomatiskan pengisian slot kosong lapangan Anda dengan sistem Mabar.</p>
        
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nama Event (Contoh: Mabar Pagi)" 
            value={eventForm.title}
            onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
            className="w-full bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black" 
          />
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Jam (Contoh: 08:00)" 
              value={eventForm.time}
              onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
              className="w-1/2 bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black" 
            />
            <input 
              type="number" 
              placeholder="Kuota" 
              value={eventForm.quota}
              onChange={(e) => setEventForm({...eventForm, quota: e.target.value})}
              className="w-1/2 bg-white text-black p-4 rounded-2xl outline-none text-sm font-bold border-4 border-transparent focus:border-black" 
            />
          </div>
          <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
            Publish Event Mabar
          </button>
        </form>
      </div>

      {/* BOOKING MASUK */}
      <div className="lg:col-span-3">
        <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
          <div className="p-8 border-b-4 border-black flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
              <Calendar className="w-6 h-6 text-red-600" /> Booking Masuk
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                  <th className="p-6">Lapangan</th>
                  <th className="p-6">Tanggal</th>
                  <th className="p-6">Jam</th>
                  <th className="p-6">User</th>
                  <th className="p-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-bold text-slate-800">{courts.find(c => c.id === b.courtId)?.name || `Court #${b.courtId}`}</td>
                    <td className="p-6 text-slate-500 text-sm font-medium">{b.date}</td>
                    <td className="p-6 font-bold text-slate-700">{b.time}</td>
                    <td className="p-6 text-slate-500 text-sm font-medium">{b.userId}</td>
                    <td className="p-6"><span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">{b.status}</span></td>
                  </tr>
                ))}
                {allBookings.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-400 italic">Belum ada booking masuk</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EVENT & PESERTA */}
      <div className="lg:col-span-3">
        <div className="bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
          <div className="p-8 border-b-4 border-black flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg uppercase tracking-tighter">
              <Users className="w-6 h-6 text-blue-600" /> Peserta Event Mabar
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {events.map(event => (
              <div key={event.id} className="border-2 border-slate-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-slate-800 uppercase">{event.title}</h4>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${(event.joined || 0) >= (event.quota || 12) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {event.joined || 0}/{event.quota || 12} Peserta
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(eventParticipants[event.id] || []).map(p => (
                    <span key={p.id} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">{p.userId}</span>
                  ))}
                  {(!eventParticipants[event.id] || eventParticipants[event.id].length === 0) && (
                    <p className="text-slate-400 text-sm italic">Belum ada peserta</p>
                  )}
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-center text-slate-400 italic">Belum ada event</p>}
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 text-slate-900">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Halo, <span className="text-blue-600">Champions!</span></h2>
          <p className="font-medium italic text-slate-500">Siapkan raketmu, lapangan sudah menanti.</p>
        </div>
        <div className="bg-white border-4 border-black p-4 rounded-[2rem] flex items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Smash Points</p>
            <p className="text-xl font-black text-slate-800">2.450 PTS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-10 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
               <Calendar className="w-7 h-7 text-red-600" /> Jadwal & Booking
            </h3>

            {/* Pilih Lapangan */}
            <div className="mb-6">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Pilih Lapangan</p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {courts.map(court => (
                  <button key={court.id} onClick={() => setSelectedCourt(court.id)} className={`min-w-[140px] p-4 rounded-2xl border-4 transition-all ${selectedCourt === court.id ? 'bg-red-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}>
                    <p className="font-black text-sm">{court.name}</p>
                    <p className="text-[10px] opacity-70 font-bold">Rp {Number(court.price).toLocaleString()}/jam</p>
                  </button>
                ))}
                {courts.length === 0 && <p className="text-slate-400 italic text-sm">Belum ada lapangan tersedia</p>}
              </div>
            </div>
            
            {/* Pilih Tanggal */}
            <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
              {getNext7Days().map((day) => (
                <button key={day.full} onClick={() => setSelectedDate(day.full)} className={`min-w-[90px] p-5 rounded-[2rem] border-4 transition-all ${selectedDate === day.full ? 'bg-blue-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                  <p className="text-[10px] uppercase font-black mb-1 opacity-70">{day.label}</p>
                  <p className="text-2xl font-black">{day.date}</p>
                </button>
              ))}
            </div>

            {/* Pilih Jam */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['08:00', '10:00', '14:00', '16:00', '19:00', '20:00', '21:00', '22:00'].map((time) => {
                const booked = isSlotBooked(time);
                return (
                  <button key={time} onClick={() => !booked && setSelectedTime(time)} disabled={booked} className={`p-4 rounded-2xl border-2 transition-all font-bold uppercase italic text-xs ${
                    booked ? 'bg-red-100 border-red-200 text-red-400 cursor-not-allowed line-through' :
                    selectedTime === time ? 'bg-blue-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' :
                    'border-slate-100 bg-slate-50/50 hover:border-red-600 hover:bg-white text-slate-600'
                  }`}>
                    {booked ? `${time} ✗` : time}
                  </button>
                );
              })}
            </div>
            
            <button onClick={handleBooking} className="w-full mt-10 py-5 bg-black text-white font-black rounded-[1.5rem] hover:bg-red-600 transition-all uppercase tracking-widest text-sm shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
              Konfirmasi Booking
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 px-2 uppercase tracking-tighter italic">
             <Users className="w-7 h-7 text-blue-600" /> Mabar Terpopuler
          </h3>
          {events.map(event => {
            const alreadyJoined = joinedEvents.includes(event.id);
            const isFull = (event.joined || 0) >= (event.quota || 12);
            return (
            <div key={event.id} className="bg-white border-4 border-black rounded-[2.5rem] p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group relative overflow-hidden text-slate-900">
              <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[1.5rem] text-[10px] font-black uppercase tracking-widest ${event.level === 'Advanced' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                {event.level}
              </div>
              <h4 className="text-xl font-black mb-4 group-hover:text-red-600 transition-colors uppercase tracking-widest italic">{event.title}</h4>
              <div className="space-y-4 text-sm font-bold text-slate-400 mb-8">
                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-blue-600" /> {event.time || (event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-')}</div>
                <div className="flex items-center gap-3"><Users className="w-5 h-5 text-red-600" /> Kuota: <span className={`${isFull ? 'text-red-600' : 'text-slate-800'}`}>{event.joined || 0}/{event.quota || 12}</span>{isFull && <span className="text-red-500 text-[10px] uppercase"> (Penuh)</span>}</div>
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-400" /> {event.owner || 'GOR SmashHub'}</div>
              </div>
              {alreadyJoined ? (
                <button disabled className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-default flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Sudah Join
                </button>
              ) : isFull ? (
                <button disabled className="w-full py-4 bg-slate-300 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest cursor-not-allowed">
                  Kuota Penuh
                </button>
              ) : (
                <button onClick={() => handleJoinEvent(event)} className="w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-blue-600 transition-all uppercase text-xs tracking-widest">
                  Join Event
                </button>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* LOGIN MODAL — accessible from any page */}
      {showLogin && (
        <div className="animate-in fade-in zoom-in duration-300 fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] max-w-md w-full">
            <h3 className="text-2xl font-black text-black mb-6 uppercase italic">Akses Konsol</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full p-4 rounded-xl border-2 border-black font-bold text-black outline-none focus:bg-slate-50"
              />
              <button
                onClick={() => handleLogin()}
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
              >
                Masuk Sekarang
              </button>
              <p className="text-[10px] text-slate-400 font-bold uppercase text-center">
                user: user/123 | owner: owner/123
              </p>
            </div>
          </div>
        </div>
      )}

      {Navbar()}
      
      {view === 'home' && (
        <div className="animate-in fade-in duration-1000">
          {Hero()}
          <section className="py-32 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { icon: <Calendar />, title: "Online Booking", color: "bg-red-50 text-red-600" },
                  { icon: <Clock />, title: "Real-time Slot", color: "bg-blue-50 text-blue-600" },
                  { icon: <Users />, title: "Mabar System", color: "bg-slate-900 text-white" },
                  { icon: <ShieldCheck />, title: "Verified GOR", color: "bg-red-50 text-red-600" }
                ].map((f, i) => (
                  <div key={i} className="p-10 rounded-[3rem] bg-white border-4 border-black hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                       {React.cloneElement(f.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter italic">{f.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">Premium badminton experience for champions.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-6 max-w-7xl mx-auto text-white">
            <div className="bg-black rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden border-4 border-red-600">
               <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
                  Siap Menjadi <span className="text-red-600">Legenda</span> Lapangan?
               </h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="px-12 py-5 bg-red-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">Mulai Main
                  </button>
                  <button onClick={() => setShowLogin(true)} className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">Daftar GOR</button>
               </div>
            </div>
          </section>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="bg-slate-50 min-h-[calc(100vh-80px)]">
          {role === 'owner' ? OwnerDashboard() : UserDashboard()}
        </div>
      )}

      <footer className="bg-black py-20 px-6 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3 text-white uppercase italic font-black text-2xl tracking-tighter">
              <Trophy className="text-red-600 w-8 h-8" /> SMASHHUB
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 SmashHub Neo-Brutalist.</p>
        </div>
      </footer>
    </div>
  );
}