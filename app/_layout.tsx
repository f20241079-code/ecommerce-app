import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { registerForPushNotifications } from "@/lib/notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // Ignore splash-screen errors on web/native.
      }

      try {
        await registerForPushNotifications();
      } catch {
        // Ignore notification registration failures during startup.
      }
    };

    initializeApp();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(stack)" />
          </Stack>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}