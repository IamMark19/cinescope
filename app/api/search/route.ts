import { NextRequest, NextResponse } from "next/server";
import { searchShows } from "@/lib/tvmaze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    const shows = await searchShows(q);
    return NextResponse.json({ data: shows, query: q }, {
      headers: {
        "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[/api/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
