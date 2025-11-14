import type { WeatherResponse, WeatherSummary } from "@/src/models/weather";

const WEATHER_ENDPOINT = "https://wttr.in";

export async function fetchWeather(city: string): Promise<WeatherSummary> {
  const response = await fetch(
    `${WEATHER_ENDPOINT}/${encodeURIComponent(city)}?format=j1`
  );
  if (!response.ok) {
    throw new Error("Unable to fetch weather right now");
  }
  const json = (await response.json()) as WeatherResponse;
  const current = json.current_condition?.[0];
  if (!current) {
    throw new Error("No weather data found for that city");
  }

  const location = json.nearest_area?.[0];
  const area = location?.areaName?.[0]?.value ?? city;
  const country = location?.country?.[0]?.value;

  return {
    location: country ? `${area}, ${country}` : area,
    temperature: Number(current.temp_C),
    feelsLike: Number(current.FeelsLikeC),
    description: current.weatherDesc?.[0]?.value ?? "Unknown",
    humidity: Number(current.humidity),
    windSpeed: Number(current.windspeedKmph),
    icon: current.weatherIconUrl?.[0]?.value,
  };
}
