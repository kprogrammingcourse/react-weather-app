import { useState } from "react";

export default function SearchForm({ onSearch, isLoading }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    setCity(event.target.value);
    if (error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (trimmedCity === "") {
      setError("Please enter a city name.");
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label htmlFor="city-search" className="visually-hidden">
        City name
      </label>
      <div className="search-form__row">
        <input
          id="city-search"
          className="search-form__input"
          type="search"
          value={city}
          onChange={handleChange}
          placeholder="Search for a city, e.g. London"
          autoComplete="off"
          aria-invalid={error !== ""}
          aria-describedby={error ? "city-search-error" : undefined}
        />
        <button
          type="submit"
          className="search-form__button"
          disabled={isLoading}
        >
          {isLoading ? "Searching…" : "Search"}
        </button>
      </div>
      {error && (
        <p id="city-search-error" className="search-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
