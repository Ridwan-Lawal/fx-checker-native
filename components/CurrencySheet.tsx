import AnimatedPressable from "@/components/AnimatedPressable";
import { useGetCurrencies } from "@/hooks/useCurrency";
import {
  colors,
  fontFamily,
  fontSizes,
  radius,
  spacing,
} from "@/styles/tokens";
import { getCurrencyName, getFlag } from "@/utils/flags";
import { CurrencyData, CurrencyType, RateType } from "@/utils/types";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CurrencySheetProps {
  onCloseSheet: () => void;
  ref: React.RefObject<BottomSheetModal | null>;
  baseCurrency: CurrencyData;
  targetCurrency: CurrencyData;
  onUpdateCurrency: (currency: string) => void;
  allRatesData: RateType;
  currencyType: CurrencyType | null;
}

export default function CurrencySheet({
  onCloseSheet,
  ref,
  baseCurrency,
  targetCurrency,
  onUpdateCurrency,
  allRatesData,
  currencyType,
}: CurrencySheetProps) {
  const { currenciesData, isFetchingCurrencies, error } = useGetCurrencies();

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

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["90%"]}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.currencySheetContainer}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
    >
      <BottomSheetFlatList
        data={currenciesData}
        contentContainerStyle={styles.currencySheetContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>you send</Text>
            <AnimatedPressable onPress={onCloseSheet}>
              <Text style={styles.closeSheetText}>Close</Text>
            </AnimatedPressable>
          </View>
        }
        renderItem={({ item }) => {
          const currencyFirstTwoLetters = item.slice(0, 2).toLowerCase();
          const isBaseCurrency = item === baseCurrency.currency;
          const isTargetCurrency = item === targetCurrency.currency;

          return (
            <AnimatedPressable
              style={[
                styles.currencyContainer,
                isBaseCurrency || isTargetCurrency
                  ? styles.currencyContainerActive
                  : null,
              ]}
              onPress={() => {
                onUpdateCurrency(item);
              }}
              disabled={
                (isBaseCurrency && currencyType === "recieve") ||
                (isTargetCurrency && currencyType === "send")
              }
            >
              <Image
                source={getFlag(currencyFirstTwoLetters)}
                accessibilityLabel="currecy flags"
                style={styles.flag}
              />

              <View style={styles.currencyInnerContainer}>
                <View>
                  <Text style={styles.currencyCode}>{item.toUpperCase()}</Text>
                  <Text style={styles.currencyName}>
                    {getCurrencyName(item.slice(0, 2).toLowerCase())}
                  </Text>
                </View>

                <Text style={styles.rate}>
                  {isBaseCurrency
                    ? "base"
                    : isTargetCurrency
                      ? "target"
                      : allRatesData?.rates?.[item]?.toFixed(4) || "N/A"}
                </Text>
              </View>
            </AnimatedPressable>
          );
        }}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  currencySheetContainer: {
    paddingTop: 12,
    paddingBottom: 80,
    paddingHorizontal: 18,
    gap: spacing.space4,
    backgroundColor: "#1a1a1c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  headerText: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size14,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  closeSheetText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    gap: 13,
    alignSelf: "stretch",
  },

  currencyContainerActive: {
    backgroundColor: "#26262a",
    borderRadius: 14,
  },

  flag: {
    width: 30,
    height: 30,
    borderRadius: radius.radiusFull,
  },

  currencyInnerContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  currencyCode: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  currencyName: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size11,
  },

  rate: {
    color: "#9a9aa0",
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size11,
    textTransform: "uppercase",
  },
});
