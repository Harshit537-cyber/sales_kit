"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import mpLogo from "../../../assets/mp_Escapes.jpg";
import {
  MapPin,
  Sparkles,
  Crown,
  Compass,
  ArrowLeft,
  Loader2,
  Download,
} from "lucide-react";
import { getHotelById } from "@/Service/api/luxuryhotel";

interface HotelData {
  _id: string;
  name: string;
  location: string;
  tagline: string;
  images: string[];
  story: string;
  city: string;
  whyItStandsOut: string;
  signatureExperience: string;
}

export default function LuxuryHotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.id as string;

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await getHotelById(hotelId);

        if (res?.success) {
          const data = Array.isArray(res.data)
            ? res.data.find((item: HotelData) => item._id === hotelId) || res.data[0]
            : res.data;

          setHotel(data);
          if (data?.images?.length > 0) {
            setActiveImage(data.images[0]);
          }
        } else {
          setError("Hotel details not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

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

  const handleDownloadPDF = async () => {
    if (!hotel) return;
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
      doc.text("MP ESCAPES — LUXURY HERITAGE FACTSHEET", margin, y);
      y += 28;

      doc.setFont("times", "bold");
      doc.setFontSize(24);
      doc.setTextColor(...dark);
      const nameLines = doc.splitTextToSize(cleanTextForPdf(hotel.name), titleWidth);
      doc.text(nameLines, margin, y);
      y += nameLines.length * 20 + 4;

      if (hotel.location) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...accent);
        doc.text(`LOCATION: ${cleanTextForPdf(hotel.location).toUpperCase()}`, margin, y);
        y += 14;
      }

      if (hotel.tagline) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...muted);
        const tagLines = doc.splitTextToSize(`"${cleanTextForPdf(hotel.tagline)}"`, titleWidth);
        doc.text(tagLines, margin, y);
        y += tagLines.length * 14 + 6;
      }

      const minHeaderBottom = logoData ? logoStartY + logoHeight + 18 : 0;
      if (y < minHeaderBottom) {
        y = minHeaderBottom;
      } else {
        y += 12;
      }

      const heroUrl = hotel.images?.[0];
      if (heroUrl) {
        const heroImg = await loadImageAsJPEG(heroUrl, 900);
        if (heroImg) {
          const targetHeight = Math.min(contentWidth * (heroImg.height / heroImg.width), 220);
          ensureSpace(targetHeight + 24);
          doc.addImage(heroImg.dataUrl, "JPEG", margin, y, contentWidth, targetHeight);
          y += targetHeight + 24;
        }
      }

      if (hotel.signatureExperience) {
        ensureSpace(70);
        addHeading("Signature Experience");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        const sigLines = doc.splitTextToSize(cleanTextForPdf(hotel.signatureExperience), contentWidth - 24);
        const boxHeight = sigLines.length * 14 + 18;

        ensureSpace(boxHeight + 10);
        doc.setFillColor(...lightBg);
        doc.setDrawColor(...accent);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y - 10, contentWidth, boxHeight, 4, 4, "FD");

        doc.setTextColor(...dark);
        doc.text(sigLines, margin + 12, y + 6);
        y += boxHeight + 14;
      }

      if (hotel.story) {
        addHeading("The Palace Story");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const storyLines = doc.splitTextToSize(cleanTextForPdf(hotel.story), contentWidth);
        ensureSpace(storyLines.length * 14 + 12);
        doc.text(storyLines, margin, y);
        y += storyLines.length * 14 + 18;
      }

      if (hotel.whyItStandsOut) {
        addHeading("Why It Stands Out");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const whyLines = doc.splitTextToSize(cleanTextForPdf(hotel.whyItStandsOut), contentWidth);
        ensureSpace(whyLines.length * 14 + 12);
        doc.text(whyLines, margin, y);
        y += whyLines.length * 14 + 18;
      }

      if (hotel.city) {
        addHeading("About The Destination");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const cityLines = doc.splitTextToSize(cleanTextForPdf(hotel.city), contentWidth);
        ensureSpace(cityLines.length * 14 + 12);
        doc.text(cityLines, margin, y);
        y += cityLines.length * 14 + 18;
      }

      if (hotel.images && hotel.images.length > 1) {
        ensureSpace(130);
        addHeading("Property Gallery");
        const galleryImages = hotel.images.slice(1, 4);
        const thumbWidth = (contentWidth - (galleryImages.length - 1) * 10) / galleryImages.length;
        const thumbHeight = thumbWidth * 0.65;

        for (let i = 0; i < galleryImages.length; i++) {
          const gImg = await loadImageAsJPEG(galleryImages[i], 400);
          if (gImg) {
            const posX = margin + i * (thumbWidth + 10);
            doc.addImage(gImg.dataUrl, "JPEG", posX, y, thumbWidth, thumbHeight);
          }
        }
        y += thumbHeight + 24;
      }

      ensureSpace(30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(
        `Curated by MP Escapes — DMC for Central India. Luxury Property Dossier for ${cleanTextForPdf(hotel.name)}.`,
        margin,
        pageHeight - 20
      );

      doc.save(`MP_Luxury_${hotel.name.replace(/\s+/g, "_")}_Factsheet.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#B38350]" />
        <p className="text-sm font-medium text-[#8A7A6C]">Loading luxury stay...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Crown className="w-12 h-12 text-[#B38350]/50" />
        <h2 className="text-2xl font-serif text-[#241A10]">Hotel Not Found</h2>
        <p className="text-sm text-[#8A7A6C] max-w-md">
          {error || "We could not find the luxury hotel you are looking for."}
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#241A10] text-[#FAF5EE] text-sm font-medium hover:bg-[#B38350] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#241A10] pb-20 print:bg-white print:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 print:p-0">
        
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8DDD4] text-xs font-semibold text-[#8A7A6C] hover:text-[#241A10] hover:border-[#B38350] transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Destinations
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#241A10] text-[#FAF5EE] border border-[#B38350]/40 text-xs font-semibold hover:bg-[#B38350] transition-all shadow-md disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C28E58]" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#C28E58]" />
                Download PDF Factsheet
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-8 md:p-10 shadow-xl shadow-black/5 mb-8 print:shadow-none print:border-none print:p-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] text-[#976634] text-xs font-semibold border border-[#EBDCC9]">
              <Crown className="w-3.5 h-3.5 text-[#C28E58]" /> Luxury Heritage Stay
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#8A7A6C]">
              <MapPin className="w-3.5 h-3.5 text-[#C28E58]" /> {hotel.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241A10] mb-3 leading-tight">
            {hotel.name}
          </h1>

          <p className="text-base sm:text-lg text-[#8A7A6C] font-serif italic max-w-3xl">
            "{hotel.tagline}"
          </p>
        </div>

        <div className="space-y-4 mb-12 print:mb-6">
          <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] print:h-[350px] rounded-3xl overflow-hidden shadow-xl border border-[#EFE4D8] bg-[#241A10]/5">
            {activeImage && (
              <Image
                src={activeImage}
                alt={hotel.name}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
            )}
          </div>

          {hotel.images && hotel.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 print:hidden">
              {hotel.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 sm:h-28 md:h-32 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? "border-[#B38350] scale-[1.02] shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${hotel.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F3EBE1]">
                <span className="w-9 h-9 rounded-xl bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-[#976634]" />
                </span>
                <h2 className="text-xl font-serif font-bold text-[#241A10]">The Palace Story</h2>
              </div>
              <p className="text-[#594B3F] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {hotel.story}
              </p>
            </section>

            <section className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F3EBE1]">
                <span className="w-9 h-9 rounded-xl bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#976634]" />
                </span>
                <h2 className="text-xl font-serif font-bold text-[#241A10]">Why It Stands Out</h2>
              </div>
              <p className="text-[#594B3F] text-sm sm:text-base leading-relaxed">
                {hotel.whyItStandsOut}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#2A1D12] to-[#170E08] text-[#FAF5EE] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B38350]/30">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#EBDCC9] text-xs font-semibold mb-4 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#C28E58]" /> Curated Moment
              </span>
              <h3 className="text-lg font-serif font-bold text-white mb-3">Signature Experience</h3>
              <p className="text-sm text-[#D7C9BD] leading-relaxed mb-6">
                {hotel.signatureExperience}
              </p>

              <div className="space-y-2.5 print:hidden">
                <a
                  href={`https://wa.me/918269950599?text=Hello%2C%20I%20am%20interested%20in%20inquiring%20rates%20and%20booking%20for%20${encodeURIComponent(
                    hotel.name
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center block py-3.5 px-4 rounded-xl bg-[#C28E58] hover:bg-[#A9743E] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Inquire For Booking
                </a>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#B38350]/50 text-[#FAF5EE] hover:bg-white/10 text-xs font-semibold tracking-wide transition-colors disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C28E58]" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#C28E58]" />
                      Download Factsheet (PDF)
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#F3EBE1]">
                <MapPin className="w-4 h-4 text-[#976634]" />
                <h3 className="text-base font-serif font-bold text-[#241A10]">About The Destination</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#8A7A6C] leading-relaxed">
                {hotel.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}