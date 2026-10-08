import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../../config/env";

let sb: SupabaseClient | null | undefined;

/**
 * Singleton client Supabase untuk backend.
 * Dibuat sekali saja untuk mempercepat koneksi.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (sb !== undefined) return sb;
  if (env.supabaseUrl && env.supabaseServiceKey) {
    sb = createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } });
    console.log(`[supabase] ✓ Client dibuat — URL: ${env.supabaseUrl}`);
  } else {
    sb = null;
    console.warn("[supabase] ✗ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY kosong — Supabase dinonaktifkan.");
  }
  return sb;
}
