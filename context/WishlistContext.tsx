import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore
      }
    };

    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    };

    save();
  }, [items]);

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