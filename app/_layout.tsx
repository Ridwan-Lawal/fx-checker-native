import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {useFonts} from 'expo-font';
import {JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold} from '@expo-google-fonts/jetbrains-mono'
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

const [fontsLoaded] = useFonts({
    JetBrainsMono_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  })

  useEffect(() => {
    if(fontsLoaded) {
      SplashScreen.hideAsync();
    }
  },[fontsLoaded])

  if(!fontsLoaded) {
    return null;
  }


  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
