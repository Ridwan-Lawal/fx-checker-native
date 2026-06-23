export type CurrencyType = "send" | "recieve";
export type CurrencyData = {
  currency: string;
  amount: number;
};

export type CurrenciesToGetRate = {
  from: string;
  to?: string;
};

// rates
export interface RateType {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// time-series (historical) rates
export interface TimeSeriesRateType {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>; // { "YYYY-MM-DD": { SYM: rate } }
}

// shape react-native-wagmi-charts consumes
export type ChartPoint = {
  timestamp: number; // epoch ms
  value: number;
};
