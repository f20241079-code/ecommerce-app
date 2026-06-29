import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function StackLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="product-detail" options={{ title: "Product Detail" }} />
      <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="order-history" options={{ title: "Order History" }} />
      <Stack.Screen name="addresses" options={{ title: "Addresses" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="category" options={{ title: "Category" }} />
    </Stack>
  );
}