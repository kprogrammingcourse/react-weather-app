import { FORECAST_API_URL, GEOCODING_API_URL } from "../config.js";

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function findLocation(city, signal) {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const data = await fetchJson(`${GEOCODING_API_URL}?${params}`, signal);
  const match = data.results?.[0];

  if (!match) {
    return null;
  }

  return {
    name: match.name,
    region: match.admin1 ?? "",
    country: match.country ?? "",
    latitude: match.latitude,
    longitude: match.longitude,
  };
}

async function fetchForecast(location, unit, signal) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5",
    temperature_unit: unit,
    wind_speed_unit: unit === "fahrenheit" ? "mph" : "kmh",
  });

  return fetchJson(`${FORECAST_API_URL}?${params}`, signal);
}

export async function getWeatherForCity(city, unit, signal) {
  const location = await findLocation(city, signal);

  if (!location) {
    return null;
  }

  const forecast = await fetchForecast(location, unit, signal);

  return {
    location,
    current: {
      temperature: forecast.current.temperature_2m,
      feelsLike: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: forecast.current.wind_speed_10m,
      weatherCode: forecast.current.weather_code,
    },
    daily: forecast.daily.time.map((date, index) => ({
      date,
      weatherCode: forecast.daily.weather_code[index],
      max: forecast.daily.temperature_2m_max[index],
      min: forecast.daily.temperature_2m_min[index],
    })),
  };
}
