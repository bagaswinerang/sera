# Sera Backend

Backend agent chat Sera: Express 5 + TypeScript + Vercel AI SDK 7 + Gemini (dengan fallback model) + API Sectors + cache Supabase (opsional).
Butuh **Node 22 atau lebih baru**.

## Mulai cepat
```bash
npm install
cp .env.example .env       # lalu isi SECTORS_API_KEY dan GOOGLE_GENERATIVE_AI_API_KEY
npm run typecheck          # harus bersih
npm run dev                # http://localhost:8787
```

## Endpoint
| Method | Path | Fungsi |
|---|---|---|
| GET | `/health` | cek hidup, membalas `{"ok":true}` |
| POST | `/api/chat` | chat dengan Sera, respons SSE (streaming) |

Body `POST /api/chat`:
```json
{
  "messages": [{ "id": "1", "role": "user", "parts": [{ "type": "text", "text": "Apa itu PER?" }] }],
  "level": "simple"
}
```
`level` opsional: `"simple"` (default) atau `"detail"`. Untuk percakapan lanjutan, kirim RIWAYAT LENGKAP (termasuk part tool dari jawaban sebelumnya).

Error sebelum streaming berupa JSON `{"error":"..."}`: 400 (input salah), 429 (lebih dari 20 permintaan per 10 menit per IP), 500 (server/konfigurasi).


## Konfigurasi `.env`
| Variabel | Wajib | Keterangan |
|---|---|---|
| `SECTORS_API_KEY` | ya | dari onboarding hackathon Sectors |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ya | dari Google AI Studio |
| `GEMINI_MODELS` | tidak | model berurutan; default `gemini-3.8-flash,gemini-3.7-flash,gemini-3.6-flash,gemini-3.5-flash` |
| `PORT` | tidak | default 8787 |
| `FRONTEND_ORIGIN` | tidak | origin yang diizinkan CORS, default `http://localhost:3000` (boleh banyak, pisah koma) |
| `TRUST_PROXY` | tidak | isi `1` bila di belakang proxy hosting |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | tidak | cache tahan restart; jalankan `supabase/schema.sql` dulu |

## Fallback model
Bila model pertama gagal dengan 404/408/429/5xx atau jaringan putus, otomatis mencoba model berikutnya (model yang baru gagal dilewati sementara). 400/401/403 tidak di-fallback. Fallback hanya terjadi sebelum jawaban mulai mengalir.

## Struktur
```
src/
  index.ts                 entry point
  app.ts                   Express: cors + routes + error handler
  config/env.ts            satu-satunya tempat membaca .env
  routes/                  URL -> controller
  controllers/             urus request/response HTTP
  middlewares/             rateLimit, errorHandler
  agent/                   otak Sera: agent, model (fallback), prompts, guardrail, session, tools/
  services/                logika murni: compare, quarterly, glossary, slim
  integrations/sectors/    client, endpoints, cache
  types/comparison.ts      tipe untuk frontend
  data/glossary.json       kamus istilah
supabase/schema.sql        tabel cache
```
Arah dependensi: routes -> controllers -> agent -> services -> integrations. `services` dan `integrations` tidak mengenal Express maupun SDK LLM.

## Pemecahan masalah
| Gejala | Penyebab / solusi |
|---|---|
| `ENOENT .env` saat `npm run dev` | belum membuat `.env` (`cp .env.example .env`) |
| `Unsupported engine` / error sintaks saat install | Node di bawah 22 (`node -v`) |
| 500 "Model Gemini belum dikonfigurasi" | `GEMINI_MODELS` diisi kosong; hapus barisnya atau isi nama model |
| Respons chat HTTP 200 tapi hanya berisi `{"type":"error","errorText":"Maaf, terjadi kesalahan saat memproses..."}` | key Gemini kosong/salah atau semua model gagal. Ini sengaja: error saat streaming dikirim sebagai baris SSE, bukan status HTTP. Detail penyebab ada di log terminal (`[stream error]`) |
| 429 | rate limit per IP; tunggu sekitar 10 menit |
| `Kode saham ... tidak valid` | kode saham harus 4 huruf, contoh BBCA |
