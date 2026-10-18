import { useEffect, useState } from "react";
import { getWeatherForCity } from "../services/weatherApi.js";

const FRIENDLY_ERROR =
  "We couldn't load the weather. Check your connection and try again.";

const EMPTY_RESULT = { requestKey: null, data: null, error: null };

function createRequestKey(search, unit) {
  return search ? `${search.id}|${unit}` : null;
}

export default function useWeather(search, unit) {
  const [result, setResult] = useState(EMPTY_RESULT);
  const requestKey = createRequestKey(search, unit);

  useEffect(() => {
    if (!search) {
      return;
    }

    const key = createRequestKey(search, unit);
    const controller = new AbortController();

    getWeatherForCity(search.city, unit, controller.signal)
      .then((data) => {
        setResult({ requestKey: key, data, error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        setResult({ requestKey: key, data: null, error: FRIENDLY_ERROR });
      });

    return () => {
      controller.abort();
    };
  }, [search, unit]);

  if (!search) {
    return { status: "idle", data: null, error: null };
  }
  if (result.requestKey !== requestKey) {
    return { status: "loading", data: null, error: null };
  }
  if (result.error) {
    return { status: "error", data: null, error: result.error };
  }
  if (!result.data) {
    return { status: "not-found", data: null, error: null };
  }
  return { status: "success", data: result.data, error: null };
}
