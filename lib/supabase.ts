import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl = "https://lgdjadfaigbhqvwcnrxm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZGphZGZhaWdiaHF2d2NucnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjU5NDMsImV4cCI6MjA5ODI0MTk0M30.wXEqnKE1q-FcUsAY0aWB32kOT3FvWsxnHlfW0mK1ns4";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

const ExpoSecureStoreAdapter = Platform.OS === "web"
    ? {
        getItem: (key: string) => { if (typeof window === "undefined") return Promise.resolve(null); return Promise.resolve(window.localStorage?.getItem(key) ?? null); },
        setItem: (key: string, value: string) => { if (typeof window === "undefined") return Promise.resolve(); window.localStorage?.setItem(key, value); return Promise.resolve(); },
        removeItem: (key: string) => { if (typeof window === "undefined") return Promise.resolve(); window.localStorage?.removeItem(key); return Promise.resolve(); },
      }
    : {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: Platform.OS !== "web",
    detectSessionInUrl: false,
  },
});