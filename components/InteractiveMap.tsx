"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import jsPDF from "jspdf";

import mpMapImage from "../assets/MadhyaPradesh.jpeg";
import bhopalMapImage from "../assets/Bhopal.png";
import gwaliorMapImage from "../assets/Gwalior.png";
import jabalpurMapImage from "../assets/Jabalpur.png";
import ujjainMapImage from "../assets/Ujjain.png";

interface LocationPin {
  id: string;
  name: string;
  category: "Wildlife" | "Heritage" | "Spiritual" | "Nature" | "Overview";
  nearestAirport: string;
  bestTime: string;
  highlights: string;
  description: string;
  itinerary: { day: string; title: string; desc: string }[];
  topSpots: string[];
  image: string;
  mapImage: StaticImageData;
}

const MP_LOCATIONS: LocationPin[] = [
  {
    id: "gwalior",
    name: "Gwalior",
    category: "Heritage",
    nearestAirport: "Gwalior Airport (GWL) - In City",
    bestTime: "October - March",
    highlights: "Gwalior Fort, Jai Vilas Palace, Tansen Tomb, Gopachal Parvat",
    description:
      "Renowned as the city of music and majestic architecture, Gwalior is crowned by its impregnable 8th-century hilltop fort, grandiose Scindia royal palaces, and legendary classical music heritage.",
    itinerary: [
      { day: "Day 1", title: "The Gibralter of India", desc: "Ascend Gwalior Fort, explore Man Mandir Palace, Gujari Mahal, and witness the evening Sound & Light Show." },
      { day: "Day 2", title: "Royal Scindia Legacy", desc: "Tour the opulence of Jai Vilas Palace & Museum, followed by paying homage at Tansen Tomb & Sun Temple." },
      { day: "Day 3", title: "Ancient Sculptures & Bazaars", desc: "Marvel at monolithic Jain rock colossi of Gopachal Parvat and explore traditional Chanderi fabric bazaars." },
    ],
    topSpots: ["Man Mandir Palace", "Jai Vilas Palace", "Tansen Tomb", "Gopachal Parvat", "Sas Bahu Temples"],
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=85",
    mapImage: gwaliorMapImage,
  },
  {
    id: "orchha",
    name: "Orchha & Khajuraho",
    category: "Heritage",
    nearestAirport: "Khajuraho (HJR) - 15 km",
    bestTime: "October - March",
    highlights: "UNESCO Temples, Betwa River Chhatris, Jahangir Mahal",
    description:
      "A journey through medieval Bundela splendour along the Betwa river, transitioning to the globally celebrated UNESCO World Heritage temples of Khajuraho famous for Nagara architecture.",
    itinerary: [
      { day: "Day 1", title: "The Bundela Capital", desc: "Visit Orchha Fort Complex, Jahangir Mahal, Raja Mahal, and witness Ram Raja Temple evening aarti." },
      { day: "Day 2", title: "Betwa Riverside Chhatris", desc: "Sunrise photoshoot at Betwa Chhatris, rafting along the river, then transfer to Khajuraho." },
      { day: "Day 3", title: "UNESCO Monumental Wonders", desc: "Explore Western & Eastern Temple Groups, Kandariya Mahadeva Temple, and the Khajuraho Dance show." },
    ],
    topSpots: ["Kandariya Mahadeva", "Jahangir Mahal", "Betwa Chhatris", "Ram Raja Temple", "Raneh Falls Canyon"],
    image: "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
  {
    id: "ujjain",
    name: "Ujjain & Indore",
    category: "Spiritual",
    nearestAirport: "Indore (IDR) - 55 km",
    bestTime: "July - March",
    highlights: "Mahakaleshwar Jyotirlinga, Ram Ghat Aarti, Chappan Dukan",
    description:
      "The spiritual nucleus of Central India along the sacred Shipra River, coupled with Indore — India's cleanest city and world-famous gastronomic capital.",
    itinerary: [
      { day: "Day 1", title: "Sacred Jyotirlinga Darshan", desc: "Attend pre-dawn Bhasma Aarti at Mahakaleshwar, stroll through the grand Mahakal Lok Corridor and Ram Ghat." },
      { day: "Day 2", title: "Historic Indore Exploration", desc: "Visit Rajwada Palace, Lal Bagh Palace, and spend the evening enjoying delicacies at Chappan Dukan." },
      { day: "Day 3", title: "Night Food & Street Culture", desc: "Explore Sarafa Night Food Market, Kanch Mandir, and take an excursion to Omkareshwar Jyotirlinga." },
    ],
    topSpots: ["Mahakaleshwar Temple", "Mahakal Lok Corridor", "Ram Ghat Aarti", "Rajwada Palace", "Sarafa Night Bazaar"],
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=85",
    mapImage: ujjainMapImage,
  },
  {
    id: "bhopal",
    name: "Bhopal & Sanchi",
    category: "Heritage",
    nearestAirport: "Bhopal (BHO) - In City",
    bestTime: "October - March",
    highlights: "Sanchi Great Stupa, Upper Lake Bhojtal, Bhimbetka Rock Shelters",
    description:
      "A scenic confluence of historic mosques, sparkling lakes, UNESCO Buddhist marvels at Sanchi, and 10,000-year-old Stone Age cave paintings at Bhimbetka.",
    itinerary: [
      { day: "Day 1", title: "The City of Lakes", desc: "Cruise across Upper Lake (Bhojtal), visit Taj-ul-Masajid, and explore tribal art at Bharat Bhavan." },
      { day: "Day 2", title: "UNESCO Buddhist Sanchi", desc: "Full-day trip to the Great Stupa of Sanchi, monastic ruins, and the ancient Udayagiri Caves." },
      { day: "Day 3", title: "Prehistoric Bhimbetka", desc: "Discover the UNESCO rock shelters of Bhimbetka featuring prehistoric rock paintings from the Mesolithic era." },
    ],
    topSpots: ["Sanchi Great Stupa", "Bhimbetka Caves", "Upper Lake Bhojtal", "Taj-ul-Masajid", "Tribal Museum"],
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=85",
    mapImage: bhopalMapImage,
  },
  {
    id: "bhedaghat",
    name: "Jabalpur & Bhedaghat",
    category: "Nature",
    nearestAirport: "Jabalpur (JLR) - 22 km",
    bestTime: "September - May",
    highlights: "Marble Rocks Gorge, Narmada Moonlight Boating, Dhuandhar Falls",
    description:
      "A breathtaking natural wonder where the Holy Narmada River cuts through towering hundred-foot shimmering white marble rocks, culminating in the roaring Dhuandhar Falls.",
    itinerary: [
      { day: "Day 1", title: "Misty Falls & Marble Canyon", desc: "Experience the smoky spray of Dhuandhar Falls and take a traditional wooden rowboat ride through Marble Rocks gorge." },
      { day: "Day 2", title: "Heritage of Kalachuris", desc: "Ascend to the 10th-century Chausath Yogini Temple and visit the medieval Madan Mahal Fort." },
      { day: "Day 3", title: "Full Moon River Expedition", desc: "Evening twilight boat ride over the Narmada and witness the balancing rocks and Narmada Aarti at Gwarighat." },
    ],
    topSpots: ["Marble Rocks Gorge", "Dhuandhar Waterfall", "Chausath Yogini Temple", "Narmada River Boating", "Madan Mahal Fort"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
    mapImage: jabalpurMapImage,
  },
  {
    id: "bandhavgarh",
    name: "Bandhavgarh Tiger Reserve",
    category: "Wildlife",
    nearestAirport: "Jabalpur (JLR) - 165 km",
    bestTime: "October - June",
    highlights: "Tala & Magdhi Zones, Highest Bengal Tiger Density, Fort Ruins",
    description:
      "Holding the highest density of Royal Bengal Tigers anywhere in the world, set against dramatic cliffs and ancient 2,000-year-old fort ruins.",
    itinerary: [
      { day: "Day 1", title: "Into the Tiger's Lair", desc: "Arrive at resort, evening nature trail, and attend an orientation session by a senior forest naturalist." },
      { day: "Day 2", title: "Core Jungle Safari", desc: "Morning 4x4 open-top safari through Tala Zone; afternoon safari tracking tiger pugmarks in Magdhi Zone." },
      { day: "Day 3", title: "Ancient Ruins & Birding", desc: "Explore the ancient reclining Vishnu statue (Shesh Shaiya) and birdwatching in the Sal meadows." },
    ],
    topSpots: ["Tala Safari Zone", "Magdhi Zone", "Shesh Shaiya Vishnu Statue", "Bandhavgarh Hilltop Fort", "Sal Forest Trails"],
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
  {
    id: "kanha",
    name: "Kanha National Park",
    category: "Wildlife",
    nearestAirport: "Jabalpur (JLR) - 160 km",
    bestTime: "October - June",
    highlights: "Hardground Barasingha, Bamni Dadar Sunset, Mukki Sal Forests",
    description:
      "The lush inspiration behind Rudyard Kipling’s 'The Jungle Book', famed for saving the rare swamp deer (Barasingha) and housing thriving populations of tigers and leopards.",
    itinerary: [
      { day: "Day 1", title: "Sal Valleys Welcome", desc: "Check-in to jungle eco-lodge, sunset tribal village walk, and fireside wildlife documentary." },
      { day: "Day 2", title: "Deep Jungle Encounters", desc: "Dawn game drive across Kanha Meadow to spot Barasingha herds; afternoon game drive in Mukki." },
      { day: "Day 3", title: "Bamni Dadar Vista", desc: "Ascend to Bamni Dadar (Sunset Point) for panoramic sunset views over grazing sambar and Indian gaur." },
    ],
    topSpots: ["Kanha Meadow", "Bamni Dadar Sunset Point", "Mukki Safari Zone", "Shravan Tal", "Barasingha Sanctuary"],
    image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
  {
    id: "pachmarhi",
    name: "Pachmarhi Hills",
    category: "Nature",
    nearestAirport: "Bhopal (BHO) - 195 km",
    bestTime: "Year-round",
    highlights: "Dhoopgarh Highest Peak, Bee Falls, Queen of Satpura Valleys",
    description:
      "The verdant 'Queen of Satpura', perched at 1,067 meters with cascading waterfalls, sandstone caves, scenic lookouts, and tranquil colonial hill station charm.",
    itinerary: [
      { day: "Day 1", title: "Canyons & Waterfalls", desc: "Trek down to the refreshing cascade of Bee Falls, followed by exploring prehistoric Pandav Caves." },
      { day: "Day 2", title: "Highest Peak Sunset", desc: "Visit Duchess Falls and Reechgarh cavern, followed by sunset at Dhoopgarh, the highest peak in MP." },
      { day: "Day 3", title: "Sacred Caves & Valleys", desc: "Explore Jatashankar cave temple, Mahadeo sanctuary, and leisurely forest walks around the lake." },
    ],
    topSpots: ["Dhoopgarh Peak", "Bee Falls", "Pandav Caves", "Jatashankar Temple", "Handi Khoh Canyon"],
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
  {
    id: "pench",
    name: "Pench Tiger Reserve",
    category: "Wildlife",
    nearestAirport: "Nagpur (NAG) - 95 km",
    bestTime: "October - June",
    highlights: "Turia Gate, Kipling Jungle Book Land, Night Safari & Teak Forest",
    description:
      "Straddling the MP-Maharashtra border, this undulating teak jungle is the real habitat of Mowgli, Sher Khan, and Baloo from the classic Jungle Book.",
    itinerary: [
      { day: "Day 1", title: "Mowgli's Frontier", desc: "Arrival via Nagpur highway, orientation walk along the buffer zone, stargazing at night." },
      { day: "Day 2", title: "Dual Zone Safari", desc: "Early morning drive into Turia Gate tracking tiger calls; evening safari through Karmajhiri teak canopies." },
      { day: "Day 3", title: "Night Safari & Riverbank", desc: "Explore the banks of the Pench River, spot migratory waterfowl, and take an authorized night safari." },
    ],
    topSpots: ["Turia Safari Gate", "Karmajhiri Zone", "Pench River Reservoir", "Totladoh Dam", "Night Buffer Safari"],
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
  {
    id: "all-mp",
    name: "All Madhya Pradesh",
    category: "Overview",
    nearestAirport: "Bhopal (BHO) / Indore (IDR)",
    bestTime: "October - March",
    highlights: "The Heart of Incredible India: UNESCO Heritage, Tigers, Ghats & Hills",
    description:
      "A grand comprehensive overview of Madhya Pradesh — encompassing world-renowned tiger sanctuaries, ancient UNESCO monuments, sacred Jyotirlingas, and pristine Satpura hill forests.",
    itinerary: [
      { day: "Days 1-3", title: "Golden Heritage Circuit", desc: "Explore Gwalior Fort, Orchha Palace complex, and Khajuraho UNESCO temples." },
      { day: "Days 4-7", title: "Tiger & Nature Safari", desc: "Wildlife game drives across Bandhavgarh & Kanha tiger reserves with a stop at Marble Rocks Jabalpur." },
      { day: "Days 8-10", title: "Sacred Ghats & Hill Haven", desc: "Spiritual darshan at Ujjain Mahakal, Indore culinary tour, and cool breezes at Pachmarhi hills." },
    ],
    topSpots: ["Gwalior Fort", "Khajuraho Temples", "Kanha & Bandhavgarh", "Mahakaleshwar Jyotirlinga", "Marble Rocks"],
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=85",
    mapImage: mpMapImage,
  },
];

const FILTERS = [
  { id: "All", label: "All Circuits", icon: "✦" },
  { id: "Wildlife", label: "Wildlife", icon: "🐅" },
  { id: "Heritage", label: "Heritage", icon: "🏛" },
  { id: "Spiritual", label: "Spiritual", icon: "◉" },
  { id: "Nature", label: "Nature", icon: "🌿" },
];

const CATEGORY_ICONS: Record<string, string> = {
  Wildlife: "🐅",
  Heritage: "🏛",
  Spiritual: "◉",
  Nature: "🌿",
  Overview: "🗺️",
};

export default function InteractiveMap() {
  const [selectedPin, setSelectedPin] = useState<LocationPin>(MP_LOCATIONS[0]);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary">("overview");

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredLocations =
    filter === "All"
      ? MP_LOCATIONS
      : [
          ...MP_LOCATIONS.filter((loc) => loc.category === filter && loc.id !== "all-mp"),
          MP_LOCATIONS[MP_LOCATIONS.length - 1],
        ];

  const handleFilterChange = (category: string) => {
    setFilter(category);
    if (category !== "All") {
      const first = MP_LOCATIONS.find((loc) => loc.category === category);
      if (first) {
        setSelectedPin(first);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    } else {
      setSelectedPin(MP_LOCATIONS[0]);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleSelectLocation = (location: LocationPin) => {
    setSelectedPin(location);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Number((prev + 0.3).toFixed(2)), 3.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(Number((prev - 0.3).toFixed(2)), 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3.5));
    } else {
      setScale((prev) => {
        const next = Math.max(Number((prev - 0.15).toFixed(2)), 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

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

  const loadImageAsJPEGFromStatic = async (staticImg: StaticImageData, maxWidth = 800): Promise<{ dataUrl: string; width: number; height: number } | null> => {
    try {
      const res = await fetch(staticImg.src);
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
        dataUrl: canvas.toDataURL("image/jpeg", 0.9),
        width: canvas.width,
        height: canvas.height,
      };
    } catch {
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = 40;

    const accent: [number, number, number] = [151, 102, 52];
    const dark: [number, number, number] = [36, 26, 16];
    const muted: [number, number, number] = [122, 106, 92];

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = 40;
      }
    };

    const addHeading = (text: string, size = 10) => {
      ensureSpace(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...accent);
      doc.text(text.toUpperCase(), margin, y);
      y += 4;
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;
    };

    const addParagraph = (text: string, size = 9, color: [number, number, number] = dark) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      ensureSpace(lines.length * 13 + 4);
      doc.text(lines, margin, y);
      y += lines.length * 13 + 6;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("MADHYA PRADESH TOURISM — OFFICIAL DESTINATION DOSSIER", margin, y);
    y += 18;

    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...dark);
    doc.text(selectedPin.name, margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...accent);
    doc.text(`Category: ${selectedPin.category}`, margin, y);
    y += 14;

    const targetImageWidth = contentWidth * 0.65;

    const mapImg = await loadImageAsJPEGFromStatic(selectedPin.mapImage, 800);
    if (mapImg) {
      const mapHeight = targetImageWidth * (mapImg.height / mapImg.width);
      ensureSpace(mapHeight + 10);
      const xCentered = margin + (contentWidth - targetImageWidth) / 2;
      doc.addImage(mapImg.dataUrl, "JPEG", xCentered, y, targetImageWidth, mapHeight);
      y += mapHeight + 14;
    }

    const cover = await loadImageAsJPEG(selectedPin.image, 800);
    if (cover) {
      const coverHeight = targetImageWidth * (cover.height / cover.width);
      ensureSpace(coverHeight + 10);
      const xCentered = margin + (contentWidth - targetImageWidth) / 2;
      doc.addImage(cover.dataUrl, "JPEG", xCentered, y, targetImageWidth, coverHeight);
      y += coverHeight + 14;
    }

    addHeading("Destination Overview");
    addParagraph(selectedPin.description);
    addParagraph(`Nearest Airport: ${selectedPin.nearestAirport}`);
    addParagraph(`Best Time to Visit: ${selectedPin.bestTime}`);
    y += 2;

    addHeading("Top Attractions");
    addParagraph(selectedPin.topSpots.map((spot, i) => `${i + 1}. ${spot}`).join("     "));
    y += 2;

    addHeading("3-Day Itinerary");
    selectedPin.itinerary.forEach((item) => {
      addParagraph(`${item.day}: ${item.title}`, 9.5, accent);
      addParagraph(item.desc, 9, muted);
    });

    ensureSpace(30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      "Issued by Department of Tourism, Madhya Pradesh. Copyright (c) 2026. All Rights Reserved.",
      margin,
      pageHeight - 20
    );

    doc.save(`MP-Destination-${selectedPin.id}.pdf`);
    setIsDownloading(false);
  };

  return (
    <section id="map" className="bg-[#ede4d8] px-4 py-12 text-[#2d1b10] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-6 border-b border-[#cdbbaa] pb-8 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8f5d38]/30 bg-[#f9f4ec] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#8f5d38]">
              <span className="h-2 w-2 rounded-full bg-[#b84a1c]" />
              MADHYA PRADESH REGIONAL MAPS
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2d1b10] sm:text-4xl lg:text-5xl">
              Destination <span className="font-serif italic text-[#8f5d38]">Cartography</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#c4af98] bg-[#f9f4ec] p-1.5 shadow-sm">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleFilterChange(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#6d4322] text-white shadow"
                      : "text-[#624731] hover:bg-[#ebd9c5] hover:text-[#2d1b10]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-3xl border border-[#c5af98] bg-[#f6eee2] p-4 shadow-xl lg:col-span-7">
            <div className="mb-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#b84a1c]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#694b34]">
                  {selectedPin.name} {selectedPin.id === "all-mp" ? "State Map" : "Circuit Map"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFitMode((m) => (m === "contain" ? "cover" : "contain"))}
                  className="rounded-md border border-[#c5af98] bg-[#fdfbf7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#78593f] hover:bg-[#6d4322] hover:text-white"
                >
                  {fitMode === "contain" ? "Fit View" : "Fill View"}
                </button>
                <span className="rounded-md border border-[#c5af98] bg-[#fdfbf7] px-2 py-0.5 font-mono text-[11px] font-bold text-[#78593f]">
                  {Math.round(scale * 100)}%
                </span>
              </div>
            </div>

            <div
              className={`relative h-[480px] w-full select-none overflow-hidden rounded-2xl border border-[#cbb69e] bg-[#fcf8f2] shadow-inner sm:h-[550px] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              <div
                className="relative flex h-full w-full items-center justify-center will-change-transform"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
              >
                <Image
                  key={selectedPin.id}
                  src={selectedPin.mapImage}
                  alt={`${selectedPin.name} Map`}
                  fill
                  priority
                  draggable={false}
                  className={`pointer-events-none select-none transition-all duration-300 ${
                    fitMode === "cover" ? "object-cover" : "object-contain p-2"
                  }`}
                />
              </div>

              <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 rounded-xl border border-[#b89e85] bg-[#fdfaf5]/95 p-1.5 shadow-lg backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  aria-label="Zoom In"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe3d3] text-base font-bold text-[#442b17] transition hover:bg-[#6d4322] hover:text-white"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  aria-label="Zoom Out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe3d3] text-base font-bold text-[#442b17] transition hover:bg-[#6d4322] hover:text-white"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode((m) => (m === "contain" ? "cover" : "contain"))}
                  aria-label="Toggle Fit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe3d3] text-[10px] font-bold uppercase text-[#442b17] transition hover:bg-[#6d4322] hover:text-white"
                >
                  {fitMode === "contain" ? "Fit" : "Fill"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset Map"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe3d3] text-xs font-bold text-[#442b17] transition hover:bg-[#6d4322] hover:text-white"
                >
                  ↺
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#d8c7b3] pt-3 text-xs text-[#6a4f38]">
              <div className="flex items-center gap-3">
                <span>✦ Viewing {selectedPin.name} map</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="font-mono text-[11px] font-semibold text-[#8e6848] underline decoration-dotted underline-offset-4 hover:text-[#523319]"
              >
                Reset Position
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-[#c5af98] bg-[#fbf5eb] p-6 shadow-xl lg:col-span-5">
            <div>
              <div className="relative mb-5 h-52 w-full overflow-hidden rounded-2xl border border-[#cfbfae] bg-[#e7d8c6] shadow-md">
                <img
                  key={selectedPin.id}
                  src={selectedPin.image}
                  alt={selectedPin.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80";
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1109]/95 via-[#1b1109]/30 to-transparent" />
                <span className="absolute left-3 top-3 rounded-lg border border-white/20 bg-[#1e130a]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {CATEGORY_ICONS[selectedPin.category]} {selectedPin.category}
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#dfb57b]">
                    Destination Dossier
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                    {selectedPin.name}
                  </h3>
                </div>
              </div>

              <div className="mb-4 flex rounded-xl border border-[#d6c4b2] bg-[#f2e4d2] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === "overview"
                      ? "bg-[#6d4322] text-white shadow"
                      : "text-[#694b34] hover:text-[#2d1b10]"
                  }`}
                >
                  Overview & Sights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("itinerary")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === "itinerary"
                      ? "bg-[#6d4322] text-white shadow"
                      : "text-[#694b34] hover:text-[#2d1b10]"
                  }`}
                >
                  3-Day Itinerary
                </button>
              </div>

              {activeTab === "overview" ? (
                <div className="space-y-4">
                  <p className="text-xs leading-relaxed text-[#432d1e]">
                    {selectedPin.description}
                  </p>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7e5c41]">
                      Top Attractions
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedPin.topSpots.map((spot, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-[#cfbfae] bg-[#f4e8d8] px-2.5 py-1 text-[11px] font-semibold text-[#442c1b]"
                        >
                          ✦ {spot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#d6c4b2] bg-[#f4e8d8] p-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#795a41]">
                        Transit Access
                      </span>
                      <p className="mt-0.5 text-xs font-bold text-[#28180d]">
                        {selectedPin.nearestAirport}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#d6c4b2] bg-[#f4e8d8] p-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#795a41]">
                        Best Time To Visit
                      </span>
                      <p className="mt-0.5 text-xs font-bold text-[#904d20]">
                        {selectedPin.bestTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                  {selectedPin.itinerary.map((plan, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#d6c4b2] bg-[#f4e8d8] p-3 text-left shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-[#6d4322] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                          {plan.day}
                        </span>
                        <span className="text-xs font-bold text-[#351e0e]">
                          {plan.title}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#5a3f2b]">
                        {plan.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#6d4322] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition-colors hover:bg-[#543217] disabled:opacity-50"
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
                    <span>📥</span> Download PDF
                  </>
                )}
              </button>
              <a
                href={`https://wa.me/919876543210?text=Hello%2C%20I%20want%20to%20plan%20a%20trip%20to%20${encodeURIComponent(
                  selectedPin.name
                )}%20in%20Madhya%20Pradesh.`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#ab927b] bg-[#ede0ce] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#3d2411] transition-colors hover:bg-[#e2cfb9]"
              >
                <span>💬</span> WhatsApp Desk
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#c5af98] bg-[#f6eee2] p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between px-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#694b34]">
              Select Destination ({filteredLocations.length})
            </h4>
            <span className="text-[11px] text-[#8c6b4f]">Click to switch map & details</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            {filteredLocations.map((location) => {
              const active = selectedPin.id === location.id;
              const isAllMp = location.id === "all-mp";
              return (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                    active
                      ? "border border-[#6d4322] bg-[#6d4322] text-white shadow-md ring-2 ring-[#6d4322]/20"
                      : isAllMp
                      ? "border-2 border-[#8f5d38] bg-[#f4e8d8] text-[#3a200f] hover:bg-[#e8d5bf]"
                      : "border border-[#d7c6b4] bg-[#fbf5eb] text-[#4d2f19] hover:bg-[#ebd9c4]"
                  }`}
                >
                  <span className="text-xl">{CATEGORY_ICONS[location.category]}</span>
                  <span className="mt-1 text-xs font-bold leading-tight line-clamp-1">
                    {isAllMp ? "All MP" : location.name.split(" ")[0]}
                  </span>
                  <span
                    className={`text-[10px] ${
                      active ? "text-[#e9c7a3]" : isAllMp ? "font-bold text-[#8f5d38]" : "text-[#836348]"
                    }`}
                  >
                    {isAllMp ? "State Map" : location.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}