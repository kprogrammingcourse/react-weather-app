import { describe, expect, it } from "vitest";
import { getWeatherInfo } from "../utils/weatherCodes.js";

describe("getWeatherInfo", () => {
  it("returns the label and icon for a known code", () => {
    expect(getWeatherInfo(0)).toEqual({ label: "Clear sky", icon: "☀️" });
  });

  it("returns the same description for codes in the same group", () => {
    expect(getWeatherInfo(61).label).toBe("Rain");
    expect(getWeatherInfo(63).label).toBe("Rain");
  });

  it("returns a safe fallback for an unknown code", () => {
    expect(getWeatherInfo(12345).label).toBe("Unknown conditions");
  });
});
