// "Memori" sesi: kumpulkan kode saham yang sudah dibahas dari riwayat tool call,
// supaya pertanyaan lanjutan ("bandingin sama yang tadi") tetap nyambung.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractSessionCompanies(messages: any[], max = 6): string[] {
  const seen: string[] = [];
  const add = (s: unknown) => {
    if (typeof s !== "string") return;
    const sym = s.trim().toUpperCase().replace(/\.JK$/, "");
    if (/^[A-Z]{4}$/.test(sym) && !seen.includes(sym)) seen.push(sym);
  };
  for (const m of messages) {
    for (const p of m?.parts ?? []) {
      if (typeof p?.type !== "string" || !p.type.startsWith("tool-")) continue;
      add(p.input?.symbol);
      if (Array.isArray(p.input?.symbols)) p.input.symbols.forEach(add);
    }
  }
  return seen.slice(-max);
}
