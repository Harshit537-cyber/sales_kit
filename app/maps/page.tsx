"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Map,
  MapPin,
  Search,
  Download,
  Maximize2,
  ArrowLeft,
  Loader2,
  X,
  Compass,
} from "lucide-react";
import { getMaps } from "@/Service/api/map";

interface CityMapItem {
  _id: string;
  cityName: string;
  mapImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function InteractiveMapsPage() {
  const [maps, setMaps] = useState<CityMapItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMap, setSelectedMap] = useState<CityMapItem | null>(null);

  useEffect(() => {
    const fetchAllMaps = async () => {
      try {
        setLoading(true);
        const res = await getMaps();
        if (res?.success && Array.isArray(res.data)) {
          setMaps(res.data);
        }
      } catch (error) {
        console.error("Failed to load maps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMaps();
  }, []);

  const filteredMaps = useMemo(() => {
    if (!searchQuery.trim()) return maps;
    return maps.filter((item) =>
      item.cityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [maps, searchQuery]);

  const handleDownload = async (url: string, cityName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${cityName}-Travel-Map.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
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
            <Compass className="w-3.5 h-3.5 text-[#C28E58]" /> High-Resolution State Maps
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D8] p-6 sm:p-10 shadow-xl shadow-black/5 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                  <Map className="w-4 h-4 text-[#C28E58]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C28E58]">
                  Navigation & Circuits
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241A10]">
                City Travel Maps
              </h1>
              <p className="text-sm sm:text-base text-[#8A7A6C] mt-2 max-w-xl">
                Explore detailed full-size city maps, routes and safari circuits across Madhya Pradesh.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A7A6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city map..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8DDD4] rounded-2xl text-xs font-medium text-[#241A10] placeholder-[#8A7A6C] focus:outline-none focus:border-[#B38350] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#B38350]" />
            <p className="text-xs font-medium text-[#8A7A6C]">Loading city maps...</p>
          </div>
        ) : filteredMaps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EFE4D8] p-12 text-center">
            <Map className="w-12 h-12 text-[#B38350]/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#241A10] mb-1">
              No Maps Found
            </h3>
            <p className="text-xs text-[#8A7A6C]">
              {searchQuery ? `No maps found for "${searchQuery}".` : "No maps available currently."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredMaps.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-[#EFE4D8] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="p-5 sm:p-6 border-b border-[#F3EBE1] flex items-center justify-between bg-[#FCFBF9]">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#C28E58]" />
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#241A10]">
                        {item.cityName}
                      </h3>
                      <p className="text-[11px] text-[#8A7A6C]">Official Tourist & Circuit Guide</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#241A10]/5 text-[#976634] px-2.5 py-1 rounded-md font-semibold">
                    Full Map
                  </span>
                </div>

                <div
                  onClick={() => setSelectedMap(item)}
                  className="relative w-full h-[450px] sm:h-[550px] md:h-[620px] bg-[#FAF7F2] cursor-pointer overflow-hidden p-3 group/img"
                >
                  <Image
                    src={item.mapImage}
                    alt={`${item.cityName} Map`}
                    fill
                    priority
                    className="object-contain p-2 group-hover/img:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#241A10]/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[1px]">
                    <span className="px-4 py-2 rounded-xl bg-black/70 backdrop-blur-sm flex items-center gap-2 shadow-lg">
                      <Maximize2 className="w-4 h-4 text-[#C28E58]" /> Click to Open Fullscreen
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-white border-t border-[#F3EBE1] mt-auto flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMap(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF3EA] border border-[#E8DDD4] text-xs font-semibold text-[#241A10] transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 text-[#C28E58]" /> Fullscreen View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(item.mapImage, item.cityName)}
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#241A10] hover:bg-[#C28E58] text-[#FAF5EE] text-xs font-semibold transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4 text-[#C28E58]" /> Download Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {selectedMap && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-7xl h-[94vh] bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EFE4D8]">
            
            <div className="px-6 py-4 bg-white border-b border-[#EFE4D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#C28E58]" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#241A10]">
                    {selectedMap.cityName} Tourist Map
                  </h3>
                  <p className="text-[11px] text-[#8A7A6C]">High Resolution View</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedMap.mapImage, selectedMap.cityName)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#241A10] text-[#FAF5EE] text-xs font-semibold hover:bg-[#C28E58] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C28E58]" /> Download Map
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMap(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-[#F5F2EC] p-2 sm:p-4 overflow-auto flex items-center justify-center">
              <div className="relative w-full h-full min-h-[500px]">
                <Image
                  src={selectedMap.mapImage}
                  alt={selectedMap.cityName}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}