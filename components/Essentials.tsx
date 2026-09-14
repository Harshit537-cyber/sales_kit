"use client";

import { useState } from "react";

interface DownloadAsset {
  id: number;
  name: string;
  category: string;
  format: string;
  size: string;
  pagesOrCount: string;
  icon: string;
  description: string;
}

const DOWNLOADS: DownloadAsset[] = [
  {
    id: 1,
    name: "Complete Partner Itineraries 2025-26",
    category: "Master Circuit Guide",
    format: "PDF",
    size: "18.4 MB",
    pagesOrCount: "48 Pages",
    icon: "🗺️",
    description: "Detailed day-by-day routes, safari gate timings, and hotel logistics ready for client presentation."
  },
  {
    id: 2,
    name: "Royalty-Free High-Res Image Bank",
    category: "Media Toolkit",
    format: "ZIP",
    size: "240 MB",
    pagesOrCount: "120 RAW & JPGs",
    icon: "📸",
    description: "Full commercial licensing rights for print brochures, website banners, and luxury travel pitch decks."
  },
  {
    id: 3,
    name: "Social Media Reels & Video Promos",
    category: "Short-Form Video",
    format: "MP4",
    size: "520 MB",
    pagesOrCount: "18 Reels (4K)",
    icon: "🎬",
    description: "Vertical 9:16 graded reels of tiger safaris, heritage forts, and night boat aartis with audio stems."
  },
  {
    id: 4,
    name: "Madhya Pradesh Tourist Vector Route Map",
    category: "Cartography Asset",
    format: "PDF",
    size: "8.2 MB",
    pagesOrCount: "Vector / Layered",
    icon: "🧭",
    description: "Printable vector layout showing highway travel times, air corridors, and core-to-buffer transition gates."
  },
  {
    id: 5,
    name: "Tariffs, Seasons & Agent Factsheet",
    category: "Confidential B2B",
    format: "XLSX",
    size: "2.1 MB",
    pagesOrCount: "8 Spreadsheets",
    icon: "📊",
    description: "Net wholesale B2B rates, blackout dates, safari cancellation guidelines, and seasonal pricing matrices."
  },
  {
    id: 6,
    name: "State Hotel & Forest Lodge Directory",
    category: "Hospitality Registry",
    format: "PDF",
    size: "6.5 MB",
    pagesOrCount: "32 Properties",
    icon: "🏨",
    description: "Direct general manager contacts, private villa allocations, and trade reservation priority desks."
  },
];

