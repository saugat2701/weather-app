"use client";
import { useState, useEffect, useRef } from "react";
import WeatherCard from "@/components/WeatherCard";
import ForecastChart from "@/components/ForecastChart";
import AQICard from "@/components/AQICard";
import WeatherMap from "@/components/WeatherMap";
import FavoriteCities from "@/components/FavoriteCities";

export default function Home() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [aqi, setAqi] = useState<any>(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [listening, setListening] = useState(false);
  const debounceRef = useRef<any>(null);
  const favRef = useRef<any>(null);

  useEffect(() => {
    // Initial fetch based on user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          search(undefined, { lat: latitude, lon: longitude });
        },
        () => {
          // Fallback if permission denied or error
          search("London");
        }
      );
    } else {
      search("London");
    }
  }, []);

  useEffect(() => {
    if (city.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(city)}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    }, 300);
  }, [city]);

  const search = async (cityName?: string, coords?: { lat: number, lon: number }) => {
    const searchCity = cityName || city;
    if (!searchCity.trim() && !coords) return;
    setShowSuggestions(false);
    setLoading(true);
    setError("");
    setResult(null);
    setForecast(null);
    setAqi(null);
    try {
      const body = coords ? JSON.stringify(coords) : JSON.stringify({ city: searchCity });
      const [weatherRes, forecastRes] = await Promise.all([
        fetch("/api/weather", { method: "POST", headers: { "Content-Type": "application/json" }, body }),
        fetch(coords ? `/api/forecast?lat=${coords.lat}&lon=${coords.lon}` : `/api/forecast?city=${encodeURIComponent(searchCity)}`),
      ]);
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
      if (weatherData.error) throw new Error(weatherData.error);
      setResult(weatherData);
      setForecast(forecastData);

      const aqiRes = await fetch(`/api/aqi?lat=${weatherData.weather.lat || 0}&lon=${weatherData.weather.lon || 0}`);
      const aqiData = await aqiRes.json();
      if (!aqiData.error) setAqi(aqiData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice search not supported in your browser. Try Chrome!"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.replace(/[.,!?]/g, "").trim();
      setCity(transcript);
      search(transcript);
    };
    recognition.start();
  };
  const handleShare = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById("weather-card");
    if (!element) return;
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.download = `weathermind-${result?.weather?.city}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  const handleSave = () => {
    if (favRef.current?.add) favRef.current.add(result?.weather?.city);
    alert(`✅ ${result?.weather?.city} saved to favorites!`);
  };
  const bg = darkMode
    ? { background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }
    : { background: "linear-gradient(135deg, #e0f2fe, #f0f9ff, #e8eaf6)" };
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 pt-12 transition-all duration-500 w-full" style={bg}>
      <div className="w-full max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className={`text-5xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
                Weather<span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #38bdf8, #818cf8)" }}>Mind</span>
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/40" : "text-slate-400"}`}>AI-powered weather intelligence</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <FavoriteCities ref={favRef} onSelect={(c) => { setCity(c); search(c); }} darkMode={darkMode} />

          <div className="relative mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-white/30" : "text-slate-300"}`}>🔍</span>
                <input
                  value={city}
                  onChange={e => { setCity(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={e => e.key === "Enter" && search()}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Enter city to be searched..."
                  className={`w-full rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-sm ${darkMode ? "bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-sky-400/50" : "bg-white border border-slate-200 text-slate-700 placeholder-slate-300 focus:border-sky-400 shadow-sm"}`}
                />
              </div>
              <button onClick={handleVoiceSearch}
                className={`px-4 rounded-2xl transition-all ${listening ? "bg-red-500 text-white" : darkMode ? "bg-white/10 text-white/60 hover:bg-white/20" : "bg-white border border-slate-200 text-slate-500 shadow-sm"}`}>
                🎙️
              </button>

              <button onClick={() => search()} disabled={loading}
                className="px-6 py-4 rounded-2xl font-bold text-white text-sm disabled:opacity-50 transition-all"
                style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}>
                {loading ? "⏳" : "Go"}
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute top-16 left-0 right-24 rounded-2xl shadow-2xl z-10 overflow-hidden border ${darkMode ? "bg-[#1e1b4b] border-white/10" : "bg-white border-slate-100"}`}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setCity(s.name); search(s.name); }}
                    className={`w-full text-left px-5 py-3 text-sm border-b last:border-0 transition-colors ${darkMode ? "hover:bg-white/10 text-white/80 border-white/5" : "hover:bg-sky-50 text-slate-700 border-slate-50"}`}>
                    📍 {s.name}{s.state ? `, ${s.state}` : ""}, {s.country}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-2xl px-5 py-4 mb-4 text-sm bg-red-500/10 border border-red-500/20 text-red-300">
              ⚠️ {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 animate-bounce">🌤️</div>
            <p className={darkMode ? "text-white/40" : "text-slate-400"}>Fetching weather data...</p>
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-4 items-start">
            <div className="lg:col-span-4 flex flex-col gap-6 w-full">
              <WeatherCard weather={result.weather} aiInsight={result.aiInsight} darkMode={darkMode} onSave={handleSave} onShare={handleShare} />
              {aqi && <AQICard aqi={aqi} darkMode={darkMode} />}
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6 w-full">
              {forecast && <ForecastChart forecast={forecast} darkMode={darkMode} />}
              <WeatherMap city={result.weather.city} darkMode={darkMode} />
            </div>
          </div>
        )}

        <div className={`mt-10 text-center text-xs ${darkMode ? "text-white/20" : "text-slate-300"}`}>
          <p>Crafted by <span className={`font-semibold ${darkMode ? "text-white/40" : "text-slate-400"}`}>Saugat</span></p>
          <a href="https://github.com/saugat2701" target="_blank" rel="noopener noreferrer"
            className="hover:underline flex items-center justify-center mt-1 gap-1">github.com/saugat2701</a>
        </div>
      </div>
    </main>
  );
}