import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  spacing,
} from "@/styles/tokens";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const logoIcon = require("@/assets/images/convert/logo-icon.svg");

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Image
          source={logoIcon}
          accessibilityLabel="logo"
          priority="high"
          style={styles.logoIcon}
        />
        <Text style={styles.logoText}>fx_checker</Text>
      </View>
      <Text style={styles.headerText}>55 CCY · ECB</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 6,
    borderBottomWidth: 1,
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.space10,
  },

  logoIcon: {
    width: 30,
    height: 30,
  },

  logoText: {
    fontFamily: fontFamily.extraBold,
    color: colors.neutral[50],
    fontSize: fontSizes.size15,
    letterSpacing: letterSpacing.trackingPos5,
    textTransform: "uppercase",
  },

  headerText: {
    fontFamily: fontFamily.bold,
    color: colors.neutral[350],
    fontSize: fontSizes.size10,
    letterSpacing: letterSpacing.tracking1,
    textTransform: "uppercase",
  },
});
