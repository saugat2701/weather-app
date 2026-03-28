import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  if (!city) return NextResponse.json({ error: "City required" }, { status: 400 });
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) return NextResponse.json({ error: "City not found" }, { status: 404 });
  const data = await res.json();
  const grouped = data.list.reduce((acc: any, item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
  
  const daily = Object.entries(grouped).slice(0, 5).map(([date, items]: [string, any]) => {
    const mainItem = items[Math.floor(items.length / 2)]; 
    const min = Math.min(...items.map((i: any) => i.main.temp_min));
    const max = Math.max(...items.map((i: any) => i.main.temp_max));
    return {
      date,
      temp: Math.round(mainItem.main.temp),
      min: Math.round(min),
      max: Math.round(max),
      description: mainItem.weather[0].description,
      icon: mainItem.weather[0].icon,
      humidity: mainItem.main.humidity,
      windSpeed: mainItem.wind.speed,
    };
  });
  return NextResponse.json(daily);
}