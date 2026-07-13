import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl = "https://lgdjadfaigbhqvwcnrxm.supabase.co";
const supabaseAnonKey = "sb_publishable_kjSiiSIMQ7Osa9UdDpWMNg_sOxeB5Z3";

const isServer = typeof window === "undefined";

const createStorageAdapter = () => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    return {
      getItem: async (key: string) => window.localStorage.getItem(key),
      setItem: async (key: string, value: string) => {
        window.localStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        window.localStorage.removeItem(key);
      },
    };
  }

  if (Platform.OS === "web" || isServer) {
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
  }

  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
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