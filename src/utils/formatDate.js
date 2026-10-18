const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

export function formatWeekday(isoDate) {
  return weekdayFormatter.format(new Date(`${isoDate}T00:00:00`));
}
