"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import mpLogo from "../../../assets/mp_Escapes.jpg";
import {
  MapPin,
  Calendar,
  Plane,
  Train,
  Car,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Map as MapIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Camera,
} from "lucide-react";
import { getDestinationById } from "../../../Service/api/destination";

interface EssentialTravelInfo {
  weatherAndSeasonality?: string;
  nearestAirport?: string;
  nearestRailhead?: string;
  roadConnectivity?: string;
  canBeCombinedWith?: string[];
}

interface DestinationData {
  _id: string;
  name: string;
  tagline?: string;
  description?: string;
  highlights?: string[];
  images?: string[];
  mapImage?: string;
  essentialTravelInfo?: EssentialTravelInfo;
}

interface DestinationResponse {
  success: boolean;
  data: DestinationData;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const [destination, setDestination] = useState<DestinationData | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const response: DestinationResponse = await getDestinationById(id);
        if (response?.success && response?.data) {
          setDestination(response.data);
          if (response.data.images && response.data.images.length > 0) {
            setSelectedImage(response.data.images[0]);
          }
        } else {
          setError("Destination data not found.");
        }
      } catch (err) {
        setError("Failed to fetch destination details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  useEffect(() => {
    if (!destination?.images || destination.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destination.images!.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [destination?.images]);

  const cleanTextForPdf = (str: string): string => {
    return str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2022\u2726\u2728\u25C6\u25CF]/g, "")
      .replace(/[^\x20-\x7E\t\n\r]/g, "");
  };

  const loadImageAsJPEG = async (url: string, maxWidth = 900): Promise<{ dataUrl: string; width: number; height: number } | null> => {
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

  const handleDownloadPdf = async () => {
    if (!destination) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;

      const accent: [number, number, number] = [194, 142, 88];
      const dark: [number, number, number] = [36, 26, 16];
      const muted: [number, number, number] = [110, 83, 63];
      const lightBg: [number, number, number] = [250, 247, 242];

      let y = 45;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = 45;
        }
      };

      const addHeading = (text: string) => {
        ensureSpace(32);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...accent);
        doc.text(cleanTextForPdf(text).toUpperCase(), margin, y);
        y += 5;
        doc.setDrawColor(...accent);
        doc.setLineWidth(0.75);
        doc.line(margin, y, pageWidth - margin, y);
        y += 16;
      };

      const logoSource = typeof mpLogo === "string" ? mpLogo : (mpLogo as { src: string }).src;
      const logoData = await loadImageAsJPEG(logoSource, 400);

      let logoWidth = 0;
      let logoHeight = 0;
      const logoStartY = 38;

      if (logoData) {
        logoWidth = 65;
        logoHeight = (logoData.height / logoData.width) * logoWidth;
        doc.addImage(logoData.dataUrl, "JPEG", pageWidth - margin - logoWidth, logoStartY, logoWidth, logoHeight);
      }

      const titleWidth = logoData ? contentWidth - logoWidth - 20 : contentWidth;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...accent);
      doc.text("MP ESCAPES — DMC FOR CENTRAL INDIA", margin, y);
      y += 28;

      doc.setFont("times", "bold");
      doc.setFontSize(26);
      doc.setTextColor(...dark);
      const nameLines = doc.splitTextToSize(cleanTextForPdf(destination.name), titleWidth);
      doc.text(nameLines, margin, y);
      y += nameLines.length * 22 + 4;

      if (destination.tagline) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...muted);
        const tagLines = doc.splitTextToSize(cleanTextForPdf(destination.tagline), titleWidth);
        doc.text(tagLines, margin, y);
        y += tagLines.length * 14 + 6;
      }

      const minHeaderBottom = logoData ? logoStartY + logoHeight + 18 : 0;
      if (y < minHeaderBottom) {
        y = minHeaderBottom;
      } else {
        y += 12;
      }

      const heroUrl = destination.images?.[0];
      if (heroUrl) {
        const heroImg = await loadImageAsJPEG(heroUrl, 900);
        if (heroImg) {
          const targetHeight = Math.min(contentWidth * (heroImg.height / heroImg.width), 220);
          ensureSpace(targetHeight + 24);
          doc.addImage(heroImg.dataUrl, "JPEG", margin, y, contentWidth, targetHeight);
          y += targetHeight + 24;
        }
      }

      const travelInfo = destination.essentialTravelInfo || {};
      const hasTravelInfo =
        travelInfo.weatherAndSeasonality ||
        travelInfo.nearestAirport ||
        travelInfo.nearestRailhead ||
        travelInfo.roadConnectivity;

      if (hasTravelInfo) {
        addHeading("Essential Travel Information");
        const items = [
          { label: "Seasonality", val: travelInfo.weatherAndSeasonality },
          { label: "Nearest Airport", val: travelInfo.nearestAirport },
          { label: "Nearest Railhead", val: travelInfo.nearestRailhead },
          { label: "Road Access", val: travelInfo.roadConnectivity },
        ].filter((item) => item.val);

        const cardWidth = (contentWidth - 10) / 2;
        for (let i = 0; i < items.length; i += 2) {
          ensureSpace(58);
          const row = items.slice(i, i + 2);
          row.forEach((col, cIdx) => {
            const posX = margin + cIdx * (cardWidth + 10);
            doc.setFillColor(...lightBg);
            doc.roundedRect(posX, y, cardWidth, 48, 4, 4, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...accent);
            doc.text(cleanTextForPdf(col.label).toUpperCase(), posX + 8, y + 14);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(...dark);
            const valLines = doc.splitTextToSize(cleanTextForPdf(col.val || ""), cardWidth - 16);
            doc.text(valLines.slice(0, 2), posX + 8, y + 26);
          });
          y += 56;
        }
        y += 6;
      }

      if (destination.description) {
        addHeading(`About ${destination.name}`);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const descLines = doc.splitTextToSize(cleanTextForPdf(destination.description), contentWidth);
        ensureSpace(descLines.length * 14 + 12);
        doc.text(descLines, margin, y);
        y += descLines.length * 14 + 18;
      }

      if (destination.highlights && destination.highlights.length > 0) {
        addHeading("Key Highlights & Sightings");
        const bulletIndent = 16;
        const textWidth = contentWidth - bulletIndent;

        destination.highlights.forEach((hl) => {
          const cleanedHl = cleanTextForPdf(hl);
          const hlLines = doc.splitTextToSize(cleanedHl, textWidth);
          const blockHeight = hlLines.length * 13 + 6;

          ensureSpace(blockHeight);

          doc.setFillColor(...accent);
          doc.circle(margin + 5, y - 3.5, 2.2, "F");

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...dark);
          doc.text(hlLines, margin + bulletIndent, y);

          y += blockHeight;
        });
        y += 10;
      }

      if (travelInfo.canBeCombinedWith && travelInfo.canBeCombinedWith.length > 0) {
        addHeading("Can Be Combined With");
        ensureSpace(38);

        let currentBadgeX = margin;
        const badgeHeight = 20;

        travelInfo.canBeCombinedWith.forEach((place) => {
          const cleanPlace = cleanTextForPdf(place);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          const textWidth = doc.getTextWidth(cleanPlace);
          const badgeWidth = textWidth + 16;

          if (currentBadgeX + badgeWidth > pageWidth - margin) {
            y += badgeHeight + 8;
            currentBadgeX = margin;
          }

          doc.setFillColor(...lightBg);
          doc.setDrawColor(...accent);
          doc.setLineWidth(0.5);
          doc.roundedRect(currentBadgeX, y - 10, badgeWidth, badgeHeight, 3, 3, "FD");

          doc.setTextColor(...accent);
          doc.text(cleanPlace, currentBadgeX + 8, y + 3);

          currentBadgeX += badgeWidth + 8;
        });

        y += badgeHeight + 16;
      }

      if (destination.images && destination.images.length > 1) {
        ensureSpace(130);
        addHeading("Destination Gallery");
        const extraImages = destination.images.slice(1, 4);
        const thumbWidth = (contentWidth - (extraImages.length - 1) * 10) / extraImages.length;
        const thumbHeight = thumbWidth * 0.65;

        for (let i = 0; i < extraImages.length; i++) {
          const gImg = await loadImageAsJPEG(extraImages[i], 400);
          if (gImg) {
            const posX = margin + i * (thumbWidth + 10);
            doc.addImage(gImg.dataUrl, "JPEG", posX, y, thumbWidth, thumbHeight);
          }
        }
        y += thumbHeight + 24;
      }

      if (destination.mapImage) {
        doc.addPage();
        y = 45;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...accent);
        doc.text("MADHYA PRADESH REGIONAL CARTOGRAPHY", margin, y);
        y += 22;

        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.setTextColor(...dark);
        doc.text(`${cleanTextForPdf(destination.name)} - Tourist Route & Zone Map`, margin, y);
        y += 18;

        const mapImg = await loadImageAsJPEG(destination.mapImage, 1000);
        if (mapImg) {
          const availableHeight = pageHeight - y - margin - 30;
          const targetWidth = contentWidth;
          const targetHeight = Math.min(contentWidth * (mapImg.height / mapImg.width), availableHeight);
          doc.addImage(mapImg.dataUrl, "JPEG", margin, y, targetWidth, targetHeight);
        }
      }

      ensureSpace(30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(
        `Curated by MP Escapes — DMC for Central India. Destination Dossier for ${cleanTextForPdf(destination.name)}.`,
        margin,
        pageHeight - 20
      );

      doc.save(`MP_${destination.name.replace(/\s+/g, "_")}_Dossier.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 0.3, 1));
  };

  const handleResetZoom = () => {
    setMapZoom(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#C28E58]" />
        <p className="text-sm font-semibold text-[#241A10]">Loading destination details...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-base font-semibold text-red-600">{error || "Destination not found"}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#241A10] text-[#FAF5EE]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const {
    name,
    tagline,
    description,
    highlights = [],
    images = [],
    mapImage,
    essentialTravelInfo = {},
  } = destination;

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#241A10]">
      <section className="relative min-h-[540px] sm:min-h-[620px] text-[#FAF5EE] pt-6 sm:pt-10 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`${name} slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45 z-10" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#FAF5EE] bg-black/40 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-white/20 hover:bg-black/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58]" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#C28E58] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              {images.length > 1 && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FAF5EE]">
                    {currentSlide + 1}/{images.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#EBDCC9] font-mono mb-2 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58] shrink-0" />
            <span>Madhya Pradesh, India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-2 sm:mb-3 tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] break-words">
            {name}
          </h1>

          {tagline && (
            <p className="text-sm sm:text-base md:text-xl text-[#FAF5EE] max-w-3xl font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-relaxed">
              {tagline}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            {essentialTravelInfo.weatherAndSeasonality && (
              <div className="bg-[#170E08]/75 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58] mb-1.5 sm:mb-2" />
                <div className="text-[10px] sm:text-[11px] text-[#C28E58] uppercase font-mono tracking-wider font-semibold">Seasonality</div>
                <div className="text-xs text-white/95 mt-1 leading-relaxed break-words">
                  {essentialTravelInfo.weatherAndSeasonality}
                </div>
              </div>
            )}

            {essentialTravelInfo.nearestAirport && (
              <div className="bg-[#170E08]/75 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl">
                <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58] mb-1.5 sm:mb-2" />
                <div className="text-[10px] sm:text-[11px] text-[#C28E58] uppercase font-mono tracking-wider font-semibold">Airport</div>
                <div className="text-xs text-white/95 mt-1 leading-relaxed break-words">
                  {essentialTravelInfo.nearestAirport}
                </div>
              </div>
            )}

            {essentialTravelInfo.nearestRailhead && (
              <div className="bg-[#170E08]/75 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl">
                <Train className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58] mb-1.5 sm:mb-2" />
                <div className="text-[10px] sm:text-[11px] text-[#C28E58] uppercase font-mono tracking-wider font-semibold">Railhead</div>
                <div className="text-xs text-white/95 mt-1 leading-relaxed break-words">
                  {essentialTravelInfo.nearestRailhead}
                </div>
              </div>
            )}

            {essentialTravelInfo.roadConnectivity && (
              <div className="bg-[#170E08]/75 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58] mb-1.5 sm:mb-2" />
                <div className="text-[10px] sm:text-[11px] text-[#C28E58] uppercase font-mono tracking-wider font-semibold">Road Access</div>
                <div className="text-xs text-white/95 mt-1 leading-relaxed break-words">
                  {essentialTravelInfo.roadConnectivity}
                </div>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-7 sm:w-8 bg-[#C28E58]" : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {images.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/5 border border-[#EFE4D8]">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-[#C28E58]" />
                  <h3 className="font-serif font-bold text-sm text-[#241A10]">
                    Destination Gallery
                  </h3>
                </div>

                <div className="relative w-full h-56 sm:h-80 md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF3EA] mb-3 sm:mb-4">
                  <img
                    src={selectedImage || images[0]}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                  {images.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === imgUrl
                          ? "border-[#C28E58] scale-105 shadow-md shadow-[#C28E58]/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`${name}-${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-black/5 border border-[#EFE4D8]">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#241A10] mb-3 sm:mb-4">
                About {name}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#5C4D3E] whitespace-pre-line break-words">
                {description}
              </p>
            </div>

            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-black/5 border border-[#EFE4D8]">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#241A10] mb-4 sm:mb-6">
                  Key Highlights & Sightings
                </h2>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE4D8]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C28E58] mt-0.5 shrink-0" />
                      <span className="text-xs font-medium text-[#241A10] leading-snug break-words">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {essentialTravelInfo.canBeCombinedWith && essentialTravelInfo.canBeCombinedWith.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-black/5 border border-[#EFE4D8]">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58]" />
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#241A10]">
                    Can Be Combined With
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {essentialTravelInfo.canBeCombinedWith.map((place, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF3EA] border border-[#EBDCC9] text-xs font-semibold text-[#976634]"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/5 border border-[#EFE4D8]">
              <h3 className="font-serif font-bold text-base text-[#241A10] mb-2">
                Book Safaris & Packages
              </h3>
              <p className="text-xs text-[#8A7A6C] mb-5 leading-relaxed">
                Connect directly with our travel desk for itinerary planning, safari gates, and hotel tariffs.
              </p>
              <a
                href={`https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20booking%20packages%20and%20safari%20for%20${encodeURIComponent(
                  name
                )}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#C28E58] to-[#8A5A2E] shadow-md hover:brightness-110 active:scale-95 transition-all text-center"
              >
                Inquire on WhatsApp
              </a>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/5 border border-[#EFE4D8]">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Download className="w-4 h-4 text-[#C28E58]" />
                <h3 className="font-serif font-bold text-sm text-[#241A10]">
                  Offline Itinerary
                </h3>
              </div>
              <p className="text-xs text-[#8A7A6C] mb-4 leading-relaxed">
                Save full destination notes, highlights, connectivity and map in PDF format.
              </p>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-[#241A10] bg-[#FAF3EA] border border-[#EBDCC9] hover:bg-[#FAF7F2] active:scale-95 transition-all disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C28E58]" />
                    <span>Building PDF File...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#C28E58]" />
                    <span>Export as PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {mapImage && (
          <div className="mt-8 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-black/5 border border-[#EFE4D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C28E58] shrink-0" />
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#241A10]">
                    Tourist Route & Zone Map
                  </h2>
                </div>
                <p className="text-xs text-[#8A7A6C] mt-1 leading-relaxed">
                  Detailed tourist map, safari gates, and regional connectivity routes.
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#FAF7F2] p-1.5 rounded-xl sm:rounded-2xl border border-[#EFE4D8] self-start sm:self-auto">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white text-[#241A10] hover:bg-[#FAF3EA] border border-[#EFE4D8] transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold px-1.5 sm:px-2 text-[#976634]">
                  {Math.round(mapZoom * 100)}%
                </span>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white text-[#241A10] hover:bg-[#FAF3EA] border border-[#EFE4D8] transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white text-[#241A10] hover:bg-[#FAF3EA] border border-[#EFE4D8] transition-colors"
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="relative w-full h-[320px] sm:h-[450px] md:h-[650px] overflow-auto rounded-xl sm:rounded-2xl bg-[#FAF7F2] border border-[#EFE4D8] flex items-center justify-center p-2 sm:p-4">
              <img
                src={mapImage}
                alt={`${name} Large Map`}
                style={{ transform: `scale(${mapZoom})` }}
                className="max-w-none w-auto h-auto max-h-[300px] sm:max-h-[500px] md:max-h-[600px] object-contain transition-transform duration-200 origin-center"
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}