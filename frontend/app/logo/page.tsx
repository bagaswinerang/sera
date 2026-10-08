"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Sparkles,
  Flame,
  Cpu,
  TrendingUp,
  Layers,
  Palette,
  BookOpen,
} from "lucide-react";

const OFFICIAL_LOGO = {
  id: 3,
  slug: "sera-concept-3-phoenix-crest",
  name: "The Continuum S",
  subtitle: "Official Brand Identity",
  tagline: "Monoline Flow & Compounding Alpha",
  coreMetaphor: "Kurva Loop Infiniti + Alpha Compounding Dual Node",
  badge: "Official Logo • Ultra Minimalis",
  palette: {
    black: {
      name: "Carbon Luxury",
      hex: "#0E0E13",
      role: "Wibawa cockpit terminal fintech, kedalaman komputasi dark mode",
    },
    orange: {
      name: "Solar Flare",
      hex: "#FFA600",
      role: "Pencerahan wawasan finansial, pertumbuhan nilai, sinyal entry emas",
    },
    red: {
      name: "Phoenix Flame",
      hex: "#E11D48",
      role: "Daya juang bangkit dari bear market, realisasi target profit (exit)",
    },
  },
  philosophy: {
    visualShape:
      "Satu garis kontinyu berpresisi tinggi (monoline loop) yang meliuk membentuk huruf 'S' harmonis terinspirasi rasio emas Fibonacci. Tanpa dekorasi berlebihan, dua simpul lingkaran di kedua ujung menandakan titik masuk (entry) dan realisasi target profit (exit) yang terhubung mulus tanpa putus.",
    colors:
      "Gradasi api kosmik dari Oranye Surya (#FFA600) melalui Oranye Menyala (#FF5100) hingga Merah Kirmizi (#E11D48), berpadu dengan Hitam Karbon (#0E0E13). Menghadirkan keseimbangan sempurna antara pertumbuhan modal yang stabil dan ketegasan eksekusi profit.",
    aiAndStockSynergy:
      "Dalam dunia pasar modal, 'Alpha' adalah kemampuan untuk mengalahkan performa indeks acuan IHSG. Bentuk alur kontinu ini melambangkan proses compounding portofolio investor yang terus bertumbuh tanpa henti dengan asistensi analitik kecerdasan SERA AI.",
    relevanceToIndonesianMarket:
      "Menghadirkan citra brand yang bersih, elegan, dan menenangkan psikologis investor di tengah gejolak pasar modal Indonesia yang sering volatil. Desain ini membuktikan bahwa produk AI kebanggaan Indonesia memiliki standar estetika setara Silicon Valley.",
  },
  uiuxImpact: {
    primaryAtmosphere:
      "Sleek, fluid luxury fintech interface dengan transisi lembut dan bayangan halus bergradasi.",
    accentUsage:
      "Gradient badges premium, radial glow lembut di belakang kartu portofolio dan chat bubble assisten.",
    componentVibe:
      "Rounded corners (r-xl), glassmorphism tipis berefek frosted, dan tipografi modern berkarakter hangat.",
  },
  files: {
    iconPng: "/logos/sera-concept-3-phoenix-crest-icon.png",
    iconPng1024: "/logos/sera-concept-3-phoenix-crest-icon-1024.png",
    iconWebp: "/logos/sera-concept-3-phoenix-crest-icon.webp",
    iconWebp1024: "/logos/sera-concept-3-phoenix-crest-icon-1024.webp",
    transPng: "/logos/sera-concept-3-phoenix-crest-trans.png",
    transWebp: "/logos/sera-concept-3-phoenix-crest-trans.webp",
    fullPng: "/logos/sera-concept-3-phoenix-crest-full.png",
    fullWebp: "/logos/sera-concept-3-phoenix-crest-full.webp",
    iconSvg: "/logos/sera-concept-3-phoenix-crest-icon.svg",
    transSvg: "/logos/sera-concept-3-phoenix-crest-transparent.svg",
    fullSvg: "/logos/sera-concept-3-phoenix-crest-full.svg",
  },
};

