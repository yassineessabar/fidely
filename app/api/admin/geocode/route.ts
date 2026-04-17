import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { address: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { address } = body;
  if (!address || address.trim().length < 3) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address.trim())}`,
      {
        headers: {
          "User-Agent": "Kyro Loyalty (contact@kyro.com)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
    }

    const results = await res.json();
    if (!results || results.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { lat, lon, display_name } = results[0];
    return NextResponse.json({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      display_name,
    });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
