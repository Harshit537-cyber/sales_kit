"use client";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative overflow-hidden bg-[#0c0704] text-[#faf5ee] border-t border-[#2d1b10]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c28e58]/50 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-[#c28e58]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 lg:pt-20">
        <div className="mb-14 rounded-3xl border border-[#2d1b10] bg-[#160d07]/80 p-8 backdrop-blur-md sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c28e58]/30 bg-[#24150b] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#c28e58]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#34d399]" />
                Live B2B Concierge Active
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to curate customized MP itineraries?
              </h3>
              <p className="mt-1 text-xs text-[#a8988b] sm:text-sm">
                Connect with our dedicated trade desk for white-label collateral, vehicle allotments, and safari permits.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20a%20travel%20partner%20looking%20for%20MP%20itinerary%20support."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all hover:bg-[#20bd5a] hover:shadow-[#25D366]/20"
              >
                <span>💬</span> WhatsApp Trade Desk
              </a>
              <a
                href="mailto:trade@mpescapes.com"
                className="flex items-center gap-2 rounded-xl border border-[#3e2617] bg-[#22130b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#e6d5c3] transition hover:bg-[#2d1a0f] hover:text-white"
              >
                <span>✉</span> Email Dispatch
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c28e58]/50 bg-gradient-to-br from-[#c28e58] to-[#8c5a2b] font-serif text-base font-bold text-white shadow">
                MP
              </span>
              <div>
                <h4 className="font-serif text-xl font-bold tracking-wider text-white">
                  MP ESCAPES
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-[#c28e58]">
                  The Heart of Incredible India
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#a8988b]">
              Central India's premier B2B enablement portal for luxury travel designers, inbound operators, and tour curators. Delivering high-precision itineraries, verified safari logistics, and heritage circuit assets.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="rounded-md border border-[#2d1b10] bg-[#1a0f08] px-2.5 py-1 text-[10px] font-semibold text-[#c28e58]">
                Tiger Capital of India
              </span>
              <span className="rounded-md border border-[#2d1b10] bg-[#1a0f08] px-2.5 py-1 text-[10px] font-semibold text-[#c28e58]">
                UNESCO Circuit Hub
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#dfb57b]">
              Curated Circuits
            </h5>
            <ul className="mt-4 space-y-2.5 text-xs text-[#a8988b]">
              <li>
                <a href="#map" className="transition hover:text-white">
                  Gwalior & Orchha Heritage
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  Khajuraho UNESCO Wonders
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  Bandhavgarh & Kanha Safaris
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  Ujjain Mahakal & Indore Food
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  Jabalpur Bhedaghat Marble Rocks
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  Pachmarhi Queen of Satpura
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#dfb57b]">
              Trade Assets
            </h5>
            <ul className="mt-4 space-y-2.5 text-xs text-[#a8988b]">
              <li>
                <a href="#map" className="transition hover:text-white">
                  Interactive Regional Maps
                </a>
              </li>
              <li>
                <a href="#map" className="transition hover:text-white">
                  PDF Itinerary Downloads
                </a>
              </li>
              <li>
                <a href="#destinations" className="transition hover:text-white">
                  Airport Distance Matrix
                </a>
              </li>
              <li>
                <a href="#essentials" className="transition hover:text-white">
                  Safari Booking Protocols
                </a>
              </li>
              <li>
                <a href="#collateral" className="transition hover:text-white">
                  White-label Client Dossiers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#dfb57b]">
              Trade Liaison
            </h5>
            <div className="mt-4 space-y-3 text-xs text-[#a8988b]">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                  Partner Operations
                </span>
                <p className="mt-0.5 text-white font-mono text-[11px]">trade@mpescapes.com</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                  Direct Hotline
                </span>
                <p className="mt-0.5 text-white font-mono text-[11px]">+91 98765 43210</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                  Support Timings
                </span>
                <p className="mt-0.5 text-[#a8988b] text-[11px]">Mon – Sat: 09:00 AM – 08:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#20140c] pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] text-[#a8988b]/70">
            © {new Date().getFullYear()} MP Escapes. All Rights Reserved. Exclusively engineered for certified travel professionals.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#a8988b]/60">Central India Expedition Network</span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d1b10] bg-[#1a0f08] text-xs text-[#c28e58] transition hover:border-[#c28e58] hover:bg-[#c28e58] hover:text-black"
            >
              ▲
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}