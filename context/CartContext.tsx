import {
    fetchCartItems,
    getCurrentUserId,
    syncCartItems,
} from "@/lib/supabaseHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "cart-items-v1";

const mergeCartItems = (localItems: CartItem[], remoteItems: CartItem[]) => {
  const merged = new Map<string, CartItem>();
  localItems.forEach((item) => merged.set(item.id, { ...item }));
  remoteItems.forEach((item) => {
    const existing = merged.get(item.id);
    if (existing) {
      merged.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      merged.set(item.id, { ...item });
    }
  });
  return Array.from(merged.values());
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const load = async () => {
      let localItems: CartItem[] = [];
      try {
        const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (raw) localItems = JSON.parse(raw);
      } catch {
        // ignore load errors
      }

      const userId = await getCurrentUserId();
      if (userId) {
        const remoteItems = await fetchCartItems(userId);
        if (remoteItems) {
          const merged = mergeCartItems(localItems, remoteItems);
          if (isMounted.current) {
            setItems(merged);
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(merged));
            await syncCartItems(userId, merged);
          }
          setReady(true);
          return;
        }
      }

      if (isMounted.current) {
        setItems(localItems);
        setReady(true);
      }
    };

    load();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const saveAndSync = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore save failures
      }

      const userId = await getCurrentUserId();
      if (!userId) return;
      await syncCartItems(userId, items);
    };

    saveAndSync();
  }, [items, ready]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      total,
      count,
    }),
    [items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}