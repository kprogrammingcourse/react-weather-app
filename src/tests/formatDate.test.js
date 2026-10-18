import { describe, expect, it } from "vitest";
import { formatWeekday } from "../utils/formatDate.js";

describe("formatWeekday", () => {
  it("returns the short weekday name for a date", () => {
    expect(formatWeekday("2026-10-18")).toBe("Sun");
  });

  it("uses the local calendar date, not the UTC date", () => {
    expect(formatWeekday("2026-10-19")).toBe("Mon");
  });
});
