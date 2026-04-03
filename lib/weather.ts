export async function fetchWeatherData(query: string | { lat: number; lon: number }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  let url = "";
  if (typeof query === "string") {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${apiKey}&units=metric`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather data not found.");
  const data = await res.json();
  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    visibility: Math.round(data.visibility / 1000),
  };
}