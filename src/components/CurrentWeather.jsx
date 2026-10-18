import { getWeatherInfo } from "../utils/weatherCodes.js";
import { UNIT_SYMBOLS } from "../utils/units.js";

export default function CurrentWeather({ location, current, unit }) {
  const { label, icon } = getWeatherInfo(current.weatherCode);
  const symbols = UNIT_SYMBOLS[unit];
  const placeDetails = [location.region, location.country]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="current-weather">
      <div className="current-weather__heading">
        <h2>{location.name}</h2>
        {placeDetails && (
          <p className="current-weather__place">{placeDetails}</p>
        )}
      </div>

      <div className="current-weather__main">
        <span className="current-weather__icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="current-weather__temperature">
            {Math.round(current.temperature)}
            {symbols.temperature}
          </p>
          <p className="current-weather__condition">{label}</p>
        </div>
      </div>

      <dl className="current-weather__details">
        <div>
          <dt>Feels like</dt>
          <dd>
            {Math.round(current.feelsLike)}
            {symbols.temperature}
          </dd>
        </div>
        <div>
          <dt>Humidity</dt>
          <dd>{current.humidity}%</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>
            {Math.round(current.windSpeed)} {symbols.wind}
          </dd>
        </div>
      </dl>
    </article>
  );
}
