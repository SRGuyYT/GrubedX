import { NextResponse } from "next/server";

const LIVE_SPORTS_ENDPOINT = "https://streamed.pk/api/sports";

export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch(LIVE_SPORTS_ENDPOINT, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch sports" }, { status: response.status });
    }

    const payload = await response.json();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Unable to reach sports provider" }, { status: 502 });
  }
}
