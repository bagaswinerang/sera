# Sera Frontend

Next.js (App Router) + React 19 + TypeScript + Tailwind v4, siap untuk shadcn/ui.

## Jalankan
```bash
node -v            # harus >= 22
npm install
cp .env.example .env.local   # atau pakai .env.local yang sudah ada
npm run dev        # http://localhost:3000
```
Backend harus jalan di http://localhost:8787 (atau ubah NEXT_PUBLIC_API_URL).

## Tambah komponen shadcn/ui
components.json dan lib/utils.ts (cn) sudah ada, jadi TIDAK perlu `shadcn init`.
```bash
npx shadcn@latest add button card
```
Jangan jalankan `init` ulang: ia menimpa app/globals.css (token warna Sera).

## Cek
```bash
npm run typecheck
npm run lint
npm run build      # butuh internet (mengunduh font Google)
```
