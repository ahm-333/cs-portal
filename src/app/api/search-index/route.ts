import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/data";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600",
};

export async function GET() {
  const items = await getSearchIndex();
  return NextResponse.json(items, {
    status: 200,
    headers: CACHE_HEADERS,
  });
}
