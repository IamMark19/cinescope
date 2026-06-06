"use client";

import { useState, useCallback, useMemo } from "react";
import type { Show, Section, LiveStatus } from "@/types";

import { useShows, useSchedule, useSearch, useWebhook } from "@/hooks/useTVmaze";

import { Header }        from "@/components/Header";
import { LiveStatusBar } from "@/components/LiveStatusBar";
import { ShowCard, HeroCardMain, HeroCardSmall, ShowCardSkeleton, HeroSkeleton } from "@/components/ShowCard";
import { ScheduleList }  from "@/components/ScheduleList";
import { ShowModal }     from "@/components/ShowModal";
import { Sidebar }       from "@/components/Sidebar";
import { Footer }        from "@/components/Footer";

export default function HomePage() {
  const [section, setSection]       = useState<Section>("popular");
  const [selectedShow, setSelected] = useState<Show | null>(null);

  // ── Data hooks ───────────────────────────────────────────────────────────────
  const {
    shows, loading: showsLoading, loadingMore,
    hasMore, lastSync: showsSync, source,
    loadMore, refresh: refreshShows,
  } = useShows();

  const {
    episodes, loading: schedLoading,
    refresh: refreshSchedule,
  } = useSchedule();

  const {
    query, results: searchResults, loading: searchLoading,
    setQuery, clear: clearSearch,
  } = useSearch();

  // ── Webhook / SSE live updates ────────────────────────────────────────────
  const handleWebhookEvent = useCallback((event: string, _data: unknown) => {
    switch (event) {
      case "show.updated":
      case "show.added":
        refreshShows();
        break;
      case "schedule.updated":
        refreshSchedule();
        break;
      case "ping":
        // connection test — no refresh needed
        break;
    }
  }, [refreshShows, refreshSchedule]);

  const { status: webhookStatus, updateCount } = useWebhook(handleWebhookEvent);

  // Keep showCount in sync
  useMemo(() => {
    if (shows.length) updateCount(shows.length);
  }, [shows.length, updateCount]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const heroShows = useMemo(
    () => shows
      .filter((s) => s.image?.original)
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 3),
    [shows]
  );

  const trendingShows = useMemo(
    () => shows
      .filter((s) => s.rating?.average)
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 8),
    [shows]
  );

  const liveStatus: LiveStatus = {
    connected:  webhookStatus.connected,
    lastSync:   showsSync,
    source,
    showCount:  shows.length,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openModal  = (show: Show) => setSelected(show);
  const closeModal = () => setSelected(null);

  const handleRefresh = useCallback(() => {
    refreshShows();
    refreshSchedule();
  }, [refreshShows, refreshSchedule]);

  // ── Sections ──────────────────────────────────────────────────────────────
  const displayShows = section === "search" && query.length >= 2
    ? searchResults
    : shows;

  return (
    <>
      <Header
        section={section}
        onSection={setSection}
        searchQuery={query}
        onSearch={(q) => { setQuery(q); if (q.length >= 2) setSection("search"); if (!q) setSection("popular"); }}
      />

      <LiveStatusBar status={liveStatus} onRefresh={handleRefresh} />

      {/* ── HERO ── */}
      {section !== "schedule" && (
        <section className="max-w-[1280px] mx-auto px-6 pt-7">
          {showsLoading || heroShows.length < 3 ? (
            <HeroSkeleton />
          ) : (
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows:    "auto auto",
              }}
            >
              <HeroCardMain   show={heroShows[0]} onClick={() => openModal(heroShows[0])} />
              <HeroCardSmall  show={heroShows[1]} variant="tv"  onClick={() => openModal(heroShows[1])} />
              <HeroCardSmall  show={heroShows[2]} variant="new" onClick={() => openModal(heroShows[2])} />
            </div>
          )}
        </section>
      )}

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

        {/* ── LEFT COLUMN ── */}
        <main>

          {/* Popular / Search grid */}
          {section !== "schedule" && (
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dark-3">
                <h2 className="font-condensed text-[22px] font-black uppercase tracking-wide">
                  {section === "search" && query.length >= 2 ? (
                    <>
                      <span className="text-red">Results</span> for &ldquo;{query}&rdquo;
                    </>
                  ) : (
                    <>
                      <span className="text-red">Popular</span> Shows
                    </>
                  )}
                </h2>

                {section !== "search" && hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="font-condensed text-[12px] font-bold uppercase tracking-wide text-red border border-red px-3 py-1.5 rounded hover:bg-red hover:text-white transition-colors duration-150 disabled:opacity-50"
                  >
                    {loadingMore ? "Loading…" : "Load More →"}
                  </button>
                )}

                {section === "search" && query.length >= 2 && (
                  <button
                    onClick={() => { clearSearch(); setSection("popular"); }}
                    className="font-condensed text-[12px] font-bold uppercase tracking-wide text-gray-500 hover:text-red transition-colors duration-150"
                  >
                    ← Clear
                  </button>
                )}
              </div>

              {/* Loading state */}
              {(showsLoading || (section === "search" && searchLoading)) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => <ShowCardSkeleton key={i} />)}
                </div>
              ) : displayShows.length === 0 ? (
                <div className="text-gray-500 text-[14px] py-16 text-center">
                  {section === "search"
                    ? `No results found for "${query}"`
                    : "No shows available. Check your connection."}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayShows.slice(0, section === "search" ? 20 : undefined).map((show) => (
                    <ShowCard key={show.id} show={show} onClick={() => openModal(show)} />
                  ))}
                </div>
              )}

              {/* Load more spinner */}
              {loadingMore && (
                <div className="flex justify-center pt-8">
                  <div className="w-8 h-8 border-2 border-dark-3 border-t-red rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* Schedule section */}
          {section === "schedule" && (
            <ScheduleList
              episodes={episodes}
              loading={schedLoading}
              onShowClick={openModal}
            />
          )}

        </main>

        {/* ── SIDEBAR ── */}
        <div className="hidden lg:block">
          <Sidebar
            topShows={trendingShows}
            status={liveStatus}
            onShowClick={openModal}
          />
        </div>

      </div>

      <Footer />

      {/* Modal */}
      <ShowModal show={selectedShow} onClose={closeModal} />
    </>
  );
}
