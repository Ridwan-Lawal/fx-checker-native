import { colors, fontFamily, spacing } from "@/styles/tokens";
import { getCurrencyName, getFlag } from "@/utils/flags";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import { View } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

interface CurrencyPickerBottomSheetProps {
  ref: React.RefObject<BottomSheetModal | null>;
  onCloseCurrencyPicker: () => void;
  currencyToConvert: string;
  amountToConvert: number;
  currentRates: [string, number][];
  onCurrencyChange: (currency: string) => void;
}

export default function CurrencyPickerBottomSheet({
  ref,
  onCloseCurrencyPicker,
  currencyToConvert,
  currentRates,
  onCurrencyChange,
}: CurrencyPickerBottomSheetProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  // All currenies = the currency to convert plus all the other currencies
  const allCurrencies = [
    currencyToConvert,
    ...currentRates.map((currency) => currency[0]),
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["90%"]}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1a1a1c",
      }}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      enableDismissOnClose={true}
    >
      <BottomSheetFlatList
        data={allCurrencies}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>Select Currency</Text>

            <Pressable onPress={onCloseCurrencyPicker}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const isCurrentlySelected = item === currencyToConvert;

          return (
            <Pressable
              onPress={() => onCurrencyChange(item)}
              style={styles.currency}
            >
              <View style={styles.currencyFlagName}>
                <Image
                  source={getFlag(item.slice(0, 2))}
                  style={styles.currencyFlag}
                />

                <View>
                  <Text style={styles.currencyCode}>{item}</Text>
                  <Text style={styles.currencyName}>
                    {getCurrencyName(item.slice(0, 2))}
                  </Text>
                </View>
              </View>

              <Text style={styles.currencyRate}>
                {isCurrentlySelected ? "Current" : ""}
              </Text>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item}
        contentContainerStyle={{ gap: 4, paddingBottom: 40 }}
        style={styles.currenciesList}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  currenciesList: {
    paddingTop: 12,
    paddingBottom: 80,
    paddingHorizontal: 18,
    gap: spacing.space4,
    backgroundColor: "#1a1a1c",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    paddingHorizontal: 20,
    alignSelf: "stretch",
  },
  listHeaderText: {
    color: "#f2f2f3",
    fontSize: 14,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  closeButtonText: {
    color: colors.lime[500],
    fontSize: 12,
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  currency: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 13,
    alignSelf: "stretch",
  },

  currencyFlagName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  currencyFlag: {
    width: 30,
    height: 30,
    borderRadius: 999,
  },
  currencyCode: {
    color: "#f2f2f3",
    fontSize: 14,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  currencyName: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    textTransform: "capitalize",
    fontSize: 11,
  },
  currencyRate: {
    color: colors.neutral[150],
    fontSize: 12,
    fontFamily: fontFamily.regular,
    textTransform: "uppercase",
  },
});
