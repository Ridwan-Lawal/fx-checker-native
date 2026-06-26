import CompareScreenHeader from "@/components/compare/CompareScreenHeader";
import CurrencyPicker from "@/components/compare/CurrencyPicker";
import { colors, fontFamily, radius } from "@/styles/tokens";
import { getFlag } from "@/utils/flags";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CurrencyPickerBottomSheet from "@/components/compare/CurrencyPickerBottomSheet";
import CurrencyAmountKeypad from "@/components/compare/CurrencyAmountKeypad";
import {
  useGetRateForComparison,
  useGetRatesPerBaseCurrency,
} from "@/hooks/useRates";
import {
  getCurrencyRateChange,
  getTimeSeriesForRate,
} from "@/utils/compare-rates";
import ErrorState from "@/components/ErrorState";

export default function CompareScreen() {
  const [currencyToConvert, setCurrencyToConvert] = useState("USD");
  const [amountToConvert, setAmountToConvert] = useState(100);

  const { startDate, endDate } = getTimeSeriesForRate("30d");

  const { rateData, isFetchingRate, rateFetchError, refetchRate } =
    useGetRateForComparison(currencyToConvert, startDate, endDate);

  const currentRates = rateData?.rates[endDate];
  const currentRatesToArray = Object.entries(currentRates ?? {});

  const currencyPickerSheetRef = useRef<BottomSheetModal>(null);
  const currencyAmountKeypadRef = useRef<BottomSheetModal>(null);

  const handleCurrencyChange = (currency: string) => {
    setCurrencyToConvert(currency);
    closeCurrencyPickerSheet();
  };

  const openCurrencyPickerSheet = () => {
    currencyPickerSheetRef.current?.present();
  };
  const closeCurrencyPickerSheet = () => {
    currencyPickerSheetRef.current?.close();
  };

  const openCurrencyAmountKeypad = () => {
    currencyAmountKeypadRef.current?.present();
  };
  const closeCurrencyAmountKeypad = () => {
    currencyAmountKeypadRef.current?.close();
  };

  const handleAmountChange = (amount: number) => {
    setAmountToConvert(amount);
  };

  // fix the loading and error state later

  if (rateFetchError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          onRetry={refetchRate}
          isRetrying={isFetchingRate}
          message={rateFetchError.message}
        />
      </SafeAreaView>
    );
  }

  // Loading state here
  if (isFetchingRate) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CompareScreenHeader />
      <CurrencyPicker
        currencyToConvert={currencyToConvert}
        amountToConvert={amountToConvert}
        onOpenCurrencyPicker={openCurrencyPickerSheet}
        onOpenCurrencyAmountKeypad={openCurrencyAmountKeypad}
      />

      {/*currencies to be converted*/}
      <View style={styles.currenciesToBeCompartedSection}>
        <Text style={styles.sectionHeaderText}>Best value across markets.</Text>

        {/*use flatlist later*/}
        <FlatList
          data={currentRatesToArray}
          renderItem={({ item }) => {
            const currencyToConvertFlag = getFlag(item[0].slice(0, 2));
            const currencyToBeComparedWithCode = item[0];
            const currencyToBeComparedWithRate = item[1];

            const currencyConversion =
              amountToConvert * currencyToBeComparedWithRate;

            const rateChange = getCurrencyRateChange(
              currencyToBeComparedWithCode,
              rateData?.rates,
            );

            const isRateIncrease = rateChange > 0;

            return (
              <View style={styles.currencyToBeComparedContainer}>
                <View style={styles.currencyToBeComparedHeader}>
                  <View style={styles.headerFirstSection}>
                    <Image
                      source={currencyToConvertFlag}
                      style={styles.currencyToBeComparedFlag}
                      priority="high"
                    />

                    <View>
                      <Text style={styles.currencyToBeComparedName}>
                        {currencyToBeComparedWithCode}
                      </Text>
                      <Text style={styles.currencyToBeComparedRate}>
                        1 {currencyToConvert} = {currencyToBeComparedWithRate}{" "}
                        {currencyToBeComparedWithCode}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.headerSecondSection}>
                    <Text style={styles.conversionAmount}>
                      {currencyConversion.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.conversionRateChange,
                        !isRateIncrease && { color: colors.red[500] },
                      ]}
                    >
                      {isRateIncrease ? "▲" : "▼"} {rateChange.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={{ gap: 8 }}
        />
      </View>

      <CurrencyPickerBottomSheet
        ref={currencyPickerSheetRef}
        onCloseCurrencyPicker={closeCurrencyPickerSheet}
        currencyToConvert={currencyToConvert}
        amountToConvert={amountToConvert}
        currentRates={currentRatesToArray}
        onCurrencyChange={handleCurrencyChange}
      />

      <CurrencyAmountKeypad
        ref={currencyAmountKeypadRef}
        onCloseCurrencyAmountKeypad={closeCurrencyAmountKeypad}
        onChange={handleAmountChange}
        value={amountToConvert}
        currencyCode={currencyToConvert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },
  currencyToConvertContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 18,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2e",
    backgroundColor: colors.neutral[600],
    marginTop: 10,
  },

  currencyToConvertHeadingText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  currencyToConvertAmount: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  flagPickerContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 6,
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#33333a",
    backgroundColor: "#26262a",
  },
  flagImage: {
    width: 22,
    height: 22,
    borderRadius: radius.radiusFull,
  },
  currencyToConvert: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  currenciesToBeCompartedSection: {
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    color: "#6e6e74",
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  currencyToBeComparedContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    alignSelf: "stretch",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#2a2a2e",
    backgroundColor: colors.neutral[700],
  },

  currencyToBeComparedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  headerFirstSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  currencyToBeComparedFlag: {
    height: 28,
    width: 28,
    borderRadius: radius.radiusFull,
  },
  currencyToBeComparedName: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  currencyToBeComparedRate: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: 10.5,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },

  headerSecondSection: {
    alignItems: "flex-end",
  },
  conversionAmount: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    textTransform: "uppercase",
  },
  conversionRateChange: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: 11,
  },
});
