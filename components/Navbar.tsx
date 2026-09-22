"use client";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#170E08]/90 backdrop-blur-md border-b border-[#3D2817]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A47141] to-[#C59A68] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-serif font-black text-lg">MP</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#FAF5EE] tracking-wide block leading-none group-hover:text-[#D89F67] transition-colors">
              MP ESCAPES
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#B38350]">
              Partner Portal
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-[#C8B6A6]">
          <a href="#destinations" className="hover:text-[#FAF5EE] transition-colors">Destinations</a>
          <a href="#downloads" className="hover:text-[#FAF5EE] transition-colors">Collateral</a>
          <a href="#essentials" className="hover:text-[#FAF5EE] transition-colors">Essentials</a>
          <a href="#map" className="hover:text-[#FAF5EE] transition-colors">Route Map</a>
        </div>

        <a
          href="https://wa.me/918269950599"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-[#25D366]/20 transition duration-300 flex items-center gap-2"
        >
          <span>WhatsApp Desk</span>
        </a>
      </div>
    </nav>
  );
}