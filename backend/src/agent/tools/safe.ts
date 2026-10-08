import { SectorsError } from "../../integrations/sectors/client";

// Error dikembalikan sebagai DATA (bukan di-throw) supaya model bisa membaca
// penyebabnya dan memperbaiki panggilannya (misalnya salah nama field).
export async function safe<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof SectorsError) return { error: e.message, status: e.status };
    console.error("[tool error]", e);
    return { error: "Terjadi kesalahan saat mengambil data. Coba lagi sebentar." };
  }
}
