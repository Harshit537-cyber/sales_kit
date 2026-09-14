"use client";

import { useState, useRef, useEffect } from "react";
import {
  Compass,
  Package,
  BookOpen,
  PhoneCall,
  Map,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Film,
  Table,
  Sun,
  Plane,
  Ticket,
  Leaf,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";

const DESTINATION_DROPDOWN = [
  { name: "Wildlife Expeditions", tag: "National Parks", desc: "Kanha, Bandhavgarh, Pench" },
  { name: "Sacred & Spiritual", tag: "Pilgrimage", desc: "Ujjain, Omkareshwar, Sanchi" },
  { name: "Heritage & Dynasties", tag: "UNESCO", desc: "Khajuraho, Gwalior Fort, Orchha" },
  { name: "Regal Luxury Stays", tag: "Luxury", desc: "Palaces & Jungle Lodges" },
  { name: "Nature & Escapes", tag: "Eco", desc: "Pachmarhi, Bhedaghat" },
  { name: "Art, Craft & Weaves", tag: "Culture", desc: "Chanderi, Maheshwar, Gond Art" },
];

const DOWNLOADS_DROPDOWN = [
  { name: "Partner Itineraries 2025-26", format: "PDF", icon: FileText },
  { name: "High-Res Image Bank", format: "ZIP", icon: ImageIcon },
  { name: "Social Media Reels Pack", format: "MP4", icon: Film },
  { name: "State Tourist Route Map", format: "PDF", icon: Map },
  { name: "Tariffs & Seasons Sheet", format: "XLSX", icon: Table },
];

const ESSENTIALS_DROPDOWN = [
  { title: "Best Travel Seasons", desc: "October to March prime time", icon: Sun },
  { title: "Key Transit Hubs", desc: "Bhopal, Indore, Jabalpur airports", icon: Plane },
  { title: "Safari Gate Protocols", desc: "Book 120 days prior", icon: Ticket },
  { title: "Dress Codes & Rules", desc: "Modesty at temples & silence in parks", icon: Leaf },
];

export default function DropdownNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navButtonClass = (name: string) =>
    `w-full text-left px-5 py-4 rounded-2xl font-semibold text-sm flex items-center justify-between border transition-all duration-300 ${
      openDropdown === name
        ? "bg-gradient-to-br from-[#2A1D12] to-[#170E08] text-[#FAF5EE] border-[#B38350]/50 shadow-lg shadow-black/20"
        : "bg-[#FAF7F2] text-[#241A10] border-[#E8DDD4] hover:border-[#B38350] hover:bg-white"
    }`;

  const panelClass = (name: string) =>
    `absolute top-full mt-3 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#EFE4D8] p-2.5 z-50 origin-top transition-all duration-300 ${
      openDropdown === name
        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
    }`;

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 -mt-10 relative z-40">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-[#EFE4D8] p-3 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative col-span-1">
          <button onClick={() => toggle("destination")} className={navButtonClass("destination")}>
            <span className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#C28E58]" strokeWidth={2.25} />
              Destination Info
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openDropdown === "destination" ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${panelClass("destination")} left-0 w-80`}>
            <div className="px-3.5 py-2.5 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1]">
              Select a Circuit
            </div>
            {DESTINATION_DROPDOWN.map((dest, i) => (
              <a
                key={i}
                href="#destinations"
                onClick={() => setOpenDropdown(null)}
                className="flex flex-col px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#241A10] group-hover:text-[#976634]">
                    {dest.name}
                  </span>
                  <span className="text-[10px] tracking-wide bg-[#FAF3EA] text-[#976634] font-medium px-2 py-0.5 rounded-full border border-[#EBDCC9]">
                    {dest.tag}
                  </span>
                </div>
                <span className="text-[12px] text-[#8A7A6C] mt-0.5">{dest.desc}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="relative col-span-1">
          <button onClick={() => toggle("downloads")} className={navButtonClass("downloads")}>
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#C28E58]" strokeWidth={2.25} />
              Downloads
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openDropdown === "downloads" ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${panelClass("downloads")} left-0 w-80`}>
            <div className="px-3.5 py-2.5 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1]">
              Marketing Files
            </div>
            {DOWNLOADS_DROPDOWN.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href="#downloads"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#976634]" strokeWidth={2} />
                    </span>
                    <span className="text-[13px] font-semibold text-[#241A10] group-hover:text-[#976634]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#241A10] text-[#F0DCC0] px-2 py-0.5 rounded-md font-mono tracking-wide">
                    {item.format}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative col-span-1">
          <button onClick={() => toggle("essentials")} className={navButtonClass("essentials")}>
            <span className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#C28E58]" strokeWidth={2.25} />
              Essentials
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openDropdown === "essentials" ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${panelClass("essentials")} left-0 w-80`}>
            <div className="px-3.5 py-2.5 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1]">
              Rules & Guidelines
            </div>
            {ESSENTIALS_DROPDOWN.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href="#essentials"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200"
                >
                  <span className="w-8 h-8 mt-0.5 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#976634]" strokeWidth={2} />
                  </span>
                  <div>
                    <span className="block text-[13px] font-semibold text-[#241A10]">{item.title}</span>
                    <span className="block text-[12px] text-[#8A7A6C]">{item.desc}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative col-span-1">
          <button onClick={() => toggle("contact")} className={navButtonClass("contact")}>
            <span className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-[#C28E58]" strokeWidth={2.25} />
              Contact Desk
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openDropdown === "contact" ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${panelClass("contact")} right-0 w-72`}>
            <div className="px-3.5 py-2.5 mb-1 font-serif text-sm font-semibold text-[#241A10] border-b border-[#F3EBE1]">
              Direct Connect
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-emerald-700" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-semibold text-[#241A10]">Instant WhatsApp</span>
            </a>
            <a
              href="mailto:trade@mpescapes.com"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200"
            >
              <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#976634]" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-semibold text-[#241A10]">trade@mpescapes.com</span>
            </a>
            <a
              href="#footer"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#FAF3EA] transition-colors duration-200"
            >
              <span className="w-8 h-8 rounded-lg bg-[#FAF3EA] border border-[#EBDCC9] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#976634]" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-semibold text-[#241A10]">Phone & Address</span>
            </a>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <a
            href="#map"
            className="w-full h-full min-h-[52px] px-5 py-4 rounded-2xl font-semibold text-sm flex items-center justify-between bg-gradient-to-r from-[#C28E58] to-[#8A5A2E] text-white shadow-lg shadow-[#976634]/25 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <span>Interactive Map</span>
            <Map className="w-4 h-4" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  );
}