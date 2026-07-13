import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const allProducts = [
  { id: "1", name: "iPhone 15 Pro", price: 999, rating: 4.8, icon: "📱", category: "Electronics" },
  { id: "2", name: "Nike Air Max", price: 129, rating: 4.5, icon: "👟", category: "Fashion" },
  { id: "3", name: "MacBook Pro", price: 1999, rating: 4.9, icon: "💻", category: "Electronics" },
  { id: "4", name: "Sony Headphones", price: 299, rating: 4.7, icon: "🎧", category: "Electronics" },
  { id: "5", name: "Samsung TV", price: 799, rating: 4.6, icon: "📺", category: "Electronics" },
  { id: "6", name: "Adidas Shoes", price: 99, rating: 4.3, icon: "👟", category: "Fashion" },
  { id: "7", name: "Coffee Maker", price: 49, rating: 4.2, icon: "☕", category: "Home" },
  { id: "8", name: "Yoga Mat", price: 29, rating: 4.4, icon: "🧘", category: "Sports" },
  { id: "9", name: "Novel Book", price: 15, rating: 4.6, icon: "📖", category: "Books" },
  { id: "10", name: "Lipstick Set", price: 35, rating: 4.5, icon: "💄", category: "Beauty" },
  { id: "11", name: "iPad Pro", price: 799, rating: 4.8, icon: "📱", category: "Electronics" },
  { id: "12", name: "Denim Jacket", price: 79, rating: 4.3, icon: "👕", category: "Fashion" },
  { id: "13", name: "Nintendo Switch OLED", price: 349, rating: 4.8, icon: "🎮", category: "Gaming" },
  { id: "14", name: "Gaming Headset", price: 89, rating: 4.6, icon: "🎧", category: "Gaming" },
  { id: "15", name: "Carry-On Luggage", price: 129, rating: 4.5, icon: "🧳", category: "Travel" },
  { id: "16", name: "Travel Pillow", price: 27, rating: 4.4, icon: "🛏️", category: "Travel" },
  { id: "17", name: "Ergonomic Mouse", price: 59, rating: 4.6, icon: "🖱️", category: "Office" },
  { id: "18", name: "Standing Desk", price: 249, rating: 4.7, icon: "🖥️", category: "Office" },
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

  const filtered = allProducts.filter((p) => p.category === name);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Text style={[styles.sortBtnText, { color: colors.text }]}>Sort 🔽</Text>
        </TouchableOpacity>
      </View>

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
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={[styles.count, { color: colors.subtext }]}>
        {sorted.length} products found
      </Text>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: "/(stack)/product-detail",
                params: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  rating: item.rating,
                  icon: item.icon,
                },
              })
            }
          >
            <TouchableOpacity
              style={styles.wishlistIcon}
              onPress={() =>
                isInWishlist(item.id)
                  ? removeFromWishlist(item.id)
                  : addToWishlist(item)
              }
            >
              <Text style={{ fontSize: 20 }}>
                {isInWishlist(item.id) ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.productIcon}>{item.icon}</Text>
            <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.productRating, { color: colors.subtext }]}>⭐ {item.rating}</Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price}</Text>
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
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold" },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  sortBtnText: { fontSize: 14, fontWeight: "bold" },
  sortMenu: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  sortOption: { padding: 14, borderBottomWidth: 1 },
  sortOptionText: { fontSize: 14 },
  count: { paddingHorizontal: 20, marginBottom: 12, fontSize: 13 },
  list: { paddingHorizontal: 12 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48%", borderRadius: 16, padding: 12, borderWidth: 1 },
  wishlistIcon: { alignSelf: "flex-end" },
  productIcon: { fontSize: 48, textAlign: "center", marginVertical: 8 },
  productName: { fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  productRating: { fontSize: 11, marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: "bold", marginBottom: 8 },
  addBtn: { padding: 8, borderRadius: 8, alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});