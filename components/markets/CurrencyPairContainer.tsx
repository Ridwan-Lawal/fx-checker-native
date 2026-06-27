import {
  useGetMarketRate,
  useGetRate,
  useGetTimeSeriesRates,
} from "@/hooks/useRates";
import { colors, fontFamily } from "@/styles/tokens";
import {
  getCurrencyRateChange,
  getTimeSeriesForRate,
} from "@/utils/compare-rates";
import { getFlag } from "@/utils/flags";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CurrencyPairContainerProps {
  currencyPair: string;
}

const positiveChart = require("@/assets/charts/positive-chart.svg");
const negativeChart = require("@/assets/charts/negative-charts.svg");

export default function CurrencyPairContainer({
  currencyPair,
}: CurrencyPairContainerProps) {
  const currenyPairArr = currencyPair.split("/");
  const baseCurrency = currenyPairArr[0];
  const quoteCurrency = currenyPairArr[1];
  const { startDate, endDate } = getTimeSeriesForRate("30d");

  const { rateData, isFetchingRate, rateFetchError, refetchRate } =
    useGetMarketRate(baseCurrency, quoteCurrency);
  const { timeSeriesData, isFetchingTimeSeries, timeSeriesError } =
    useGetTimeSeriesRates(baseCurrency, quoteCurrency, startDate, endDate);

  const rateChange = getCurrencyRateChange(
    quoteCurrency,
    timeSeriesData?.rates,
  );

  const isRateChangePositive = rateChange > 0;
  return (
    <View style={styles.currencyPairContainer}>
      <View style={styles.firstFlexItem}>
        <View style={styles.flags}>
          <Image
            source={getFlag(baseCurrency.slice(0, 2))}
            style={styles.flagImage}
            priority="high"
          />
          <Image
            source={getFlag(quoteCurrency.slice(0, 2))}
            style={[styles.flagImage, styles.secondFlagImage]}
            priority="high"
          />
        </View>
        <Text style={styles.currencyPairTitle}>{currencyPair}</Text>
      </View>

      {/*second flex item*/}
      <Image
        source={isRateChangePositive ? positiveChart : negativeChart}
        style={styles.currencyPairChart}
      />

      <View style={styles.thirdFlexItem}>
        <Text style={styles.currencyPairRate}>
          {rateData?.rates?.[quoteCurrency]}
        </Text>
        <Text
          style={[
            styles.rateChange,
            !isRateChangePositive && { color: colors.red[500] },
          ]}
        >
          {isRateChangePositive ? "▲" : "▼"} {isRateChangePositive && "+"}
          {rateChange.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currencyPairContainer: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 13,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    backgroundColor: colors.neutral[700],
    borderRadius: 14,
    borderColor: "#2a2a2e",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  firstFlexItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  flags: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagImage: {
    width: 26,
    height: 26,
    borderRadius: 999,
  },
  secondFlagImage: {
    marginLeft: -8,
    width: 22,
    height: 22,
  },
  currencyPairTitle: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  currencyPairChart: {
    height: 28,
    width: 70,
  },
  thirdFlexItem: {
    alignItems: "flex-end",
  },
  currencyPairRate: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  rateChange: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: 11,
  },
});