export default function LogoShowcasePage() {
  const [previewMode, setPreviewMode] = useState<"card" | "header" | "mobile">(
    "card",
  );
  const [copiedNotification, setCopiedNotification] = useState<string | null>(
    null,
  );

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification("Tautan halaman logo berhasil disalin!");
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans selection:bg-[#ff5100]/30 selection:text-white pb-24">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ff5100]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-[#e11d48]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#ffa600]/08 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Floating Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090a0f]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#ff5100]/20 to-[#e11d48]/20 text-[#ffa600] border border-[#ff5100]/30">
                <Sparkles className="w-3 h-3 text-[#ff5100]" />
                Brand Identity
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ffa600]" />
              <span><span className="hidden sm:inline">Panduan </span>Fitur</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative z-10 pt-10 pb-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#ffa600] uppercase mb-2">
            <Flame className="w-4 h-4 text-[#ff5100]" />
            Official Identity: The Continuum S
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Identitas Resmi & Aset Logo SERA
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Logo resmi untuk <strong>SERA (AI Saham Indonesia)</strong>{" "}
            mengadopsi prinsip desain <strong>ultra-minimalis</strong> berbasis{" "}
            <em>monoline loop</em>. Memadukan keanggunan rasio Fibonacci, kurva
            kontinu tanpa putus, dan semburat api gradasi Oranye-Merah yang
            melambangkan compounding alpha pasar modal.
          </p>
        </div>

        {/* Toast / Copied Alert */}
        {copiedNotification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 w-fit">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{copiedNotification}</span>
          </div>
        )}
      </section>

      {/* Main Focus Detail Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-2 space-y-10">
        {/* Concept Spotlight Card */}
        <div className="bg-[#0e0f16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-25"
            style={{ backgroundColor: OFFICIAL_LOGO.palette.orange.hex }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Showcase (Left Column - 5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Main Visual Box */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#181924] to-[#0d0e15] border border-white/10 p-6 flex flex-col items-center justify-center min-h-[340px] group shadow-inner">
                {/* View switcher pill */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-[10px]">
                  <button
                    onClick={() => setPreviewMode("card")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      previewMode === "card"
                        ? "bg-white/20 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Logo Mark
                  </button>
                  <button
                    onClick={() => setPreviewMode("header")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      previewMode === "header"
                        ? "bg-white/20 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Header Mock
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      previewMode === "mobile"
                        ? "bg-white/20 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    App Icon
                  </button>
                </div>

                {previewMode === "card" && (
                  <div className="w-full flex flex-col items-center justify-center py-4 space-y-6">
                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 drop-shadow-[0_16px_36px_rgba(255,80,0,0.3)] transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={OFFICIAL_LOGO.files.iconPng1024}
                        alt={`${OFFICIAL_LOGO.name} Icon`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-black tracking-tight text-white">
                        SERA
                      </h4>
                      <p className="text-[11px] font-bold tracking-widest text-[#ffa600] uppercase">
                        AI SAHAM INDONESIA
                      </p>
                    </div>
                  </div>
                )}

                {previewMode === "header" && (
                  <div className="w-full py-4 space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
                      Simulasi Tampilan Header Navbar
                    </p>
                    <div className="rounded-xl bg-[#090a10] border border-white/15 p-3 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={OFFICIAL_LOGO.files.iconPng}
                          alt="Sera Logo"
                          className="w-8 h-8 rounded-lg object-contain shadow-md"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            SERA AI
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            IHSG 7,612 (+0.84%)
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#ff5100]/20 text-[#ffa600] px-2 py-0.5 rounded-md border border-[#ff5100]/30">
                        Pro Tier
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-300">
                          Sinyal AI Sera Terkini
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          BULLISH ACCUMULATION
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Inflow institusi domestik terdeteksi masif pada sektor
                        perbankan & komoditas energi.
                      </p>
                    </div>
                  </div>
                )}

                {previewMode === "mobile" && (
                  <div className="w-full flex flex-col items-center justify-center py-6 space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Simulasi Icon Aplikasi Mobile (iOS / Android)
                    </p>
                    <div className="w-24 h-24 rounded-[26px] bg-black shadow-2xl border border-white/20 p-2 overflow-hidden shadow-[#ff5100]/25">
                      <img
                        src={OFFICIAL_LOGO.files.iconPng}
                        alt="App Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">
                      SERA AI
                    </span>
                  </div>
                )}
              </div>

              {/* Full Horizontal Logo Preview Box */}
              <div className="rounded-2xl bg-[#090a10] border border-white/10 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Full Horizontal Brandmark (1200 x 400)
                </span>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <img
                    src={OFFICIAL_LOGO.files.fullPng}
                    alt={`${OFFICIAL_LOGO.name} Full Brand`}
                    className="w-full h-auto object-contain hover:scale-[1.01] transition-transform"
                  />
                </div>
              </div>

              {/* Transparent Mark Tester (Checkerboard background) */}
              <div className="rounded-2xl bg-[#0d0e14] border border-white/10 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Varian Transparan (Tanpa Background Box)
                </span>
                <div
                  className="rounded-xl p-4 flex items-center justify-center h-28 border border-white/10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff15 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                >
                  <img
                    src={OFFICIAL_LOGO.files.transPng}
                    alt="Transparent Logo"
                    className="h-20 object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Comprehensive Philosophy & Download Package (Right Column - 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff5100]/20 text-[#ffa600] border border-[#ff5100]/30">
                    Official Logo
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    • {OFFICIAL_LOGO.badge}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {OFFICIAL_LOGO.name}
                </h2>
                <p className="text-sm font-semibold text-[#ffa600] mt-0.5">
                  {OFFICIAL_LOGO.tagline}
                </p>
              </div>

              {/* 3 Core Color Swatches */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#ffa600]" />
                    Palet Warna Brand: Hitam • Oren • Merah
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Black */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shrink-0"
                      style={{
                        backgroundColor: OFFICIAL_LOGO.palette.black.hex,
                      }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {OFFICIAL_LOGO.palette.black.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {OFFICIAL_LOGO.palette.black.hex}
                      </span>
                    </div>
                  </div>
                  {/* Orange */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shrink-0 shadow-[0_0_12px_rgba(255,166,0,0.5)]"
                      style={{
                        backgroundColor: OFFICIAL_LOGO.palette.orange.hex,
                      }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {OFFICIAL_LOGO.palette.orange.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {OFFICIAL_LOGO.palette.orange.hex}
                      </span>
                    </div>
                  </div>
                  {/* Red */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shrink-0 shadow-[0_0_12px_rgba(225,29,72,0.4)]"
                      style={{ backgroundColor: OFFICIAL_LOGO.palette.red.hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {OFFICIAL_LOGO.palette.red.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {OFFICIAL_LOGO.palette.red.hex}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Philosophy Breakdown */}
              <div className="space-y-3">
                {/* 1. Bentuk Visual */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ffa600]">
                    <Layers className="w-4 h-4" />
                    1. Makna Bentuk Visual (Monoline Dual Arc & Golden Ratio)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {OFFICIAL_LOGO.philosophy.visualShape}
                  </p>
                </div>

                {/* 2. Filosofi Warna */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ff5100]">
                    <Palette className="w-4 h-4" />
                    2. Filosofi Warna (Carbon, Solar Flare, Phoenix Flame)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {OFFICIAL_LOGO.philosophy.colors}
                  </p>
                </div>

                {/* 3. Sinergi AI & Saham */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ff334b]">
                    <Cpu className="w-4 h-4" />
                    3. Sinergi AI & Compounding Alpha
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {OFFICIAL_LOGO.philosophy.aiAndStockSynergy}
                  </p>
                </div>

                {/* 4. Relevansi Pasar Indonesia */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                    4. Relevansi Bagi Investor & Trader Indonesia (BEI / IHSG)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {OFFICIAL_LOGO.philosophy.relevanceToIndonesianMarket}
                  </p>
                </div>
              </div>

              {/* Download Package Center */}
              <div className="p-5 rounded-2xl bg-[#090a10] border border-white/15 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#ff8400]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pusat Unduhan Aset (PNG, WebP & SVG)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Resolusi Siap Produksi
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* PNG Icon 512 */}
                  <a
                    href={OFFICIAL_LOGO.files.iconPng}
                    download="sera-logo-icon-512.png"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      PNG Icon
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      512 x 512
                    </span>
                  </a>

                  {/* PNG Icon 1024 */}
                  <a
                    href={OFFICIAL_LOGO.files.iconPng1024}
                    download="sera-logo-icon-1024.png"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      PNG Hi-Res
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      1024 x 1024
                    </span>
                  </a>

                  {/* WebP Icon */}
                  <a
                    href={OFFICIAL_LOGO.files.iconWebp}
                    download="sera-logo-icon-512.webp"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      WebP Icon
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Modern Web
                    </span>
                  </a>

                  {/* WebP 1024 */}
                  <a
                    href={OFFICIAL_LOGO.files.iconWebp1024}
                    download="sera-logo-icon-1024.webp"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      WebP Hi-Res
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      1024 x 1024
                    </span>
                  </a>

                  {/* Transparent PNG */}
                  <a
                    href={OFFICIAL_LOGO.files.transPng}
                    download="sera-logo-transparent.png"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      PNG Transparan
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Tanpa Box
                    </span>
                  </a>

                  {/* Transparent WebP */}
                  <a
                    href={OFFICIAL_LOGO.files.transWebp}
                    download="sera-logo-transparent.webp"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      WebP Transparan
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Tanpa Box
                    </span>
                  </a>

                  {/* Full Horizontal PNG */}
                  <a
                    href={OFFICIAL_LOGO.files.fullPng}
                    download="sera-logo-full-1200x400.png"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      Full Banner PNG
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      1200 x 400
                    </span>
                  </a>

                  {/* Master Vector SVG */}
                  <a
                    href={OFFICIAL_LOGO.files.iconSvg}
                    download="sera-logo-master.svg"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors group"
                  >
                    <span className="text-[11px] font-bold text-white block group-hover:text-[#ff8400]">
                      Master Vector
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      SVG Scalable
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
