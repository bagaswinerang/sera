# Sera - Asisten AI Pasar Modal Indonesia 📈

Sera adalah asisten AI (Artificial Intelligence) pintar yang dirancang khusus untuk menganalisis data pasar saham di Bursa Efek Indonesia (BEI) dan menjelaskannya kembali menggunakan bahasa manusia sehari-hari yang mudah dipahami, santai, dan tanpa jargon rumit.

Proyek ini dibangun untuk mendemokratisasi akses data keuangan bagi investor ritel maupun pemula.

## ✨ Fitur Utama
- **Penjelasan Bahasa Manusia:** Menerjemahkan angka-angka membingungkan (seperti PER, PBV, ROE) menjadi penjelasan sederhana yang bisa dimengerti siapa saja.
- **Perbandingan Saham:** Membandingkan kinerja beberapa perusahaan sekaligus dan menyajikannya secara cerdas.
- **Saran Pertanyaan AI (AI Wizard):** Memberikan rekomendasi pertanyaan lanjutan secara cerdas di akhir setiap jawaban.
- **Bilingual & Guardrail:** Deteksi injeksi *prompt*, menolak perintah di luar konteks BEI, dan mengubah kalimat bernada "saran investasi" menjadi penjelasan objektif yang disertai *disclaimer*.
- **Level Penjelasan:** Tersedia 2 mode: "Sederhana" (untuk pemula) dan "Detail" (untuk analisis komprehensif).

## 🛠️ Tech Stack
Proyek ini dibangun menggunakan arsitektur *Monorepo*:

**Frontend:**
- [Next.js 15 (App Router)](https://nextjs.org) - Framework React
- [Tailwind CSS](https://tailwindcss.com) + [Framer Motion](https://www.framer.com/motion/) - Styling & Animasi modern
- [KaTeX](https://katex.org) - Rendering rumus matematika
- [Lucide React](https://lucide.dev) - Ikon UI

**Backend:**
- [Express.js](https://expressjs.com) - Node.js Server
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Orchestrator integrasi LLM (Tool Calling & Streaming)
- [Google Gemini Pro](https://deepmind.google/technologies/gemini/) - LLM Engine (Core Intelligence)
- [Sectors API](https://sectors.app/api) - Penyedia data finansial BEI real-time

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Kloning Repository
```bash
git clone https://github.com/username/sera.git
cd sera
```

### 2. Setup Backend
```bash
cd backend
npm install
```
- Salin `.env.example` menjadi `.env`
- Masukkan API Key kamu:
  - `GEMINI_API_KEY`: API dari Google AI Studio
  - `SECTORS_API_KEY`: API dari aplikasi Sectors
- Jalankan server:
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:8787`

### 3. Setup Frontend
Buka terminal baru:
```bash
cd frontend
npm install
```
- Buat file `.env.local`
- Isi variabel berikut:
  - `NEXT_PUBLIC_API_URL=http://localhost:8787/api`
- Jalankan web:
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`

## 🧠 Arsitektur & Cara Kerja

Sera menggunakan arsitektur **Agentic AI** dengan pola *Tool Calling* dari Vercel AI SDK. Alur kerjanya:

1. **User bertanya** → Frontend mengirim pesan ke backend via streaming HTTP.
2. **Backend (Orchestrator)** → Menerima pesan, memvalidasi input melalui **3-layer guardrail** (deteksi prompt injection, sanitasi output, dan instruksi defense-in-depth di system prompt).
3. **LLM (Gemini)** → Memproses pertanyaan dan secara otonom memutuskan **tool** mana yang perlu dipanggil berdasarkan konteks pertanyaan.
4. **Tool Calling** → LLM memanggil fungsi-fungsi data seperti:
   - `lookup_glossary` — Mencari definisi istilah pasar modal
   - `compare_companies` — Membandingkan metrik keuangan beberapa emiten
   - `get_price_history` — Mengambil riwayat pergerakan harga saham
   - `get_company_news` — Mengambil berita terkini perusahaan
   - `get_dividend_history` — Riwayat dan jadwal dividen
   - `get_market_movers` — Saham paling naik/turun hari ini
   - `suggest_follow_up` — Menghasilkan 3 saran pertanyaan lanjutan secara cerdas
5. **Sectors API** → Menyediakan data finansial BEI *real-time* yang dipanggil oleh tools di atas.
6. **Streaming Response** → Jawaban di-*stream* token-per-token ke frontend sehingga user bisa melihat respons secara *real-time* tanpa menunggu seluruh jawaban selesai di-generate.

```
┌─────────────┐     Stream      ┌──────────────────┐    Tool Call    ┌─────────────┐
│   Frontend   │ ◄────────────► │  Backend (Agent)  │ ◄────────────► │ Sectors API │
│   Next.js    │                │  Express + AI SDK │                │  Data BEI   │
└─────────────┘                └────────┬─────────┘                └─────────────┘
                                        │
                                        ▼
                                ┌──────────────┐
                                │  Google Gemini │
                                │     (LLM)     │
                                └──────────────┘
```

### 🛡️ Sistem Keamanan (Guardrail)
- **Layer 1 — Input Guard:** Mendeteksi pola *prompt injection* (bilingual ID/EN) dan memblokir tanpa memanggil LLM untuk menghemat kredit.
- **Layer 2 — System Prompt:** Instruksi ketat agar LLM menolak perintah di luar konteks, tidak mengungkapkan *system prompt*, dan tidak memberikan saran investasi.
- **Layer 3 — Output Guard:** Menyaring jawaban LLM dari kalimat bernada "saran investasi" dan menggantinya dengan penjelasan objektif + *disclaimer*.

---
> *Peringatan: Proyek ini dibuat untuk keperluan hackathon/edukasi. Informasi dan analisis yang disajikan oleh bot bukan merupakan saran investasi resmi.*