function buildPdfBlob(item: DownloadAsset): Blob {
  const escape = (text: string) => text.replace(/([()\\])/g, "\\$1");
  const lines = [
    `${item.icon}  ${item.name}`,
    "",
    `Category: ${item.category}`,
    `Format: ${item.format}   Size: ${item.size}   ${item.pagesOrCount}`,
    "",
    ...(item.description.match(/.{1,90}(\s|$)/g) ?? [item.description]),
    "",
    "Trade Collateral Vault - Release 2025/26",
  ];

  const content = lines
    .map((line, i) => `BT /F1 ${i === 0 ? 18 : 11} Tf 50 ${740 - i * 26} Td (${escape(line)}) Tj ET`)
    .join("\n");

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${content.length} >>
stream
${content}
endstream
endobj
xref
0 6
0000000000 65535 f 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function buildGenericBlob(item: DownloadAsset): Blob {
  const text = `${item.name}\n\nCategory: ${item.category}\nFormat: ${item.format}\nSize: ${item.size}\n${item.pagesOrCount}\n\n${item.description}\n\nTrade Collateral Vault - Release 2025/26`;
  return new Blob([text], { type: "application/octet-stream" });
}

function triggerDownload(item: DownloadAsset) {
  const blob = item.format === "PDF" ? buildPdfBlob(item) : buildGenericBlob(item);
  const extension = item.format.toLowerCase();
  const filename = `${item.name.replace(/[^a-z0-9]+/gi, "_")}.${extension}`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function Downloads() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Master Circuit Guide", "Media Toolkit", "Confidential B2B"];

  const filteredItems = activeCategory === "All"
    ? DOWNLOADS
    : DOWNLOADS.filter(item => item.category === activeCategory);

  const handleDownload = (item: DownloadAsset) => {
    if (downloadingId !== null) return;
    setDownloadingId(item.id);

    setTimeout(() => {
      triggerDownload(item);
      setDownloadingId(null);
      setDownloadedIds((prev) => [...prev, item.id]);
    }, 1400);
  };

  return (
    <section id="downloads" className="relative bg-[#F4EFE6] text-[#2A1D15] pt-10 sm:pt-14 pb-20 sm:pb-28 overflow-hidden selection:bg-[#8B5E3C] selection:text-white" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(28px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-6px, 6px); }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        @keyframes cardShine {
          0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          10% { opacity: 0.5; }
          100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
        }
        @keyframes popCheck {
          0% { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes iconWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes badgeDrop {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,94,60,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(139,94,60,0); }
        }

        .card-enter {
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .card-glow-blob {
          animation: floatGlow 6s ease-in-out infinite;
        }
        .card-shine::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
          pointer-events: none;
          opacity: 0;
        }
        .group:hover .card-shine::before {
          animation: cardShine 1.1s ease-in-out;
        }
        .btn-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmerSweep 2.2s ease-in-out infinite;
        }
        .progress-bar {
          animation: progressFill 1.4s linear forwards;
        }
        .check-pop {
          display: inline-block;
          animation: popCheck 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .icon-hover:hover {
          animation: iconWiggle 0.5s ease-in-out;
        }
        .badge-drop {
          animation: badgeDrop 0.5s ease-out forwards;
        }
        .pulse-ring:hover {
          animation: softPulse 1.4s ease-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(184,135,85,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_90%,rgba(139,94,60,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14 card-enter">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#CBB8A3] bg-[#EBE0D2]/80 backdrop-blur-md mb-4 shadow-xs badge-drop">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] animate-pulse" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#6C4A30] font-bold font-mono">
              Trade Collateral Vault &bull; Release 2025/26
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.08] text-[#24160E] mb-3">
            Client-Ready Collateral <br />
            <span className="italic font-light text-[#8B5E3C]">& Media Toolkits</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#614A3B] leading-relaxed font-light max-w-xl">
            Unbranded, white-label verified materials ready to export straight to ultra-high-net-worth travellers and boutique agency itineraries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#2A1D15] text-[#FAF7F2] shadow-md shadow-[#2A1D15]/20 scale-105"
                    : "bg-[#EBE2D5] text-[#695242] hover:bg-[#E2D5C4] hover:text-[#2A1D15] border border-[#DECFC0] hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, index) => {
            const isDownloading = downloadingId === item.id;
            const isDownloaded = downloadedIds.includes(item.id);

            return (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 90}ms` }}
                className="card-enter card-shine group relative bg-[#FAF7F2] rounded-3xl p-6 border border-[#DECFC0] hover:border-[#8B5E3C]/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3B2618]/10 flex flex-col justify-between overflow-hidden"
              >
                <div className="card-glow-blob absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#EFE5D7] via-transparent to-transparent opacity-60 rounded-bl-full pointer-events-none group-hover:scale-125 group-hover:opacity-90 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-3xl border-2 border-[#8B5E3C]/0 group-hover:border-[#8B5E3C]/20 transition-colors duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="icon-hover pulse-ring w-12 h-12 rounded-2xl bg-[#F0E6D8] border border-[#DFCFC0] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-lg bg-[#EFE5D7] text-[#6E4B31] border border-[#DFCFC0]">
                        {item.format} &bull; {item.size}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C7564] tracking-wide">
                        {item.pagesOrCount}
                      </span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#8B5E3C] font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#24160E] leading-snug tracking-tight mb-2 group-hover:text-[#8B5E3C] transition-colors duration-300">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#695445] leading-relaxed font-light mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE0D3]">
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className={`relative w-full py-3 px-4 rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-sm active:scale-95 ${
                      isDownloaded
                        ? "bg-[#E6DDD0] text-[#362419] border border-[#CBB8A3]"
                        : isDownloading
                        ? "bg-[#3D291D] text-[#FAF6F0] btn-shimmer"
                        : "bg-[#2A1D15] hover:bg-[#3D2B20] text-[#FAF7F2] hover:shadow-lg hover:shadow-[#2A1D15]/30"
                    }`}
                  >
                    {isDownloading ? (
                      <div className="flex flex-col w-full gap-1.5">
                        <div className="flex items-center justify-center gap-2.5">
                          <svg
                            className="animate-spin h-3.5 w-3.5 text-[#D8B991]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          <span className="tracking-widest font-mono text-[11px]">Preparing Package...</span>
                        </div>
                        <div className="w-full h-0.5 bg-[#5A4030] rounded-full overflow-hidden">
                          <div className="progress-bar h-full bg-[#D8B991] rounded-full" />
                        </div>
                      </div>
                    ) : isDownloaded ? (
                      <div className="flex items-center gap-1.5">
                        <span className="check-pop text-[#8B5E3C]">✓</span>
                        <span>Downloaded to Vault</span>
                      </div>
                    ) : (
                      <>
                        <span>Download Asset</span>
                        <span className="text-sm transform group-hover:translate-y-1 transition-transform duration-300">
                          ↓
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#ECE2D5] via-[#EFE6DB] to-[#E9DFD0] border border-[#DECFC0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 card-enter">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#DECFC0] flex items-center justify-center text-lg shrink-0 shadow-xs icon-hover">
              ⚡
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#24160E]">
                Need Custom White-Labeling with Agency Branding?
              </h4>
              <p className="text-xs text-[#6B5546] font-light mt-0.5">
                We imprint your tour operating logo, company disclaimer, and custom margins at zero surcharge within 2 hours.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl border border-[#C5B099] bg-[#FAF7F2] hover:bg-[#2A1D15] hover:text-white text-[#2A1D15] text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Request Custom Deck
          </a>
        </div>

      </div>
    </section>
  );
}