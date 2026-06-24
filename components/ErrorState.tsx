import AnimatedPressable from "@/components/AnimatedPressable";
import {
  colors,
  fontFamily,
  fontSizes,
  letterSpacing,
  radius,
  spacing,
} from "@/styles/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ErrorStateProps {
  onRetry: () => void;
  title?: string;
  message?: string;
  isRetrying?: boolean;
}

export default function ErrorState({
  onRetry,
  title = "Something went wrong",
  message = "We couldn't fetch the latest rates. Check your connection and try again.",
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Ionicons
          name="cloud-offline-outline"
          size={30}
          color={colors.red[500]}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <AnimatedPressable
        style={styles.retryButton}
        onPress={onRetry}
        disabled={isRetrying}
      >
        <Ionicons name="refresh" size={15} color={colors.neutral[900]} />
        <Text style={styles.retryText}>
          {isRetrying ? "retrying…" : "try again"}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.space32,
    gap: spacing.space12,
  },

  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.radiusFull,
    backgroundColor: colors.neutral[700],
    borderWidth: 1,
    borderColor: colors.neutral.borderColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.space4,
  },

  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size16,
    color: colors.neutral[70],
    letterSpacing: letterSpacing.trackingPos5,
    textTransform: "uppercase",
    textAlign: "center",
  },

  message: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.size12,
    color: colors.neutral[350],
    lineHeight: 18,
    textAlign: "center",
  },

  retryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 9,
    marginTop: spacing.space12,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: radius.radius16,
    backgroundColor: colors.lime[500],
  },

  retryText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.size13,
    color: colors.neutral[900],
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
