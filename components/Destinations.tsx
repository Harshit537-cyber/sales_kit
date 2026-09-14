"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface SignatureMoment {
  title: string;
  desc: string;
}

interface DestinationItem {
  id: string;
  name: string;
  romanNo: string;
  badge: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  duration: string;
  season: string;
  connectivity: string;
  corridor: string[];
  signatureMoments: SignatureMoment[];
  operatorQuote: string;
  accent: string;
  pdfFileName: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: "wildlife",
    name: "Wild Tiger Sanctuaries",
    romanNo: "I",
    badge: "Tiger Reserves & Bio-Hotspots",
    tagline: "The Sal Wilderness of Kanha & Ancient Bandhavgarh Fort",
    heroImage: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "5N / 6D Circuit",
    season: "Oct to Jun (Peak: Feb-May)",
    connectivity: "Jabalpur (JLR) / Nagpur (NAG)",
    corridor: ["Kanha Mukki", "Bandhavgarh Tala", "Pench Turia", "Panna Ken River", "Satpura Madhai"],
    signatureMoments: [
      { title: "Exclusive Core Trackers", desc: "Private open-top 4x4 gypsies led by certified state naturalists" },
      { title: "Rare Sal Endemics", desc: "Hardground Barasingha, Sloth Bears, Asiatic Leopards & 300+ avians" },
      { title: "Bespoke Wilderness Lodges", desc: "Taj Mahua Kothi, Pashan Garh, Pugdundee Safaris & Singinawa" }
    ],
    operatorQuote: "Boasts Asia's highest Bengal Tiger density across pristine Sal & bamboo canopies.",
    accent: "#C59358",
    pdfFileName: "MP-B2B-Wildlife-Sanctuaries-Dossier.pdf"
  },
  {
    id: "spiritual",
    name: "Sacred Shrines & Stupas",
    romanNo: "II",
    badge: "Jyotirlingas & UNESCO Faith",
    tagline: "Sanctified Mahakal Corridor, Omkareshwar & Sanchi Great Stupa",
    heroImage: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010e421a113?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "4N / 5D Circuit",
    season: "Year-Round (Best: Oct-Mar)",
    connectivity: "Indore (IDR) / Bhopal (BHO)",
    corridor: ["Mahakaleshwar Ujjain", "Omkareshwar Island", "Sanchi Stupa Complex", "Amarkantak", "Maheshwar Ghats"],
    signatureMoments: [
      { title: "VIP Bhasma Aarti", desc: "Dedicated trade concierge for predawn Mahakal sanctum access" },
      { title: "Ashokan UNESCO Monoliths", desc: "Sanchi Toranas and hemispherical dome dating to 3rd century BCE" },
      { title: "Narmada River Boat Aarti", desc: "Private sunset wooden skiffs with floating brass lamps" }
    ],
    operatorQuote: "Two of India's twelve sacred Jyotirlingas resting alongside Ashoka's immortal Buddhist relics.",
    accent: "#D69F60",
    pdfFileName: "MP-B2B-Spiritual-Sanctuaries-Dossier.pdf"
  },
  {
    id: "heritage",
    name: "Khajuraho & Medieval Forts",
    romanNo: "III",
    badge: "UNESCO World Heritage & Forts",
    tagline: "Chandelas' Erotic Stone Temples & Bundela Palaces on Betwa",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010e421a113?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600100397608-f010e421a113?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "6N / 7D Circuit",
    season: "Oct to Mar",
    connectivity: "Khajuraho (HJR) / Gwalior (GWL)",
    corridor: ["Kandariya Mahadeva", "Gwalior Fort", "Jahangir Mahal Orchha", "Chhatris on Betwa", "Mandu Fort"],
    signatureMoments: [
      { title: "Nagara Architectural Tours", desc: "Lectures by ASI-certified art historians across Western Group" },
      { title: "Gwalior Man Mandir Spectacle", desc: "Private seating at the palace courtyard Sound & Light evening" },
      { title: "Sunset Chhatris of Orchha", desc: "Heritage walks through medieval Bundelkhand cenotaphs" }
    ],
    operatorQuote: "Intricate sandstone filigree preserved impeccably across a millennium of Indian history.",
    accent: "#C59358",
    pdfFileName: "MP-B2B-Heritage-Forts-Dossier.pdf"
  },
  {
    id: "luxury",
    name: "Regal Suites & Palaces",
    romanNo: "IV",
    badge: "Bespoke & Royal Hospitality",
    tagline: "Scindia Palatial Wings, Heritage Haveli Suites & Private Safaris",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "Tailored Royal Itineraries",
    season: "Oct to Apr",
    connectivity: "Direct Charters / Bhopal / Gwalior",
    corridor: ["Taj Usha Kiran Gwalior", "Jehan Numa Palace", "Ahilya Fort Maheshwar", "Banjaar Tola Kanha"],
    signatureMoments: [
      { title: "Private Silver Train Banquets", desc: "Curated imperial dining inside Jai Vilas Scindia Palace grounds" },
      { title: "Remote Bush Dinners", desc: "Lantern-lit multi-course dinners under star-drenched forest canopies" },
      { title: "Charter Flight Airstrips", desc: "Seamless private aircraft logistics directly into Kanha & Khajuraho" }
    ],
    operatorQuote: "Live as honored royal guests with personalized silver-service hospitality across royal estates.",
    accent: "#E2AA68",
    pdfFileName: "MP-B2B-Royal-Palaces-Dossier.pdf"
  },
  {
    id: "nature",
    name: "Marble Canyons & Hills",
    romanNo: "V",
    badge: "Eco Retreats & Landscapes",
    tagline: "Narmada's Marble Gorges at Bhedaghat & Satpura's Pachmarhi",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "3N / 4D Circuit",
    season: "Jul to Mar (Lush Monsoon & Winter)",
    connectivity: "Jabalpur (JLR) / Bhopal (BHO)",
    corridor: ["Bhedaghat Marble Rocks", "Dhuandhar Falls", "Dhoopgarh Peak", "Bee Falls", "Tamia Hidden Valley"],
    signatureMoments: [
      { title: "Full Moon Marble Boating", desc: "Silent rowboat through 100-foot gleaming magnesium limestone cliffs" },
      { title: "Dhoopgarh Sunset Plateau", desc: "Highest elevation in Central India (1,352m) overlooking Satpura" },
      { title: "Dhuandhar Mist Walkways", desc: "Paved viewing promenades where the mighty Narmada plunges 30m" }
    ],
    operatorQuote: "Towering marble gorges bathed in lunar glow combined with serene hill station breezes.",
    accent: "#B88958",
    pdfFileName: "MP-B2B-Marble-Canyons-Dossier.pdf"
  },
  {
    id: "crafts",
    name: "Imperial Looms & Tribal Art",
    romanNo: "VI",
    badge: "Living Cultural Heritage",
    tagline: "Pure Zari Chanderi Weaves, Maheshwar Silk & Gond Folklore",
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    duration: "3N / 4D Circuit",
    season: "Sep to Apr",
    connectivity: "Indore (IDR) / Gwalior (GWL)",
    corridor: ["Chanderi Weaver Alleys", "Maheshwar Ahilya Fort", "Bagh Block Print Hub", "Patan Gond Tribal Hamlet"],
    signatureMoments: [
      { title: "Master Weaver Guilds", desc: "Private access to 700-year-old pit looms weaving real gold Zari sarees" },
      { title: "Ahilya Bai Handloom Lab", desc: "Hands-on silk weaving restoration studio atop Maheshwar river fort" },
      { title: "Original Gond Canvas Purchases", desc: "Meet state-awarded tribal artists in their village courtyards" }
    ],
    operatorQuote: "Centuries of royal handloom patronage and mythological tribal paintings straight from the creators.",
    accent: "#C99158",
    pdfFileName: "MP-B2B-Artisan-Crafts-Dossier.pdf"
  }
];

