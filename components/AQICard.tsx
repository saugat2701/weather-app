"use client";
export default function AQICard({ aqi, darkMode }: { aqi: any; darkMode: boolean }) {
  const percentage = Math.min((aqi.aqi / 500) * 100, 100);
  return (
    <div className={`rounded-3xl p-6 mt-4 ${darkMode ? "bg-white/5 border border-white/10" : "bg-white border border-slate-100 shadow-md"}`}>
      <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${darkMode ? "text-sky-300" : "text-sky-500"}`}>
        🌿 Air Quality Index
      </h3>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-4xl">{aqi.emoji}</span>
          <p className="text-2xl font-black mt-1" style={{ color: aqi.color }}>{aqi.label}</p>
          <p className={`text-sm ${darkMode ? "text-white/40" : "text-slate-400"}`}>AQI Level {aqi.aqi}</p>
        </div>
        <div className="w-24 h-24 relative flex items-center justify-center">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={aqi.color} strokeWidth="3"
              strokeDasharray={`${percentage} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute text-lg font-bold" style={{ color: aqi.color }}>{aqi.aqi}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "PM2.5", value: `${aqi.pm2_5} μg/m³` },
          { label: "PM10", value: `${aqi.pm10} μg/m³` },
          { label: "NO₂", value: `${aqi.no2} μg/m³` },
          { label: "O₃", value: `${aqi.o3} μg/m³` },
        ].map(({ label, value }) => (
          <div key={label} className={`rounded-2xl p-3 ${darkMode ? "bg-white/5" : "bg-slate-50"}`}>
            <p className={`text-xs ${darkMode ? "text-white/40" : "text-slate-400"}`}>{label}</p>
            <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-700"}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}