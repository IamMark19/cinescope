import { NextRequest, NextResponse } from "next/server";
import { getSchedule } from "@/lib/tvmaze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? undefined;

  try {
    const result = await getSchedule(date);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "X-Data-Source": result.source,
        "X-Schedule-Date": result.date,
      },
    });
  } catch (err) {
    console.error("[/api/schedule]", err);
    return NextResponse.json({ error: "Failed to fetch schedule from TVmaze" }, { status: 502 });
  }
}
