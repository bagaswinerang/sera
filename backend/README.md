# Sera Backend

Backend agent chat Sera: Express 5 + TypeScript + Vercel AI SDK 7 + Gemini (dengan fallback model) + API Sectors + cache Supabase (opsional).
Butuh **Node 22 atau lebih baru**.

## Mulai cepat
```bash
npm install
cp .env.example .env       # lalu isi SECTORS_API_KEY dan GOOGLE_GENERATIVE_AI_API_KEY
npm run typecheck          # harus bersih
npm test                   # tes otomatis (model tiruan, tanpa kuota/kredit)
npm run dev                # http://localhost:8787
```

## Endpoint
| Method | Path | Fungsi |
|---|---|---|
| GET | `/` | info API dan daftar endpoint |
| GET | `/health` | cek hidup, membalas `{"ok":true}` |
| POST | `/api/chat` | chat dengan Sera, respons SSE (UI message stream AI SDK) |

Body `POST /api/chat`:
```json
{
  "messages": [{ "id": "1", "role": "user", "parts": [{ "type": "text", "text": "Apa itu PER?" }] }],
  "level": "simple"
}
```
`level` opsional: `"simple"` (default) atau `"detail"`. Untuk percakapan lanjutan, kirim RIWAYAT LENGKAP (termasuk part tool dari jawaban sebelumnya). Backend hanya memakai 10 pesan terakhir dan membuang tool call yang belum punya hasil.

Error sebelum streaming berupa JSON `{"error":"..."}`:
- 400: body bukan JSON atau `messages` kosong
- 413: body lebih dari 1 MB
- 429 `SERA_RATE_LIMIT`: lebih dari 100 permintaan per 10 menit per IP
- 500: model belum dikonfigurasi / error server
- 503 `SERA_*`: gagal sebelum stream dimulai

Error saat streaming dikirim sebagai chunk `{"type":"error","errorText":"SERA_..."}`. Kodenya dipetakan ke pesan ramah oleh `frontend/lib/errors.ts`:

| Kode | Arti |
|---|---|
| `SERA_BUSY` | model sedang overload (503) |
| `SERA_QUOTA_EXHAUSTED` | kuota Gemini habis |
| `SERA_RATE_LIMIT` | terlalu banyak permintaan (429) |
| `SERA_TIMEOUT` | model terlalu lama merespons |
| `SERA_NETWORK` | koneksi ke Google putus |
| `SERA_AUTH` | API key salah/tidak diizinkan |
| `SERA_UNKNOWN` | lainnya, cek log terminal |

## Konfigurasi `.env`
| Variabel | Wajib | Keterangan |
|---|---|---|
| `SECTORS_API_KEY` | ya | dari onboarding hackathon Sectors |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ya | dari Google AI Studio |
| `GEMINI_MODELS` | tidak | model berurutan, pisah koma; default `gemini-4-hydrogen,gemini-3.8-flash,gemini-3.5-flash-lite` |
| `MODEL_TIMEOUT_MS` | tidak | batas tunggu model mulai merespons sebelum pindah ke cadangan; default `10000` (10 detik) |
| `FOLLOWUP_MODEL` | tidak | model ringan untuk saran pertanyaan lanjutan jika model utama lupa membuatnya; default `gemini-3.5-flash-lite` |
| `PORT` | tidak | default 8787 |
| `FRONTEND_ORIGIN` | tidak | origin yang diizinkan CORS, default `http://localhost:3000` (boleh banyak, pisah koma) |
| `TRUST_PROXY` | tidak | isi `1` bila di belakang proxy hosting (Railway/Render/dll.) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | tidak | cache tahan restart; jalankan `supabase/schema-cache.sql` dulu |
| `CREDIT_BUDGET` | tidak | batas keras kredit Sectors per proses server (kosong = tanpa batas); disarankan saat demo, mis. 300 |

