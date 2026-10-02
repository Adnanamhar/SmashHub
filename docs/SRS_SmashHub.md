# 📄 Software Requirements Specification (SRS)

## SmashHub — Sistem Sewa Lapangan Badminton Online

---

| **Informasi Dokumen** | **Detail** |
|------------------------|------------|
| Nama Proyek | SmashHub |
| Versi Dokumen | 1.0 |
| Tanggal | 29 September 2026 |
| Jenis Aplikasi | Web Application |
| Tech Stack | Next.js 16, React 19, TypeScript, Supabase PostgreSQL, Tailwind CSS 4, Prisma ORM |
| URL Repository | DP7_RK_SewaLapangan |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum](#2-deskripsi-umum)
3. [Kebutuhan Fungsional](#3-kebutuhan-fungsional)
4. [Kebutuhan Non-Fungsional](#4-kebutuhan-non-fungsional)
5. [Model Data](#5-model-data)
6. [Matriks Fitur vs Teknik Testing](#6-matriks-fitur-vs-teknik-testing)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan kebutuhan perangkat lunak (Software Requirements Specification) untuk aplikasi **SmashHub**, sebuah sistem sewa lapangan badminton berbasis web. Dokumen ini berfungsi sebagai acuan utama untuk pengembangan, pengujian, dan validasi sistem.

### 1.2 Ruang Lingkup

SmashHub adalah platform web yang memfasilitasi penyewaan lapangan badminton secara online. Sistem ini mendukung dua aktor utama — **Player (User)** dan **Owner Lapangan** — dengan fitur mulai dari autentikasi, manajemen lapangan, booking, hingga event mabar (main bareng).

### 1.3 Definisi & Akronim

| Istilah | Definisi |
|---------|----------|
| **Player / User** | Pengguna yang ingin booking lapangan atau join event mabar |
| **Owner** | Pemilik GOR yang mengelola lapangan dan event |
| **Mabar** | Main Bareng — event bermain badminton bersama |
| **Booking** | Reservasi slot waktu pada lapangan tertentu |
| **EP** | Equivalence Partitioning — teknik testing |
| **BVA** | Boundary Value Analysis — teknik testing |
| **CRUD** | Create, Read, Update, Delete |

### 1.4 Referensi

- Project Readiness Checklist (Table 5.2)
- Implementation Plan SmashHub v1.0
- Prisma Schema (`prisma/schema.prisma`)

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk

SmashHub merupakan aplikasi web *single-page application* (SPA) yang dibangun menggunakan Next.js dengan server-side API routes. Data disimpan di database PostgreSQL yang di-host pada Supabase. Aplikasi ini berjalan di browser modern dan tidak memerlukan instalasi khusus.

### 2.2 Aktor / Peran Pengguna

| Aktor | Deskripsi | Akses Fitur |
|-------|-----------|-------------|
| **Guest** | Pengunjung yang belum login | Melihat landing page, Login, Register, Forgot Password |
| **Player (User)** | Pengguna terdaftar dengan role `user` | Booking Lapangan, Pembatalan Booking, Join Event Mabar |
| **Owner** | Pengguna terdaftar dengan role `owner` | CRUD Lapangan, Buat Event Mabar, Lihat Booking & Peserta |

### 2.3 Peta 8 Fitur Utama

| No | Fitur | Kategori | Aktor |
|----|-------|----------|-------|
| F-01 | Login | Auth (Wajib) | Guest |
| F-02 | Register | Auth (Wajib) | Guest |
| F-03 | Forgot Password | Auth (Wajib) | Guest |
| F-04 | CRUD Lapangan | Tambahan | Owner |
| F-05 | Booking Lapangan | Tambahan | User |
| F-06 | Pembatalan Booking | Tambahan | User |
| F-07 | Buat Event Mabar | Tambahan | Owner |
| F-08 | Join Event Mabar | Tambahan | User |

### 2.4 Batasan Sistem

- Sistem tidak mengimplementasikan hashing password (plain text untuk keperluan demo & testing).
- Reset token dikirim secara simulasi (log di server console), bukan melalui email asli.
- Sistem tidak mengimplementasikan JWT/session token; role disimpan di `localStorage`.
- Pembayaran tidak termasuk dalam scope sistem ini.

---

## 3. Kebutuhan Fungsional

---

### F-01: Login

| Atribut | Detail |
|---------|--------|
| **ID** | F-01 |
| **Nama** | Login |
| **Aktor** | Guest |
| **Deskripsi** | Sistem harus memungkinkan pengguna untuk masuk ke dalam sistem menggunakan username dan password yang sudah terdaftar. |
| **Pre-condition** | Pengguna sudah memiliki akun terdaftar di database. |
| **Post-condition** | Pengguna berhasil masuk, role disimpan, dan diarahkan ke dashboard sesuai role. |
| **API Endpoint** | `POST /api/auth/login` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `username` | String | Ya | Tidak boleh kosong |
| `password` | String | Ya | Tidak boleh kosong |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-01-R1 | Username dan password wajib diisi | `400` — "Username dan password wajib diisi" |
| F-01-R2 | Username tidak ditemukan di database | `404` — "Username tidak ditemukan" |
| F-01-R3 | Password tidak cocok dengan data di database | `401` — "Password salah" |
| F-01-R4 | Username dan password cocok | `200` — `{ success: true, role: "user"/"owner" }` |

**Output Sukses:**

```json
{
  "success": true,
  "role": "user",
  "message": "Login berhasil"
}
```

---

### F-02: Register

| Atribut | Detail |
|---------|--------|
| **ID** | F-02 |
| **Nama** | Register |
| **Aktor** | Guest |
| **Deskripsi** | Sistem harus memungkinkan pengguna baru untuk mendaftarkan akun dengan mengisi data profil dan memilih role. |
| **Pre-condition** | Pengguna belum memiliki akun. |
| **Post-condition** | Akun baru tersimpan di database, pengguna diarahkan ke halaman login. |
| **API Endpoint** | `POST /api/auth/register` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `username` | String | Ya | 3–20 karakter, hanya alfanumerik (`a-z`, `A-Z`, `0-9`) |
| `email` | String (Email) | Ya | Format email valid (mengandung `@` dan domain) |
| `password` | String | Ya | Minimal 6 karakter, maksimal 50 karakter |
| `confirmPassword` | String | Ya | Harus sama dengan `password` (validasi client-side) |
| `full_name` | String | Ya | Tidak boleh kosong |
| `phone` | String | Tidak | Opsional, format bebas |
| `role` | String | Ya | Hanya `"user"` atau `"owner"` |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-02-R1 | Username kurang dari 3 karakter | `400` — "Username tidak valid (3-20 karakter, alfanumerik)" |
| F-02-R2 | Username lebih dari 20 karakter | `400` — "Username tidak valid (3-20 karakter, alfanumerik)" |
| F-02-R3 | Username mengandung karakter non-alfanumerik | `400` — "Username tidak valid (3-20 karakter, alfanumerik)" |
| F-02-R4 | Format email tidak valid | `400` — "Format email tidak valid" |
| F-02-R5 | Password kurang dari 6 karakter | `400` — "Password minimal 6 karakter, maksimal 50" |
| F-02-R6 | Password lebih dari 50 karakter | `400` — "Password minimal 6 karakter, maksimal 50" |
| F-02-R7 | Nama lengkap kosong | `400` — "Nama lengkap wajib diisi" |
| F-02-R8 | Role bukan `"user"` atau `"owner"` | `400` — "Role tidak valid" |
| F-02-R9 | Username sudah digunakan oleh akun lain | `409` — "Username atau email sudah digunakan" |
| F-02-R10 | Email sudah digunakan oleh akun lain | `409` — "Username atau email sudah digunakan" |
| F-02-R11 | Konfirmasi password tidak cocok | Ditolak client-side — "Password tidak cocok" |
| F-02-R12 | Semua validasi berhasil | `201` — "Registrasi berhasil" |

**Boundary Values (untuk BVA testing):**

| Field | Min Valid | Min Invalid | Max Valid | Max Invalid |
|-------|-----------|-------------|-----------|-------------|
| `username` length | 3 | 2 | 20 | 21 |
| `password` length | 6 | 5 | 50 | 51 |

**Output Sukses:**

```json
{
  "success": true,
  "message": "Registrasi berhasil"
}
```

---

### F-03: Forgot Password (Reset Password)

| Atribut | Detail |
|---------|--------|
| **ID** | F-03 |
| **Nama** | Forgot Password |
| **Aktor** | Guest |
| **Deskripsi** | Sistem harus memungkinkan pengguna yang lupa password untuk me-reset password melalui proses 2 langkah: (1) Request kode reset via email, (2) Verifikasi kode dan buat password baru. |
| **Pre-condition** | Pengguna sudah memiliki akun terdaftar. |
| **Post-condition** | Password pengguna berhasil diubah, token reset dihapus. |

#### F-03a: Request Kode Reset

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `POST /api/auth/forgot-password` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `email` | String (Email) | Ya | Format email valid |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-03-R1 | Format email tidak valid | `400` — "Format email tidak valid" |
| F-03-R2 | Email tidak terdaftar di database | `404` — "Email tidak terdaftar" |
| F-03-R3 | Email valid dan terdaftar | `200` — Generate token 6 digit, simpan di DB dengan expiry 15 menit |

#### F-03b: Reset Password

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `POST /api/auth/reset-password` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `email` | String (Email) | Ya | — |
| `token` | String | Ya | 6 digit kode reset |
| `new_password` | String | Ya | Minimal 6 karakter |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-03-R4 | Salah satu field kosong | `400` — "Semua field wajib diisi" |
| F-03-R5 | Password baru kurang dari 6 karakter | `400` — "Password baru minimal 6 karakter" |
| F-03-R6 | User tidak ditemukan berdasarkan email | `404` — "User tidak ditemukan" |
| F-03-R7 | Token tidak cocok dengan yang tersimpan | `400` — "Kode reset tidak valid" |
| F-03-R8 | Token sudah expired (> 15 menit) | `400` — "Kode reset sudah expired" |
| F-03-R9 | Semua validasi berhasil | `200` — Password diupdate, token dihapus |

**State Diagram — Forgot Password Workflow:**

```
[Guest] → Input Email → [Kode Terkirim] → Input Kode + Password Baru → [Password Direset] → Kembali ke Login
              ↓ (gagal)                           ↓ (gagal)
        [Email Error]                      [Token Invalid / Expired]
```

---

### F-04: CRUD Lapangan

| Atribut | Detail |
|---------|--------|
| **ID** | F-04 |
| **Nama** | CRUD Lapangan |
| **Aktor** | Owner |
| **Deskripsi** | Sistem harus memungkinkan owner untuk membuat, melihat, mengubah, dan menghapus data lapangan badminton. |
| **Pre-condition** | Pengguna sudah login sebagai Owner. |
| **Post-condition** | Data lapangan tersimpan/terupdate/terhapus di database. |

#### F-04a: Create Lapangan

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `POST /api/courts` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `name` | String | Ya | Tidak boleh kosong |
| `price` | Integer | Ya | Harus berupa angka, tidak boleh kosong |
| `status` | String | Tidak | Default: `"Tersedia"`. Nilai valid: `"Tersedia"`, `"Maintenance"` |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-04-R1 | Nama lapangan kosong | Ditolak client-side — "Nama dan harga harus diisi!" |
| F-04-R2 | Harga kosong | Ditolak client-side — "Nama dan harga harus diisi!" |
| F-04-R3 | Data valid | `200` — Lapangan tersimpan ke database |

#### F-04b: Read Lapangan

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `GET /api/courts` |

**Output:** Array of `Court` objects, diurutkan berdasarkan `id` ascending.

#### F-04c: Update Lapangan

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `PUT /api/courts/{id}` |

**Input:** Sama dengan Create, ditambah `id` dari lapangan yang diedit.

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-04-R4 | ID lapangan tidak ditemukan | `500` — Error |
| F-04-R5 | Data valid | `200` — Lapangan berhasil diupdate |

#### F-04d: Delete Lapangan

| Atribut | Detail |
|---------|--------|
| **API Endpoint** | `DELETE /api/courts/{id}` |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-04-R6 | ID valid | `200` — "Lapangan berhasil dihapus" |

**Equivalence Partitioning (Harga):**

| Kelas | Nilai | Hasil yang Diharapkan |
|-------|-------|----------------------|
| Valid | Angka positif (contoh: `50000`) | Tersimpan |
| Invalid | Kosong (`""`) | Ditolak |
| Invalid | Non-numerik (contoh: `"abc"`) | Ditolak / `NaN` |

---

### F-05: Booking Lapangan

| Atribut | Detail |
|---------|--------|
| **ID** | F-05 |
| **Nama** | Booking Lapangan |
| **Aktor** | User (Player) |
| **Deskripsi** | Sistem harus memungkinkan user untuk memesan slot waktu pada lapangan yang tersedia. |
| **Pre-condition** | User sudah login. Ada minimal 1 lapangan tersedia. |
| **Post-condition** | Booking tersimpan di database dengan status `confirmed`. Slot menjadi tidak tersedia. |
| **API Endpoint** | `POST /api/bookings` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `courtId` | Integer | Ya | ID lapangan yang valid |
| `date` | String (ISO date) | Ya | Format `YYYY-MM-DD`, dalam rentang 7 hari ke depan |
| `time` | String | Ya | Format jam (contoh: `"08:00"`, `"09:00"`, dst.) |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-05-R1 | Lapangan, tanggal, atau jam belum dipilih | Ditolak client-side — "Pilih lapangan, tanggal, dan jam terlebih dahulu!" |
| F-05-R2 | Slot (courtId + date + time) sudah dibooking | `409` — "Slot sudah dibooking!" |
| F-05-R3 | Slot tersedia | `200` — Booking tersimpan dengan status `confirmed` |

**Business Rule — Conflict Detection:**

Sistem melakukan pengecekan unik berdasarkan kombinasi 3 field: `courtId` + `date` + `time`. Jika kombinasi tersebut sudah ada di tabel `Booking`, maka request ditolak (HTTP 409 Conflict).

---

### F-06: Pembatalan Booking

| Atribut | Detail |
|---------|--------|
| **ID** | F-06 |
| **Nama** | Pembatalan Booking |
| **Aktor** | User (Player) |
| **Deskripsi** | Sistem harus memungkinkan user untuk membatalkan booking yang sudah dikonfirmasi. |
| **Pre-condition** | User sudah login. Terdapat booking yang aktif milik user. |
| **Post-condition** | Data booking dihapus dari database. Slot kembali tersedia. |
| **API Endpoint** | `DELETE /api/bookings/{id}` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `id` | Integer (URL param) | Ya | ID booking yang valid |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-06-R1 | ID booking valid dan ditemukan | `200` — "Booking berhasil dibatalkan" |
| F-06-R2 | ID booking tidak valid / tidak ditemukan | `500` — Error |

---

### F-07: Buat Event Mabar

| Atribut | Detail |
|---------|--------|
| **ID** | F-07 |
| **Nama** | Buat Event Mabar |
| **Aktor** | Owner |
| **Deskripsi** | Sistem harus memungkinkan owner untuk membuat event main bareng (mabar) dengan informasi judul, waktu, dan kuota peserta. |
| **Pre-condition** | Owner sudah login. |
| **Post-condition** | Event tersimpan di database, tampil di daftar event untuk user. |
| **API Endpoint** | `POST /api/events` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `title` | String | Ya | Tidak boleh kosong |
| `time` | String | Ya | Tidak boleh kosong (format jam, contoh: `"19:00"`) |
| `quota` | Integer | Tidak | Default: `12`. Harus berupa angka |
| `level` | String | Tidak | Default: `"Beginner"` |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-07-R1 | Judul event kosong | Ditolak client-side — "Nama event dan jam harus diisi!" |
| F-07-R2 | Jam event kosong | Ditolak client-side — "Nama event dan jam harus diisi!" |
| F-07-R3 | Data valid | `200` — Event tersimpan |

**Equivalence Partitioning (Kuota):**

| Kelas | Nilai | Hasil yang Diharapkan |
|-------|-------|----------------------|
| Valid | Angka positif (contoh: `12`, `8`, `20`) | Tersimpan |
| Default | Kosong / tidak diisi | Tersimpan dengan default `12` |
| Invalid | Non-numerik (contoh: `"abc"`) | Tersimpan sebagai `NaN` atau `12` |

---

### F-08: Join Event Mabar

| Atribut | Detail |
|---------|--------|
| **ID** | F-08 |
| **Nama** | Join Event Mabar |
| **Aktor** | User (Player) |
| **Deskripsi** | Sistem harus memungkinkan user untuk bergabung ke event mabar yang tersedia, selama kuota belum penuh dan user belum pernah join. |
| **Pre-condition** | User sudah login. Terdapat event yang tersedia. |
| **Post-condition** | User terdaftar sebagai peserta event. Jumlah `joined` bertambah. |
| **API Endpoint** | `POST /api/events/{id}` |

**Input:**

| Field | Tipe | Wajib | Validasi |
|-------|------|-------|----------|
| `id` | Integer (URL param) | Ya | ID event yang valid |
| `userId` | String (Body) | Ya | ID pengguna |

**Aturan Bisnis:**

| ID | Aturan | Response |
|----|--------|----------|
| F-08-R1 | Event tidak ditemukan | `404` — "Event tidak ditemukan" |
| F-08-R2 | Kuota event sudah penuh (`joined >= quota`) | `409` — "Kuota event sudah penuh!" |
| F-08-R3 | User sudah pernah join event yang sama | `409` — "Kamu sudah join event ini!" |
| F-08-R4 | Semua validasi berhasil | `200` — User berhasil terdaftar |

**State Diagram — Join Event:**

```
[Event Tersedia] → User klik "Join"
    ↓
[Cek Kuota] → Penuh? → 409 "Kuota penuh"
    ↓ (Tersedia)
[Cek Duplikat] → Sudah join? → 409 "Sudah join"
    ↓ (Belum)
[Join Berhasil] → Peserta bertambah
```

---

## 4. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
|----|----------|-----------|
| NF-01 | **Performa** | Semua API endpoint harus merespons dalam waktu < 3 detik pada kondisi normal. |
| NF-02 | **Kompatibilitas** | Aplikasi harus berjalan di browser modern (Chrome, Firefox, Safari, Edge versi terbaru). |
| NF-03 | **Responsivitas** | UI harus responsif dan dapat digunakan pada layar desktop (≥1024px) dan mobile (≥375px). |
| NF-04 | **Ketersediaan Data** | Menggunakan Supabase PostgreSQL sebagai database yang tersedia 24/7. |
| NF-05 | **User Experience** | Sistem memberikan feedback visual (toast notification) untuk setiap aksi pengguna — baik sukses maupun gagal. |
| NF-06 | **Testability** | Semua fitur harus dapat diuji melalui API endpoint (automated testing) dan melalui UI (manual testing). |
| NF-07 | **Validasi Input** | Validasi dilakukan pada dua level: client-side (form/UI) dan server-side (API route). |

---

## 5. Model Data

### 5.1 Entity Relationship

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│   User   │       │  Court   │       │   Booking    │
├──────────┤       ├──────────┤       ├──────────────┤
│ id (PK)  │       │ id (PK)  │◄──────│ courtId (FK) │
│ username │       │ name     │       │ date         │
│ email    │       │ type     │       │ time         │
│ password │       │ price    │       │ userId       │
│ full_name│       │ status   │       │ status       │
│ phone    │       │ owner_id │       └──────────────┘
│ role     │       └──────────┘
│ reset_   │
│  token   │       ┌──────────┐       ┌──────────────┐
│ reset_   │       │  Event   │       │  EventJoin   │
│  token_  │       ├──────────┤       ├──────────────┤
│  expiry  │       │ id (PK)  │◄──────│ eventId (FK) │
│ created_ │       │ title    │       │ userId       │
│  at      │       │ level    │       │ joinedAt     │
└──────────┘       │ time     │       └──────────────┘
                   │ quota    │
                   │ joined   │
                   │ owner    │
                   │ court_id │
                   └──────────┘
```

### 5.2 Tabel Database

#### Tabel `User`

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PK` | Auto-increment |
| `username` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Alfanumerik, 3-20 karakter |
| `email` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Format email valid |
| `password` | `VARCHAR(255)` | `NOT NULL` | Plain text (demo) |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | — |
| `phone` | `VARCHAR(20)` | `DEFAULT ''` | Opsional |
| `role` | `VARCHAR(10)` | `DEFAULT 'user'` | `"user"` atau `"owner"` |
| `reset_token` | `VARCHAR(255)` | `NULLABLE` | Token reset 6 digit |
| `reset_token_expiry` | `TIMESTAMPTZ` | `NULLABLE` | Waktu expiry token |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

#### Tabel `Court`

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PK` | Auto-increment |
| `name` | `VARCHAR` | `NOT NULL` | Nama lapangan |
| `type` | `VARCHAR` | `DEFAULT 'Reguler'` | Tipe lapangan |
| `price` | `INTEGER` | `NOT NULL` | Harga sewa (Rupiah) |
| `status` | `VARCHAR` | `DEFAULT 'Tersedia'` | `"Tersedia"` / `"Maintenance"` |
| `owner_id` | `VARCHAR` | `DEFAULT 'owner_1'` | ID pemilik |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

#### Tabel `Event`

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PK` | Auto-increment |
| `title` | `VARCHAR` | `NOT NULL` | Nama event |
| `level` | `VARCHAR` | `DEFAULT 'Beginner'` | Level pemain |
| `time` | `VARCHAR` | `NOT NULL` | Jam pelaksanaan |
| `quota` | `INTEGER` | `NOT NULL` | Kuota peserta |
| `joined` | `INTEGER` | `DEFAULT 0` | Jumlah yang join |
| `owner` | `VARCHAR` | `DEFAULT 'GOR SmashHub'` | Penyelenggara |
| `court_id` | `INTEGER` | `NULLABLE` | ID lapangan terkait |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | — |

#### Tabel `Booking`

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PK` | Auto-increment |
| `courtId` | `INTEGER` | `NOT NULL` | FK ke Court |
| `date` | `VARCHAR` | `NOT NULL` | Format `YYYY-MM-DD` |
| `time` | `VARCHAR` | `NOT NULL` | Format jam `HH:MM` |
| `userId` | `VARCHAR` | `DEFAULT 'user_1'` | ID user yang booking |
| `status` | `VARCHAR` | `DEFAULT 'confirmed'` | Status booking |

#### Tabel `EventJoin`

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PK` | Auto-increment |
| `eventId` | `INTEGER` | `NOT NULL` | FK ke Event |
| `userId` | `VARCHAR` | `NOT NULL` | ID user yang join |
| `joinedAt` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu join |

---

## 6. Matriks Fitur vs Teknik Testing

Tabel ini menunjukkan kesesuaian setiap fitur dengan teknik pengujian yang dapat diterapkan:

| Fitur | EP | BVA | State-Based | Business Rule | CRUD | Workflow |
|-------|:--:|:---:|:-----------:|:-------------:|:----:|:--------:|
| **F-01** Login | ✅ | — | ✅ | ✅ | — | — |
| **F-02** Register | ✅ | ✅ | — | ✅ | — | — |
| **F-03** Forgot Password | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **F-04** CRUD Lapangan | ✅ | — | ✅ | — | ✅ | — |
| **F-05** Booking | ✅ | — | ✅ | ✅ | — | ✅ |
| **F-06** Pembatalan Booking | — | — | ✅ | — | — | ✅ |
| **F-07** Buat Event | ✅ | — | — | — | ✅ | — |
| **F-08** Join Event | — | — | ✅ | ✅ | — | ✅ |

**Keterangan:**
- **EP (Equivalence Partitioning):** Tersedia pada fitur dengan input teks/numerik yang memiliki kelas valid & invalid (username, email, password, harga, kuota).
- **BVA (Boundary Value Analysis):** Tersedia pada fitur dengan batas nilai (panjang username: 3–20, panjang password: 6–50).
- **State-Based:** Tersedia pada fitur yang melibatkan perubahan status (login state, token status, booking status, kuota event).
- **Business Rule:** Tersedia pada fitur dengan logika bisnis khusus (duplikat username, slot conflict, kuota penuh).
- **CRUD:** Tersedia pada fitur dengan operasi Create/Read/Update/Delete lengkap.
- **Workflow:** Tersedia pada fitur dengan alur multi-step (forgot password 2-step, booking flow, join event flow).

---

*Dokumen ini dibuat berdasarkan analisis source code aktual proyek SmashHub dan berfungsi sebagai acuan untuk development dan pengujian perangkat lunak.*
