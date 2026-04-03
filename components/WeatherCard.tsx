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
    <div id="weather-card" className={`w-full rounded-[2rem] overflow-hidden transition-all duration-500 ${darkMode ? "border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : "border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"}`}
      style={{ background: darkMode ? "rgba(15, 12, 41, 0.7)" : "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(20px)" }}>

      {hasAlert && (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 text-white text-xs font-bold uppercase tracking-widest text-center">
          {alertMsg}
        </div>
      )}

      <div className="relative p-8 overflow-hidden">
        {/* Decorative Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20"
          style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }} />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-white/10 text-white/50" : "bg-slate-100 text-slate-400"}`}>
                📍 {weather.city}, {weather.country}
              </span>
            </div>
            <h2 className={`text-5xl font-black tracking-tighter ${darkMode ? "text-white" : "text-slate-800"}`}>
              {weather.city}
            </h2>
            <p className={`capitalize mt-2 text-base font-medium ${darkMode ? "text-white/60" : "text-slate-500"}`}>
              {weather.description}
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-400/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt="" className="w-24 h-24 drop-shadow-2xl relative z-10" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-6 relative z-10">
          <span className={`text-[7rem] leading-none font-black tracking-tighter ${darkMode ? "text-white" : "text-slate-800"}`}>
            {weather.temp}<span className="text-4xl align-top mt-4 inline-block">°</span>
          </span>
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}>Feels like</span>
            <span className={`text-2xl font-black ${darkMode ? "text-white/90" : "text-slate-700"}`}>
              {weather.feelsLike}°<span className="text-sm">C</span>
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "💧", value: `${weather.humidity}%`, label: "Humidity" },
            { icon: "💨", value: `${weather.windSpeed}`, unit: "m/s", label: "Wind" },
            { icon: "👁️", value: `${weather.visibility}`, unit: "km", label: "Visibility" },
          ].map(({ icon, value, label, unit }) => (
            <div key={label} className={`rounded-[1.5rem] p-4 flex flex-col items-center justify-center transition-all ${darkMode ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-slate-50 border border-slate-100 hover:bg-slate-100"}`}>
              <div className="text-xl mb-2">{icon}</div>
              <div className={`font-black text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>
                {value}<span className="text-[10px] ml-0.5 opacity-60 font-medium">{unit}</span>
              </div>
              <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${darkMode ? "text-white/30" : "text-slate-400"}`}>{label}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-[1.5rem] p-6 mb-6 relative overflow-hidden ${darkMode ? "bg-white/[0.03] border border-white/10" : "bg-sky-50/50 border border-sky-100"}`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-indigo-500" />
          <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2 ${darkMode ? "text-sky-400" : "text-sky-600"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            WeatherMind AI Insight
          </p>
          <p className={`text-[0.9rem] leading-relaxed font-medium ${darkMode ? "text-white/70" : "text-slate-600 italic"}`}>
            "{aiInsight}"
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={onSave}
            className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${darkMode ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}>
            ⭐ Save City
          </button>
          <button onClick={onShare}
            className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}>
            📸 Share Snap
          </button>
        </div>
      </div>
    </div>
  );
}