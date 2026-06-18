import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text>404 | Page not found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
