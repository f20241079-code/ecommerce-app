import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const redirectToApp = async () => {
      if (hasRedirected.current) return;
      hasRedirected.current = true;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.warn("Session check failed:", error.message);
        router.replace("/(auth)/login");
        return;
      }

      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    };

    redirectToApp();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (hasRedirected.current) return;
      hasRedirected.current = true;

      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FF6B00" />
    </View>
  );
}