import { ChartPoint, TimeSeriesRateType } from "@/utils/types";

/**
 * Convert a Frankfurter time-series response into the sorted
 * `{ timestamp, value }[]` shape react-native-wagmi-charts consumes.
 */
export function toChartPoints(
  data: TimeSeriesRateType | undefined,
  symbol: string,
): ChartPoint[] {
  if (!data?.rates) return [];

  const sym = symbol.toUpperCase();

  return Object.entries(data.rates)
    .map(([date, rates]) => ({
      timestamp: new Date(date).getTime(),
      value: rates[sym],
    }))
    .filter((point) => typeof point.value === "number")
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Build a `{ start, end }` date range (inclusive) ending today, going back
 * `days` days. Dates are `YYYY-MM-DD` strings — Frankfurter's path format.
 */
export function getDateRange(days = 30): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: toISODate(start),
    end: toISODate(end),
  };
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
