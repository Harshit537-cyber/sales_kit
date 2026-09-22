"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import mpMapImage from "@/assets/MadhyaPradesh.jpeg";

export default function InteractiveMap() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Number((prev + 0.35).toFixed(2)), 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(Number((prev - 0.35).toFixed(2)), 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
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

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale === 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(Number((prev + 0.2).toFixed(2)), 4));
    } else {
      setScale((prev) => {
        const next = Math.max(Number((prev - 0.2).toFixed(2)), 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  return (
    <>
      <section className="relative w-full bg-[#f4ece1] px-4 py-16 text-[#2d1b10] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-[#cdbbaa] pb-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8f5d38]/30 bg-[#fbf7f0] px-4 py-1.5 text-xs font-bold tracking-widest text-[#8f5d38]">
                <span className="h-2 w-2 animate-ping rounded-full bg-[#b84a1c]" />
                MADHYA PRADESH REGIONAL CARTOGRAPHY
              </div>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#2d1b10] sm:text-4xl lg:text-5xl">
                Explore The <span className="italic text-[#8f5d38]">Heart of India</span>
              </h2>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 rounded-xl border border-[#6d4322] bg-[#6d4322] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#523319] active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Full Screen Map
            </button>
          </div>

          <div
            ref={containerRef}
            className="group relative h-[600px] w-full overflow-hidden rounded-3xl border-4 border-[#8f5d38]/40 bg-[#fdfbf7] p-2 shadow-2xl transition-all duration-500 hover:border-[#8f5d38]"
          >
            <div
              className={`relative h-full w-full overflow-hidden rounded-2xl bg-[#efe3d3]/30 ${
                scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              onClick={() => {
                if (scale === 1) handleZoomIn();
              }}
            >
              <div
                className="relative flex h-full w-full items-center justify-center will-change-transform"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                <Image
                  src={mpMapImage}
                  alt="Madhya Pradesh Full Map"
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  draggable={false}
                  className="pointer-events-none select-none object-contain p-2"
                />
              </div>

              <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 rounded-2xl border border-[#b89e85] bg-[#fdfaf5]/90 p-2 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomIn();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece1] text-lg font-bold text-[#442b17] shadow-sm transition hover:bg-[#6d4322] hover:text-white"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOut();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece1] text-lg font-bold text-[#442b17] shadow-sm transition hover:bg-[#6d4322] hover:text-white"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece1] text-xs font-bold uppercase text-[#442b17] shadow-sm transition hover:bg-[#6d4322] hover:text-white"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6d4322] text-xs font-bold text-white shadow-sm transition hover:bg-[#442b17]"
                >
                  ⛶
                </button>
              </div>

              <div className="absolute left-6 top-6 z-20 rounded-xl border border-[#b89e85] bg-[#fdfaf5]/80 px-3 py-1.5 font-mono text-xs font-bold text-[#78593f] backdrop-blur-sm">
                Zoom: {Math.round(scale * 100)}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-5 right-5 z-50 flex items-center gap-3">
            <span className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 font-mono text-xs font-bold text-white backdrop-blur-md">
              Zoom: {Math.round(scale * 100)}%
            </span>
            <button
              onClick={toggleFullscreen}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b84a1c] text-xl font-bold text-white shadow-2xl transition hover:scale-110 active:scale-95"
            >
              ✕
            </button>
          </div>

          <div
            className={`relative h-screen w-screen overflow-hidden p-6 select-none ${
              scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
                transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
              }}
            >
              <Image
                src={mpMapImage}
                alt="Madhya Pradesh Fullscreen Map"
                fill
                priority
                sizes="100vw"
                draggable={false}
                className="pointer-events-none select-none object-contain drop-shadow-2xl"
              />
            </div>

            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2.5 rounded-2xl border border-white/20 bg-black/60 p-2 backdrop-blur-lg">
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white transition hover:bg-white/40 active:scale-95"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white transition hover:bg-white/40 active:scale-95"
              >
                -
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white transition hover:bg-white/40 active:scale-95"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/90 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}