## Cara kerja agent
- **Fallback model.** Bila model gagal dengan 404/408/429/5xx, jaringan putus, atau belum merespons dalam `MODEL_TIMEOUT_MS`, otomatis mencoba model berikutnya. Model yang baru gagal dilewati sementara (1 menit; 10 menit untuk 404). 400/401/403 tidak di-fallback karena model lain pun akan gagal. Fallback hanya terjadi sebelum jawaban mulai mengalir. Jika semua model gagal, seluruh rantai dicoba ulang sekali (`maxRetries: 1`).
- **Jalan pintas definisi.** Pertanyaan definisi ("apa itu PER?", "artinya market cap apa?") dicocokkan langsung ke `src/data/glossary.json`. Entri yang cocok disisipkan ke system prompt dan tool `lookup_glossary` dinonaktifkan untuk request itu, jadi hemat satu putaran ke LLM.
- **Saran pertanyaan lanjutan.** Model diminta memanggil `suggest_follow_up`. Jika jawaban selesai tanpa panggilan itu, server membuat 3 saran dengan `FOLLOWUP_MODEL` (timeout 6 detik) dan mengirimnya sebagai part `tool-suggest_follow_up` sebelum stream ditutup. Gagal = tanpa saran; jawaban tidak terpengaruh. Loop juga langsung berhenti bila `suggest_follow_up` dipanggil setelah teks jawaban.
- **Memori sesi.** Kode saham dari tool call sebelumnya dimasukkan ke prompt, supaya "bandingin sama yang tadi" tetap nyambung.
- **Guardrail.** Input yang jelas berupa prompt injection diblokir tanpa memanggil LLM, dan balasan penolakannya dikirim sebagai stream biasa. Bahasa "saran investasi" di jawaban hanya dicatat di log (`[guardrail]`), karena teks sudah ter-stream.
- **Hemat kredit Sectors.** Setiap tool menyebut biaya kreditnya ke model. Respons di-cache (LRU memori + Supabase) dan `CREDIT_BUDGET` menolak panggilan sebelum batas terlampaui.

## Struktur
```
src/
  index.ts                 entry point
  app.ts                   Express: cors + routes + error handler
  config/env.ts            satu-satunya tempat membaca .env
  routes/                  URL -> controller
  controllers/             urus request/response HTTP + streaming (termasuk saran cadangan)
  middlewares/             rateLimit, errorHandler
  agent/
    agent.ts               jalankan model + tools, stop condition, jalan pintas definisi
    model.ts               rantai fallback model + timeout
    prompts.ts             system prompt
    guardrail.ts           deteksi prompt injection + monitor saran investasi
    history.ts             rapikan riwayat chat sebelum dikirim ke model
    followups.ts           saran pertanyaan cadangan
    session.ts             memori kode saham dalam sesi
    tools/                 definisi tool yang dilihat Gemini
  services/                logika murni: compare, quarterly, glossary, price, news, movers, slim
  integrations/sectors/    client, endpoints, cache
  integrations/supabase/   client Supabase (opsional)
  types/comparison.ts      tipe untuk frontend
  data/glossary.json       kamus istilah
tests/                     tes node:test (npm test)
supabase/schema-cache.sql  tabel cache
```
Arah dependensi: routes -> controllers -> agent -> services -> integrations. `services` dan `integrations` tidak mengenal Express maupun SDK LLM.

## Tes
`npm test` menjalankan `tests/*.test.ts` dengan `node:test` dan model tiruan (`MockLanguageModelV4`), jadi tidak butuh API key dan tidak memakai kuota. Cakupannya: pola guardrail (termasuk pertanyaan normal yang tidak boleh terblokir), perapian riwayat, endpoint chat end-to-end, saran cadangan, dan jumlah putaran ke model.

## Pemecahan masalah
| Gejala | Penyebab / solusi |
|---|---|
| `ENOENT .env` saat `npm run dev` | belum membuat `.env` (`cp .env.example .env`) |
| `Unsupported engine` / error sintaks saat install | Node di bawah 22 (`node -v`) |
| 500 "Model Gemini belum dikonfigurasi" | `GEMINI_MODELS` diisi kosong; hapus barisnya atau isi nama model |
| Respons chat HTTP 200 tapi hanya berisi chunk `{"type":"error","errorText":"SERA_..."}` | semua model gagal atau key Gemini salah. Lihat tabel kode error di atas dan log terminal (`[stream error]`, `[model] ... gagal (...)`) |
| Log `[model] gemini-4-hydrogen gagal (HTTP 429)` | kuota key Gemini habis; cek limit di Google AI Studio. Sera tetap menjawab memakai model cadangan |
| Log sering `gagal (timeout 10 detik)` padahal kuota aman | naikkan `MODEL_TIMEOUT_MS`, mis. ke `15000` |
| Pengaturan model di `.env` tidak berpengaruh di server | `GEMINI_MODELS` di dashboard hosting menimpa default; samakan atau hapus |
| 429 `SERA_RATE_LIMIT` dari backend | rate limit per IP; tunggu sekitar 10 menit |
| `Kode saham ... tidak valid` | kode saham harus 4 huruf, contoh BBCA |
| `Anggaran kredit demo (...) hampir habis` | `CREDIT_BUDGET` tercapai; restart server atau naikkan nilainya |
