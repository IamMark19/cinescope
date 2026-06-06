"use client";

import Image from "next/image";
import type { Episode, Show } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  episodes: Episode[];
  loading: boolean;
  onShowClick: (show: Show) => void;
}

function EpisodeSkeleton() {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 py-4 border-b border-dark-3 last:border-0">
      <div className="h-[68px] skeleton rounded" />
      <div className="space-y-2 pt-1">
        <div className="h-3 skeleton rounded w-1/4" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}

export function ScheduleList({ episodes, loading, onShowClick }: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dark-3">
          <h2 className="font-condensed text-[22px] font-black uppercase tracking-wide">
            <span className="text-red">Today's</span> TV Schedule
          </h2>
          <span className="font-condensed text-[12px] text-gray-500 uppercase tracking-wide">{today}</span>
        </div>
        {[...Array(8)].map((_, i) => <EpisodeSkeleton key={i} />)}
      </div>
    );
  }

  if (!episodes.length) {
    return (
      <div className="text-gray-500 text-[14px] py-10 text-center">
        No schedule data available for today.
      </div>
    );
  }

  const sorted = [...episodes]
    .sort((a, b) => (a.airtime || "").localeCompare(b.airtime || ""))
    .slice(0, 40);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dark-3">
        <h2 className="font-condensed text-[22px] font-black uppercase tracking-wide">
          <span className="text-red">Today's</span> TV Schedule
        </h2>
        <span className="font-condensed text-[12px] text-gray-500 uppercase tracking-wide">
          {today} · {episodes.length} airings
        </span>
      </div>

      <div className="divide-y divide-dark-3">
        {sorted.map((ep) => {
          const show: Show | undefined =
            (ep._embedded?.show) ?? (ep.show as Show | undefined);
          const imgSrc = show?.image?.medium;
          const network =
            show?.network?.name ?? show?.webChannel?.name ?? "Unknown";

          return (
            <div
              key={ep.id}
              className={`grid grid-cols-[100px_1fr] gap-4 py-3.5 group ${
                show ? "cursor-pointer" : ""
              }`}
              onClick={() => show && onShowClick(show)}
            >
              {/* Thumbnail */}
              <div className="h-[68px] overflow-hidden rounded bg-dark-3 flex-shrink-0">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={show?.name ?? "Show"}
                    width={120}
                    height={68}
                    className="object-cover h-full w-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-condensed text-[10px] uppercase">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div className="font-condensed text-[13px] font-bold text-red tracking-wide">
                  {ep.airtime || "TBD"}
                </div>
                <div
                  className={`font-condensed text-[16px] font-bold leading-tight mt-0.5 transition-colors duration-150 ${
                    show ? "group-hover:text-red" : ""
                  } text-cs-white`}
                >
                  {ep.name ||
                    (ep.season && ep.number
                      ? `Season ${ep.season} Episode ${ep.number}`
                      : "TBA")}
                </div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  {show?.name && <span className="text-gray-400">{show.name}</span>}
                  <span className="bg-dark-3 text-gray-500 font-condensed text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                    {network}
                  </span>
                  {ep.season && ep.number && (
                    <span>
                      S{String(ep.season).padStart(2, "0")}E{String(ep.number).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
