"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Download,
  Archive,
  ArrowLeft,
  Search,
  Eye,
  X,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageBank, downloadAllImages } from "@/Service/api/imageBankApi";

export interface TourismImage {
  _id: string;
  title: string;
  category: "Wildlife" | "Heritage" | "Spiritual" | "Nature" | "Culture";
  location: string;
  url: string;
  resolution: string;
  fileSize: string;
}

interface ImageBankApiResponse {
  _id: string;
  imageUrl: string;
  publicId: string;
  originalName: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["All", "Wildlife", "Heritage", "Spiritual", "Nature", "Culture"] as const;

export default function DownloadsImagesPage() {
  const [images, setImages] = useState<TourismImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<TourismImage | null>(null);
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await getImageBank();
        if (res?.success && Array.isArray(res.data)) {
          const categoryList: TourismImage["category"][] = [
            "Wildlife",
            "Heritage",
            "Spiritual",
            "Nature",
            "Culture",
          ];

          const mapped: TourismImage[] = res.data.map(
            (item: ImageBankApiResponse, index: number) => {
              const cleanTitle = item.originalName
                .replace(/\.[^/.]+$/, "")
                .replace(/[_-]/g, " ");

              return {
                _id: item._id,
                title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
                category: categoryList[index % categoryList.length],
                location: "Madhya Pradesh",
                url: item.imageUrl,
                resolution: "Original HD",
                fileSize: "Cloudinary Asset",
              };
            }
          );
          setImages(mapped);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    }
  }, [images.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoSlide]);

  const handleNextSlide = () => {
    if (images.length <= 1) return;
    setHeroIndex((prev) => (prev + 1) % images.length);
    startAutoSlide();
  };

  const handlePrevSlide = () => {
    if (images.length <= 1) return;
    setHeroIndex((prev) => (prev - 1 + images.length) % images.length);
    startAutoSlide();
  };

  const handleDotClick = (index: number) => {
    setHeroIndex(index);
    startAutoSlide();
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesCategory =
        activeCategory === "All" || img.category === activeCategory;
      const matchesSearch =
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [images, activeCategory, searchQuery]);

  const handleDownloadSingle = async (e: React.MouseEvent, img: TourismImage) => {
    e.stopPropagation();
    try {
      const res = await fetch(img.url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${img.title.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(img.url, "_blank");
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      await downloadAllImages();
    } catch (err) {
      console.error(err);
      alert("Failed to download ZIP file.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241A10] pb-20">
      <section className="relative bg-[#0d0704] text-[#FAF5EE] pt-28 pb-20 px-4 md:px-8 overflow-hidden min-h-[480px] flex items-center">
        {images.map((img, index) => (
          <div
            key={img._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === heroIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
          >
            <img
              src={img.url}
              alt={img.title}
              className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                index === heroIndex ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#180E08] via-transparent to-black/40 pointer-events-none z-[1]" />

        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-3 md:inset-x-6 flex items-center justify-between pointer-events-none z-20">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all active:scale-90 pointer-events-auto cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all active:scale-90 pointer-events-auto cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#F1C694] hover:text-white transition-colors mb-6 bg-black/40 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl bg-black/30 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C28E58]/30 border border-[#C28E58]/50 text-[#F1C694] text-[11px] font-mono uppercase tracking-wider mb-3 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" /> Official Media Gallery
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
                High-Resolution Asset Library
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/95 leading-relaxed font-normal drop-shadow">
                Explore and download {images.length}+ curated, print-ready travel
                photographs, marketing assets, and royalty-free scenic visuals of
                Madhya Pradesh.
              </p>

              {images.length > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 text-xs bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl text-white/90 font-mono backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                  <span>Now Showing ({heroIndex + 1}/{images.length}):</span>
                  <span className="text-[#F1C694] font-semibold truncate max-w-xs sm:max-w-sm">
                    {images[heroIndex]?.title || "Asset Showcase"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping || filteredImages.length === 0}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C28E58] to-[#976634] text-white font-semibold text-sm shadow-2xl shadow-black/50 hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer border border-white/20"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Download All Images (ZIP)</span>
                    <span className="text-xs font-mono bg-white/25 px-2 py-0.5 rounded-full">
                      {filteredImages.length}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-8 flex items-center gap-2 overflow-x-auto py-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 shadow-md ${
                    i === heroIndex
                      ? "w-9 bg-[#F1C694]"
                      : "w-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#EFE4D8] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#241A10] text-[#FAF5EE] shadow-md shadow-black/10"
                    : "bg-[#FAF7F2] text-[#6A5B4F] hover:bg-[#FAF3EA] hover:text-[#241A10]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8A7A6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8DDD4] focus:outline-none focus:border-[#C28E58] focus:bg-white text-[#241A10] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6C] hover:text-[#241A10]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#8A7A6C] font-mono">
            Showing <strong className="text-[#241A10]">{filteredImages.length}</strong> of {images.length} available files
          </p>
          <span className="text-[11px] text-[#976634] font-medium bg-[#FAF3EA] px-2.5 py-1 rounded-lg border border-[#EBDCC9]">
            Full High-Res Quality
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-[#EFE4D8] p-16 text-center my-8 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#C28E58] animate-spin mb-3" />
            <p className="text-sm font-medium text-[#241A10]">Loading asset library...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EFE4D8] p-12 text-center my-8">
            <SlidersHorizontal className="w-10 h-10 text-[#C28E58] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-[#241A10]">No media assets found</h3>
            <p className="text-xs text-[#8A7A6C] mt-1">
              Try adjusting your search keyword or selected category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredImages.map((img) => (
              <div
                key={img._id}
                onClick={() => setPreviewImage(img)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#EFE4D8] hover:border-[#C28E58]/50 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={img.url}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                    <span className="text-[11px] text-white/90 flex items-center gap-1 font-mono">
                      <Eye className="w-3.5 h-3.5 text-[#C28E58]" /> Preview
                    </span>
                    <span className="text-[10px] bg-black/60 text-white font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                      {img.fileSize}
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 bg-[#241A10]/75 backdrop-blur-md text-[#FAF5EE] text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
                    {img.category}
                  </div>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h2 className="text-xs font-semibold text-[#241A10] group-hover:text-[#976634] line-clamp-1 transition-colors">
                      {img.title}
                    </h2>
                    <p className="text-[11px] text-[#8A7A6C] line-clamp-1 mt-0.5">
                      📍 {img.location}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F6EFE7] flex items-center justify-between">
                    <span className="text-[10px] text-[#976634] font-mono font-medium">
                      {img.resolution}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadSingle(e, img)}
                      title="Download image"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#241A10] text-[#241A10] hover:text-[#FAF5EE] border border-[#E8DDD4] hover:border-[#241A10] text-[11px] font-semibold transition-all group/btn"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C28E58] group-hover/btn:text-[#FAF5EE]" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-[#241A10] border border-white/10 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col text-[#FAF5EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white truncate max-w-xs md:max-w-md">
                  {previewImage.title}
                </span>
                <span className="text-[10px] bg-[#C28E58]/30 text-[#C28E58] px-2 py-0.5 rounded-full font-mono">
                  {previewImage.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black/50 flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-[#1B120B] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-white/70">
                <span>📍 {previewImage.location}</span>
                <span>•</span>
                <span className="font-mono">{previewImage.resolution}</span>
                <span>•</span>
                <span className="font-mono">{previewImage.fileSize}</span>
              </div>

              <button
                onClick={(e) => handleDownloadSingle(e, previewImage)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C28E58] to-[#976634] text-white text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-black/20"
              >
                <Download className="w-3.5 h-3.5" />
                Download Full Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}