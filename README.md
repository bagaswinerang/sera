# Sera - Asisten AI Pasar Modal Indonesia 📈

Sera adalah asisten AI (Artificial Intelligence) pintar yang dirancang khusus untuk menganalisis data pasar saham di Bursa Efek Indonesia (BEI) dan menjelaskannya kembali menggunakan bahasa manusia sehari-hari yang mudah dipahami, santai, dan tanpa jargon rumit.

Proyek ini dibangun untuk mendemokratisasi akses data keuangan bagi investor ritel maupun pemula.

## ✨ Fitur Utama
- **Penjelasan Bahasa Manusia:** Menerjemahkan angka-angka membingungkan (seperti PER, PBV, ROE) menjadi penjelasan sederhana yang bisa dimengerti siapa saja.
- **Perbandingan Saham:** Membandingkan 2-4 perusahaan sekaligus; pemenang tiap metrik dihitung oleh kode (bukan ditebak AI) dan tampil sebagai tabel.
- **Data Lengkap BEI:** Laporan perusahaan, laporan kuartalan, riwayat harga, berita, dividen, saham paling naik/turun, dan penyaring saham.
- **Saran Pertanyaan Lanjutan:** Selalu ada 3 saran pertanyaan di akhir jawaban. Jika model lupa membuatnya, server membuatkan cadangannya.
- **Guardrail Bilingual:** Deteksi *prompt injection* (ID/EN), menolak perintah di luar konteks BEI, dan tidak memberi saran investasi (setiap jawaban ditutup *disclaimer*).
- **Level Penjelasan:** Tersedia 2 mode: "Sederhana" (untuk pemula) dan "Detail" (untuk analisis komprehensif).
- **Tahan Gangguan:** Jika model Gemini utama sibuk, kena kuota, atau lambat, Sera otomatis pindah ke model cadangan.

## 🛠️ Tech Stack
Proyek ini dibangun menggunakan arsitektur *Monorepo*:

