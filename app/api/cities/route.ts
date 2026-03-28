import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  if (!query || query.length < 2) return NextResponse.json([]);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${apiKey}`
  );
  const data = await res.json();
  
  const unique = new Map();
  for (const r of (Array.isArray(data) ? data : [])) {
    const key = `${r.name}-${r.state || ""}-${r.country || ""}`;
    if (!unique.has(key)) {
      unique.set(key, {
        name: r.name,
        country: r.country,
        state: r.state,
      });
    }
  }
  
  const cities = Array.from(unique.values()).slice(0, 5);
  return NextResponse.json(cities);
}