import AnimatedPressable from "@/components/AnimatedPressable";
import ConversionBlock from "@/components/ConversionBlock";
import ConversionKeypad from "@/components/ConversionKeypad";
import CurrencySheet from "@/components/CurrencySheet";
import ErrorState from "@/components/ErrorState";
import FXMarquee from "@/components/FXMarquee";
import Header from "@/components/Header";
import {
  useGetRate,
  useGetRatesPerBaseCurrency,
  useGetTimeSeriesRates,
} from "@/hooks/useRates";
import { useFaveStore } from "@/store/useFaves";
import { useLogStore } from "@/store/useLogStore";
import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  radius,
  spacing,
} from "@/styles/tokens";
import { getDateRange, toChartPoints } from "@/utils/chart";
import { CurrencyType, RateType } from "@/utils/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-wagmi-charts";
import * as Crypto from "expo-crypto";

const currencyFlag = require("@/assets/images/convert/demoflag.png");
const seperatorIcon = require("@/assets/images/convert/seperator-icon.svg");

const CHART_CONTAINER_PADDING = 18;

export default function ConvertScreen() {
  const addFave = useFaveStore((state) => state.addFave);
  const faves = useFaveStore((state) => state.faves);
  const addLog = useLogStore((state) => state.addLog);
  const [chartContainerWidth, setChartContainerWidth] = useState(0);
  const sheetRef = useRef<BottomSheetModal>(null);
  const currencySheetRef = useRef<BottomSheetModal>(null);
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("EUR");

  const [amount, setAmount] = useState(0);
  const [activeField, setActiveField] = useState<CurrencyType>("send");
  const [formOpenCurrencyType, setFormOpenCurrencyType] =
    useState<null | CurrencyType>(null);
  const [currencySheetType, setCurrencySheetType] =
    useState<CurrencyType | null>(null);

  const { rateData, isFetchingRate, error, refetch } = useGetRate(
    { currency: sendCurrency, amount },
    { currency: receiveCurrency, amount },
  );

  const {
    allRatesData,
    allRatesFetchError,
    isFetchingAllRates,
    refetchAllRates,
  } = useGetRatesPerBaseCurrency(sendCurrency);

  const hasError = !!error || !!allRatesFetchError;
  const isRetrying = isFetchingRate || isFetchingAllRates;
  const handleRetry = () => {
    refetch();
    refetchAllRates();
  };

  // 30-day historical window for the chart (computed once)
  const { start, end } = useMemo(() => getDateRange(30), []);

  const { timeSeriesData } = useGetTimeSeriesRates(
    sendCurrency,
    receiveCurrency,
    start,
    end,
  );

  const chartData = useMemo(
    () => toChartPoints(timeSeriesData, receiveCurrency),
    [timeSeriesData, receiveCurrency],
  );

  // 30-day change for the chart header (first -> last point)
  const chartChangePct =
    chartData.length > 1
      ? ((chartData[chartData.length - 1].value - chartData[0].value) /
          chartData[0].value) *
        100
      : 0;
  const isChartUp = chartChangePct >= 0;
  const chartChangeLabel = `${isChartUp ? "+" : ""}${chartChangePct.toFixed(2)}%`;

  // send -> receive rate for the current currency pair
  const rate = rateData?.rates?.[receiveCurrency];
  const sendAmount = activeField === "send" ? amount : rate ? amount / rate : 0;
  const receiveAmount =
    activeField === "recieve" ? amount : rate ? amount * rate : 0;

  const currencyToSend = { currency: sendCurrency, amount: sendAmount };
  const currencyToRecieve = {
    currency: receiveCurrency,
    amount: receiveAmount,
  };

  const openKeypad = (currencyType: CurrencyType) => {
    sheetRef.current?.present();
    setFormOpenCurrencyType(currencyType);
    // The opened field becomes the anchor the keypad edits.
    setActiveField(currencyType);
    setAmount(currencyType === "send" ? sendAmount : receiveAmount);
  };
  const closeKeypad = () => {
    sheetRef.current?.dismiss();
    setFormOpenCurrencyType(null);
  };

  const handleOpenCurrencySheet = () => currencySheetRef.current?.present();
  const handleCloseCurrencySheet = () => currencySheetRef.current?.dismiss();
  const handleUpdateCurrencySheetType = (currencyType: CurrencyType) => {
    setCurrencySheetType(currencyType);
  };

  const handleSwitchCurrency = () => {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
    setActiveField((f) => (f === "send" ? "recieve" : "send"));
  };

  const updateCurrencyAmount = (
    newAmount: number,
    currencyType: CurrencyType | null,
  ) => {
    setAmount(newAmount);
    if (currencyType) setActiveField(currencyType);
  };

  const handleUpdateCurrency = (currency: string) => {
    if (currencySheetType === "send") {
      setSendCurrency(currency);
    } else if (currencySheetType === "recieve") {
      setReceiveCurrency(currency);
    }
    handleCloseCurrencySheet();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const isCurrencyPairFaved = faves.some(
    (fave) => fave.currencyPair === `${sendCurrency}/${receiveCurrency}`,
  );

  function handleAddFavePair() {
    const faveData = {
      currencyPair: `${sendCurrency}/${receiveCurrency}`,
      currencyRate: rate ?? 0,
      currencyChange: chartChangePct,
    };
    addFave(faveData);
  }

  function handleAddCurrencyPairToLog() {
    const currencyPairData = {
      id: Crypto.randomUUID(),
      conversionRate: rate ?? 0,
      conversionDate: new Date(),
      conversionSendPrice: sendCurrency,
      convertionRecievePrice: receiveCurrency,
    };

    addLog(currencyPairData);
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState onRetry={handleRetry} isRetrying={isRetrying} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <FXMarquee />

        <View style={styles.conversionSection}>
          <Text style={styles.conversionSectionTitle}>check the rate</Text>
          <View style={styles.conversionContainer}>
            {/* send */}
            <ConversionBlock
              title="send"
              onPress={openKeypad}
              data={currencyToSend}
              isFetchingRate={isFetchingRate}
              onOpenCurrencySheet={handleOpenCurrencySheet}
              onUpdateCurrencySheetType={handleUpdateCurrencySheetType}
            />

            {/* seperator */}
            <View style={styles.seperator}>
              <View style={styles.seperatorLine} />

              <AnimatedPressable onPress={handleSwitchCurrency}>
                <Image
                  source={seperatorIcon}
                  accessibilityLabel="seperator icon"
                  style={styles.seperatorIcon}
                />
              </AnimatedPressable>
            </View>

            {/* Recieve */}

            <ConversionBlock
              title="recieve"
              onPress={openKeypad}
              data={currencyToRecieve}
              isFetchingRate={isFetchingRate}
              onOpenCurrencySheet={handleOpenCurrencySheet}
              onUpdateCurrencySheetType={handleUpdateCurrencySheetType}
            />

            <View style={styles.conversionFooter}>
              <Text style={styles.conversionFooterText}>
                1 {sendCurrency} = {rate?.toFixed(4) ?? "—"} {receiveCurrency}
              </Text>

              <Pressable
                onPress={handleAddFavePair}
                style={styles.faveContainer}
              >
                <FontAwesome
                  name={isCurrencyPairFaved ? "star" : "star-o"}
                  size={15}
                  color={
                    isCurrencyPairFaved ? colors.lime[500] : colors.neutral[450]
                  }
                />

                <Text style={styles.faveText}>favourite</Text>
              </Pressable>
            </View>
          </View>

          {/* log button */}
          <AnimatedPressable
            style={styles.conversionLogButton}
            onPress={handleAddCurrencyPairToLog}
          >
            <Ionicons name="add" size={15} color={colors.neutral[900]} />
            <Text style={styles.conversionLogButtonText}>log conversion</Text>
          </AnimatedPressable>

          {/* chart summary */}
          <View
            style={styles.chartContainer}
            onLayout={(e) => setChartContainerWidth(e.nativeEvent.layout.width)}
          >
            <View style={styles.chartHeader}>
              <View style={styles.chartHeaderText}>
                <Text style={styles.chartCurrency}>
                  {sendCurrency}/{receiveCurrency}
                </Text>
                <Text
                  style={[
                    styles.chartChange,
                    { color: isChartUp ? colors.green[500] : colors.red[500] },
                  ]}
                >
                  {chartChangeLabel}
                </Text>
              </View>
              <View style={styles.timeframe}>
                <Text style={styles.timeframeText}>30D</Text>
                <Ionicons
                  name="chevron-forward"
                  size={11}
                  color={colors.neutral[450]}
                />
              </View>
            </View>
            {chartData.length > 0 && (
              <LineChart.Provider data={chartData}>
                <LineChart
                  height={120}
                  width={chartContainerWidth - CHART_CONTAINER_PADDING * 2}
                >
                  <LineChart.Path color={colors.lime[500]} width={2}>
                    <LineChart.Gradient />
                  </LineChart.Path>
                </LineChart>
              </LineChart.Provider>
            )}
          </View>
        </View>

        <ConversionKeypad
          ref={sheetRef}
          closeKeypad={closeKeypad}
          renderBackdrop={renderBackdrop}
          currencyData={
            formOpenCurrencyType === "send" ? currencyToSend : currencyToRecieve
          }
          updateCurrencyAmount={updateCurrencyAmount}
          currencyType={formOpenCurrencyType}
        />
      </ScrollView>

      <CurrencySheet
        ref={currencySheetRef}
        onCloseSheet={handleCloseCurrencySheet}
        baseCurrency={currencyToSend}
        targetCurrency={currencyToRecieve}
        onUpdateCurrency={handleUpdateCurrency}
        allRatesData={allRatesData as RateType}
        currencyType={currencySheetType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },

  conversionSection: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: spacing.space12,
  },
  conversionSectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    color: colors.neutral[350],
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  conversionContainer: {
    paddingTop: 3,
    paddingBottom: 1,
    paddingHorizontal: 1,
    borderRadius: radius.radius20,
    borderWidth: 1,
    borderColor: "#2a2a2e",
    backgroundColor: "#202022",
  },

  conversionFromContainer: {
    paddingTop: 20,
    paddingBottom: 22,
    paddingHorizontal: 20,
    gap: spacing.space12,
  },
  conversionFromHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conversionFromTitle: {
    color: colors.neutral[450],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  currencyPicker: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 6,
    gap: spacing.space8,
    borderWidth: 1,
    borderColor: "#33333a",
    backgroundColor: "#26262A",
    borderRadius: radius.radiusFull,
    alignItems: "center",
  },

  currencyFlag: {
    width: 22,
    height: 22,
    borderRadius: radius.radiusFull,
  },

  currencyName: {
    color: "#f2f2f3",
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size14,
    letterSpacing: letterSpacing.trackingPos5,
    textTransform: "uppercase",
  },

  fromPriceInput: {
    width: "100%",
  },

  fromPrice: {
    color: "#f2f2f3",
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size40,
    letterSpacing: -1,
    lineHeight: 40,
  },

  seperator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },

  seperatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a2a2e",
  },

  seperatorIcon: {
    width: 46,
    height: 46,
  },

  conversionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#2a2a2e",
    paddingVertical: 14,
  },

  conversionFooterText: {
    color: colors.neutral[150],
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size12,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  faveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  faveText: {
    color: colors.neutral[150],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: letterSpacing.tracking1,
    textTransform: "uppercase",
  },

  conversionLogButton: {
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    alignSelf: "stretch",
    borderRadius: radius.radius16,
    backgroundColor: colors.lime[500],
    padding: 15,
    flexDirection: "row",
  },

  conversionLogButtonText: {
    color: colors.neutral[900],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  chartContainer: {
    paddingHorizontal: CHART_CONTAINER_PADDING,
    paddingTop: 26,
    paddingBottom: 21,
    alignItems: "flex-start",
    alignSelf: "stretch",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2a2a2e",
    backgroundColor: colors.neutral[700],
    height: 144,
    gap: 12,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  chartHeaderText: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  chartCurrency: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size13,
    letterSpacing: letterSpacing.trackingPos5,
    textTransform: "uppercase",
  },
  chartChange: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
  },

  timeframe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeframeText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size11,
    letterSpacing: 1,
  },

  keypadContainer: {
    padding: 20,
  },
});

// Logging conversion properties zustand
//  favourite functionality which is zustand
