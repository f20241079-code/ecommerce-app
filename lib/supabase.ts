import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl =
  (Constants?.expoConfig?.extra?.SUPABASE_URL as string) ||
  process.env.SUPABASE_URL ||
  "";
const supabaseAnonKey =
  (Constants?.expoConfig?.extra?.SUPABASE_ANON_KEY as string) ||
  process.env.SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw — warn so development can continue while signaling misconfiguration
  // Use app config or environment variables (EAS secrets / app.config.js recommended)
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase URL or ANON key is not set. Provide via app config (expo.extra) or env vars."
  );
}

const isServer = typeof window === "undefined";

const createStorageAdapter = () => {
  // Web: use localStorage if available
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    return {
      getItem: async (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch {
          /* ignore */
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          /* ignore */
        }
      },
    };
  }

  // Native (Expo): use SecureStore when running on a device/simulator
  if (!isServer && Platform.OS !== "web") {
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }

  // Fallback (SSR or unknown): in-memory Map
  const memoryStorage = new Map<string, string>();
  return {
    getItem: async (key: string) => memoryStorage.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      memoryStorage.set(key, value);
    },
    removeItem: async (key: string) => {
      memoryStorage.delete(key);
    },
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});