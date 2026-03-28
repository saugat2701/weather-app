"use client";
interface WeatherData {
  city: string; country: string; temp: number; feelsLike: number;
  humidity: number; windSpeed: number; description: string;
  icon: string; visibility: number;
}

export default function WeatherCard({ weather, aiInsight, darkMode, onSave, onShare }: {
  weather: WeatherData; aiInsight: string; darkMode: boolean;
  onSave: () => void; onShare: () => void;
}) {
  const hasAlert = weather.windSpeed > 10 || weather.temp > 40 || weather.temp < 0;
  const alertMsg = weather.windSpeed > 10 ? "⚠️ High wind speeds detected. Take precautions outdoors."
    : weather.temp > 40 ? "🔥 Extreme heat warning! Stay hydrated and avoid direct sunlight."
      : "🥶 Freezing temperatures! Dress in warm layers and avoid prolonged exposure.";

  return (
    <div id="weather-card" className={`w-full rounded-3xl overflow-hidden ${darkMode ? "border border-white/10" : "border border-slate-100 shadow-xl"}`}
      style={{ background: darkMode ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))" : "white" }}>

      {hasAlert && (
        <div className="bg-red-500/90 px-6 py-3 text-white text-sm font-semibold">
          {alertMsg}
        </div>
      )}

      <div className="p-7" style={{ background: darkMode ? "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))" : "linear-gradient(135deg, #e0f2fe, #ede9fe)" }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm ${darkMode ? "text-white/40" : "text-slate-400"}`}>📍 {weather.country}</span>
            </div>
            <h2 className={`text-4xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>{weather.city}</h2>
            <p className={`capitalize mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>{weather.description}</p>
          </div>
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" className="w-20 h-20 drop-shadow-lg" />
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className={`text-8xl font-thin ${darkMode ? "text-white" : "text-slate-800"}`}>{weather.temp}°</span>
          <div className="mb-4">
            <span className={`text-sm block ${darkMode ? "text-white/40" : "text-slate-400"}`}>Feels like</span>
            <span className={`text-lg font-semibold ${darkMode ? "text-white/70" : "text-slate-600"}`}>{weather.feelsLike}°C</span>
          </div>
        </div>
      </div>

      <div className="px-7 py-5">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: "💧", value: `${weather.humidity}%`, label: "Humidity" },
            { icon: "💨", value: `${weather.windSpeed} m/s`, label: "Wind" },
            { icon: "👁️", value: `${weather.visibility} km`, label: "Visibility" },
          ].map(({ icon, value, label }) => (
            <div key={label} className={`rounded-2xl p-4 text-center ${darkMode ? "bg-white/5 border border-white/7" : "bg-slate-50 border border-slate-100"}`}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-700"}`}>{value}</div>
              <div className={`text-xs mt-1 ${darkMode ? "text-white/30" : "text-slate-400"}`}>{label}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl p-5 mb-5 ${darkMode ? "bg-white/5 border border-white/10" : "bg-sky-50 border border-sky-100"}`}>
          <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${darkMode ? "text-sky-300" : "text-sky-500"}`}>
            ✨ WeatherMind AI Analysis
          </p>
          <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-slate-600"}`}>{aiInsight}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onSave}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            ⭐ Save City
          </button>
          <button onClick={onShare}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}>
            📸 Share
          </button>
        </div>
      </div>
    </div>
  );
}