import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { colors, fontFamily, fontSizes, lineHeight } from "@/styles/tokens";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral[900],
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 30,
          height: 70 + insets.bottom,
          borderTopWidth: 2,
          borderColor: "#1f1f22",
        },
        tabBarInactiveTintColor: colors.neutral[350],
        tabBarActiveTintColor: colors.lime[500],
        tabBarLabelStyle: {
          fontFamily: fontFamily.bold,
          textAlign: "center",
          fontSize: fontSizes.size10,
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Convert",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="exchange" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="git-compare-sharp" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: "Markets",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart-sharp" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="faves"
        options={{
          title: "Faves",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome
              name={focused ? "star" : "star-o"}
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="history" color={color} size={22} />
          ),
        }}
      />
      pp
    </Tabs>
  );
}

const styles = StyleSheet.create({});
