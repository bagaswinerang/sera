import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Sera — Tanya saham pakai bahasa sehari-hari",
  description:
    "Sera mengambil data pasar Indonesia lalu menjelaskannya dengan bahasa sehari-hari.",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "Sera — Asisten AI Saham Indonesia",
    description: "Tanya saham pakai bahasa sehari-hari tanpa jargon rumit.",
    url: "https://sera-ai.vercel.app", // Akan di-override dinamis nanti atau biarkan
    siteName: "Sera",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Sera - Asisten AI Saham Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sera — Asisten AI Saham Indonesia",
    description: "Tanya saham pakai bahasa sehari-hari tanpa jargon rumit.",
    images: ["/logo-full.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-background text-foreground min-h-dvh relative`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Futuristic Ambient Grid & Subtle Radial Atmosphere */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ff3b00]/10 rounded-full blur-[130px]" />
            <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-[#e11d48]/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#ff8400]/06 rounded-full blur-[110px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
