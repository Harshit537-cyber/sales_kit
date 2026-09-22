"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/A%20view%20of%20multiple%20Khajuraho%20temples%20India.jpg",
    label: "Khajuraho Temples",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Sanchi%20Stupa.jpg",
    label: "Sanchi Stupa",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Gwalior%20Fort%20front.jpg",
    label: "Gwalior Fort",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Tigress%20in%20Bandhavgarh%20NP.jpg",
    label: "Bandhavgarh Tiger Reserve",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#170E08] text-[#FAF5EE] overflow-hidden border-b border-[#3D2817] pt-28 sm:pt-32 md:pt-36 pb-24 sm:pb-28 md:pb-32">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.label}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[#120B06]/75 backdrop-blur-[1px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#E6C6A2] text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C28E58]" />
          MP Escapes • B2B Travel Portal
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
          Explore Madhya Pradesh. <br />
          <span className="text-[#D8A36E]">Everything You Need to Plan & Book.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#E3D7CC] font-normal leading-relaxed px-2">
          Complete destination dossiers, safari information, high-quality promotional photos, videos, and route maps — made simple for travel partners.
        </p>

        {/* Single Button (Download button removed) */}
        <div className="mt-7 sm:mt-8 flex items-center justify-center">
          <a
            href="#destinations"
            className="px-7 py-3.5 rounded-xl bg-[#C28E58] hover:bg-[#b37f4a] text-white font-semibold text-sm shadow-lg shadow-[#C28E58]/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Explore Destinations
          </a>
        </div>

        {/* Featured Slider Indicators */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2.5 sm:gap-3">
          <span className="text-xs sm:text-sm text-[#C8B8A8] font-medium">
            Featured: <strong className="text-white font-semibold">{slides[active].label}</strong>
          </span>

          <div className="flex gap-1.5 ml-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === active ? "w-6 bg-[#C28E58]" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}