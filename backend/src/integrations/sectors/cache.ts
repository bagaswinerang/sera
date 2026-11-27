import { LRUCache } from "lru-cache";
import { getSupabaseClient } from "../supabase/client";

// Cache dua lapis: memori server (LRU, maksimal 500 entri, kedaluwarsa sesuai TTL)
// + Supabase tabel api_cache (tahan restart). Kalau Supabase belum diisi, hanya memori.
// Error cache TIDAK boleh merusak aplikasi, jadi semua dibungkus try/catch.

const mem = new LRUCache<string, { payload: unknown }>({ max: 500, ttl: 6 * 3600 * 1000 });

export async function cacheGet<T>(key: string): Promise<T | null> {
  const m = mem.get(key);
  if (m) return m.payload as T;
  try {
    const db = getSupabaseClient();
    if (!db) return null; // tanpa Supabase: hanya memori (sudah diperingatkan sekali saat start)
    const { data, error } = await db
      .from("api_cache")
      .select("payload, expires_at")
      .eq("key", key)
      .maybeSingle();
    if (error) {
      console.warn("[cache] cacheGet error:", error.message);
      return null;
    }
    if (!data) return null;
    const remaining = new Date(data.expires_at as string).getTime() - Date.now();
    if (remaining <= 0) return null;
    mem.set(key, { payload: data.payload }, { ttl: remaining });
    return data.payload as T;
  } catch (e) {
    console.warn("[cache] cacheGet exception:", e);
    return null;
  }
}

export async function cacheSet(key: string, payload: unknown, ttlSeconds: number): Promise<void> {
  mem.set(key, { payload }, { ttl: ttlSeconds * 1000 });
  try {
    const db = getSupabaseClient();
    if (!db) return;
    const { error: upsertError } = await db
      .from("api_cache")
      .upsert({ key, payload, expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString() });
    if (upsertError) console.warn("[cache] cacheSet upsert gagal:", upsertError.message, upsertError.code);
  } catch (e) {
    console.warn("[cache] cacheSet exception:", e);
  }
}

// Untuk pengujian
export function _clearMemoryCache() {
  mem.clear();
}
