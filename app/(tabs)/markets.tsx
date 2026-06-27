import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "@/styles/tokens";
import { Image } from "expo-image";
import { getFlag } from "@/utils/flags";
import { CURRENCY_PAIRS } from "@/utils/contants";
import CurrencyPairContainer from "@/components/markets/CurrencyPairContainer";

export default function MarketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>markets</Text>
        <Text style={styles.headerSubText}>LIVE · ECB DATA</Text>
      </View>

      <FlatList
        data={CURRENCY_PAIRS}
        renderItem={({ item }) => {
          return <CurrencyPairContainer currencyPair={item} />;
        }}
        keyExtractor={(item) => item}
        contentContainerStyle={{ gap: 10, ...styles.currencyPairsList }}
      />
      <View style={styles.currencyPairsList}></View>
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
});