export default function Destinations() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const current = DESTINATIONS[activeTab];

  const switchCircuit = (index: number) => {
    if (index === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(index);
      setActiveImageIndex(0);
      setIsTransitioning(false);
    }, 180);
  };

  const loadImageAsJPEG = async (url: string, maxWidth = 1000): Promise<{ dataUrl: string; width: number; height: number } | null> => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, maxWidth / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width * scale;
      canvas.height = bitmap.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return {
        dataUrl: canvas.toDataURL("image/jpeg", 0.85),
        width: canvas.width,
        height: canvas.height,
      };
    } catch {
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = 64;

    const accent: [number, number, number] = [151, 102, 52];
    const dark: [number, number, number] = [36, 26, 16];
    const muted: [number, number, number] = [122, 106, 92];

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = 64;
      }
    };

    const addHeading = (text: string, size = 11) => {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...accent);
      doc.text(text.toUpperCase(), margin, y);
      y += 6;
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.75);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;
    };

    const addParagraph = (text: string, size = 10, color: [number, number, number] = dark) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      ensureSpace(lines.length * 14 + 6);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 10;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("MADHYA PRADESH TOURISM — OFFICIAL B2B PARTNER SALES DOSSIER", margin, y);
    y += 26;

    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...dark);
    doc.text(`Circuit ${current.romanNo}: ${current.name}`, margin, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text(current.badge, margin, y);
    y += 20;

    const cover = await loadImageAsJPEG(current.heroImage);
    if (cover) {
      const coverHeight = Math.min(240, contentWidth * (cover.height / cover.width));
      ensureSpace(coverHeight + 16);
      doc.addImage(cover.dataUrl, "JPEG", margin, y, contentWidth, coverHeight);
      y += coverHeight + 20;
    }

    addHeading("Circuit Overview");
    addParagraph(`Tagline: ${current.tagline}`);
    addParagraph(`Duration: ${current.duration}`);
    addParagraph(`Ideal Window: ${current.season}`);
    addParagraph(`Transit Hubs: ${current.connectivity}`);
    y += 8;

    addHeading("Key Travel Corridor & Enclaves");
    addParagraph(current.corridor.map((station, i) => `${i + 1}. ${station}`).join("     "));
    y += 8;

    const galleryImages = (
      await Promise.all(current.gallery.slice(0, 4).map((url) => loadImageAsJPEG(url, 500)))
    ).filter((img): img is { dataUrl: string; width: number; height: number } => img !== null);

    if (galleryImages.length > 0) {
      addHeading("Circuit Gallery");
      const gap = 10;
      const tileWidth = (contentWidth - gap * (galleryImages.length - 1)) / galleryImages.length;
      const tileHeight = tileWidth * 0.75;
      ensureSpace(tileHeight + 16);
      galleryImages.forEach((img, i) => {
        const x = margin + i * (tileWidth + gap);
        doc.addImage(img.dataUrl, "JPEG", x, y, tileWidth, tileHeight);
      });
      y += tileHeight + 20;
    }

    addHeading("Curated Signature Inclusions");
    current.signatureMoments.forEach((m, i) => {
      addParagraph(`${i + 1}. ${m.title}`, 10.5, accent);
      addParagraph(m.desc, 10, muted);
    });
    y += 4;

    addHeading("Operator Appraisal & Value Proposition");
    doc.setFont("times", "italic");
    doc.setFontSize(11.5);
    doc.setTextColor(...dark);
    const quoteLines = doc.splitTextToSize(`"${current.operatorQuote}"`, contentWidth);
    ensureSpace(quoteLines.length * 16 + 10);
    doc.text(quoteLines, margin, y);
    y += quoteLines.length * 16 + 20;

    addHeading("Confidential Commercial Notes");
    [
      "Standard DMC Margins: 18% - 24% on contract rates.",
      "Safari & Entry Permits: 120-day advance booking essential.",
      "Luxury Haveli & Palace Buyouts available on request.",
      "Concierge B2B Helpline: +91 98765 43210 (Direct Trade Desk).",
    ].forEach((note) => addParagraph(`•  ${note}`));

    ensureSpace(40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...muted);
    doc.text(
      "Issued by Department of Tourism, Madhya Pradesh & Partner Guilds. Copyright (c) 2025. All Rights Reserved.",
      margin,
      pageHeight - 32
    );

    doc.save(current.pdfFileName);
    setIsDownloading(false);
  };

  return (
    <section id="destinations" className="relative bg-gradient-to-br from-[#F5EFE6] to-[#EDE3D3] text-[#241A10] py-24 sm:py-32 overflow-hidden selection:bg-[#D4A373] selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(151,102,52,0.10),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,110,61,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#B38350_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <header className="mb-14 sm:mb-18">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#DCC9AE]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C28E58]/40 bg-white/70 backdrop-blur-md mb-6 shadow-md shadow-black/5">
                <span className="w-2 h-2 rounded-full bg-[#976634] animate-pulse" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-[#8A5A2E] font-semibold">
                  Central India Sovereign Portfolios
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.05] text-[#241A10]">
                Six Sovereign <br />
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#976634] via-[#B38350] to-[#7A4F26]">
                  Voyages of Heritage
                </span>
              </h2>
            </div>

            <div className="max-w-md lg:text-right flex flex-col justify-end">
              <p className="text-xs sm:text-sm text-[#6B594A] leading-relaxed font-light tracking-wide">
                Calibrated trade itineraries connecting private national park corridors, live royal suites, and ancient master artisan guilds.
              </p>
              <div className="mt-4 flex items-center lg:justify-end gap-2 text-[10px] uppercase font-mono tracking-[0.25em] text-[#976634]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#976634]" />
                B2B Verified Trade Portfolio &bull; Vol. 2025
              </div>
            </div>
          </div>
        </header>

        <nav aria-label="Circuit selector" className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {DESTINATIONS.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => switchCircuit(idx)}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 border flex flex-col justify-between min-h-[125px] overflow-hidden ${
                    isActive
                      ? "bg-white border-[#C28E58] shadow-xl shadow-[#C28E58]/15 -translate-y-1.5"
                      : "bg-white/60 border-[#E5D5BF] hover:border-[#C9AE8C] hover:bg-white/85"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase font-bold transition-colors ${
                        isActive ? "text-[#976634]" : "text-[#B29B85] group-hover:text-[#976634]"
                      }`}
                    >
                      [{item.romanNo}]
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#976634] scale-125 shadow-[0_0_8px_#C28E58]"
                          : "bg-[#E5D5BF] group-hover:bg-[#C9AE8C]"
                      }`}
                    />
                  </div>

                  <div className="mt-4">
                    <span className="block font-serif text-sm sm:text-base leading-snug tracking-tight text-[#241A10] font-medium group-hover:text-[#1A130B]">
                      {item.name}
                    </span>
                    <span className="block text-[10px] font-mono tracking-wider text-[#8A7A6C] mt-1.5">
                      {item.duration.split(" ")[0]} {item.duration.split(" ")[1]}
                    </span>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C28E58] to-[#8A5B2D] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        <div className="relative rounded-3xl border border-[#E5D5BF] bg-white/70 shadow-2xl shadow-black/10 overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">

            <div className="lg:col-span-7 relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E5D5BF]">
              <div
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isTransitioning ? "opacity-30 scale-105" : "opacity-100 scale-100"
                }`}
              >
                <img
                  src={current.gallery[activeImageIndex] || current.heroImage}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140D08] via-[#140D08]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#140D08]/55 via-transparent to-transparent" />
              </div>

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md text-[#FAF5EE] border border-[#E5C29A]/40 text-[10px] uppercase font-mono tracking-widest font-semibold shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5B584] animate-ping" />
                  {current.badge}
                </span>

                <span className="text-[11px] font-mono text-[#F0DCC0] tracking-[0.25em] bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-md">
                  CIRCUIT {current.romanNo} / VI
                </span>
              </div>

              <div
                className={`relative z-10 mt-36 sm:mt-48 transition-all duration-300 ${
                  isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
                }`}
              >
                <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF5EE] tracking-tight leading-tight mb-2 drop-shadow-xl">
                  {current.name}
                </h3>
                <p className="text-sm sm:text-base font-light text-[#EDE1D4] max-w-xl leading-relaxed mb-6 drop-shadow">
                  {current.tagline}
                </p>

                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {current.gallery.map((imgUrl, gIdx) => {
                    const isSelected = activeImageIndex === gIdx;
                    return (
                      <button
                        key={gIdx}
                        onClick={() => setActiveImageIndex(gIdx)}
                        className={`group/thumb relative h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                          isSelected
                            ? "border-[#E5B584] ring-4 ring-[#E5B584]/30 scale-105"
                            : "border-white/30 opacity-70 hover:opacity-100 hover:border-white/70"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail perspective ${gIdx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FBF6EE]/95 backdrop-blur-md transition-all duration-300 ${
                isTransitioning ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
              }`}
            >
              <div className="space-y-6 sm:space-y-7">

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E5D5BF] shadow-sm">
                  <div>
                    <span className="block text-[9px] font-mono tracking-widest text-[#9C8271] uppercase font-bold">Duration</span>
                    <span className="block text-xs sm:text-sm font-serif font-bold text-[#241A10] mt-1">
                      {current.duration}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono tracking-widest text-[#9C8271] uppercase font-bold">Best Window</span>
                    <span className="block text-xs sm:text-sm font-serif font-bold text-[#241A10] mt-1 truncate">
                      {current.season.split("(")[0]}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono tracking-widest text-[#9C8271] uppercase font-bold">Transit Gate</span>
                    <span className="block text-xs sm:text-sm font-serif font-bold text-[#241A10] mt-1 truncate">
                      {current.connectivity.split("/")[0]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#976634] font-bold">
                      Corridor Enclaves & Access
                    </span>
                    <span className="text-[10px] font-mono text-[#9C8271]">Geo-Route</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.corridor.map((station, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF3EA] border border-[#EBDCC9] text-xs text-[#5C4B3C] font-medium hover:border-[#C28E58] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#976634]" />
                        {station}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[#976634] font-bold mb-3">
                    Curated Signature Inclusions
                  </span>
                  <div className="space-y-2.5">
                    {current.signatureMoments.map((moment, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3.5 rounded-2xl bg-white border border-[#EBDCC9] flex items-start gap-3.5 hover:border-[#C9AE8C] transition-colors"
                      >
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#8A5B2D] text-white flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 shadow-md">
                          0{mIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-serif font-bold text-[#241A10] tracking-wide">
                            {moment.title}
                          </h4>
                          <p className="text-[11px] text-[#7A6A5C] leading-relaxed mt-0.5 font-light">
                            {moment.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5D5BF] bg-gradient-to-br from-white to-[#FAF3EA] relative overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-3.5 h-3.5 text-[#976634]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#976634] font-bold">
                      Operator Appraisal
                    </span>
                  </div>
                  <p className="text-xs font-serif italic text-[#5C4B3C] leading-relaxed">
                    &ldquo;{current.operatorQuote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#E5D5BF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono text-[#9C8271] uppercase tracking-widest block font-semibold">
                    Instant Operator Toolkit
                  </span>
                  <span className="text-xs font-serif font-bold text-[#241A10]">
                    White-Label PDF & Media Deck
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#A06C3B] hover:from-[#E2B384] hover:to-[#B47C46] text-white text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 text-center shadow-lg shadow-[#A06C3B]/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Dossier</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl border border-[#E5D5BF] hover:border-[#C28E58] bg-white hover:bg-[#FAF3EA] text-[#241A10] text-xs font-mono font-semibold transition-all duration-200 flex items-center justify-center active:scale-95 shadow-sm"
                    title="Direct Concierge Channel"
                  >
                    B2B Desk
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}