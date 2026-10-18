import { formatWeekday } from "../utils/formatDate.js";
import { getWeatherInfo } from "../utils/weatherCodes.js";
import { UNIT_SYMBOLS } from "../utils/units.js";

export default function ForecastList({ days, unit }) {
  const symbol = UNIT_SYMBOLS[unit].temperature;

  return (
    <section className="forecast" aria-labelledby="forecast-heading">
      <h2 id="forecast-heading" className="forecast__title">
        5-day forecast
      </h2>
      <ul className="forecast__list">
        {days.map((day, index) => {
          const { label, icon } = getWeatherInfo(day.weatherCode);

          return (
            <li key={day.date} className="forecast__day">
              <span className="forecast__name">
                {index === 0 ? "Today" : formatWeekday(day.date)}
              </span>
              <span className="forecast__icon" role="img" aria-label={label}>
                {icon}
              </span>
              <span className="forecast__temps">
                <span className="forecast__max">
                  {Math.round(day.max)}
                  {symbol}
                </span>
                <span className="forecast__min">
                  {Math.round(day.min)}
                  {symbol}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
