"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#170E08]/90 backdrop-blur-md border-b border-[#3D2817]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3 sm:py-4">
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

        <a
          href="https://wa.me/918269950599?text=Hello%20MP%20Escapes%2C%20I%20am%20looking%20for%20tour%20and%20itinerary%20details."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#25D366] px-3.5 sm:px-5 py-2 sm:py-2.5 text-white shadow-md shadow-[#25D366]/25 transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95"
        >
          <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide">
            <span>WhatsApp</span>
            <span className="hidden sm:inline text-white/60">·</span>
            <span className="font-mono text-[11px] sm:text-xs text-white/95 font-medium">+91 82699 50599</span>
          </div>
        </a>
      </div>
    </nav>
  );
}