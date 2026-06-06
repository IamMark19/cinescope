"use client";

import { useState, useEffect } from "react";

// ─── Ad data ──────────────────────────────────────────────────────────────────
// Replace these with your real ad network tags (Google AdSense, etc.)

const LEADERBOARD_ADS = [
  {
    id: "lb1",
    label: "SPONSORED",
    bg: "from-[#0f0f23] to-[#1a1a3e]",
    accent: "#6366f1",
    logo: "🎮",
    headline: "Play Free. Win Big.",
    sub: "The #1 gaming platform. 10M+ players worldwide.",
    cta: "Play Now →",
    badge: "FREE TO PLAY",
  },
  {
    id: "lb2",
    label: "ADVERTISEMENT",
    bg: "from-[#1a0a00] to-[#2d1500]",
    accent: "#f97316",
    logo: "🍿",
    headline: "Stream Everything.",
    sub: "All your favorites in one place. Cancel anytime.",
    cta: "Start Free Trial →",
    badge: "30 DAYS FREE",
  },
  {
    id: "lb3",
    label: "PROMOTED",
    bg: "from-[#000d1a] to-[#001f3f]",
    accent: "#0ea5e9",
    logo: "📱",
    headline: "Watch on Any Device.",
    sub: "Ultra HD · Dolby Atmos · No ads. Just movies.",
    cta: "Get the App →",
    badge: "NEW APP",
  },
];

const SIDEBAR_ADS = [
  {
    id: "sb1",
    label: "ADVERTISEMENT",
    bg: "from-[#0f0f23] to-[#1c1c3a]",
    accent: "#8b5cf6",
    logo: "🎬",
    headline: "CinePro Plus",
    sub: "Stream 10,000+ movies & shows in 4K Ultra HD.",
    cta: "Try Free →",
    badge: "1 MONTH FREE",
    tag: "STREAMING",
  },
  {
    id: "sb2",
    label: "SPONSORED",
    bg: "from-[#0a1a00] to-[#122800]",
    accent: "#22c55e",
    logo: "🏆",
    headline: "Win Movie Tickets",
    sub: "Enter our weekly giveaway. 2 tickets every Friday.",
    cta: "Enter Now →",
    badge: "FREE ENTRY",
    tag: "GIVEAWAY",
  },
  {
    id: "sb3",
    label: "PROMOTED",
    bg: "from-[#1a0000] to-[#2d0000]",
    accent: "#ef4444",
    logo: "🎧",
    headline: "SoundScore",
    sub: "Discover the best movie soundtracks. Free forever.",
    cta: "Listen Free →",
    badge: "NOW FREE",
    tag: "MUSIC",
  },
];

const SQUARE_ADS = [
  {
    id: "sq1",
    label: "AD",
    bg: "from-[#0a0a1f] to-[#12123a]",
    accent: "#a855f7",
    logo: "⭐",
    headline: "Rate & Review",
    sub: "Join 500K+ critics on FilmVault.",
    cta: "Join Free",
    badge: "TOP RATED",
  },
  {
    id: "sq2",
    label: "AD",
    bg: "from-[#0a1500] to-[#162200]",
    accent: "#84cc16",
    logo: "🎟️",
    headline: "Cinemas Near You",
    sub: "Book tickets in under 60 seconds.",
    cta: "Find Showtimes",
    badge: "BOOK NOW",
  },
];

