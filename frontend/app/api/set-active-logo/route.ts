import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const publicDir = path.resolve(process.cwd(), "public");
    const logosDir = path.resolve(publicDir, "logos");

    const target = {
      name: "sera-concept-3-phoenix-crest",
      title: "The Continuum S (Monoline Loop)",
    };

    // Copy selected files to standard root public assets
    const filesToCopy = [
      { src: `${target.name}-icon.png`, dest: "logo-icon.png" },
      { src: `${target.name}-icon.webp`, dest: "logo-icon.webp" },
      { src: `${target.name}-icon.svg`, dest: "logo-icon.svg" },
      { src: `${target.name}-full.png`, dest: "logo-full.png" },
      { src: `${target.name}-full.webp`, dest: "logo-full.webp" },
      { src: `${target.name}-full.svg`, dest: "logo-full.svg" },
      { src: `${target.name}-trans.png`, dest: "logo-trans.png" },
      { src: `${target.name}-trans.webp`, dest: "logo-trans.webp" },
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(logosDir, file.src);
      const destPath = path.join(publicDir, file.dest);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }

    // Save active logo meta
    const activeMeta = {
      activeId: 3,
      conceptName: target.name,
      title: target.title,
      updatedAt: new Date().toISOString(),
      iconUrl: "/logo-icon.webp",
      fullUrl: "/logo-full.webp",
      transUrl: "/logo-trans.webp",
      boxedIconUrl: "/logo-icon.png",
      svgIconUrl: "/logo-icon.svg",
      svgFullUrl: "/logo-full.svg",
    };

    fs.writeFileSync(
      path.join(publicDir, "active-logo.json"),
      JSON.stringify(activeMeta, null, 2)
    );

    return NextResponse.json({ success: true, activeMeta });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengatur logo aktif" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const publicDir = path.resolve(process.cwd(), "public");
    const metaPath = path.join(publicDir, "active-logo.json");

    if (fs.existsSync(metaPath)) {
      const raw = fs.readFileSync(metaPath, "utf-8");
      const activeMeta = JSON.parse(raw);
      return NextResponse.json({ activeMeta });
    }

    return NextResponse.json({
      activeMeta: {
        activeId: 3,
        conceptName: "sera-concept-3-phoenix-crest",
        title: "The Continuum S (Monoline Loop)",
        iconUrl: "/logo-trans.webp",
        fullUrl: "/logo-full.webp",
        transUrl: "/logo-trans.webp",
      },
    });
  } catch {
    return NextResponse.json({
      activeMeta: {
        activeId: 3,
        conceptName: "sera-concept-3-phoenix-crest",
        title: "The Continuum S (Monoline Loop)",
        iconUrl: "/logo-trans.webp",
        fullUrl: "/logo-full.webp",
        transUrl: "/logo-trans.webp",
      },
    });
  }
}