**Frontend:**
- [Next.js 16 (App Router)](https://nextjs.org) + React 19 - Framework React
- [Tailwind CSS 4](https://tailwindcss.com) - Styling
- [KaTeX](https://katex.org) - Rendering rumus matematika
- [Lucide React](https://lucide.dev) - Ikon UI

**Backend:**
- [Express 5](https://expressjs.com) + TypeScript - Node.js Server (Node 22+)
- [Vercel AI SDK 7](https://ai-sdk.dev) - Orchestrator LLM (Tool Calling & Streaming)
- [Google Gemini](https://ai.google.dev/gemini-api/docs/models) - LLM: `gemini-4-hydrogen` sebagai model utama, cadangan `gemini-3.8-flash` lalu `gemini-3.5-flash-lite`
- [Sectors API](https://sectors.app/api) - Penyedia data finansial BEI
- [Supabase](https://supabase.com) (opsional) - Cache respons API yang tahan restart

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Kloning Repository
```bash
git clone https://github.com/bagaswinerang/sera.git
cd sera
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```
- Isi API key di `.env`:
  - `GOOGLE_GENERATIVE_AI_API_KEY`: API key dari [Google AI Studio](https://aistudio.google.com)
  - `SECTORS_API_KEY`: API key dari Sectors
- Jalankan server:
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:8787`. Pengaturan lain (urutan model, timeout, cache) ada di [backend/README.md](backend/README.md).

### 3. Setup Frontend
Buka terminal baru:
```bash
cd frontend
npm install
cp .env.example .env.local
```
- Pastikan `.env.local` berisi URL backend (tanpa `/api`):
  - `NEXT_PUBLIC_API_URL=http://localhost:8787`
- Jalankan web:
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`

## 🧠 Arsitektur & Cara Kerja

Sera menggunakan arsitektur **Agentic AI** dengan pola *Tool Calling* dari Vercel AI SDK. Alur kerjanya:

1. **User bertanya** → Frontend mengirim riwayat chat ke backend (`POST /api/chat`).
2. **Backend (Orchestrator)** → Memeriksa pesan dengan *input guard* (deteksi prompt injection). Jika terblokir, Sera langsung membalas penolakan ramah tanpa memanggil LLM. Riwayat dirapikan (10 pesan terakhir, tool call yang menggantung dibuang).
3. **Jalan pintas definisi** → Untuk pertanyaan seperti "apa itu PER?", istilah dicari langsung di kamus server lalu disisipkan ke prompt, jadi LLM tidak perlu memanggil tool kamus (jawaban lebih cepat).
4. **LLM (Gemini)** → Memproses pertanyaan dan secara otonom memutuskan **tool** mana yang perlu dipanggil:
   - `get_company_report` — Profil, valuasi, dividen, keuangan, pesaing, proyeksi, manajemen, kepemilikan
   - `get_quarterly_financials` — Laporan keuangan per kuartal dan kestabilan laba
   - `screen_companies` — Mencari/menyaring perusahaan (mis. "bank terbesar")
   - `compare_companies` — Membandingkan metrik keuangan 2-4 emiten
   - `get_price_history` — Riwayat pergerakan harga (maks 90 hari)
   - `get_company_news` — Berita terkini perusahaan
   - `get_dividend_history` — Riwayat dan jadwal dividen
   - `get_market_movers` — Saham paling naik/turun
   - `lookup_glossary` — Definisi istilah pasar modal
   - `suggest_follow_up` — 3 saran pertanyaan lanjutan
5. **Sectors API** → Menyediakan data finansial BEI untuk tools di atas. Respons di-cache (memori + Supabase) dan pemakaian kredit dibatasi (`CREDIT_BUDGET`).
6. **Streaming Response** → Jawaban di-*stream* ke frontend sehingga user melihat respons secara *real-time*. Jika model tidak memanggil `suggest_follow_up`, server membuat saran cadangan dengan model ringan sebelum stream ditutup.

```
┌──────────────┐     Stream     ┌───────────────────┐   Tool Call   ┌─────────────┐
│   Frontend   │ ◄────────────► │  Backend (Agent)  │ ◄───────────► │ Sectors API │
│   Next.js    │                │ Express + AI SDK  │               │  Data BEI   │
└──────────────┘                └─────────┬─────────┘               └─────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │     Google Gemini     │
                              │ 4 Hydrogen → 3.8 Flash│
                              │   → 3.5 Flash-Lite    │
                              └───────────────────────┘
```

### 🔁 Fallback Model
Model dicoba berurutan. Jika satu model gagal (kuota habis/429, server sibuk/5xx, model tidak ada/404, jaringan putus) atau belum merespons dalam 10 detik, Sera pindah ke model berikutnya, dan model yang gagal dilewati sementara. Error karena API key/request salah (400/401/403) tidak di-fallback.

### 🛡️ Sistem Keamanan (Guardrail)
- **Layer 1 — Input Guard:** Mendeteksi pola *prompt injection* (bilingual ID/EN) dan memblokir tanpa memanggil LLM untuk menghemat kredit. Polanya dibuat ketat supaya pertanyaan normal (mis. "Bandingkan BBCA dan BBRI") tidak ikut terblokir.
- **Layer 2 — System Prompt:** Instruksi ketat agar LLM menolak perintah di luar konteks, tidak mengungkapkan *system prompt*, tidak mengarang angka, dan tidak memberikan saran investasi.
- **Layer 3 — Output Monitor:** Jawaban yang terdengar seperti saran investasi dicatat di log untuk evaluasi prompt. Karena jawaban di-*stream*, teks tidak diubah setelah terkirim; pencegahan utamanya ada di Layer 2.

### ✅ Pengujian
Backend punya tes otomatis (guardrail, riwayat chat, endpoint chat, fallback saran pertanyaan) yang memakai model tiruan, jadi tidak memakai kuota Gemini maupun kredit Sectors:
```bash
cd backend
npm test
npm run typecheck
```

---
> *Peringatan: Proyek ini dibuat untuk keperluan hackathon/edukasi. Informasi dan analisis yang disajikan oleh bot bukan merupakan saran investasi resmi.*
