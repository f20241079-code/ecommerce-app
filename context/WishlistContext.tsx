import {
    fetchWishlistItems,
    getCurrentUserId,
    syncWishlistItems,
} from "@/lib/supabaseHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  icon: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = "wishlist-items-v1";

const mergeWishlistItems = (localItems: WishlistItem[], remoteItems: WishlistItem[]) => {
  const merged = new Map<string, WishlistItem>();
  localItems.forEach((item) => merged.set(item.id, { ...item }));
  remoteItems.forEach((item) => {
    if (!merged.has(item.id)) {
      merged.set(item.id, { ...item });
    }
  });
  return Array.from(merged.values());
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      let localItems: WishlistItem[] = [];
      try {
        const raw = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (raw) localItems = JSON.parse(raw);
      } catch {
        // ignore
      }

      const userId = await getCurrentUserId();
      if (userId) {
        const remoteItems = await fetchWishlistItems(userId);
        if (remoteItems) {
          const merged = mergeWishlistItems(localItems, remoteItems);
          if (active) {
            setItems(merged);
            await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(merged));
            await syncWishlistItems(userId, merged);
          }
          setReady(true);
          return;
        }
      }

      if (active) {
        setItems(localItems);
        setReady(true);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const saveAndSync = async () => {
      try {
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }

      const userId = await getCurrentUserId();
      if (!userId) return;
      await syncWishlistItems(userId, items);
    };

    saveAndSync();
  }, [items, ready]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const count = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, addToWishlist, removeFromWishlist, isInWishlist, count }),
    [items, addToWishlist, removeFromWishlist, isInWishlist, count]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}