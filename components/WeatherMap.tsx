"use client";
import { useEffect, useState } from "react";
export default function WeatherMap({ city, darkMode }: { city: string; darkMode: boolean }) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  useEffect(() => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
      .then(r => r.json())
      .then(d => {
        if (d.results?.[0]) {
          setCoords({ lat: d.results[0].latitude, lon: d.results[0].longitude });
        }
      });
  }, [city]);
  if (!coords) return null;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 2}%2C${coords.lat - 2}%2C${coords.lon + 2}%2C${coords.lat + 2}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`
  return (
    <div className={`rounded-3xl overflow-hidden mt-4 ${darkMode ? "border border-white/10" : "border border-slate-100 shadow-md"}`}>
      <div className={`px-6 py-4 ${darkMode ? "bg-white/5" : "bg-white"}`}>
        <h3 className={`text-sm font-bold tracking-widest uppercase ${darkMode ? "text-sky-300" : "text-sky-500"}`}>
          🗺️ Weather Map
        </h3>
      </div>
      <iframe
        src={mapUrl}
        width="100%"
        height="250"
        style={{ border: "none", display: "block" }}
        title="Weather Map"
      />
    </div>
  );
}