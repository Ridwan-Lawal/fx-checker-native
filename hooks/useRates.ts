import {
  getCurrenciesRateByTime,
  getCurrencyRate,
  getCurrencyRatesPerBaseCurrency,
  getMarketRates,
  getMarketTimeSeries,
  getTimeSeriesRates,
} from "@/lib/services/rates";
import { getDateRange } from "@/utils/chart";
import { MARQUEE_BASE, MARQUEE_SYMBOLS } from "@/utils/contants";
import { toMarqueeItems } from "@/utils/marquee";
import { CurrencyData, RateType, TimeSeriesRateType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useGetMarketRate(base: string, quote: string) {
  const {
    data: rateData,
    isPending: isFetchingRate,
    error: rateFetchError,
    refetch: refetchRate,
  } = useQuery<RateType>({
    queryKey: ["market-rate", base, quote],
    queryFn: () => getMarketRates(base, quote),
    retry: 2,
    enabled: !!base && !!quote,
    staleTime: 1000 * 60 * 60,
  });

  return { rateData, isFetchingRate, rateFetchError, refetchRate };
}

export function useGetRateForComparison(
  baseCurrency: string,
  startDate: string,
  endDate: string,
) {
  const {
    data: rateData,
    isPending: isFetchingRate,
    error: rateFetchError,
    refetch: refetchRate,
  } = useQuery<TimeSeriesRateType>({
    queryKey: ["rate-for-comparison", baseCurrency],
    queryFn: () => getCurrenciesRateByTime(baseCurrency, startDate, endDate),
    staleTime: 1000 * 60 * 60,
    enabled: !!baseCurrency,
  });

  return { rateData, isFetchingRate, rateFetchError, refetchRate };
}

export function useGetRate(
  currencyToSend: CurrencyData,
  currencyToRecieve?: CurrencyData,
) {
  const {
    data: rateData,
    isPending: isFetchingRate,
    error,
    refetch,
  } = useQuery<RateType>({
    queryKey: ["rate", currencyToSend.currency, currencyToRecieve?.currency],
    queryFn: () =>
      getCurrencyRate({
        from: currencyToSend.currency,
        to: currencyToRecieve?.currency,
      }),
    staleTime: 1000 * 60 * 60,
    retry: 2,
    enabled: !!currencyToSend.currency && !!currencyToRecieve?.currency,
  });

  return { rateData, isFetchingRate, error, refetch };
}

export function useGetRatesPerBaseCurrency(baseCurrency: string) {
  const {
    data: allRatesData,
    isPending: isFetchingAllRates,
    error: allRatesFetchError,
    refetch: refetchAllRates,
  } = useQuery<RateType>({
    queryKey: ["all-rates-per-base-cur", baseCurrency],
    queryFn: () => getCurrencyRatesPerBaseCurrency(baseCurrency),
    staleTime: 1000 * 60 * 60,
    enabled: !!baseCurrency,
  });

  return {
    allRatesData,
    isFetchingAllRates,
    allRatesFetchError,
    refetchAllRates,
  };
}

export function useGetTimeSeriesRates(
  from: string,
  to: string,
  start: string,
  end: string,
) {
  const {
    data: timeSeriesData,
    isPending: isFetchingTimeSeries,
    error: timeSeriesError,
  } = useQuery<TimeSeriesRateType>({
    queryKey: ["time-series", from, to, start, end],
    queryFn: () => getTimeSeriesRates({ from, to, start, end }),
    staleTime: 1000 * 60 * 60,
    retry: 2,
    enabled: !!from && !!to,
  });

  return { timeSeriesData, isFetchingTimeSeries, timeSeriesError };
}

export function useGetMarketRates() {
  const { start, end } = getDateRange(7);

  const { data, isPending, error } = useQuery<TimeSeriesRateType>({
    queryKey: ["market-rates", start, end],
    queryFn: () =>
      getMarketTimeSeries(MARQUEE_BASE, MARQUEE_SYMBOLS, start, end),
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });

  const marqueeItems = toMarqueeItems(data, MARQUEE_BASE, MARQUEE_SYMBOLS);

  return { marqueeItems, isFetchingMarket: isPending, marketError: error };
}
