"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { getDestinationSummary } from "@/Service/api/destination";

interface DestinationItem {
  _id: string;
  name: string;
  tagline: string;
  images: string[];
  description: string;
}

interface StatConfig {
  target: number;
  prefix?: string;
  suffix?: string;
  padZero?: boolean;
  label: string;
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
    </svg>
  );
}

function AnimatedCounter({ stat }: { stat: StatConfig }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * stat.target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(stat.target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isVisible, stat.target]);

  const formattedValue = () => {
    let numStr = count.toString();
    if (stat.padZero && count < 10) {
      numStr = `0${count}`;
    }
    return `${stat.prefix || ""}${numStr}${stat.suffix || ""}`;
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-2 text-center">
      <span className="font-serif text-3xl font-extrabold text-[#6D4322] sm:text-4xl tabular-nums tracking-tight">
        {formattedValue()}
      </span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#7C5A41]">
        {stat.label}
      </span>
    </div>
  );
}

export default function RoyalShowcase() {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [activeDest, setActiveDest] = useState<DestinationItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getDestinationSummary();
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          setDestinations(list);
          setActiveDest(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectDestination = (dest: DestinationItem) => {
    setActiveDest(dest);
    setActiveImageIndex(0);
  };

  const filteredDestinations = destinations.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsRibbon: StatConfig[] = [
    { target: destinations.length || 28, padZero: true, label: "Curated Destinations" },
    { target: 70, suffix: "%", label: "India's Wild Tiger Population" },
    { target: 3, padZero: true, label: "UNESCO World Heritage Sites" },
    { target: 2, padZero: true, label: "Venerated Jyotirlingas" },
    { target: 11, label: "National Parks & Sanctuaries" },
  ];

  const loadImageAsJPEG = async (url: string, maxWidth = 800): Promise<{ dataUrl: string; width: number; height: number } | null> => {
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

  const handleDownloadSinglePdf = async () => {
    if (!activeDest) return;
    setIsPdfLoading(true);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = 40;

    const accent: [number, number, number] = [143, 93, 56];
    const dark: [number, number, number] = [43, 27, 16];
    const muted: [number, number, number] = [110, 83, 63];

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = 40;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.text("MADHYA PRADESH TOURISM — OFFICIAL DESTINATION DOSSIER", margin, y);
    y += 18;

    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...dark);
    doc.text(activeDest.name, margin, y);
    y += 16;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    const taglineLines = doc.splitTextToSize(activeDest.tagline, contentWidth);
    doc.text(taglineLines, margin, y);
    y += taglineLines.length * 13 + 12;

    const mainImageUrl = activeDest.images?.[activeImageIndex] || activeDest.images?.[0];
    if (mainImageUrl) {
      const imgData = await loadImageAsJPEG(mainImageUrl, 900);
      if (imgData) {
        const targetWidth = contentWidth;
        const targetHeight = targetWidth * (imgData.height / imgData.width);
        const clampedHeight = Math.min(targetHeight, 260);
        ensureSpace(clampedHeight + 16);
        doc.addImage(imgData.dataUrl, "JPEG", margin, y, targetWidth, clampedHeight);
        y += clampedHeight + 18;
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text("DESTINATION OVERVIEW", margin, y);
    y += 4;
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...dark);
    const descLines = doc.splitTextToSize(activeDest.description, contentWidth);
    ensureSpace(descLines.length * 14 + 10);
    doc.text(descLines, margin, y);
    y += descLines.length * 14 + 16;

    if (activeDest.images && activeDest.images.length > 1) {
      ensureSpace(120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...accent);
      doc.text("PHOTO GALLERY", margin, y);
      y += 4;
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      const galleryImages = activeDest.images.slice(1, 4);
      const thumbWidth = (contentWidth - (galleryImages.length - 1) * 10) / galleryImages.length;
      const thumbHeight = thumbWidth * 0.65;

      for (let i = 0; i < galleryImages.length; i++) {
        const gImg = await loadImageAsJPEG(galleryImages[i], 400);
        if (gImg) {
          const posX = margin + i * (thumbWidth + 10);
          doc.addImage(gImg.dataUrl, "JPEG", posX, y, thumbWidth, thumbHeight);
        }
      }
      y += thumbHeight + 20;
    }

    ensureSpace(30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      "Issued by Madhya Pradesh Escapes & Tourism Promotion Board. Copyright (c) 2026.",
      margin,
      pageHeight - 20
    );

    doc.save(`MP-Destination-${activeDest.name.replace(/\s+/g, "_")}.pdf`);
    setIsPdfLoading(false);
  };

  const handleDownloadFullCatalogPdf = async () => {
    if (destinations.length === 0) return;
    setIsPdfLoading(true);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    const accent: [number, number, number] = [143, 93, 56];
    const dark: [number, number, number] = [43, 27, 16];
    const muted: [number, number, number] = [110, 83, 63];

    for (let index = 0; index < destinations.length; index++) {
      if (index > 0) doc.addPage();
      let y = 40;
      const dest = destinations[index];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...accent);
      doc.text(`MADHYA PRADESH TOURISM CATALOG — ${index + 1} OF ${destinations.length}`, margin, y);
      y += 18;

      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...dark);
      doc.text(dest.name, margin, y);
      y += 14;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(...muted);
      const tagLines = doc.splitTextToSize(dest.tagline, contentWidth);
      doc.text(tagLines, margin, y);
      y += tagLines.length * 12 + 10;

      if (dest.images?.[0]) {
        const coverImg = await loadImageAsJPEG(dest.images[0], 700);
        if (coverImg) {
          const imgH = Math.min(contentWidth * (coverImg.height / coverImg.width), 220);
          doc.addImage(coverImg.dataUrl, "JPEG", margin, y, contentWidth, imgH);
          y += imgH + 16;
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...accent);
      doc.text("DESTINATION OVERVIEW", margin, y);
      y += 3;
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...dark);
      const bodyLines = doc.splitTextToSize(dest.description, contentWidth);
      doc.text(bodyLines, margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...muted);
      doc.text(
        "Madhya Pradesh Tourism Catalog. Official Dossier 2026.",
        margin,
        pageHeight - 20
      );
    }

    doc.save("Madhya_Pradesh_Complete_Destinations_Catalog.pdf");
    setIsPdfLoading(false);
  };

  return (
    <section id="royal-showcase" className="relative w-full overflow-hidden bg-[#F5EFEB] py-20 text-[#2B1B10]">
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#EADCCB]/60 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#DFCEBA]/60 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-[#D8C7B3] pb-10 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8F5D38]/30 bg-[#ECE2D5] px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#7C4824] uppercase shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#B84A1C] animate-pulse" />
              MADHYA PRADESH OFFICIAL EXPEDITIONS
            </div>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#2B1B10] sm:text-5xl lg:text-6xl">
              The Sovereign <span className="italic text-[#8F5D38]">Chronicles</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6E533F]">
              Explore {destinations.length || 28} magnificent destinations across Central India, from ancient rock carvings and water palaces to the realm of the Royal Bengal Tiger.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleDownloadFullCatalogPdf}
              disabled={isPdfLoading || destinations.length === 0}
              className="flex items-center gap-2 rounded-2xl border border-[#8F5D38] bg-[#6D4322] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#523319] active:scale-95 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isPdfLoading ? "Building PDF..." : "Download Full 28-City Catalog"}</span>
            </button>

            <div className="relative w-full max-w-xs md:w-64">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#D8C7B3] bg-[#FAF5EE] px-4 py-2.5 pl-10 text-xs font-semibold text-[#2B1B10] placeholder-[#9E836E] shadow-sm outline-none transition focus:border-[#8F5D38] focus:ring-2 focus:ring-[#8F5D38]/20"
              />
              <svg
                className="absolute left-3.5 top-3 h-4 w-4 text-[#8F5D38]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8F5D38] border-t-transparent" />
              <span className="font-serif text-sm font-bold text-[#7C5A41]">
                Loading MP Expeditions...
              </span>
            </div>
          </div>
        ) : activeDest ? (
          <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D5C2AE] bg-[#FCF9F4] p-6 shadow-xl lg:col-span-7 sm:p-8">
              <div>
                <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-[#DECDBB] shadow-md">
                  <img
                    key={`${activeDest._id}-${activeImageIndex}`}
                    src={
                      activeDest.images?.[activeImageIndex] ||
                      activeDest.images?.[0] ||
                      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={activeDest.name}
                    className="h-full w-full object-cover transition-all duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1008]/90 via-[#1C1008]/25 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full border border-white/25 bg-[#2B1B10]/75 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#F2CCA5] backdrop-blur-md">
                      Madhya Pradesh Escapes
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#F2CCA5]">
                      Official Destination Dossier
                    </span>
                    <h3 className="font-serif text-3xl font-bold sm:text-4xl">
                      {activeDest.name}
                    </h3>
                    <p className="mt-1 font-serif text-sm italic text-[#E5D7CA] line-clamp-2">
                      {activeDest.tagline}
                    </p>
                  </div>
                </div>

                {activeDest.images && activeDest.images.length > 1 && (
                  <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1">
                    {activeDest.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          activeImageIndex === idx
                            ? "border-[#8F5D38] scale-105 shadow-md ring-2 ring-[#8F5D38]/30"
                            : "border-[#D6C4B0] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${activeDest.name}-${idx}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <p className="text-sm leading-relaxed text-[#4F3929]">
                    {activeDest.description}
                  </p>

                  <div className="rounded-2xl border border-[#DFCDBB] bg-[#EFE4D6] p-4">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#8F5D38]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
                      </svg>
                      <span className="font-serif text-sm font-bold text-[#2B1B10]">
                        {activeDest.tagline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-[#DECDBB] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleDownloadSinglePdf}
                  disabled={isPdfLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#8F5D38] bg-[#FAF5EE] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6D4322] shadow-sm transition-all duration-300 hover:bg-[#6D4322] hover:text-white active:scale-95 disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{isPdfLoading ? "Exporting..." : `Download ${activeDest.name} PDF`}</span>
                </button>

                <a
                  href={`https://wa.me/918269950599?text=Hello%2C%20I%20am%20interested%20in%20exploring%20the%20${encodeURIComponent(
                    activeDest.name
                  )}%20destination%20in%20Madhya%20Pradesh.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8F5D38] via-[#754420] to-[#552E12] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366] shrink-0" />
                  <span>Inquire For {activeDest.name}</span>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 lg:col-span-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#7C5A41]">
                    All Destinations ({filteredDestinations.length})
                  </h4>
                  <span className="text-[11px] font-medium text-[#9E836E]">
                    Click to view details
                  </span>
                </div>

                <div className="h-[520px] space-y-2.5 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#D8C7B3]">
                  {filteredDestinations.map((dest) => {
                    const isActive = activeDest._id === dest._id;
                    return (
                      <button
                        key={dest._id}
                        onClick={() => handleSelectDestination(dest)}
                        className={`group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                          isActive
                            ? "border-[#8F5D38] bg-[#EFE3D5] shadow-md ring-2 ring-[#8F5D38]/30"
                            : "border-[#DECDBB] bg-[#FAF5EE] hover:border-[#BFAB95] hover:bg-[#F3E8DB]"
                        }`}
                      >
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#D6C4B0]">
                          <img
                            src={
                              dest.images?.[0] ||
                              "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80"
                            }
                            alt={dest.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-base font-bold text-[#2B1B10] truncate group-hover:text-[#8F5D38]">
                            {dest.name}
                          </h5>
                          <p className="text-xs text-[#6B513E] line-clamp-1">
                            {dest.tagline}
                          </p>
                          <span className="mt-1 inline-block text-[10px] font-semibold text-[#8F5D38]">
                            {dest.images?.length || 1} Photos Available
                          </span>
                        </div>

                        <div
                          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                            isActive
                              ? "border-[#8F5D38] bg-[#6D4322] text-white"
                              : "border-[#D1BFAC] text-[#7A5B44] group-hover:border-[#8F5D38] group-hover:text-[#6D4322]"
                          }`}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[#D5C1AD] bg-[#EFE2D3] p-5 shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F5D38]">
                      Madhya Pradesh Travel Desk
                    </span>
                    <p className="font-serif text-lg font-bold text-[#2B1B10]">
                      Custom Multi-City Tour?
                    </p>
                    <p className="text-xs text-[#6C5340]">
                      Connect with local tour planners for personalized packages.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/918269950599?text=Hello%2C%20I%20want%20to%20plan%20a%20customized%20multi-city%20Madhya%20Pradesh%20tour."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:bg-[#20bd5a] hover:scale-105 active:scale-95"
                  >
                    <WhatsAppIcon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border border-[#D5C2AE] bg-[#FAF5EE] p-6 sm:grid-cols-3 lg:grid-cols-5 shadow-sm">
          {statsRibbon.map((stat, i) => (
            <AnimatedCounter key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}