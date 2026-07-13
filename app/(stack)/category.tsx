import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const allProducts = [
  { id: "1", name: "iPhone 15 Pro", price: 999, originalPrice: 1199, rating: 4.8, reviews: 2341, icon: "📱", category: "Electronics", badge: "Best Seller" },
  { id: "2", name: "Nike Air Max 270", price: 129, originalPrice: 180, rating: 4.5, reviews: 1876, icon: "👟", category: "Fashion", badge: "Popular" },
  { id: "3", name: "MacBook Pro 16\"", price: 1999, originalPrice: 2499, rating: 4.9, reviews: 987, icon: "💻", category: "Electronics", badge: "Top Rated" },
  { id: "4", name: "Sony WH-1000XM5", price: 299, originalPrice: 399, rating: 4.7, reviews: 3210, icon: "🎧", category: "Electronics", badge: "New" },
  { id: "5", name: "Samsung 65\" TV", price: 799, originalPrice: 1199, rating: 4.6, reviews: 654, icon: "📺", category: "Electronics", badge: "Sale" },
  { id: "6", name: "Adidas Ultraboost", price: 189, originalPrice: 220, rating: 4.4, reviews: 2103, icon: "👟", category: "Fashion", badge: "Popular" },
  { id: "7", name: "Nespresso Machine", price: 79, originalPrice: 99, rating: 4.3, reviews: 876, icon: "☕", category: "Home", badge: "Sale" },
  { id: "8", name: "Lululemon Yoga Mat", price: 88, originalPrice: 98, rating: 4.6, reviews: 1432, icon: "🧘", category: "Sports", badge: "Best Seller" },
  { id: "9", name: "Atomic Habits", price: 18, originalPrice: 25, rating: 4.9, reviews: 45231, icon: "📖", category: "Books", badge: "Best Seller" },
  { id: "10", name: "Charlotte Tilbury", price: 65, originalPrice: 75, rating: 4.7, reviews: 3421, icon: "💄", category: "Beauty", badge: "New" },
  { id: "11", name: "iPad Pro 12.9\"", price: 1099, originalPrice: 1199, rating: 4.8, reviews: 1654, icon: "📱", category: "Electronics", badge: "New" },
  { id: "12", name: "Levi's 501 Jeans", price: 69, originalPrice: 89, rating: 4.4, reviews: 8765, icon: "👖", category: "Fashion", badge: "Classic" },
  { id: "13", name: "Nintendo Switch", price: 349, originalPrice: 399, rating: 4.8, reviews: 5432, icon: "🎮", category: "Gaming", badge: "Popular" },
  { id: "14", name: "Gaming Headset", price: 89, originalPrice: 120, rating: 4.6, reviews: 2341, icon: "🎧", category: "Gaming", badge: "New" },
  { id: "15", name: "Carry-On Luggage", price: 129, originalPrice: 180, rating: 4.5, reviews: 1234, icon: "🧳", category: "Travel", badge: "Popular" },
  { id: "16", name: "Travel Pillow", price: 27, originalPrice: 35, rating: 4.4, reviews: 876, icon: "🛏️", category: "Travel", badge: "Sale" },
  { id: "17", name: "Ergonomic Mouse", price: 59, originalPrice: 79, rating: 4.6, reviews: 1543, icon: "🖱️", category: "Office", badge: "Popular" },
  { id: "18", name: "Standing Desk", price: 249, originalPrice: 349, rating: 4.7, reviews: 987, icon: "🖥️", category: "Office", badge: "Top Rated" },
  { id: "19", name: "AirPods Pro", price: 199, originalPrice: 249, rating: 4.8, reviews: 9876, icon: "🎧", category: "Electronics", badge: "Best Seller" },
  { id: "20", name: "Apple Watch S9", price: 399, originalPrice: 499, rating: 4.7, reviews: 4321, icon: "⌚", category: "Electronics", badge: "New" },
  { id: "21", name: "PS5 Controller", price: 69, originalPrice: 79, rating: 4.8, reviews: 6543, icon: "🎮", category: "Gaming", badge: "Popular" },
  { id: "22", name: "Kindle Paperwhite", price: 139, originalPrice: 179, rating: 4.7, reviews: 12345, icon: "📱", category: "Electronics", badge: "Best Seller" },
  { id: "23", name: "Zara Dress", price: 49, originalPrice: 69, rating: 4.3, reviews: 3456, icon: "👗", category: "Fashion", badge: "Sale" },
  { id: "24", name: "H&M Jacket", price: 39, originalPrice: 59, rating: 4.2, reviews: 2345, icon: "🧥", category: "Fashion", badge: "Sale" },
  { id: "25", name: "The Psychology of Money", price: 15, originalPrice: 20, rating: 4.8, reviews: 23456, icon: "📚", category: "Books", badge: "Best Seller" },
  { id: "26", name: "Deep Work", price: 14, originalPrice: 18, rating: 4.7, reviews: 15678, icon: "📖", category: "Books", badge: "Popular" },
  { id: "27", name: "MAC Lipstick", price: 19, originalPrice: 24, rating: 4.5, reviews: 5432, icon: "💋", category: "Beauty", badge: "Popular" },
  { id: "28", name: "Vitamin C Serum", price: 29, originalPrice: 39, rating: 4.6, reviews: 8765, icon: "🧴", category: "Beauty", badge: "New" },
  { id: "29", name: "Wilson Tennis Racket", price: 199, originalPrice: 249, rating: 4.6, reviews: 765, icon: "🎾", category: "Sports", badge: "Pro" },
  { id: "30", name: "Running Shoes", price: 119, originalPrice: 149, rating: 4.5, reviews: 3456, icon: "👟", category: "Sports", badge: "Popular" },
];

