# TempoMatch — Direktori Lagu berdasarkan BPM dan Mood untuk DJ

**Tugas Akhir Praktikum PPB Ganjil 2026**  
- **Nama:** Hamka Muhammad  
- **NIM:** 21120124120038  
- **Judul:** TempoMatch (Direktori lagu berdasarkan BPM dan Mood untuk DJ)  
- **Bahasa / Platform:** JavaScript / Progressive Web App (PWA) + RESTful API (Node.js + Express.js + Supabase)

## Fitur Utama
1. **Tracks Directory (`/`)** — Daftar lagu dengan filter BPM, filter Mood, pencarian judul/artis/genre/key, dan fitur **Tap Tempo** interaktif.
2. **Track Detail (`/tracks/:id`)** — Detail lengkap BPM, Camelot Key, Energy level, DJ Cue Notes, tombol Edit/Hapus, simpan ke Crate, serta rekomendasi lagu transisi (±4 BPM).
3. **Moods Directory (`/moods`)** — Daftar kategori mood DJ (*Euphoric*, *Dark & Hypnotic*, *Groovy / Funky*, *Chill / Deep*, *High Energy*, *Melodic*).
4. **Mood Detail (`/moods/:id`)** — Deskripsi mood, rentang BPM, dan daftar lagu dalam mood tersebut.
5. **DJ Crates (`/crates`) & Crate Detail (`/crates/:id`)** — Manajemen setlist/crate DJ beserta rata-rata BPM.
6. **Tambah / Edit Lagu (`/add`)** — Form CRUD lagu langsung ke Supabase melalui API.
7. **Profile & About (`/about`)** — Profil praktikan, informasi aplikasi, status koneksi API, dan tombol Install PWA.

---

## Cara Setup & Menjalankan

### 1. Setup Database Supabase
1. Buat project baru di [Supabase](https://supabase.com/).
2. Buka **SQL Editor** → jalankan isi file `supabase/schema.sql`.
3. Jalankan isi file `supabase/seed.sql` untuk mengisi data awal (moods, tracks, crates).
4. Salin **Project URL** dan **anon public key** dari **Project Settings → Data API / API Keys**.

### 2. Menjalankan Backend API (Modul 1)
```bash
cd backend
npm install
# Isi SUPABASE_URL dan SUPABASE_KEY pada file .env
npm run dev
```
API berjalan di `http://localhost:3000`.

### 3. Menjalankan Frontend PWA
```bash
cd frontend
npm install
# Pastikan VITE_API_URL di .env mengarah ke URL backend (http://localhost:3000/api atau URL Vercel)
npm run dev
```

### 4. Deploy ke Vercel (Gratis)
1. Upload folder `TempoMatch` ke repository **GitHub**.
2. Deploy folder `backend` sebagai project Node.js/Express di **Vercel** (tambahkan env `SUPABASE_URL` dan `SUPABASE_KEY`).
3. Deploy folder `frontend` sebagai project Vite di **Vercel** (tambahkan env `VITE_API_URL=https://<url-backend-vercel>.vercel.app/api`).

