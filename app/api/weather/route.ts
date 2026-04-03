import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { fetchWeatherData } from "@/lib/weather";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function POST(req: NextRequest) {
  try {
    const { city, lat, lon } = await req.json();
    if (!city && (lat === undefined || lon === undefined)) {
      return NextResponse.json({ error: "City name or coordinates are required" }, { status: 400 });
    }
    const query = city || { lat, lon };
    const weather = await fetchWeatherData(query);
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `You are a friendly AI weather assistant called WeatherMind. Based on this weather data, give 2-3 sentences of warm, practical advice — what to wear, what to do, what to avoid.
City: ${weather.city}, ${weather.country}
Temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)
Conditions: ${weather.description}
Humidity: ${weather.humidity}%
Wind: ${weather.windSpeed} m/s
Visibility: ${weather.visibility} km`,
      }],
    });
    const aiInsight = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ weather, aiInsight });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}