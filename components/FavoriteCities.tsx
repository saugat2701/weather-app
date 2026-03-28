"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const FavoriteCities = forwardRef(({ onSelect, darkMode }: { onSelect: (city: string) => void; darkMode: boolean }, ref) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("weathermind-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useImperativeHandle(ref, () => ({
    add: (city: string) => {
      if (favorites.includes(city)) return;
      const updated = [...favorites, city].slice(0, 6);
      setFavorites(updated);
      localStorage.setItem("weathermind-favorites", JSON.stringify(updated));
    }
  }));

  const remove = (city: string) => {
    const updated = favorites.filter(f => f !== city);
    setFavorites(updated);
    localStorage.setItem("weathermind-favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) return null;

  return (
    <div className="mb-6">
      <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${darkMode ? "text-white/30" : "text-slate-400"}`}>
        ⭐ Favorites
      </p>
      <div className="flex flex-wrap gap-2">
        {favorites.map(city => (
          <div key={city} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${darkMode ? "bg-white/10 text-white/70 border border-white/10" : "bg-sky-50 text-sky-600 border border-sky-100"}`}>
            <button onClick={() => onSelect(city)}>{city}</button>
            <button onClick={() => remove(city)} className="text-red-400 hover:text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  );
});

FavoriteCities.displayName = "FavoriteCities";
export default FavoriteCities;