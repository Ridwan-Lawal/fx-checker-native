import { api } from "@/lib/axios";
import {
  CurrenciesToGetRate,
  RateType,
  TimeSeriesRateType,
} from "@/utils/types";
import { cache } from "react";

export async function getCurrencyRatesPerBaseCurrency(
  baseCurrency: string,
): Promise<RateType> {
  try {
    const res = await api.get<RateType>("/latest", {
      params: {
        base: baseCurrency,
      },
    });

    return res.data;
  } catch (error) {
    devLog(error);

    throw new Error("Something went wrong fetching rates");
  }
}

export const getCurrencyRate = cache(async function ({
  from,
  to,
}: CurrenciesToGetRate): Promise<RateType> {
  try {
    const res = await api.get<RateType>("/latest", {
      params: {
        base: from.toUpperCase(),
        symbols: to?.toUpperCase(),
      },
    });

    return res.data;
  } catch (error) {
    devLog(error);
    throw new Error(
      "Something went wrong trying to get currency rates. try again",
    );
  }
});

export async function getTimeSeriesRates({
  from,
  to,
  start,
  end,
}: CurrenciesToGetRate & {
  start: string;
  end: string;
}): Promise<TimeSeriesRateType> {
  try {
    const res = await api.get<TimeSeriesRateType>(`/${start}..${end}`, {
      params: {
        base: from.toUpperCase(),
        symbols: to?.toUpperCase(),
      },
    });

    return res.data;
  } catch (error) {
    devLog(error);
    throw new Error("Something went wrong fetching historical rates");
  }
}

export async function getMarketTimeSeries(
  base: string,
  symbols: string[],
  start: string,
  end: string,
): Promise<TimeSeriesRateType> {
  try {
    const res = await api.get<TimeSeriesRateType>(`/${start}..${end}`, {
      params: {
        base: base.toUpperCase(),
        symbols: symbols.map((s) => s.toUpperCase()).join(","),
      },
    });

    return res.data;
  } catch (error) {
    devLog(error);
    throw new Error("Something went wrong fetching market rates");
  }
}

export const devLog = (error: unknown) => {
  if (__DEV__) console.error("[API Error]", error);
};
