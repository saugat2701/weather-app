import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) return NextResponse.json({ error: "Coordinates required" }, { status: 400 });
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  if (!res.ok) return NextResponse.json({ error: "AQI not found" }, { status: 404 });
  const data = await res.json();
  const components = data.list[0].components;
  
  // Truncate values to required precision per EPA
  const pm25 = Math.floor((components.pm2_5 || 0) * 10) / 10;
  const pm10 = Math.floor(components.pm10 || 0);
  const no2 = Math.floor((components.no2 || 0) / 1.88);
  const so2 = Math.floor((components.so2 || 0) / 2.62);
  const o3 = Math.floor((components.o3 || 0) / 1.96);
  const co = Math.floor(((components.co || 0) / 1145) * 10) / 10;

  const calculateAQI = (c: number, bp: number[][]) => {
    const range = bp.find(b => c >= b[0] && c <= b[1]);
    if (range) {
      const [Cl, Ch, Il, Ih] = range;
      return Math.round(((Ih - Il) / (Ch - Cl)) * (c - Cl) + Il);
    }
    if (c > bp[bp.length - 1][1]) {
      const [Cl, Ch, Il, Ih] = bp[bp.length - 1];
      return Math.round(((Ih - Il) / (Ch - Cl)) * (c - Cl) + Il);
    }
    return 0;
  };

  const aqi_pm25 = calculateAQI(pm25, [
    [0.0, 12.0, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 350.4, 301, 400], [350.5, 500.4, 401, 500]
  ]);
  const aqi_pm10 = calculateAQI(pm10, [
    [0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150],
    [255, 354, 151, 200], [355, 424, 201, 300], [425, 504, 301, 400], [505, 604, 401, 500]
  ]);
  const aqi_no2 = calculateAQI(no2, [
    [0, 53, 0, 50], [54, 100, 51, 100], [101, 360, 101, 150], [361, 649, 151, 200], [650, 1249, 201, 300], [1250, 1649, 301, 400], [1650, 2049, 401, 500]
  ]);
  const aqi_so2 = calculateAQI(so2, [
    [0, 35, 0, 50], [36, 75, 51, 100], [76, 185, 101, 150], [186, 304, 151, 200], [305, 604, 201, 300], [605, 804, 301, 400], [805, 1004, 401, 500]
  ]);
  const aqi_co = calculateAQI(co, [
    [0.0, 4.4, 0, 50], [4.5, 9.4, 51, 100], [9.5, 12.4, 101, 150], [12.5, 15.4, 151, 200], [15.5, 30.4, 201, 300], [30.5, 40.4, 301, 400], [40.5, 50.4, 401, 500]
  ]);
  const aqi_o3 = o3 <= 124 ? calculateAQI(o3, [
    [0, 54, 0, 50], [55, 70, 51, 100], [71, 85, 101, 150], [86, 105, 151, 200], [106, 200, 201, 300]
  ]) : calculateAQI(o3, [
    [125, 164, 101, 150], [165, 204, 151, 200], [205, 404, 201, 300], [405, 504, 301, 400], [505, 604, 401, 500]
  ]);

  const aqiVal = Math.min(500, Math.max(aqi_pm25, aqi_pm10, aqi_no2, aqi_so2, aqi_co, aqi_o3, 0));
  
  let metadata = { label: "Good", color: "#22c55e", emoji: "😊" };
  if (aqiVal >= 51) metadata = { label: "Moderate", color: "#eab308", emoji: "🙂" };
  if (aqiVal >= 101) metadata = { label: "Unhealthy for Sensitive Groups", color: "#f97316", emoji: "😷" };
  if (aqiVal >= 151) metadata = { label: "Unhealthy", color: "#ef4444", emoji: "🚨" };
  if (aqiVal >= 201) metadata = { label: "Very Unhealthy", color: "#991b1b", emoji: "☠️" };
  if (aqiVal >= 301) metadata = { label: "Hazardous", color: "#7e22ce", emoji: "☣️" };

  return NextResponse.json({
    aqi: aqiVal,
    ...metadata,
    pm2_5: (components.pm2_5 || 0).toFixed(1),
    pm10: (components.pm10 || 0).toFixed(1),
    no2: (components.no2 || 0).toFixed(1),
    o3: (components.o3 || 0).toFixed(1),
  });
}