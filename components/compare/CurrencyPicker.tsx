import { colors, fontFamily, radius } from "@/styles/tokens";
import { getFlag } from "@/utils/flags";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedPressable from "../AnimatedPressable";

interface CurrencyPickerProps {
  currencyToConvert: string;
  amountToConvert: number;
  onOpenCurrencyPicker: () => void;
  onOpenCurrencyAmountKeypad: () => void;
}

export default function CurrencyPicker({
  currencyToConvert,
  amountToConvert,
  onOpenCurrencyPicker,
  onOpenCurrencyAmountKeypad,
}: CurrencyPickerProps) {
  const currencyToConvertFlag = getFlag(currencyToConvert.slice(0, 2));

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.currencyToConvertContainer}>
        <Pressable onPress={onOpenCurrencyAmountKeypad}>
          <Text style={styles.currencyToConvertHeadingText}>You convert</Text>
          <Text style={styles.currencyToConvertAmount}>{amountToConvert}</Text>
        </Pressable>

        <AnimatedPressable
          style={styles.flagPickerContainer}
          onPress={onOpenCurrencyPicker}
        >
          <Image
            source={currencyToConvertFlag}
            accessibilityLabel={`Flag for ${currencyToConvert}`}
            priority="high"
            style={styles.flagImage}
          />

          <Text style={styles.currencyToConvert}>{currencyToConvert}</Text>

          <Ionicons name="chevron-down" size={10} color="#86868c" />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
