"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  BarChart3,
  TrendingUp,
  Scale,
  Search,
  Newspaper,
  Coins,
  Flame,
  MessageCircle,
  ChevronRight,
  Lightbulb,
  HelpCircle,
  Zap,
  Palette,
} from "lucide-react";

interface FeatureData {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  dataPoints: string[];
  exampleQuestions: string[];
  credit: string;
  badge: string;
  gradient: string;
}

const FEATURES: FeatureData[] = [
  {
    id: "glossary",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Kamus Istilah Saham",
    subtitle: "Belajar dari Nol",
    description:
      "Nggak ngerti istilah saham? Tenang! Sera punya kamus lengkap yang menjelaskan istilah rumit dengan bahasa sehari-hari. Mulai dari PER, PBV, Market Cap, sampai Candlestick — semua dibahas dengan sederhana.",
    dataPoints: [
      "Definisi istilah dengan bahasa awam",
      "Contoh analogi sederhana",
      "Rumus dan cara interpretasi angka",
      "Hubungan antar istilah (misal: PER vs PBV)",
    ],
    exampleQuestions: [
      "Apa itu PER?",
      "Jelasin arti Market Cap dong",
      "Apa bedanya PER sama PBV?",
      "Apa itu Dividen Yield?",
    ],
    credit: "0 kredit",
    badge: "Gratis",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    id: "company-report",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Laporan Perusahaan",
    subtitle: "Analisis Fundamental Lengkap",
    description:
      "Mau tau seluk-beluk sebuah perusahaan tercatat di BEI? Sera bisa mengambil data lengkap mulai dari overview perusahaan, valuasi (PER, PBV), prospek masa depan, siapa kompetitornya, sampai siapa direksi dan pemegang sahamnya.",
    dataPoints: [
      "Overview & profil perusahaan",
      "Valuasi: PER, PBV, Market Cap",
      "Laporan keuangan (pendapatan, laba)",
      "Informasi dividen & yield",
      "Daftar kompetitor di sektor sama",
      "Susunan manajemen & pemegang saham",
      "Prospek dan outlook analis",
    ],
    exampleQuestions: [
      "Jelasin prospek BBCA dong",
      "Gimana valuasi GOTO?",
      "Siapa aja direksi TLKM?",
      "BMRI itu perusahaan apa sih?",
    ],
    credit: "1 kredit / bagian",
    badge: "Paling Lengkap",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    id: "quarterly",
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Laporan Keuangan Kuartalan",
    subtitle: "Performa Tiap Kuartal",
    description:
      "Lihat tren pendapatan dan laba bersih perusahaan dari kuartal ke kuartal. Sera juga menghitung skor kestabilan laba (CV) secara otomatis — jadi kamu bisa tau perusahaan mana yang labanya konsisten dan mana yang naik-turun drastis.",
    dataPoints: [
      "Pendapatan per kuartal (Revenue)",
      "Laba bersih per kuartal (Net Income)",
      "Pertumbuhan YoY (Year over Year)",
      "Skor Kestabilan Laba (CV / Coefficient of Variation)",
      "Grafik batang interaktif",
    ],
    exampleQuestions: [
      "Labanya BBRI naik atau turun?",
      "Apakah laba INDF stabil?",
      "Tunjukin keuangan kuartalan ASII",
      "Yang labanya lebih stabil, BBCA atau BBRI?",
    ],
    credit: "1 kredit / kuartal",
    badge: "Ada Grafik",
    gradient: "from-violet-500/20 to-violet-600/5",
  },
  {
    id: "screener",
    icon: <Search className="w-5 h-5" />,
    title: "Penyaring Saham (Screener)",
    subtitle: "Filter & Cari Saham",
    description:
      "Mau cari saham dengan kriteria tertentu? Misal saham bank dengan market cap besar, atau saham teknologi dengan PER rendah. Sera bisa menyaring ratusan saham di BEI sesuai permintaanmu.",
    dataPoints: [
      "Filter berdasarkan sektor & sub-sektor",
      "Filter market cap, harga, PER, yield",
      "Pertumbuhan laba (YoY earnings growth)",
      "ROE, payout ratio, dan metrik lainnya",
      "Hasil diurutkan sesuai permintaan",
    ],
    exampleQuestions: [
      "Cari saham bank yang market cap-nya besar",
      "Saham teknologi terbaik di BEI",
      "Saham dengan dividen yield tertinggi",
      "Cari saham sektor energi yang murah",
    ],
    credit: "1–3 kredit",
    badge: "Fleksibel",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  {
    id: "comparison",
    icon: <Scale className="w-5 h-5" />,
    title: "Perbandingan Saham",
    subtitle: "Head-to-Head Duel",
    description:
      "Bingung pilih antara dua saham? Sera bisa membandingkan 2 sampai 4 perusahaan sekaligus secara langsung. Hasilnya ditampilkan dalam tabel yang rapi — lengkap dengan kesimpulan siapa yang unggul di metrik tertentu.",
    dataPoints: [
      "Perbandingan valuasi (PER, PBV)",
      "Perbandingan ukuran (Market Cap)",
      "Perbandingan kinerja (ROE, pertumbuhan laba)",
      "Perbandingan dividen yield",
      "Tabel otomatis + kesimpulan AI",
    ],
    exampleQuestions: [
      "Bandingin BBCA sama BBRI",
      "Lebih untung BMRI atau BBNI?",
      "Adu TLKM vs EXCL vs ISAT",
      "Mana yang valuasinya lebih murah, ASII atau UNTR?",
    ],
    credit: "~4 kredit / perusahaan",
    badge: "Tabel Otomatis",
    gradient: "from-rose-500/20 to-rose-600/5",
  },
  {
    id: "price-history",
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Riwayat Harga Saham",
    subtitle: "Pergerakan 30–90 Hari",
    description:
      "Penasaran harga saham tertentu naik atau turun belakangan ini? Sera bisa menampilkan grafik pergerakan harga penutupan saham selama 30 sampai 90 hari terakhir, lengkap dengan persentase perubahannya.",
    dataPoints: [
      "Harga penutupan harian (close price)",
      "Grafik garis interaktif",
      "Perubahan harga dalam persen (%)",
      "Harga tertinggi & terendah dalam periode",
    ],
    exampleQuestions: [
      "Harga BBCA sebulan terakhir",
      "TLKM naik ga minggu ini?",
      "Gimana pergerakan GOTO 3 bulan ini?",
      "Tunjukin grafik harga ANTM",
    ],
    credit: "1 kredit",
    badge: "Ada Grafik",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    id: "news",
    icon: <Newspaper className="w-5 h-5" />,
    title: "Berita Perusahaan",
    subtitle: "Update Terkini",
    description:
      "Sera bisa mengambil berita-berita terbaru yang berkaitan dengan saham tertentu atau topik pasar modal. Berita diringkas dengan bahasa sendiri oleh AI, jadi kamu nggak perlu baca artikel panjang-panjang.",
    dataPoints: [
      "Berita terbaru per kode saham",
      "Pencarian berdasarkan kata kunci",
      "Ringkasan AI dari setiap artikel",
      "Link ke sumber asli berita",
    ],
    exampleQuestions: [
      "Ada berita apa soal BBRI?",
      "Berita terbaru AMMN",
      "Cari berita soal dividen",
      "Ada kabar apa di sektor bank?",
    ],
    credit: "1 kredit",
    badge: "Terkini",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  {
    id: "dividend",
    icon: <Coins className="w-5 h-5" />,
    title: "Riwayat & Jadwal Dividen",
    subtitle: "Kapan Dapat Dividen?",
    description:
      "Mau tau kapan perusahaan bagi dividen? Berapa nominalnya? Sera bisa menampilkan jadwal dividen yang akan datang dan sejarah pembayaran dividen lengkap, termasuk penjelasan tentang tanggal ex-date dengan bahasa awam.",
    dataPoints: [
      "Jadwal dividen mendatang (upcoming)",
      "Riwayat pembayaran dividen lalu",
      "Nominal dividen per lembar",
      "Tanggal ex-date, cum-date, payment",
      "Dividend yield tahunan",
    ],
    exampleQuestions: [
      "Kapan BBCA bagi dividen?",
      "Berapa yield dividen ADRO?",
      "Riwayat dividen ITMG",
      "TLKM kapan terakhir bagi dividen?",
    ],
    credit: "1 kredit",
    badge: "Jadwal Lengkap",
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    id: "movers",
    icon: <Flame className="w-5 h-5" />,
    title: "Pergerakan Pasar (Top Movers)",
    subtitle: "Saham Paling Naik & Turun",
    description:
      "Penasaran saham mana yang lagi paling \"panas\" hari ini? Sera bisa menampilkan daftar saham-saham yang naik paling tinggi (top gainers) atau turun paling dalam (top losers) di bursa.",
    dataPoints: [
      "Top Gainers (saham paling naik)",
      "Top Losers (saham paling turun)",
      "Persentase perubahan harga",
      "Volume perdagangan",
      "Filter berdasarkan periode (hari, minggu, bulan)",
    ],
    exampleQuestions: [
      "Saham apa yang paling naik hari ini?",
      "Siapa top losers minggu ini?",
      "Saham apa yang lagi hot?",
      "Top gainers bulan ini dong",
    ],
    credit: "1 kredit / klasifikasi",
    badge: "Real-time",
    gradient: "from-red-500/20 to-red-600/5",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans selection:bg-[#ff5100]/30 selection:text-white pb-24">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ff3b00]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-[#e11d48]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#ff8400]/8 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090a0f]/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">Kembali ke </span>Chat</span>
            </Link>
            <span className="text-white/20 hidden xs:inline">|</span>
            <div className="hidden xs:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#ff5100]/20 to-[#e11d48]/20 text-[#ff8400] border border-[#ff5100]/30">
                <Lightbulb className="w-3 h-3 text-[#ff5100]" />
                Panduan Fitur
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/logo"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[#ff8400]" />
              <span>Logo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-10 pb-6 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#ff7700] uppercase mb-2">
            <Zap className="w-4 h-4" />
            Panduan untuk Pemula
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Sera Bisa Bantu Apa Aja?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Sera terhubung langsung ke data pasar modal Indonesia (BEI/IDX) melalui{" "}
            <strong className="text-slate-200">Sectors API</strong>. Berikut semua jenis data dan
            analisis yang bisa kamu tanyakan — tinggal ketik aja pakai bahasa sehari-hari!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-2xl font-black text-white">9</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Fitur Tersedia</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#ff8400]">900+</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Saham BEI</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-2xl font-black text-emerald-400">Gratis</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Kamus Istilah</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#ff334b]">Real-time</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Data Pasar</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {FEATURES.map((feature, index) => (
          <div
            key={feature.id}
            className="bg-[#0e0f16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden hover:border-white/20 transition-colors"
          >
            {/* Subtle accent glow */}
            <div
              className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-30 bg-gradient-to-br ${feature.gradient}`}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#ff5100]/15 border border-[#ff5100]/30 flex items-center justify-center text-[#ff8400] shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Fitur {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff5100]/15 text-[#ff8400] border border-[#ff5100]/25">
                        {feature.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10">
                        {feature.credit}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {feature.title}
                    </h2>
                    <p className="text-xs font-semibold text-[#ff8400] mt-0.5">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                {feature.description}
              </p>

              {/* Two columns: Data Points & Example Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Data yang tersedia */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <BarChart3 className="w-3.5 h-3.5 text-[#ff8400]" />
                    Data yang Tersedia
                  </div>
                  <ul className="space-y-1.5">
                    {feature.dataPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-xs text-slate-400"
                      >
                        <ChevronRight className="w-3 h-3 text-[#ff5100] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contoh pertanyaan */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Contoh Pertanyaan
                  </div>
                  <div className="space-y-1.5">
                    {feature.exampleQuestions.map((q) => (
                      <Link
                        key={q}
                        href={`/?q=${encodeURIComponent(q)}`}
                        className="flex items-start gap-2 text-xs text-slate-400 hover:text-[#ff8400] transition-colors group cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3 text-slate-500 group-hover:text-[#ff8400] shrink-0 mt-0.5" />
                        <span className="italic">&quot;{q}&quot;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="text-center pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#ff5100] via-[#ff334b] to-[#e11d48] text-white hover:opacity-90 shadow-xl shadow-[#ff5100]/20 hover:scale-[1.02] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Mulai Tanya Sera Sekarang
          </Link>
          <p className="text-xs text-slate-500 mt-3">
            Tinggal ketik pertanyaan pakai bahasa sehari-hari — Sera yang urus sisanya!
          </p>
        </div>
      </main>
    </div>
  );
}