// ─── Leaderboard (728×90 equivalent) ────────────────────────────────────────
export function AdLeaderboard({ className = "" }: { className?: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [closed, setClosed] = useState(false);

  // Rotate every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % LEADERBOARD_ADS.length);
        setVisible(true);
      }, 300);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  if (closed) return null;

  const ad = LEADERBOARD_ADS[idx];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Ad label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
        <span className="bg-dark-3 text-gray-600 font-condensed text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-t">
          Advertisement
        </span>
      </div>

      <div
        className={`relative overflow-hidden rounded bg-gradient-to-r ${ad.bg} border border-white/5 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ minHeight: 90 }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${ad.accent}88, transparent 70%)` }}
        />

        <div className="relative flex items-center justify-between px-6 py-4 gap-4">
          {/* Left: logo + text */}
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="text-[36px] flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
              style={{ background: `${ad.accent}22`, border: `1px solid ${ad.accent}44` }}
            >
              {ad.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-condensed text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                  style={{ background: `${ad.accent}33`, color: ad.accent }}
                >
                  {ad.badge}
                </span>
                <span className="font-condensed text-[9px] text-gray-600 uppercase tracking-wider">
                  {ad.label}
                </span>
              </div>
              <div
                className="font-condensed text-[22px] font-black leading-tight text-white"
              >
                {ad.headline}
              </div>
              <div className="text-[12px] text-gray-400 truncate">
                {ad.sub}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Dot indicators */}
            <div className="hidden sm:flex gap-1">
              {LEADERBOARD_ADS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                  style={{ background: i === idx ? ad.accent : "#333" }}
                />
              ))}
            </div>
            <button
              className="font-condensed font-bold text-[13px] uppercase tracking-wide px-5 py-2.5 rounded whitespace-nowrap transition-all duration-150 hover:brightness-110 active:scale-95"
              style={{ background: ad.accent, color: "#fff" }}
            >
              {ad.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={() => setClosed(true)}
        className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 hover:bg-black/80 text-gray-500 hover:text-white rounded-full text-[10px] flex items-center justify-center transition-colors duration-150"
        aria-label="Close ad"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Sidebar tall ad (300×250 equivalent) ─────────────────────────────────────
export function AdSidebar({ className = "" }: { className?: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % SIDEBAR_ADS.length);
        setVisible(true);
      }, 300);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const ad = SIDEBAR_ADS[idx];

  return (
    <div className={`relative ${className}`}>
      <div className="text-center mb-1">
        <span className="font-condensed text-[9px] text-gray-600 uppercase tracking-widest">
          Advertisement
        </span>
      </div>

      <div
        className={`relative overflow-hidden rounded-lg bg-gradient-to-b ${ad.bg} border border-white/5 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ minHeight: 260 }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 20%, ${ad.accent}30, transparent 70%)` }}
        />

        {/* Tag pill */}
        <div className="absolute top-3 right-3">
          <span
            className="font-condensed text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: `${ad.accent}33`, color: ad.accent, border: `1px solid ${ad.accent}44` }}
          >
            {ad.tag}
          </span>
        </div>

        <div className="relative p-5 flex flex-col items-center text-center gap-3 pt-8">
          {/* Logo */}
          <div
            className="text-[48px] w-20 h-20 flex items-center justify-center rounded-2xl"
            style={{ background: `${ad.accent}18`, border: `1px solid ${ad.accent}33` }}
          >
            {ad.logo}
          </div>

          {/* Badge */}
          <span
            className="font-condensed text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ background: `${ad.accent}25`, color: ad.accent }}
          >
            {ad.badge}
          </span>

          {/* Copy */}
          <div>
            <div className="font-condensed text-[20px] font-black text-white leading-tight mb-1">
              {ad.headline}
            </div>
            <div className="text-[12px] text-gray-400 leading-relaxed">
              {ad.sub}
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full font-condensed font-bold text-[13px] uppercase tracking-wide py-3 rounded-lg text-white transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{ background: ad.accent }}
          >
            {ad.cta}
          </button>

          {/* Ad label + dots */}
          <div className="flex items-center justify-between w-full mt-1">
            <span className="font-condensed text-[9px] text-gray-600 uppercase tracking-widest">
              {ad.label}
            </span>
            <div className="flex gap-1">
              {SIDEBAR_ADS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                  style={{ background: i === idx ? ad.accent : "#333" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small square ad (fits in sidebar between widgets) ────────────────────────
export function AdSquare({ className = "" }: { className?: string }) {
  const [idx] = useState(() => Math.floor(Math.random() * SQUARE_ADS.length));
  const ad = SQUARE_ADS[idx];

  return (
    <div className={`relative ${className}`}>
      <div className="text-center mb-1">
        <span className="font-condensed text-[9px] text-gray-600 uppercase tracking-widest">Ad</span>
      </div>
      <div
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${ad.bg} border border-white/5`}
        style={{ minHeight: 140 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 30%, ${ad.accent}25, transparent 70%)` }}
        />
        <div className="relative p-4 flex items-center gap-3">
          <div
            className="text-[32px] w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: `${ad.accent}18`, border: `1px solid ${ad.accent}33` }}
          >
            {ad.logo}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="font-condensed text-[9px] font-bold tracking-widest uppercase"
              style={{ color: ad.accent }}
            >
              {ad.badge}
            </span>
            <div className="font-condensed text-[15px] font-black text-white leading-tight">
              {ad.headline}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{ad.sub}</div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            className="w-full font-condensed font-bold text-[12px] uppercase tracking-wide py-2 rounded-lg text-white transition-all duration-150 hover:brightness-110"
            style={{ background: ad.accent }}
          >
            {ad.cta}
          </button>
        </div>
        <div className="absolute top-2 right-2 font-condensed text-[8px] text-gray-600 uppercase tracking-wider">
          {ad.label}
        </div>
      </div>
    </div>
  );
}
