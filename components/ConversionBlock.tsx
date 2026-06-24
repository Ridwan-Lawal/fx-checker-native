import AnimatedPressable from "@/components/AnimatedPressable";
import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  radius,
  spacing,
} from "@/styles/tokens";
import { getFlag } from "@/utils/flags";
import { CurrencyData, CurrencyType } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ConversionBlockProps {
  title: "send" | "recieve";
  onPress: (currencyType: CurrencyType) => void;
  data: CurrencyData;
  isFetchingRate: boolean;
  onOpenCurrencySheet: () => void;
  onUpdateCurrencySheetType: (currencyType: CurrencyType) => void;
}

export default function ConversionBlock({
  title,
  onPress,
  data,
  isFetchingRate,
  onOpenCurrencySheet,
  onUpdateCurrencySheetType,
}: ConversionBlockProps) {
  const currencyFirstTwoLetters = data.currency.slice(0, 2).toLowerCase();
  const flagSource = getFlag(currencyFirstTwoLetters);

  return (
    <View style={styles.conversionFromContainer}>
      {/* header */}
      <View style={styles.conversionFromHeader}>
        <Text style={styles.conversionFromTitle}>{title}</Text>

        {/* countnry */}
        <AnimatedPressable
          style={styles.currencyPicker}
          onPress={() => {
            onOpenCurrencySheet();
            onUpdateCurrencySheetType(title);
          }}
        >
          <Image
            source={flagSource}
            accessibilityLabel="currency flag"
            style={styles.currencyFlag}
          />
          <Text style={styles.currencyName}>{data.currency.toUpperCase()}</Text>
          <FontAwesome name="chevron-down" size={11} color="#86868C" />
        </AnimatedPressable>
      </View>

      {/* form */}
      <Pressable style={styles.fromPriceInput} onPress={() => onPress(title)}>
        <Text
          style={[
            styles.fromPrice,
            data?.amount === 0 && { color: colors.neutral[400] },
          ]}
        >
          {isFetchingRate ? (
            <Text style={styles.rateFetchingIndicator}>Fetching rates</Text>
          ) : data.amount === 0 ? (
            data.amount.toFixed(2)
          ) : (
            data.amount.toFixed(2)
          )}
        </Text>
      </Pressable>
    </View>
  );
}

{
  /* use plaiceholder for images later */
}

const styles = StyleSheet.create({
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

  rateFetchingIndicator: {
    fontStyle: "italic",
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    color: "gray",
  },
});
