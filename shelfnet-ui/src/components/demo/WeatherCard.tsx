"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { CloudSun, Droplets, Thermometer, Wind } from "lucide-react";
import { weather } from "@/src/services/api";
import { motion } from "framer-motion";

const DEFAULT_CITY = "Lagos";

export function WeatherCard() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [activeCity, setActiveCity] = useState(DEFAULT_CITY);

  const weatherQuery = useQuery({
    queryKey: ["weather", activeCity],
    queryFn: () => weather.fetchWeather(activeCity),
    staleTime: 1000 * 60 * 15,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!city.trim()) return;
    setActiveCity(city.trim());
  };

  const summary = weatherQuery.data;

  return (
    <section className="card border-white/5 p-5 shadow-lg shadow-indigo-500/20">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            External API
          </p>
          <h3 className="text-lg font-semibold text-white">
            Weather snapshot via wttr.in
          </h3>
        </div>
        <CloudSun className="h-8 w-8 text-amber-300" />
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Try Tokyo, Berlin, Nairobi…"
          className="input-base"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-300"
        >
          Fetch
        </motion.button>
      </form>

      {weatherQuery.isError ? (
        <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {(weatherQuery.error as Error)?.message ??
            "Unable to fetch the forecast right now."}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 sm:grid-cols-2">
        {weatherQuery.isFetching ? (
          <div className="col-span-2 animate-pulse text-sm text-slate-400">
            Gathering fresh data for {activeCity}…
          </div>
        ) : summary ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Location
              </p>
              <p className="text-xl font-semibold text-white">
                {summary.location}
              </p>
              <p className="text-sm text-slate-400">
                Feels like {summary.feelsLike}°C
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Thermometer size={16} className="text-amber-300" />
                {summary.temperature}°C
              </span>
              <span className="inline-flex items-center gap-1">
                <Droplets size={16} className="text-sky-300" />
                {summary.humidity}% humidity
              </span>
              <span className="inline-flex items-center gap-1">
                <Wind size={16} className="text-slate-300" />
                {summary.windSpeed} km/h wind
              </span>
              <span className="text-slate-400">{summary.description}</span>
            </div>
          </>
        ) : (
          <div className="col-span-2 text-sm text-slate-400">
            Pick a city to fetch hyper-local weather details.
          </div>
        )}
      </div>
    </section>
  );
}

export default WeatherCard;
