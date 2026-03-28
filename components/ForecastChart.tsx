"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
export default function ForecastChart({ forecast, darkMode }: { forecast: any[]; darkMode: boolean }) {
  const textColor = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const data = {
    labels: forecast.map(f => f.date),
    datasets: [
      {
        label: "High °C",
        data: forecast.map(f => f.max),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#38bdf8",
        pointRadius: 5,
      },
      {
        label: "Low °C",
        data: forecast.map(f => f.min),
        borderColor: "#818cf8",
        backgroundColor: "rgba(129,140,248,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#818cf8",
        pointRadius: 5,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor, font: { size: 12 } } },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" } },
      y: { ticks: { color: textColor }, grid: { color: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" } },
    },
  };
  return (
    <div className={`rounded-3xl p-6 mt-4 ${darkMode ? "bg-white/5 border border-white/10" : "bg-white border border-slate-100 shadow-md"}`}>
      <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${darkMode ? "text-sky-300" : "text-sky-500"}`}>
        📈 5-Day Temperature Forecast
      </h3>
      <Line data={data} options={options} />
      <div className="grid grid-cols-5 gap-2 mt-4">
        {forecast.map((f, i) => (
          <div key={i} className={`text-center rounded-2xl p-2 ${darkMode ? "bg-white/5" : "bg-sky-50"}`}>
            <p className={`text-xs ${darkMode ? "text-white/40" : "text-slate-400"}`}>{f.date.split(",")[0]}</p>
            <img src={`https://openweathermap.org/img/wn/${f.icon}.png`} alt="" className="w-8 h-8 mx-auto" />
            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-700"}`}>{f.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}