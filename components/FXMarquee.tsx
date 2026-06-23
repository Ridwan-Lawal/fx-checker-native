import { useGetMarketRates } from "@/hooks/useRates";
import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  spacing,
} from "@/styles/tokens";
import { Marquee } from "@animatereactnative/marquee";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FXMarquee() {
  const { marqueeItems } = useGetMarketRates();

  if (marqueeItems.length === 0) return null;

  return (
    <Marquee spacing={20} speed={1} style={styles.marquee}>
      <View style={styles.marqueeDataContainer}>
        {marqueeItems.map((item) => (
          <View style={styles.marqueeData} key={item.currency}>
            <Text style={styles.currency}>{item.currency}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <Text
              style={[
                styles.change,
                { color: item.isUp ? colors.green[500] : colors.red[500] },
              ]}
            >
              {item.change}
            </Text>
          </View>
        ))}
      </View>
    </Marquee>
  );
}

const styles = StyleSheet.create({
  marquee: {
    paddingVertical: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral.borderColor,
  },
  marqueeDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 26,
  },

  marqueeData: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.space8,
  },

  currency: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size11,
    letterSpacing: letterSpacing.trackingPos5,
    color: colors.neutral[200],
    textTransform: "uppercase",
  },

  price: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: letterSpacing.trackingPos5,
    color: colors.neutral[50],
  },

  change: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: letterSpacing.trackingPos5,
    color: colors.lime[500],
  },
});
