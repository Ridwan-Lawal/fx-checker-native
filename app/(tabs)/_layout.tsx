import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Convert" }} />
      <Tabs.Screen name="compare" options={{ title: "Compare" }} />
      <Tabs.Screen name="markets" options={{ title: "Markets" }} />
      <Tabs.Screen name="faves" options={{ title: "Favourites" }} />
      <Tabs.Screen name="log" options={{ title: "History" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
