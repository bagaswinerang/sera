-- ═══════════════════════════════════════════════════════
-- SERA — API Cache (Sectors)
-- Tujuan: Menyimpan respons dari API Sectors supaya
--         tidak boros kredit. Data kedaluwarsa otomatis.
-- ═══════════════════════════════════════════════════════

create table if not exists api_cache (
  key text primary key,
  payload jsonb not null,
  expires_at timestamptz not null
);

create index if not exists api_cache_expires_idx on api_cache (expires_at);

-- RLS aktif tanpa policy = hanya service role yang bisa akses
alter table api_cache enable row level security;
