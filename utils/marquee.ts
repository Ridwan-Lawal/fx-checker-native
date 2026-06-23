import { TimeSeriesRateType } from "@/utils/types";

export type MarqueeItem = {
  currency: string; // "usd/jpy"
  price: string; // "157.91"
  change: string; // "▲ +0.84%"
  isUp: boolean;
};

/**
 * Turn a Frankfurter time-series response into marquee ticker items, computing
 * each pair's daily change from the last two dates present in the response.
 */
export function toMarqueeItems(
  data: TimeSeriesRateType | undefined,
  base: string,
  symbols: string[],
): MarqueeItem[] {
  if (!data?.rates) return [];

  const dates = Object.keys(data.rates).sort(); // ascending YYYY-MM-DD
  if (dates.length === 0) return [];

  const latestDate = dates[dates.length - 1];
  const prevDate = dates.length > 1 ? dates[dates.length - 2] : latestDate;

  return symbols
    .map((symbol) => {
      const sym = symbol.toUpperCase();
      const latest = data.rates[latestDate]?.[sym];
      const prev = data.rates[prevDate]?.[sym];
      if (typeof latest !== "number") return null;

      const changePct =
        typeof prev === "number" && prev !== 0
          ? ((latest - prev) / prev) * 100
          : 0;
      const isUp = changePct >= 0;

      return {
        currency: `${base.toLowerCase()}/${symbol.toLowerCase()}`,
        price: formatPrice(latest),
        change: `${isUp ? "▲ +" : "▼ "}${changePct.toFixed(2)}%`,
        isUp,
      };
    })
    .filter((item): item is MarqueeItem => item !== null);
}

// JPY-style values (~157) want 2dp; EUR/GBP-style (~1.08) want 4dp.
function formatPrice(value: number): string {
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}
