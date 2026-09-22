"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Package,
  BookOpen,
  PhoneCall,
  Map,
  ChevronDown,
  FileText,
  Calendar,
  CheckSquare,
  Image as ImageIcon,
  Video,
  MapPin,
  Loader2,
  Download,
  Folder,
  Archive,
  Phone,
  Clock,
  ExternalLink,
  MessageCircle,
  Mail,
  PawPrint,
  Flame,
  Landmark,
  Trees,
  Scissors,
  Crown,
  Sparkles,
} from "lucide-react";
import { getDestinationNames } from "../Service/api/destination";
import { getDownloads, downloadCategoryZip } from "../Service/api/downloads";
import { getHotelNames } from "../Service/api/luxuryhotel";
import { getDosDonts } from "../Service/api/dosDontsService";

interface Destination {
  _id: string;
  name: string;
}

interface LuxuryHotel {
  _id: string;
  name: string;
}

interface DownloadFile {
  _id: string;
  originalName: string;
  fileUrl: string;
  publicId: string;
}

interface DownloadCategory {
  _id: string;
  categoryName: string;
  files: DownloadFile[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DosDontFile {
  _id: string;
  originalName: string;
  fileUrl: string;
  publicId: string;
  fileType: string;
}

interface DosDontsData {
  _id: string;
  title: string;
  description: string;
  files: DosDontFile[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const DESTINATION_CATEGORY_CONFIG = [
  {
    id: "wildlife",
    title: "Wildlife",
    icon: PawPrint,
    matches: [
      "kanha",
      "bandhavgarh",
      "panna",
      "pench",
      "satpura",
      "ratapani",
      "kuno",
    ],
  },
  {
    id: "spiritual",
    title: "Spiritual",
    icon: Flame,
    matches: [
      "ujjain",
      "omkareshwar",
      "maheshwar",
      "maihar",
      "sanchi",
      "chitrakoot",
      "amarkantak",
      "datia",
      "nalkheda",
    ],
  },
  {
    id: "heritage",
    title: "Heritage & History",
    icon: Landmark,
    matches: [
      "gwalior",
      "orchha",
      "khajuraho",
      "bhimbetka",
      "bhopal",
      "mandu",
      "indore",
    ],
  },
  {
    id: "nature",
    title: "Nature",
    icon: Trees,
    matches: [
      "panchmarhi",
      "pachmarhi",
      "tamia",
      "bhedaghat",
      "raneh",
      "gandhisagar",
      "gandhi sagar",
      "parsili",
      "sailani",
    ],
  },
  {
    id: "craft",
    title: "Textile, Art & Craft",
    icon: Scissors,
    matches: ["chanderi", "dhar", "jhabua", "alirajpur"],
  },
];

const DOWNLOAD_OPTIONS = [
  {
    title: "Images",
    desc: "High-resolution media assets for marketing",
    icon: ImageIcon,
    href: "/downloads/images",
  },
  {
    title: "Videos / Reels",
    desc: "Promotional reels and cinematic video archives",
    icon: Video,
    href: "/downloads/videos",
  },
  {
    title: "Map",
    desc: "State travel maps, circuit routes and safari grids",
    icon: Map,
    href: "/maps",
  },
];

const CONTACT_INFO = {
  phone: "+91 731 4203777",
  whatsapp: "+91 82699 50599",
  whatsappLink: "https://wa.me/918269950599",
  tradeEmail: "sales@mpescapes.com",
  supportEmail: "sales@mpescapes.com",
  address: "Tourism Bhawan, Bhadbhada Road, Bhopal, MP 462003",
  timing: "Mon - Sat: 10:00 AM - 6:00 PM IST",
};

export default function DropdownNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [downloadCategories, setDownloadCategories] = useState<DownloadCategory[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedDestCategory, setExpandedDestCategory] = useState<string | null>("wildlife");
  const [downloadingZipId, setDownloadingZipId] = useState<string | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloadsLoading, setIsDownloadsLoading] = useState<boolean>(true);
  const [activeEssentialTab, setActiveEssentialTab] = useState<string | null>(null);

  const [luxuryHotels, setLuxuryHotels] = useState<LuxuryHotel[]>([]);
  const [isLuxuryLoading, setIsLuxuryLoading] = useState<boolean>(true);

  const [dosDonts, setDosDonts] = useState<DosDontsData | null>(null);
  const [isDosDontsLoading, setIsDosDontsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await getDestinationNames();
        if (response?.success && Array.isArray(response.data)) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDownloadsData = async () => {
      try {
        const response = await getDownloads();
        if (response?.success && Array.isArray(response.data)) {
          setDownloadCategories(response.data);
          if (response.data.length > 0) {
            setExpandedCategory(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDownloadsLoading(false);
      }
    };

    const fetchLuxuryHotels = async () => {
      try {
        setIsLuxuryLoading(true);
        const response = await getHotelNames();
        if (response?.success && Array.isArray(response.data)) {
          setLuxuryHotels(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLuxuryLoading(false);
      }
    };

    const fetchDosDonts = async () => {
      try {
        setIsDosDontsLoading(true);
        const response = await getDosDonts();
        if (response?.success && response.data) {
          const item = Array.isArray(response.data) ? response.data[0] : response.data;
          setDosDonts(item || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDosDontsLoading(false);
      }
    };

    fetchDestinations();
    fetchDownloadsData();
    fetchLuxuryHotels();
    fetchDosDonts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
        setActiveEssentialTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categorizedDestinations = useMemo(() => {
    return DESTINATION_CATEGORY_CONFIG.map((cat) => {
      const items = destinations.filter((dest) => {
        const lowerName = dest.name.toLowerCase();
        return cat.matches.some((keyword) => lowerName.includes(keyword));
      });
      return {
        ...cat,
        items,
      };
    });
  }, [destinations]);

  const toggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
    setActiveEssentialTab(null);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleDestCategory = (catId: string) => {
    setExpandedDestCategory(expandedDestCategory === catId ? null : catId);
  };

  const handleDownloadZip = async (
    e: React.MouseEvent,
    categoryId: string,
    categoryName: string,
  ) => {
    e.stopPropagation();
    try {
      setDownloadingZipId(categoryId);
      const blob = await downloadCategoryZip(categoryId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${categoryName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingZipId(null);
    }
  };

  const handleDownloadSingleFile = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string,
    fileId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloadingFileId(fileId);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(fileUrl, "_blank");
    } finally {
      setDownloadingFileId(null);
    }
  };

  const navButtonClass = (name: string) =>
    `w-full text-left px-2.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-between border transition-all duration-300 min-h-[48px] sm:min-h-[54px] ${
      openDropdown === name
        ? "bg-gradient-to-br from-[#2A1D12] to-[#170E08] text-[#FAF5EE] border-[#B38350]/50 shadow-lg shadow-black/20"
        : "bg-[#FAF7F2] text-[#241A10] border-[#E8DDD4] hover:border-[#B38350] hover:bg-white"
    }`;

  const panelClass = (name: string) =>
    `absolute top-full mt-2 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#EFE4D8] p-2.5 z-50 origin-top transition-all duration-300 ${
      openDropdown === name
        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
    }`;

  const totalFilesCount = downloadCategories.reduce(
    (acc, curr) => acc + (curr.files?.length || 0),
    0,
  );

  return (
    <div className="w-full bg-[#F5EFEB] relative z-40">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -translate-y-7 sm:-translate-y-9"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/15 border border-[#EFE4D8] p-2 sm:p-3 grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-2.5">
          <div className="relative col-span-1">
            <button
              onClick={() => toggle("destination")}
              className={navButtonClass("destination")}
            >
              <span className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <Compass
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58] shrink-0"
                  strokeWidth={2.25}
                />
                <span className="leading-tight text-left">
                  <span className="block min-[480px]:hidden">Destination Info</span>
                  <span className="hidden min-[480px]:inline">Destination Information</span>
                </span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${
                  openDropdown === "destination" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`${panelClass("destination")} left-0 w-[calc(100vw-32px)] max-w-sm md:w-[420px] max-h-[460px] overflow-y-auto`}
            >
              <div className="px-3.5 py-2 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1] flex items-center justify-between">
                <span>Explore By Theme</span>
                <span className="text-[10px] text-[#976634] font-mono">
                  {destinations.length} Destinations
                </span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-[#976634] text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading destinations...
                </div>
              ) : destinations.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8A7A6C]">
                  No destinations found
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  {categorizedDestinations.map((cat) => {
                    const isExpanded = expandedDestCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-[#F3EBE1] overflow-hidden bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDestCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors select-none ${
                            isExpanded
                              ? "bg-[#FAF3EA]"
                              : "bg-[#FAF7F2] hover:bg-[#FAF3EA]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-7 h-7 rounded-lg bg-white border border-[#EBDCC9] flex items-center justify-center shrink-0">
                              <Icon
                                className="w-3.5 h-3.5 text-[#976634]"
                                strokeWidth={2.2}
                              />
                            </span>
                            <span className="text-xs font-semibold text-[#241A10] truncate">
                              {cat.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono bg-[#241A10]/5 text-[#976634] px-1.5 py-0.5 rounded font-semibold">
                              {cat.items.length}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-[#976634] transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-1.5 bg-white space-y-0.5 border-t border-[#F6EFE7]">
                            {cat.items.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {cat.items.map((dest) => (
                                  <Link
                                    key={dest._id}
                                    href={`/destination/${dest._id}`}
                                    onClick={() => setOpenDropdown(null)}
                                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#FAF3EA] transition-colors group"
                                  >
                                    <MapPin className="w-3 h-3 text-[#C28E58] shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-[12px] font-medium text-[#241A10] group-hover:text-[#976634] truncate">
                                      {dest.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="text-[11px] text-[#8A7A6C] py-2 px-3 text-center">
                                No destinations under this theme
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-[#F3EBE1] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => toggleDestCategory("luxury")}
                      className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors select-none ${
                        expandedDestCategory === "luxury"
                          ? "bg-[#FAF3EA]"
                          : "bg-[#FAF7F2] hover:bg-[#FAF3EA]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="w-7 h-7 rounded-lg bg-white border border-[#EBDCC9] flex items-center justify-center shrink-0">
                          <Crown
                            className="w-3.5 h-3.5 text-[#C28E58]"
                            strokeWidth={2.2}
                          />
                        </span>
                        <span className="text-xs font-semibold text-[#241A10] truncate">
                          Luxury
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono bg-[#241A10]/5 text-[#976634] px-1.5 py-0.5 rounded font-semibold">
                          {luxuryHotels.length}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#976634] transition-transform duration-200 ${
                            expandedDestCategory === "luxury" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expandedDestCategory === "luxury" && (
                      <div className="p-1.5 bg-white space-y-0.5 border-t border-[#F6EFE7]">
                        {isLuxuryLoading ? (
                          <div className="flex items-center justify-center py-4 gap-2 text-[#976634] text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Loading luxury hotels...
                          </div>
                        ) : luxuryHotels.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {luxuryHotels.map((hotel) => (
                              <Link
                                key={hotel._id}
                                href={`/luxury/${hotel._id}`}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#FAF3EA] transition-colors group"
                              >
                                <Sparkles className="w-3 h-3 text-[#C28E58] shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-[12px] font-medium text-[#241A10] group-hover:text-[#976634] truncate">
                                  {hotel.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#8A7A6C] py-2 px-3 text-center">
                            No luxury hotels available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative col-span-1">
            <button
              onClick={() => toggle("downloads")}
              className={navButtonClass("downloads")}
            >
              <span className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <Package
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58] shrink-0"
                  strokeWidth={2.25}
                />
                <span className="leading-tight text-left">Downloads</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${
                  openDropdown === "downloads" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`${panelClass("downloads")} right-0 md:left-0 w-[calc(100vw-32px)] max-w-sm md:w-88 max-h-96 overflow-y-auto`}
            >
              <div className="px-3.5 py-2 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1] flex items-center justify-between">
                <span>Downloads Library</span>
                <span className="text-[10px] text-[#976634] font-mono">
                  3 Categories
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {DOWNLOAD_OPTIONS.map((item, index) => {
                  const Icon = item.icon;
                  const isHashLink = item.href.startsWith("#");

                  const content = (
                    <>
                      <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] group-hover:bg-white border border-[#EBDCC9] flex items-center justify-center shrink-0 transition-colors">
                        <Icon
                          className="w-4 h-4 text-[#976634] group-hover:text-[#C28E58]"
                          strokeWidth={2}
                        />
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[13px] font-semibold text-[#241A10] group-hover:text-[#976634] truncate">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-[#8A7A6C] truncate">
                          {item.desc}
                        </span>
                      </div>
                    </>
                  );

                  const commonClass =
                    "flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200 group border border-transparent hover:border-[#F3EBE1]";

                  return isHashLink ? (
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className={commonClass}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className={commonClass}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative col-span-1">
            <button
              onClick={() => toggle("essentials")}
              className={navButtonClass("essentials")}
            >
              <span className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <BookOpen
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58] shrink-0"
                  strokeWidth={2.25}
                />
                <span className="leading-tight text-left">Travel Essentials</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${
                  openDropdown === "essentials" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`${panelClass("essentials")} left-0 w-[calc(100vw-32px)] max-w-sm md:w-[410px] max-h-[460px] overflow-y-auto`}
            >
              <div className="px-3.5 py-2 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1] flex items-center justify-between">
                <span>Travel Essentials</span>
                <span className="text-[10px] text-[#976634] font-mono">
                  Guide & Info
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="rounded-xl border border-[#F3EBE1] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEssentialTab(
                        activeEssentialTab === "bestTime" ? null : "bestTime",
                      )
                    }
                    className={`w-full flex items-center justify-between p-2.5 transition-colors select-none ${
                      activeEssentialTab === "bestTime"
                        ? "bg-[#FAF3EA]"
                        : "bg-[#FAF7F2] hover:bg-[#FAF3EA]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#EBDCC9] flex items-center justify-center shrink-0">
                        <Calendar
                          className="w-4 h-4 text-[#C28E58]"
                          strokeWidth={2}
                        />
                      </span>
                      <div className="text-left min-w-0">
                        <span className="block text-[13px] font-semibold text-[#241A10] truncate">
                          Best Time To Visit
                        </span>
                        <span className="block text-[11px] text-[#8A7A6C] truncate">
                          {totalFilesCount} documents & seasonal files
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#976634] shrink-0 transition-transform duration-200 ${
                        activeEssentialTab === "bestTime" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeEssentialTab === "bestTime" && (
                    <div className="p-2 border-t border-[#F3EBE1] bg-[#FCFBF8] space-y-1.5">
                      {isDownloadsLoading ? (
                        <div className="flex items-center justify-center py-6 gap-2 text-[#976634] text-xs">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading seasonal documents...
                        </div>
                      ) : downloadCategories.length === 0 ? (
                        <div className="text-center py-5 text-xs text-[#8A7A6C]">
                          No seasonal documents available
                        </div>
                      ) : (
                        downloadCategories.map((category) => {
                          const isExpanded = expandedCategory === category._id;
                          const isCurrentZipLoading =
                            downloadingZipId === category._id;
                          return (
                            <div
                              key={category._id}
                              className="rounded-lg border border-[#F3EBE1] overflow-hidden bg-white"
                            >
                              <div
                                onClick={() => toggleCategory(category._id)}
                                className="w-full flex items-center justify-between px-3 py-2 bg-[#FAF7F2] hover:bg-[#FAF3EA] transition-colors cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2 overflow-hidden pr-2">
                                  <Folder className="w-3.5 h-3.5 text-[#C28E58] shrink-0" />
                                  <span className="text-[12px] font-semibold text-[#241A10] truncate">
                                    {category.categoryName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleDownloadZip(
                                        e,
                                        category._id,
                                        category.categoryName,
                                      )
                                    }
                                    disabled={isCurrentZipLoading}
                                    title={`Download ${category.categoryName} ZIP`}
                                    className="p-1 rounded-md hover:bg-white text-[#976634] border border-transparent hover:border-[#E8DDD4] transition-all disabled:opacity-50"
                                  >
                                    {isCurrentZipLoading ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C28E58]" />
                                    ) : (
                                      <Archive className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  <span className="text-[10px] font-mono bg-[#241A10]/5 text-[#976634] px-1.5 py-0.5 rounded font-semibold">
                                    {category.files?.length || 0}
                                  </span>

                                  <ChevronDown
                                    className={`w-3.5 h-3.5 text-[#976634] transition-transform duration-200 ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-1.5 space-y-1 bg-white divide-y divide-[#F6EFE7]">
                                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#FAF7F2] rounded-md mb-1">
                                    <span className="text-[10px] font-medium text-[#8A7A6C]">
                                      Category Archive
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handleDownloadZip(
                                          e,
                                          category._id,
                                          category.categoryName,
                                        )
                                      }
                                      disabled={isCurrentZipLoading}
                                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#241A10] text-[#FAF5EE] text-[10px] font-semibold hover:bg-[#C28E58] transition-colors disabled:opacity-50"
                                    >
                                      {isCurrentZipLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C28E58]" />
                                      ) : (
                                        <Archive className="w-3.5 h-3.5" />
                                      )}
                                      <span>Download All (ZIP)</span>
                                    </button>
                                  </div>

                                  {category.files && category.files.length > 0 ? (
                                    category.files.map((file) => {
                                      const extension =
                                        file.originalName
                                          .split(".")
                                          .pop()
                                          ?.toUpperCase() || "DOCX";
                                      return (
                                        <button
                                          type="button"
                                          key={file._id}
                                          onClick={(e) =>
                                            handleDownloadSingleFile(
                                              e,
                                              file.fileUrl,
                                              file.originalName,
                                              file._id,
                                            )
                                          }
                                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#FAF3EA] transition-colors group text-left"
                                        >
                                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                                            <FileText className="w-3.5 h-3.5 text-[#C28E58] shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="text-[11px] font-medium text-[#241A10] group-hover:text-[#976634] truncate">
                                              {file.originalName.replace(
                                                /\.[^/.]+$/,
                                                "",
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-[9px] bg-[#241A10] text-[#F0DCC0] px-1 py-0.5 rounded font-mono">
                                              {extension}
                                            </span>
                                            {downloadingFileId === file._id ? (
                                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#976634]" />
                                            ) : (
                                              <Download className="w-3.5 h-3.5 text-[#976634] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="text-[10px] text-[#8A7A6C] py-2 text-center">
                                      No files in this category
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[#F3EBE1] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEssentialTab(
                        activeEssentialTab === "dosDonts" ? null : "dosDonts",
                      )
                    }
                    className={`w-full flex items-center justify-between p-2.5 transition-colors select-none ${
                      activeEssentialTab === "dosDonts"
                        ? "bg-[#FAF3EA]"
                        : "bg-[#FAF7F2] hover:bg-[#FAF3EA]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#EBDCC9] flex items-center justify-center shrink-0">
                        <CheckSquare
                          className="w-4 h-4 text-[#C28E58]"
                          strokeWidth={2}
                        />
                      </span>
                      <div className="text-left min-w-0">
                        <span className="block text-[13px] font-semibold text-[#241A10] truncate">
                          {dosDonts?.title || "Dos & Don'ts"}
                        </span>
                        <span className="block text-[11px] text-[#8A7A6C] truncate">
                          {dosDonts?.description ||
                            "Safari discipline, monument etiquettes & safety norms"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {dosDonts?.files && (
                        <span className="text-[10px] font-mono bg-[#241A10]/5 text-[#976634] px-1.5 py-0.5 rounded font-semibold">
                          {dosDonts.files.length}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-[#976634] transition-transform duration-200 ${
                          activeEssentialTab === "dosDonts" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {activeEssentialTab === "dosDonts" && (
                    <div className="p-2 border-t border-[#F3EBE1] bg-[#FCFBF8] space-y-1">
                      {isDosDontsLoading ? (
                        <div className="flex items-center justify-center py-6 gap-2 text-[#976634] text-xs">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading documents...
                        </div>
                      ) : !dosDonts || !dosDonts.files || dosDonts.files.length === 0 ? (
                        <div className="text-center py-5 text-xs text-[#8A7A6C]">
                          No documents available
                        </div>
                      ) : (
                        dosDonts.files.map((file) => {
                          const extension =
                            file.fileType?.toUpperCase() ||
                            file.originalName.split(".").pop()?.toUpperCase() ||
                            "DOCX";
                          const isDownloading = downloadingFileId === file._id;
                          return (
                            <button
                              type="button"
                              key={file._id}
                              onClick={(e) =>
                                handleDownloadSingleFile(
                                  e,
                                  file.fileUrl,
                                  file.originalName,
                                  file._id,
                                )
                              }
                              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-white border border-[#F3EBE1] hover:bg-[#FAF3EA] transition-colors group text-left"
                            >
                              <div className="flex items-center gap-2 overflow-hidden pr-2">
                                <FileText className="w-3.5 h-3.5 text-[#C28E58] shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-medium text-[#241A10] group-hover:text-[#976634] truncate">
                                  {file.originalName.replace(/\.[^/.]+$/, "")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[9px] bg-[#241A10] text-[#F0DCC0] px-1 py-0.5 rounded font-mono">
                                  {extension}
                                </span>
                                {isDownloading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#976634]" />
                                ) : (
                                  <Download className="w-3.5 h-3.5 text-[#976634] opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative col-span-1">
            <button
              onClick={() => toggle("contact")}
              className={navButtonClass("contact")}
            >
              <span className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 pr-1">
                <PhoneCall
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C28E58] shrink-0"
                  strokeWidth={2.25}
                />
                <span className="leading-tight text-left">Contact Details</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${
                  openDropdown === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`${panelClass("contact")} right-0 w-[calc(100vw-32px)] max-w-sm md:w-96 max-h-[440px] overflow-y-auto`}
            >
              <div className="px-3.5 py-2 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1] flex items-center justify-between">
                <span>Trade Support & Contacts</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono font-medium">
                  Online
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <a
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center shrink-0">
                      <MessageCircle
                        className="w-4 h-4 text-emerald-700"
                        strokeWidth={2.25}
                      />
                    </span>
                    <div>
                      <span className="block text-[13px] font-semibold text-[#241A10]">
                        Instant WhatsApp Desk
                      </span>
                      <span className="block text-[11px] text-[#8A7A6C]">
                        {CONTACT_INFO.whatsapp}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF3EA] border border-transparent hover:border-[#F3EBE1] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#976634]" strokeWidth={2} />
                    </span>
                    <div>
                      <span className="block text-[13px] font-semibold text-[#241A10]">
                        Trade & Office Line
                      </span>
                      <span className="block text-[11px] text-[#8A7A6C]">
                        {CONTACT_INFO.phone}
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT_INFO.tradeEmail}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF3EA] border border-transparent hover:border-[#F3EBE1] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#976634]" strokeWidth={2} />
                    </span>
                    <div>
                      <span className="block text-[13px] font-semibold text-[#241A10]">
                        Trade & Partners Email
                      </span>
                      <span className="block text-[11px] text-[#8A7A6C]">
                        {CONTACT_INFO.tradeEmail}
                      </span>
                    </div>
                  </div>
                </a>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F3EBE1] space-y-2 mt-1">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C28E58] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#241A10] leading-snug">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] text-[#8A7A6C] pt-1 border-t border-[#EFE4D8]">
                    <Clock className="w-3 h-3 text-[#976634] shrink-0" />
                    <span>{CONTACT_INFO.timing}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <Link
              href="/maps"
              className="w-full h-full min-h-[48px] sm:min-h-[54px] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-between bg-gradient-to-r from-[#C28E58] to-[#8A5A2E] text-white shadow-md shadow-[#976634]/25 hover:brightness-110 active:scale-95 transition-all duration-300"
            >
              <span>Interactive Map</span>
              <Map className="w-4 h-4 shrink-0" strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}