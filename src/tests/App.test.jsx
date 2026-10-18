import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App.jsx";

const GEOCODING_RESPONSE = {
  results: [
    {
      name: "Paris",
      admin1: "Île-de-France",
      country: "France",
      latitude: 48.85,
      longitude: 2.35,
    },
  ],
};

const FORECAST_RESPONSE = {
  current: {
    temperature_2m: 28.4,
    apparent_temperature: 30.1,
    relative_humidity_2m: 55,
    weather_code: 1,
    wind_speed_10m: 12.3,
  },
  daily: {
    time: [
      "2026-10-18",
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
    ],
    weather_code: [1, 2, 3, 61, 95],
    temperature_2m_max: [31, 30, 27, 24, 26],
    temperature_2m_min: [19, 18, 17, 16, 17],
  },
};

function createResponse(data) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

let fetchMock;

beforeEach(() => {
  fetchMock = vi.fn((url) =>
    createResponse(
      url.includes("geocoding") ? GEOCODING_RESPONSE : FORECAST_RESPONSE,
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
});

async function searchFor(user, city) {
  await user.type(screen.getByLabelText("City name"), city);
  await user.click(screen.getByRole("button", { name: "Search" }));
}

describe("App", () => {
  it("asks the user to search before any request is made", () => {
    render(<App />);

    expect(screen.getByText("Search for a city")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a validation error for an empty search", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a city name.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a loading indicator while waiting for data", async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<App />);

    await searchFor(user, "Paris");

    expect(screen.getByRole("status")).toHaveTextContent("Loading weather…");
    expect(screen.getByRole("button", { name: "Searching…" })).toBeDisabled();
  });

  it("shows current weather and the forecast after a successful search", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchFor(user, "Paris");

    expect(
      await screen.findByRole("heading", { name: "Paris" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Île-de-France, France")).toBeInTheDocument();
    expect(screen.getByText("28°C")).toBeInTheDocument();
    expect(screen.getByText("Mainly clear")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("tells the user when a city cannot be found", async () => {
    fetchMock.mockImplementation(() => createResponse({}));
    const user = userEvent.setup();
    render(<App />);

    await searchFor(user, "Qwzxv");

    expect(await screen.findByText("City not found")).toBeInTheDocument();
  });

  it("shows an error and recovers when the user tries again", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network down"));
    const user = userEvent.setup();
    render(<App />);

    await searchFor(user, "Paris");

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "Paris" }),
    ).toBeInTheDocument();
  });

  it("requests Fahrenheit data when the unit is switched", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchFor(user, "Paris");
    await screen.findByRole("heading", { name: "Paris" });

    await user.click(screen.getByRole("button", { name: "°F" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("temperature_unit=fahrenheit"),
        expect.anything(),
      );
    });
    expect(await screen.findByText("28°F")).toBeInTheDocument();
  });

  it("remembers the last search after the app is reopened", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await searchFor(user, "Paris");
    await screen.findByRole("heading", { name: "Paris" });
    unmount();

    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Paris" }),
    ).toBeInTheDocument();
  });
});
