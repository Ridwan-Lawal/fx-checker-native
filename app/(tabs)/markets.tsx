import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "@/styles/tokens";
import { Image } from "expo-image";
import { getFlag } from "@/utils/flags";

const positiveChart = require("@/assets/charts/positive-chart.svg");
const negativeChart = require("@/assets/charts/negative-charts.svg");

export default function MarketScreen() {
  // fetch the rates using Promise.all()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>markets</Text>
        <Text style={styles.headerSubText}>LIVE · ECB DATA</Text>
      </View>

      <View style={styles.currencyPairsList}>
        <View style={styles.currencyPairContainer}>
          <View style={styles.firstFlexItem}>
            <View style={styles.flags}>
              <Image
                source={getFlag("USD".slice(0, 2))}
                style={styles.flagImage}
                priority="high"
              />
              <Image
                source={getFlag("USD".slice(0, 2))}
                style={[styles.flagImage, styles.secondFlagImage]}
                priority="high"
              />
            </View>
            <Text style={styles.currencyPairTitle}>USD/GBP</Text>
          </View>

          {/*second flex item*/}
          <Image source={positiveChart} style={styles.currencyPairChart} />

          <View style={styles.thirdFlexItem}>
            <Text style={styles.currencyPairRate}>1.1723</Text>
            <Text style={styles.rateChange}>▲ +0.18%</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f22",
    backdropFilter: "",
  },
  headerText: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerSubText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  currencyPairsList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

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