type SortOption = "default" | "price_asc" | "price_desc" | "rating";

export default function Category() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showSort, setShowSort] = useState(false);
  const { width } = useWindowDimensions();

  const filtered = allProducts.filter((p) => p.category === name);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Text style={styles.sortBtnText}>Sort 🔽</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Menu */}
      {showSort && (
        <View style={[styles.sortMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: "Default", value: "default" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
            { label: "Top Rated", value: "rating" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                { borderBottomColor: colors.border },
                sortBy === option.value && { backgroundColor: colors.primary + "20" },
              ]}
              onPress={() => {
                setSortBy(option.value as SortOption);
                setShowSort(false);
              }}
            >
              <Text style={[styles.sortOptionText, { color: sortBy === option.value ? colors.primary : colors.text }]}>
                {option.label}
              </Text>
              {sortBy === option.value && <Text style={{ color: colors.primary }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={[styles.count, { color: colors.subtext }]}>
          {sorted.length} products found
        </Text>
      </View>

      {/* Products Vertical Scroll Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {sorted.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { width: (width - 44) / 2 },
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/(stack)/product-detail",
                  params: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    rating: item.rating,
                    reviews: item.reviews,
                    icon: item.icon,
                    badge: item.badge,
                  },
                })
              }
            >
              {/* Wishlist */}
              <TouchableOpacity
                style={styles.wishlistBtn}
                onPress={() =>
                  isInWishlist(item.id)
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item)
                }
              >
                <Text style={{ fontSize: 18 }}>
                  {isInWishlist(item.id) ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>

              {/* Badge */}
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}

              {/* Product Icon */}
              <Text style={styles.productIcon}>{item.icon}</Text>

              {/* Product Info */}
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.originalPrice, { color: colors.subtext }]}>
                ${item.originalPrice}
              </Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>
                ${item.price}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={[styles.rating, { color: colors.subtext }]}>⭐ {item.rating}</Text>
                <Text style={[styles.discount, { color: "#43E97B" }]}>
                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                </Text>
              </View>

              {/* Add to Cart */}
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    icon: item.icon,
                  })
                }
              >
                <Text style={styles.addBtnText}>🛒 Add to Cart</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  backText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", flex: 1, textAlign: "center" },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  sortBtnText: { fontSize: 13, fontWeight: "bold", color: "#fff" },
  sortMenu: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, marginTop: 8, zIndex: 10 },
  sortOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 1 },
  sortOptionText: { fontSize: 14 },
  countRow: { paddingHorizontal: 20, paddingVertical: 10 },
  count: { fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  card: { borderRadius: 16, padding: 12, borderWidth: 1, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  wishlistBtn: { alignSelf: "flex-end", marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start", marginBottom: 6 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  productIcon: { fontSize: 44, textAlign: "center", marginVertical: 8 },
  productName: { fontSize: 13, fontWeight: "bold", marginBottom: 4, height: 36 },
  originalPrice: { fontSize: 11, textDecorationLine: "line-through", marginBottom: 2 },
  productPrice: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  ratingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  rating: { fontSize: 11 },
  discount: { fontSize: 11, fontWeight: "bold" },
  addBtn: { padding: 8, borderRadius: 10, alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});