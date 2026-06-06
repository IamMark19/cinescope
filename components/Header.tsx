"use client";

import type { Section } from "@/types";
import { AdLeaderboard } from "@/components/AdBanner";

interface Props {
  section: Section;
  onSection: (s: Section) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export function Header({ section, onSection, searchQuery, onSearch }: Props) {
  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-red text-white text-center font-condensed text-[11px] font-bold tracking-widest uppercase py-1.5 px-4">
        🎬 Powered by TVmaze REST API — Live Data via Server-Sent Events
      </div>

      {/* ── HEADER AD — leaderboard banner above the nav bar ── */}
      <div className="bg-[#0d0d0d] border-b border-dark-3 py-3 px-6">
        <div className="max-w-[1280px] mx-auto">
          <AdLeaderboard />
        </div>
      </div>

      {/* Main header — sticky nav sits below the ad */}
      <header className="bg-dark border-b border-dark-3 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-[60px] gap-4">

          {/* Logo */}
          <div className="font-condensed text-[28px] font-black tracking-tight text-cs-white uppercase flex-shrink-0">
            Cine<span className="text-red">Scope</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-0">
            {(["popular", "schedule", "search"] as Section[]).map((s) => (
              <button
                key={s}
                onClick={() => onSection(s)}
                className={`font-condensed font-semibold text-[14px] uppercase tracking-wide px-4 py-2 rounded transition-colors duration-150 ${
                  section === s
                    ? "text-red bg-dark-2"
                    : "text-gray-400 hover:text-red hover:bg-dark-2"
                }`}
              >
                {s === "popular" ? "Popular" : s === "schedule" ? "Schedule" : "Search"}
              </button>
            ))}
          </nav>

          {/* Search + Subscribe */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearch(e.target.value);
                  if (e.target.value.length >= 2) onSection("search");
                }}
                onFocus={() => { if (searchQuery.length >= 2) onSection("search"); }}
                placeholder="Search shows…"
                className="bg-dark-2 border border-dark-3 focus:border-red text-cs-white font-body text-[13px] placeholder:text-gray-600 px-3 py-2 pr-9 rounded outline-none w-48 transition-colors duration-200"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>

            <button className="bg-red hover:bg-red-dark text-white font-condensed font-bold text-[13px] tracking-wide uppercase px-4 py-2 rounded transition-colors duration-150 flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Genre subnav */}
      <div className="bg-dark-2 border-b border-dark-3">
        <div className="max-w-[1280px] mx-auto px-6 flex hide-scrollbar overflow-x-auto">
          {["Drama","Comedy","Thriller","Action","Horror","Science-Fiction","Fantasy","Crime","Romance","Animation"].map((g) => (
            <button
              key={g}
              className="font-condensed text-[12px] font-semibold tracking-wide uppercase text-gray-500 px-3.5 py-2.5 whitespace-nowrap border-b-2 border-transparent hover:text-cs-white hover:border-red transition-all duration-150"
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
