# 📷 Sistem Presensi Sekolah Berbasis QR Code (Next.js Edition)

Aplikasi sistem presensi dan absensi pintar untuk **Siswa** dan **Guru** berbasis pemindai **QR Code** real-time dengan integrasi **Portal Orang Tua**, **Notifikasi WhatsApp Broadcast**, **Prisma ORM**, dan **PostgreSQL / Supabase**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Ringkasan Proyek

Aplikasi ini dirancang untuk menyederhanakan, mempercepat, dan meningkatkan akurasi pencatatan kehadiran di institusi sekolah (SD/SMP/SMA/SMK). Dilengkapi fitur pemindaian kamera instan tanpa hardware khusus (cukup webcam laptop/kamera HP), pelaporan kehadiran harian/bulanan otomatis, serta dashboard monitoring khusus untuk orang tua siswa.

---

## ✨ Fitur Unggulan

### 1. 🔍 Stasiun Pemindai QR Kamera Real-time (`/` & `/scan`)
- **Pindai Cepat**: Menggunakan modul `html5-qrcode` yang responsif membaca QR Code siswa dan guru.
- **Efek Suara Sintetis (Audio Feedback)**: Suara bip Web Audio API saat kartu QR berhasil terpindai.
- **Mode Fleksibel**: Beralih mudah antara mode **Absen Masuk** dan **Absen Pulang**.
- **Kartu Konfirmasi Instan**: Informasi nama, NIS/NUPTK, kelas/jabatan, jam kehadiran, dan status keterlambatan langsung muncul di layar.
- **Live Feed Kehadiran**: Ticker tabel data kehadiran terkini secara real-time.

### 2. 👨‍👩‍👧 Portal Orang Tua (`/ortu`)
- **Login Khusus Wali Murid**: Autentikasi menggunakan NIS anak atau nomor telepon terdaftar.
- **Pantau Kehadiran Real-time**: Orang tua dapat melihat riwayat kehadiran, jam masuk, jam pulang, dan status (Hadir, Sakit, Izin, Terlambat).
- **Pengaitan Multi-Anak**: Mendukung linking beberapa anak dalam satu akun orang tua.

### 3. 📝 Formulir & Manajemen Izin (`/izin` & `/admin/izin`)
- **Pengajuan Izin Mandiri**: Pengajuan izin tidak masuk sekolah (Sakit, Keperluan Keluarga, Dispensasi) lengkap dengan bukti pendukung.
- **Approval Admin/Wali Kelas**: Verifikasi dan persetujuan status izin langsung dari dashboard admin.

### 4. 🔎 Cek Presensi Mandiri (`/cek-presensi`)
- Fitur pencarian cepat riwayat kehadiran siswa/guru tanpa perlu masuk ke dashboard utama.

### 5. 🛡️ Portal Administrator & Petugas Piket (`/admin`)
- **Dashboard Statistik**: Metrik total siswa, total guru, persentase kehadiran hari ini, dan diagram tren 7 hari.
- **Manajemen Siswa (`/admin/siswa`)**: Tambah, edit, hapus, import massal via **Excel (`.xlsx`)**, serta preview & unduh QR Code siswa.
- **Manajemen Guru (`/admin/guru`)**: Manajemen data pendidik & cetak QR Code guru.
- **Manajemen Kelas & Jurusan (`/admin/kelas`)**: Pengelompokan rombongan belajar dan program keahlian.
- **Generator QR Code Batch (`/admin/generate-qr`)**: Cetak lembaran kartu QR Code siswa/guru sekaligus siap print.
- **Laporan & Ekspor (`/admin/laporan`)**: Rekap kehadiran harian/bulanan dengan filter kelas/tanggal, ekspor ke **Excel (`.xlsx`)** dan **PDF (jsPDF AutoTable)**.
- **Broadcast WhatsApp (`/admin/broadcast`)**: Pengiriman notifikasi kehadiran/ketidakhadiran siswa ke nomor WhatsApp orang tua secara terintegrasi.
- **Pengaturan Jam Presensi (`/admin/settings`)**: Konfigurasi batas jam masuk, toleransi terlambat, dan jam pulang.

---

## 🛠️ Tech Stack

| Komponen | Deskripsi |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/) dengan [PostgreSQL / Supabase](https://supabase.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons |
| **Scanner QR** | `html5-qrcode` & `qrcode` |
| **Export Engine** | `xlsx` (Excel) & `jspdf` + `jspdf-autotable` (PDF) |
| **Autentikasi** | Session-based / JWT Auth dengan `bcryptjs` |

---

## 📁 Struktur Direktori

```text
absensi-next-app/
├── prisma/
│   └── schema.prisma         # Skema database Prisma (PostgreSQL / Supabase)
├── public/                   # Aset gambar, suara, dan logo sekolah
├── src/
│   ├── app/
│   │   ├── admin/            # Halaman admin (siswa, guru, kelas, laporan, broadcast)
│   │   ├── api/              # Endpoint API backend (scan, auth, presensi, izin, settings)
│   │   ├── cek-presensi/     # Halaman pengecekan riwayat presensi mandiri
│   │   ├── izin/             # Halaman pengajuan izin & sakit
│   │   ├── login/            # Halaman masuk petugas / admin
│   │   ├── ortu/             # Portal login dan dashboard orang tua
│   │   ├── scan/             # Halaman pemindai QR mandiri
│   │   ├── globals.css       # Tailwind v4 tema dark glassmorphism
│   │   ├── layout.tsx        # Root layout aplikasi
│   │   └── page.tsx          # Halaman utama stasiun pemindai QR
│   ├── components/
│   │   ├── QRScanner.tsx     # Komponen pemindai kamera & audio feedback
│   │   └── ui/               # Komponen antarmuka (Button, Dialog, Card, Tabs, dll.)
│   ├── lib/                  # Database client, auth helper, dan utility
│   └── middleware.ts         # Middleware proteksi rute admin & ortu
├── .env.example              # Contoh variabel lingkungan
├── package.json
└── README.md
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat
- **Node.js** versi 18.18 atau lebih baru
- Database **PostgreSQL** (bisa menggunakan [Supabase](https://supabase.com), Neon, atau PostgreSQL lokal)

### 2. Kloning Repositori
```bash
git clone https://github.com/rayyanbabab/Absensi-QR-NextJS.git
cd Absensi-QR-NextJS
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi database pada `.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
JWT_SECRET="your-secret-key-here"
```

### 5. Sinkronisasi Database (Prisma)
Jalankan migrasi skema tabel ke database:
```bash
npx prisma db push
npx prisma generate
```

### 6. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui browser di: `http://localhost:3000`

---

## 📦 Build Produksi

Untuk membangun build versi produksi:
```bash
npm run build
npm run start
```

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Silakan digunakan dan dikembangkan untuk kemajuan digitalisasi sekolah.
