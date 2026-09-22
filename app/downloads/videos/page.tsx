"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Video,
  Download,
  ArrowLeft,
  Loader2,
  Play,
  Pause,
  Search,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getVideos } from "../../../Service/api/video";

interface VideoItem {
  _id: string;
  cityName: string;
  videoName: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

function ReelCard({
  item,
  onDownload,
}: {
  item: VideoItem;
  onDownload: (url: string, name: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleTouchToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouchToggle}
      className="bg-white rounded-3xl border border-[#EFE4D8] p-3 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group select-none"
    >
      <div className="relative w-full aspect-[9/16] bg-[#0F0A06] rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer">
        <video
          ref={videoRef}
          src={item.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
        />

        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/15 shadow-sm">
            <MapPin className="w-3 h-3 text-[#C28E58]" />
            {item.cityName}
          </span>
        </div>

        <div
          className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </div>
        </div>
      </div>

      <div className="p-3 pt-4 flex-1 flex flex-col justify-between gap-3.5 bg-white">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-[#241A10]/5 text-[#976634] px-2 py-0.5 rounded font-semibold">
              <Sparkles className="w-2.5 h-2.5" /> Vertical Reel
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#241A10] line-clamp-2 leading-snug">
            {item.videoName}
          </h3>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(item.videoUrl, `${item.cityName}-${item.videoName}`);
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#241A10] hover:bg-[#C28E58] text-[#FAF5EE] text-xs font-semibold tracking-wide transition-colors shadow-sm active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-[#C28E58]" /> Download Reel (MP4)
        </button>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchVideosData = async () => {
      try {
        setLoading(true);
        const res = await getVideos();
        if (res?.success && Array.isArray(res.data)) {
          setVideos(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosData();
  }, []);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(
      (v) =>
        v.cityName.toLowerCase().includes(query) ||
        v.videoName.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  const handleDownload = async (videoUrl: string, filename: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename.replace(/\s+/g, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#241A10] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8DDD4] text-xs font-semibold text-[#8A7A6C] hover:text-[#241A10] hover:border-[#B38350] transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] text-[#976634] text-xs font-semibold border border-[#EBDCC9]">
            <Video className="w-3.5 h-3.5 text-[#C28E58]" /> Vertical Reels Library
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-10 shadow-xl shadow-black/5 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                  <Video className="w-4 h-4 text-[#C28E58]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C28E58]">
                  9:16 Vertical Videos
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241A10]">
                Tourism Reels & Shorts
              </h1>
              <p className="text-sm sm:text-base text-[#8A7A6C] mt-2 max-w-xl">
                Full-screen vertical reels. Hover over any video to preview.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A7A6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city or reel name..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8DDD4] rounded-2xl text-xs font-medium text-[#241A10] placeholder-[#8A7A6C] focus:outline-none focus:border-[#B38350] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#B38350]" />
            <p className="text-xs font-medium text-[#8A7A6C]">Loading reels...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EFE4D8] p-12 text-center">
            <Video className="w-12 h-12 text-[#B38350]/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#241A10] mb-1">
              No Reels Found
            </h3>
            <p className="text-xs text-[#8A7A6C]">
              {searchQuery
                ? `No reels match "${searchQuery}".`
                : "No vertical reels available right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredVideos.map((item) => (
              <ReelCard
                key={item._id}
                item={item}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}