import { colors, fontFamily, fontSizes, spacing } from "@/styles/tokens";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface CurrencyAmountKeypadProps {
  ref: React.RefObject<BottomSheetModal | null>;
  onCloseCurrencyAmountKeypad: () => void;
  value: number;
  onChange: (value: number) => void;
  currencyCode?: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"];
const MAX_DECIMALS = 2;

export default function CurrencyAmountKeypad({
  ref,
  onCloseCurrencyAmountKeypad,
  value,
  onChange,
  currencyCode,
}: CurrencyAmountKeypadProps) {
  const [buffer, setBuffer] = useState("");

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

  const commit = (next: string) => {
    setBuffer(next);
    onChange(Number(next) || 0);
  };

  const onPressKey = (key: string) => {
    if (key === "delete") return commit(buffer.slice(0, -1));

    if (key === ".") {
      if (buffer.includes(".")) return;
      return commit(buffer === "" ? "0." : buffer + ".");
    }

    // digit
    const [, decimals = ""] = buffer.split(".");
    if (buffer.includes(".") && decimals.length >= MAX_DECIMALS) return;
    if (buffer === "0") return commit(key);
    commit(buffer + key);
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
      onChange={(index) => {
        if (index >= 0) setBuffer(value ? String(value) : "");
      }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{currencyCode ?? "amount"}</Text>
          <Pressable onPress={onCloseCurrencyAmountKeypad}>
            <Text style={styles.doneText}>done</Text>
          </Pressable>
        </View>

        <Text style={styles.value}>{buffer === "" ? "0" : buffer}</Text>

        <FlatList
          data={KEYS}
          numColumns={3}
          keyExtractor={(item) => item}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable style={styles.key} onPress={() => onPressKey(item)}>
              {item === "delete" ? (
                <Ionicons name="backspace-outline" size={22} color="#f2f2f3" />
              ) : (
                <Text style={styles.keyText}>{item}</Text>
              )}
            </Pressable>
          )}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 30,
    paddingHorizontal: 18,
    gap: spacing.space4,
    backgroundColor: "#1a1a1c",
    borderRadius: 30,
  },
  header: {
    flexDirection: "row",
    paddingTop: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: colors.neutral[450],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  doneText: {
    color: colors.lime[500],
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size12,
    textTransform: "uppercase",
  },
  value: {
    color: colors.neutral[70],
    fontFamily: fontFamily.bold,
    fontSize: 34,
    marginBottom: 12,
  },
  key: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2e2e32",
    backgroundColor: "#202022",
  },
  keyText: {
    color: "#f2f2f3",
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size20,
  },
});
