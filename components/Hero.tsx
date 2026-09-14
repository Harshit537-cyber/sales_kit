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
    <section className="relative bg-[#170E08] text-[#FAF5EE] overflow-hidden border-b border-[#3D2817] pt-14 pb-24">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.label}
              className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                index === active ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[#170E08]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#170E08]/20 via-[#170E08]/30 to-[#170E08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#170E08]/60 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#C59A68_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#B38350]/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EE]/10 border border-[#FAF5EE]/15 backdrop-blur-md text-[#E1BD96] text-xs uppercase tracking-widest font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E1BD96] animate-pulse" />
          Official Travel Partner Digital Sales Kit
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-[#FAF5EE] leading-[1.15]">
          The Heart of Incredible India,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0CF9E] via-[#D89F67] to-[#A47141]">
            Curated for Travel Leaders.
          </span>
        </h1>

        <p className="max-w-2xl mt-6 text-base sm:text-lg text-[#C8B6A6] font-light leading-relaxed">
          Access high-definition marketing toolkits, copyright-cleared media assets, standard B2B itineraries, and safari intelligence in one seamless workspace.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
          <a
            href="#destinations"
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#C28E58] to-[#976634] text-white font-semibold text-sm shadow-xl shadow-[#976634]/30 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Explore 6 Circuits
          </a>
          <a
            href="#downloads"
            className="px-7 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#FAF5EE] border border-white/20 font-semibold text-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Download Collateral
          </a>
        </div>

        <p className="mt-10 text-xs uppercase tracking-widest text-[#E1BD96]/80">
          {slides[active].label}
        </p>

        <div className="flex gap-2 mt-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === active ? "w-8 bg-[#E1BD96]" : "w-1.5 bg-[#FAF5EE]/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}