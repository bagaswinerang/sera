import glossary from "../data/glossary.json";

type Entry = (typeof glossary)[number];

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Pencarian kamus: cocok persis (nama/alias) dulu, baru kemiripan kata.
 * Untuk 30-50 entri ini cukup. Kalau kamus membesar, ganti ke pgvector di Supabase.
 */
export function lookupGlossary(query: string) {
  const q = norm(query);
  if (!q) return { found: false as const, hint: "Istilah kosong." };

  const exact = glossary.find((e) => [e.slug, e.term, ...e.aliases].some((t) => norm(t) === q));
  if (exact) return { found: true as const, entries: [pick(exact)] };

  const qTokens = new Set(q.split(" "));
  const scored = glossary
    .map((e) => {
      const words = new Set(norm([e.term, ...e.aliases, e.simple].join(" ")).split(" "));
      let score = 0;
      for (const t of qTokens) if (t.length > 1 && words.has(t)) score++;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    return {
      found: false as const,
      hint: "Istilah belum ada di kamus Sera. Jelaskan secara umum dan sampaikan bahwa ini penjelasan umum.",
    };
  }
  return { found: true as const, entries: scored.map((x) => pick(x.e)) };
}

function pick(e: Entry) {
  return { term: e.term, simple: e.simple, detail: e.detail, example: e.example };
}
