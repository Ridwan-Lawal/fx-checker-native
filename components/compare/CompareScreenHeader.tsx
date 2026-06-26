import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors, fontFamily, letterSpacing } from "@/styles/tokens";

export default function CompareScreenHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerLeftText}>compare</Text>
      <Text style={styles.headerRightText}>1 BASE · 6 TARGETS </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    alignItems: "center",
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderColor,
    justifyContent: "space-between",
  },

  headerLeftText: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: letterSpacing.trackingPos5,
    textTransform: "uppercase",
  },

  headerRightText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
