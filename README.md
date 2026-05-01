# 🏸 SmashHub — Platform Penyewaan Lapangan Badminton

SmashHub adalah platform berbasis web untuk penyewaan lapangan badminton secara online dan real-time. Dibangun dengan desain **Neo-Brutalist** yang modern, SmashHub menghubungkan pemilik GOR (owner) dan pemain (user) dalam satu ekosistem yang terintegrasi.

## 🔗 Link Penting

| Item | Link |
|------|------|
| 🌐 **Deploy (Vercel)** | [smash-hub-gamma.vercel.app](https://smash-hub-gamma.vercel.app/) |
| 📦 **Repository GitHub** | [github.com/Adnanamhar/SmashHub](https://github.com/Adnanamhar/SmashHub) |

## 📸 Screenshot

> *Screenshot akan ditambahkan setelah deployment*

## ✨ Fitur Utama

### 👤 Sisi User (Pemain)
- Login dengan akun dummy (`user/123`)
- Booking lapangan **real-time** (pilih lapangan → tanggal → jam)
- Slot yang sudah dibooking **otomatis ditandai** dan tidak bisa dipilih
- Join event **Mabar** (Main Bareng) dengan validasi kuota
- Indikator **"Sudah Join"** agar tidak join berkali-kali
- Tampilan sisa kuota event secara real-time

### 🏢 Sisi Owner (Pemilik GOR)
- Login dengan akun dummy (`owner/123`)
- **CRUD Lapangan**: Tambah, lihat, dan hapus lapangan
- **Tabel Booking Masuk**: Melihat semua booking dari user
- **Buat Event Mabar**: Publish event dengan kuota
- **Daftar Peserta Event**: Melihat siapa saja yang join setiap event

### 🔐 Sistem Autentikasi
- Login via popup modal (tombol "LOGIN KONSOL" di navbar)
- Semua CTA button mengarahkan ke login terlebih dahulu
- Session tersimpan di `localStorage`

## 🛠️ Teknologi yang Digunakan

| Teknologi | Fungsi |
|-----------|--------|
| **Next.js 16** | Framework React full-stack (App Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first CSS framework |
| **Supabase** | Backend-as-a-Service (PostgreSQL + REST API) |
| **Lucide React** | Icon library |
| **Vercel** | Hosting & Deployment |

## 📊 Arsitektur Database (Supabase)

| Tabel | Deskripsi | Kolom Utama |
|-------|-----------|-------------|
| `Court` | Data lapangan | `id`, `name`, `price`, `status`, `ownerId` |
| `Event` | Data event mabar | `id`, `title`, `level`, `date`, `time`, `quota`, `owner`, `courtId` |
| `Booking` | Data booking lapangan | `id`, `courtId`, `date`, `time`, `userId`, `status` |
| `EventJoin` | Data peserta event | `id`, `eventId`, `userId`, `joinedAt` |

## 🚀 Cara Menjalankan Lokal

```bash
# 1. Clone repository
git clone <URL_REPO>
cd smashhub

# 2. Install dependencies
npm install

# 3. Buat file .env
# Isi dengan:
# NEXT_PUBLIC_SUPABASE_URL=<URL_SUPABASE_ANDA>
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY_ANDA>

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Akun Login
| Role | Username | Password |
|------|----------|----------|
| User (Pemain) | `user` | `123` |
| Owner (Pemilik GOR) | `owner` | `123` |

---

## 🧪 Hasil Pengujian Kualitas Aplikasi

Pengujian dilakukan berdasarkan aspek kualitas perangkat lunak sesuai standar **ISO 25010**.

### 1. Functional Suitability (Kesesuaian Fungsional)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------------|-------------------|----------------------|--------------|--------|
| F01 | Login sebagai User | Klik LOGIN KONSOL → input `user/123` → Masuk Sekarang | Masuk ke User Dashboard | Berhasil masuk ke User Dashboard | ✅ Passed |
| F02 | Login sebagai Owner | Klik LOGIN KONSOL → input `owner/123` → Masuk Sekarang | Masuk ke Owner Dashboard | Berhasil masuk ke Owner Dashboard | ✅ Passed |
| F03 | Login dengan kredensial salah | Input username/password salah → Masuk | Muncul alert error | Muncul alert "Username atau Password salah!" | ✅ Passed |
| F04 | Logout | Klik tombol logout di navbar | Kembali ke halaman home sebagai guest | Berhasil kembali ke home, role menjadi guest | ✅ Passed |
| F05 | Tambah lapangan (Owner) | Isi form nama, tipe, harga → Simpan ke Database | Lapangan muncul di tabel | Lapangan berhasil tersimpan dan muncul di tabel | ✅ Passed |
| F06 | Hapus lapangan (Owner) | Klik ikon trash pada lapangan → Konfirmasi | Lapangan terhapus dari tabel | Lapangan berhasil dihapus dari tabel dan database | ✅ Passed |
| F07 | Booking lapangan (User) | Pilih lapangan → tanggal → jam → Konfirmasi Booking | Booking tersimpan, slot berubah merah | Booking tersimpan, slot bertanda ✗ dan tidak bisa diklik | ✅ Passed |
| F08 | Booking slot yang sudah terisi | Pilih slot yang sudah merah/booked | Tidak bisa diklik | Tombol disabled, tidak bisa diklik | ✅ Passed |
| F09 | Buat event mabar (Owner) | Isi nama event, jam, kuota → Publish | Event muncul di daftar user | Event berhasil tersimpan dan tampil di sisi user | ✅ Passed |
| F10 | Join event (User) | Klik "Join Event" pada event tersedia | Berhasil join, tombol berubah hijau "Sudah Join" | Berhasil join, tombol berubah hijau dengan ikon ✓ | ✅ Passed |
| F11 | Join event yang sudah di-join | Klik tombol "Sudah Join" | Tidak bisa join ulang | Tombol disabled (hijau), alert "Sudah join" jika dicoba | ✅ Passed |
| F12 | Join event kuota penuh | Klik Join pada event dengan kuota 0 sisa | Muncul pesan "Kuota Penuh" | Tombol berubah abu-abu "Kuota Penuh", tidak bisa diklik | ✅ Passed |
| F13 | Owner melihat peserta event | Buka Owner Dashboard → lihat "Peserta Event Mabar" | Tampil daftar user yang join | Tampil badge nama user per event | ✅ Passed |
| F14 | Owner melihat booking masuk | Buka Owner Dashboard → lihat "Booking Masuk" | Tampil tabel booking | Tampil tabel booking dengan lapangan, tanggal, jam, user | ✅ Passed |

### 2. Usability (Kemudahan Penggunaan)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------------|-------------------|----------------------|--------------|--------|
| U01 | Navigasi antar halaman | Klik logo SmashHub, tombol CTA, navbar | Perpindahan halaman lancar tanpa error | Navigasi berjalan lancar, animasi transisi halus | ✅ Passed |
| U02 | Responsif di mobile | Buka di viewport 375px | Layout menyesuaikan tanpa overflow | Layout responsif, grid berubah ke 1 kolom | ✅ Passed |
| U03 | Feedback aksi pengguna | Lakukan booking, join event, tambah lapangan | Muncul feedback (alert/visual) setiap aksi | Alert muncul untuk setiap aksi, visual berubah sesuai | ✅ Passed |
| U04 | Form tidak auto-scroll | Input data di form Owner Dashboard | Halaman tidak scroll ke atas saat mengetik | Halaman tetap di posisi form saat mengetik | ✅ Passed |
| U05 | Indikator status jelas | Lihat status booking dan event | Warna badge sesuai status | Hijau = tersedia/confirmed, Merah = penuh/booked | ✅ Passed |

### 3. Reliability (Keandalan)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------------|-------------------|----------------------|--------------|--------|
| R01 | Data persisten setelah refresh | Tambah lapangan → refresh halaman | Data tetap ada | Data tetap tampil dari database Supabase | ✅ Passed |
| R02 | Validasi duplikat booking | Booking slot yang sama 2x | Ditolak dengan pesan error | Server mengembalikan error 409 "Slot sudah dibooking" | ✅ Passed |
| R03 | Validasi duplikat join event | Join event yang sama 2x | Ditolak | Server mengembalikan error 409 "Sudah join" | ✅ Passed |
| R04 | Handling API error | Akses API dengan data invalid | Tidak crash, tampil error message | Aplikasi tetap berjalan, error di-handle dengan alert | ✅ Passed |
| R05 | Session persist setelah refresh | Login → refresh halaman | Tetap login | Role tersimpan di localStorage, tetap login setelah refresh | ✅ Passed |

### 4. Performance Efficiency (Efisiensi Performa)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------------|-------------------|----------------------|--------------|--------|
| P01 | Waktu load halaman | Buka halaman utama | Load < 3 detik | Halaman tampil dalam ~1-2 detik | ✅ Passed |
| P02 | Responsivitas API | Fetch data lapangan dan event | Response < 1 detik | API merespons dalam ~200-500ms | ✅ Passed |
| P03 | Rendering komponen | Navigasi antar dashboard | Tidak ada lag/freeze | Transisi halus dengan animasi, tidak ada lag | ✅ Passed |

### 5. Security (Keamanan)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------------|-------------------|----------------------|--------------|--------|
| S01 | Proteksi halaman dashboard | Akses dashboard tanpa login | Tidak bisa akses | Dashboard hanya muncul jika role bukan 'guest' | ✅ Passed |
| S02 | Environment variables | Cek `.env` di repository | Tidak ter-expose di GitHub | `.env` sudah ada di `.gitignore`, tidak ter-push | ✅ Passed |
| S03 | Row Level Security Supabase | Akses database | RLS aktif di semua tabel | Semua tabel memiliki RLS policy | ✅ Passed |

### Ringkasan Hasil Pengujian

| Aspek Kualitas | Jumlah Test | Passed | Failed | Persentase |
|----------------|-------------|--------|--------|------------|
| Functional Suitability | 14 | 14 | 0 | **100%** |
| Usability | 5 | 5 | 0 | **100%** |
| Reliability | 5 | 5 | 0 | **100%** |
| Performance Efficiency | 3 | 3 | 0 | **100%** |
| Security | 3 | 3 | 0 | **100%** |
| **Total** | **30** | **30** | **0** | **100%** |

---

## 📁 Struktur Project

```
smashhub/
├── app/
│   ├── api/
│   │   ├── bookings/route.ts    # API booking (GET, POST)
│   │   ├── courts/
│   │   │   ├── route.ts          # API courts (GET, POST)
│   │   │   └── [id]/route.ts     # API court delete (DELETE)
│   │   └── events/
│   │       ├── route.ts          # API events (GET, POST)
│   │       └── [id]/route.ts     # API join event (GET, POST)
│   ├── lib/supabase.ts           # Supabase client
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page (semua UI)
├── prisma/
│   ├── schema.prisma             # Database schema reference
│   ├── create_booking_table.sql  # SQL script tabel Booking
│   └── create_eventjoin_table.sql # SQL script tabel EventJoin
├── .env                          # Environment variables (not in git)
├── .gitignore
├── package.json
└── README.md
```

## 👥 Tim Pengembang

| Nama | NIM | Role |
|------|-----|------|
| *[Isi nama]* | *[Isi NIM]* | *[Isi role]* |

## 📝 Lisensi

Project ini dibuat untuk keperluan **Tugas Besar Praktikum Mobile** — 2026.
