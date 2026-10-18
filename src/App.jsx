import CurrentWeather from "./components/CurrentWeather.jsx";
import ForecastList from "./components/ForecastList.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import SearchForm from "./components/SearchForm.jsx";
import StatusMessage from "./components/StatusMessage.jsx";
import UnitToggle from "./components/UnitToggle.jsx";
import useLocalStorage from "./hooks/useLocalStorage.js";
import useWeather from "./hooks/useWeather.js";
import "./App.css";

const SEARCH_STORAGE_KEY = "react-weather-app.search";
const UNIT_STORAGE_KEY = "react-weather-app.unit";

export default function App() {
  const [search, setSearch] = useLocalStorage(SEARCH_STORAGE_KEY, null);
  const [unit, setUnit] = useLocalStorage(UNIT_STORAGE_KEY, "celsius");
  const { status, data, error } = useWeather(search, unit);

  function handleSearch(city) {
    setSearch({ city, id: crypto.randomUUID() });
  }

  function handleRetry() {
    setSearch((previousSearch) => ({
      ...previousSearch,
      id: crypto.randomUUID(),
    }));
  }

  return (
    <div className="app">
      <main className="weather-app">
        <header className="weather-app__header">
          <h1>Weather</h1>
          <UnitToggle unit={unit} onUnitChange={setUnit} />
        </header>

        <SearchForm onSearch={handleSearch} isLoading={status === "loading"} />

        <section className="weather-app__content" aria-live="polite">
          {status === "idle" && (
            <StatusMessage
              title="Search for a city"
              message="Enter a city name to see current conditions and a 5-day forecast."
            />
          )}

          {status === "loading" && <LoadingSpinner label="Loading weather…" />}

          {status === "error" && (
            <StatusMessage
              tone="error"
              title="Something went wrong"
              message={error}
              actionLabel="Try again"
              onAction={handleRetry}
            />
          )}

          {status === "not-found" && (
            <StatusMessage
              title="City not found"
              message={`We couldn't find "${search.city}". Check the spelling and try again.`}
            />
          )}

          {status === "success" && (
            <>
              <CurrentWeather
                location={data.location}
                current={data.current}
                unit={unit}
              />
              <ForecastList days={data.daily} unit={unit} />
            </>
          )}
        </section>
      </main>

      <footer className="app__footer">
        Built with React + Vite · Weather data by{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo.com
        </a>
      </footer>
    </div>
  );
}
