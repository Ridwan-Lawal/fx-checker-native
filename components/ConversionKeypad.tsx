import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  spacing,
} from "@/styles/tokens";
import { CurrencyData, CurrencyType } from "@/utils/types";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface ConversionKeypadProps {
  ref: React.RefObject<BottomSheetModal | null>;
  closeKeypad: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.JSX.Element;
  currencyData: CurrencyData;
  updateCurrencyAmount: (
    amount: number,
    currencyType: CurrencyType | null,
  ) => void;
  currencyType: CurrencyType | null;
}

const KEYPADS: string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "⌫",
];

export default function ConversionKeypad({
  ref,
  closeKeypad,
  renderBackdrop,
  currencyData,
  updateCurrencyAmount,
  currencyType,
}: ConversionKeypadProps) {
  const price = currencyData.amount.toString().split("");

  const onPressKeypad = (key: string) => {
    console.log(price, "price");
    if (key === "⌫") {
      const newPrice = price.slice(0, -1);
      console.log(newPrice, price);
      updateCurrencyAmount(Number(newPrice.join("")), currencyType);
    } else {
      const newPrice = [...price, key];
      console.log(newPrice, price, key, "keeys");
      updateCurrencyAmount(Number(newPrice.join("")), currencyType);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.keypadContainer}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
    >
      <BottomSheetView style={styles.keypadContainer}>
        <View style={styles.keypadHeader}>
          <Text style={styles.keypadHeaderText}>
            {currencyType} · {currencyData.currency}
          </Text>
          <Pressable onPress={closeKeypad}>
            <Text style={styles.submitButtonText}>done</Text>
          </Pressable>
        </View>
        <Text style={styles.priceText}>
          {currencyData.amount.toLocaleString("en-US")}
        </Text>

        <FlatList
          data={KEYPADS}
          numColumns={3}
          renderItem={({ item }) => (
            <Pressable
              style={styles.keypad}
              onPress={() => onPressKeypad(item)}
            >
              <Text style={styles.keypadText}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item, i) => i.toString()}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 8 }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  keypadContainer: {
    paddingTop: 12,
    paddingBottom: 30,
    paddingHorizontal: 18,
    gap: spacing.space4,
    backgroundColor: "#1a1a1c",
  },

  keypadHeader: {
    flexDirection: "row",
    paddingTop: 12,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  keypadHeaderText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  submitButtonText: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size12,
    letterSpacing: letterSpacing.tracking1,
    textTransform: "uppercase",
  },

  priceText: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 34,
    letterSpacing: letterSpacing.trackingNeg5,
    marginBottom: 12,
  },

  keypad: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 45.67,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2e2e32",
    backgroundColor: "#202022",
    flexGrow: 1,
  },

  keypadText: {
    color: "#f2f2f3",
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size20,
  },
});
