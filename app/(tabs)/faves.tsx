import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "@/styles/tokens";
import { useFaveStore } from "@/store/useFaves";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrencyName, getFlag } from "@/utils/flags";

export default function FavouriteScreen() {
  const faves = useFaveStore((state) => state.faves);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>favourites</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{faves.length}</Text>
        </View>
      </View>

      <FlatList
        data={faves}
        renderItem={({ item }) => {
          const currencyPair = item.currencyPair.split("/");
          const [baseCurrency, quoteCurrency] = currencyPair.map((currency) =>
            getCurrencyName(currency.slice(0, 2)),
          );

          const isCurrencyPairChangePositive = item.currencyChange > 0;

          return (
            <View style={styles.favePairContainer}>
              <View style={styles.firstSection}>
                <FontAwesome name="star" size={16} color={colors.lime[500]} />

                <View>
                  <Text style={styles.currencyPair}>{item.currencyPair}</Text>
                  <Text style={styles.currencyPairNames}>
                    {baseCurrency} → {quoteCurrency}
                  </Text>
                </View>
              </View>
              <View style={styles.secondSection}>
                <Text style={styles.currencyPairRate}>{item.currencyRate}</Text>
                <Text
                  style={[
                    styles.currencyPairRateChange,
                    !isCurrencyPairChangePositive && { color: colors.red[500] },
                  ]}
                >
                  {item.currencyChange > 0
                    ? `▲ +${item.currencyChange.toFixed(2)}`
                    : `▼ ${item.currencyChange.toFixed(2)}`}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.currencyRate.toString()}
        ListEmptyComponent={<View>There are no available favourite pairs</View>}
        contentContainerStyle={styles.faveList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },

  header: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
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

  headerBadge: {
    height: 22,
    width: 22,
    paddingHorizontal: 7.7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: colors.lime[800],
  },
  headerBadgeText: {
    color: colors.lime[500],
    fontSize: 11,
    fontFamily: fontFamily.bold,
  },
  faveList: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  firstSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  favePairContainer: {
    padding: 14,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#2a2a2e",
    backgroundColor: "#171719",
    borderRadius: 14,
    justifyContent: "space-between",
  },
  currencyPair: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  currencyPairNames: {
    color: colors.neutral[450],
    fontFamily: fontFamily.regular,
    fontSize: 10.5,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  secondSection: {
    alignItems: "flex-end",
  },

  currencyPairRate: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  currencyPairRateChange: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: 11,
    textTransform: "uppercase",
  },
});
