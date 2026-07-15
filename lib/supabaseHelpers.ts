import { hasSupabaseConfig, supabase } from '@/lib/supabase';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
};

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  icon: string;
};

export type AddressRecord = {
  id: string;
  label: string;
  address: string;
  city: string;
  default?: boolean;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
};

export type OrderRecord = {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  delivery_address?: string;
  created_at: string;
};

const safeGetUserId = async (): Promise<string | null> => {
  if (!hasSupabaseConfig) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
};

export const getCurrentUserId = safeGetUserId;

export const fetchCartItems = async (userId: string): Promise<CartItem[] | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('cart_items')
    .select('product_id,name,price,quantity,icon')
    .eq('user_id', userId);

  if (error || !data) return null;

  return data.map((row: any) => ({
    id: row.product_id,
    name: row.name,
    price: row.price,
    quantity: row.quantity,
    icon: row.icon,
  }));
};

export const syncCartItems = async (userId: string, items: CartItem[]): Promise<boolean> => {
  if (!hasSupabaseConfig) return false;

  const rows = items.map((item) => ({
    user_id: userId,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    icon: item.icon,
  }));

  const { error } = await supabase.from('cart_items').upsert(rows, {
    onConflict: 'user_id,product_id',
  });

  return !error;
};

export const fetchWishlistItems = async (userId: string): Promise<WishlistItem[] | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product_id,name,price,rating,icon')
    .eq('user_id', userId);

  if (error || !data) return null;

  return data.map((row: any) => ({
    id: row.product_id,
    name: row.name,
    price: row.price,
    rating: row.rating,
    icon: row.icon,
  }));
};

export const syncWishlistItems = async (userId: string, items: WishlistItem[]): Promise<boolean> => {
  if (!hasSupabaseConfig) return false;

  const rows = items.map((item) => ({
    user_id: userId,
    product_id: item.id,
    name: item.name,
    price: item.price,
    rating: item.rating,
    icon: item.icon,
  }));

  const { error } = await supabase.from('wishlist_items').upsert(rows, {
    onConflict: 'user_id,product_id',
  });

  return !error;
};

export const fetchAddresses = async (userId: string): Promise<AddressRecord[] | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('addresses')
    .select('id,label,address,city,default')
    .eq('user_id', userId)
    .order('default', { ascending: false });

  if (error || !data) return null;

  return data as AddressRecord[];
};

export const addAddress = async (
  userId: string,
  address: Omit<AddressRecord, 'id'>
): Promise<AddressRecord | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('addresses')
    .insert([{ user_id: userId, ...address }])
    .select('id,label,address,city,default')
    .single();

  if (error || !data) return null;

  return data as AddressRecord;
};

export const updateAddress = async (
  userId: string,
  id: string,
  address: Omit<AddressRecord, 'id'>
): Promise<AddressRecord | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('addresses')
    .update({ label: address.label, address: address.address, city: address.city, default: address.default ?? false })
    .eq('user_id', userId)
    .eq('id', id)
    .select('id,label,address,city,default')
    .single();

  if (error || !data) return null;

  return data as AddressRecord;
};

export const deleteAddress = async (userId: string, id: string): Promise<boolean> => {
  if (!hasSupabaseConfig) return false;

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  return !error;
};

export const fetchOrders = async (userId: string): Promise<OrderRecord[] | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('id,status,total,items,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return null;

  return data as OrderRecord[];
};

export const createOrder = async (
  userId: string,
  order: Omit<OrderRecord, 'id' | 'created_at'>
): Promise<string | null> => {
  if (!hasSupabaseConfig) return null;

  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: userId, ...order }])
    .select('id')
    .single();

  if (error || !data) return null;

  return data.id;
};
