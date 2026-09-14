"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DropdownNav from "@/components/DropdownNav";
import Destinations from "@/components/Destinations";
import Essentials from "@/components/Essentials";
import InteractiveMap from "@/components/InteractiveMap";
import Footer from "@/components/Footer";

export default function SalesKitPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FDFBF7] text-[#1E1711] selection:bg-[#B38350] selection:text-white">
      <Navbar />
      <Hero />
      <DropdownNav />
      <Destinations />
      <Essentials />
      <InteractiveMap />
      <Footer />
    </main>
  );
}