import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="product-detail"
        options={{ title: "Product Detail", headerShown: true }}
      />
    </Stack>
  );
}