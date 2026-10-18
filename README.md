# Weather App

![CI](https://github.com/YOUR-USERNAME/react-weather-app/actions/workflows/ci.yml/badge.svg)

Current conditions and a 5-day forecast for any city, built with React and Vite. Handles loading, error, and not-found states, cancels outdated requests, and remembers your last search.

**Live demo:** _(add your deployed link after deployment)_

## Features

- City search with validation
- Current temperature, feels-like, humidity, wind, and conditions
- 5-day forecast with correct local weekday names
- °C / °F toggle (temperature and wind units)
- Clear loading, error (with retry), and not-found states
- Outdated requests are cancelled to prevent race conditions
- Last search and unit choice persist across visits
- Accessible: labeled controls, announced status changes, keyboard support
- Responsive layout

## Tech Stack

- [React](https://react.dev) (`useState`, `useEffect`, custom hooks)
- [Vite](https://vite.dev) with environment variables
- [Open-Meteo API](https://open-meteo.com) (geocoding + forecast, no API key required)
- [Vitest](https://vitest.dev) + React Testing Library with a mocked `fetch`
- GitHub Actions (CI)
- CSS, ESLint

## Getting Started

```bash
git clone https://github.com/YOUR-USERNAME/react-weather-app.git
cd react-weather-app
npm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

## Environment Variables

| Variable                 | Purpose                   | Default                                          |
| ------------------------ | ------------------------- | ------------------------------------------------ |
| `VITE_GEOCODING_API_URL` | City → coordinates lookup | `https://geocoding-api.open-meteo.com/v1/search` |
| `VITE_FORECAST_API_URL`  | Weather forecast endpoint | `https://api.open-meteo.com/v1/forecast`         |

> `VITE_` variables are bundled into client code and are publicly visible. Never store secrets in them.

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the development server         |
| `npm run build`    | Build for production into `dist/`    |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Check code quality with ESLint       |
| `npm test`         | Run tests in watch mode              |
| `npm run test:run` | Run all tests once                   |

## Project Structure

```text
src/
├── components/   # UI: search, unit toggle, weather cards, status/loading states
├── hooks/        # useWeather (data fetching), useLocalStorage (persistence)
├── services/     # weatherApi: HTTP calls and response normalization
├── utils/        # weather codes, date formatting, unit symbols
├── tests/        # unit and integration tests
├── config.js     # environment-based configuration
├── App.jsx       # state and screen selection
└── main.jsx      # entry point
```

## Architecture Notes

- **Service layer:** components never call `fetch`; `weatherApi.js` handles requests and converts API responses into app-friendly objects.
- **Single status value** (`idle | loading | error | not-found | success`) prevents contradictory UI states.
- **Derived loading state:** each result is tagged with the request it answers; a mismatch means loading.
- **Race-condition safety:** each effect run creates an `AbortController`; cleanup cancels outdated requests.
- **Retry** works by issuing a new search ID, which re-triggers the effect.

## Testing

Tests never hit the real network: `fetch` is replaced with a mock that returns fixed sample data.

- **Unit:** weather code mapping, timezone-safe weekday formatting
- **Integration:** idle, validation, loading, success, not-found, error + retry, unit switching, persistence

## Credits

Weather data by [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0).

## What I Learned

- Fetching data in effects, with cleanup via `AbortController`
- Designing for loading, error, and empty states
- Separating API code into a service layer and normalizing responses
- Using environment variables safely in a frontend app
- Mocking network requests in tests
- Setting up Continuous Integration with GitHub Actions
