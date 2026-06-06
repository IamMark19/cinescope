import { NextRequest, NextResponse } from "next/server";
import { getShows } from "@/lib/tvmaze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "0", 10);

  try {
    const result = await getShows(page);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=3600",
        "X-Data-Source": result.source,
        "X-Cache-Hit": String(result.cached),
      },
    });
  } catch (err) {
    console.error("[/api/shows]", err);
    return NextResponse.json({ error: "Failed to fetch shows from TVmaze" }, { status: 502 });
  }
}
