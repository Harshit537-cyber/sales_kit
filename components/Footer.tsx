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
                href="https://wa.me/918269950599?text=Hello%20MP%20Escapes%2C%20I%20am%20looking%20for%20tour%20and%20itinerary%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-md shadow-[#25D366]/25 transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide">
                  <span>WhatsApp</span>
                  <span className="text-white/60">·</span>
                  <span className="font-mono text-[11px] text-white/95 font-medium">+91 82699 50599</span>
                </div>
              </a>
              <a
                href="mailto:sales@mpescapes.com"
                className="flex items-center gap-2 rounded-full border border-[#3e2617] bg-[#22130b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#e6d5c3] transition hover:bg-[#2d1a0f] hover:text-white"
              >
                <span>✉</span> Email Dispatch
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start lg:gap-16">
          <div className="w-full md:max-w-md lg:max-w-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c28e58]/50 bg-gradient-to-br from-[#c28e58] to-[#8c5a2b] font-serif text-base font-bold text-white shadow-md">
                MP
              </span>
              <div>
                <h4 className="font-serif text-xl font-bold tracking-wider text-white">
                  MP ESCAPES
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-[#c28e58]">
                  DMC For Central India
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#a8988b]">
              Central India's premier B2B enablement portal for luxury travel designers, inbound operators, and tour curators. Delivering high-precision itineraries, verified safari logistics, and heritage circuit assets.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#2d1b10] bg-[#1a0f08] px-3 py-1 text-[10px] font-semibold text-[#c28e58]">
                Tiger Capital of India
              </span>
              <span className="rounded-md border border-[#2d1b10] bg-[#1a0f08] px-3 py-1 text-[10px] font-semibold text-[#c28e58]">
                UNESCO Circuit Hub
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto md:max-w-lg md:ml-auto">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#c28e58]/60 hidden sm:inline-block" />
              <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#dfb57b]">
                Trade Liaison & Office
              </h5>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                  Registered Address
                </span>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white">
                  MP Escapes Pvt Ltd<br />
                  203 Starlit Tower, 29 YN Road<br />
                  Indore 452003, Madhya Pradesh
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                    Partner Email
                  </span>
                  <a
                    href="mailto:sales@mpescapes.com"
                    className="mt-0.5 block font-mono text-[11px] text-white transition hover:text-[#c28e58]"
                  >
                    sales@mpescapes.com
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                    Direct Hotline
                  </span>
                  <a
                    href="tel:+917314203777"
                    className="mt-0.5 block font-mono text-[11px] text-white transition hover:text-[#c28e58]"
                  >
                    +91 731 4203777
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c28e58]">
                    WhatsApp Desk
                  </span>
                  <a
                    href="https://wa.me/918269950599?text=Hello%20MP%20Escapes%2C%20I%20am%20looking%20for%20tour%20and%20itinerary%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block font-mono text-[11px] text-white transition hover:text-[#25D366]"
                  >
                    +91 82699 50599
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#20140c] pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] text-[#a8988b]/70">
            © {new Date().getFullYear()} MP Escapes Pvt Ltd. All Rights Reserved. Exclusively engineered for certified travel professionals.
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