import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
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
  { id: "11", name: "Nintendo Switch", price: 349, rating: 4.7, icon: "🎮", category: "Gaming" },
  { id: "12", name: "Leather Backpack", price: 89, rating: 4.4, icon: "🎒", category: "Travel" },
  { id: "13", name: "Desk Lamp", price: 39, rating: 4.3, icon: "💡", category: "Home" },
  { id: "14", name: "Running Watch", price: 159, rating: 4.6, icon: "⌚", category: "Sports" },
  { id: "15", name: "Bestseller Novel", price: 18, rating: 4.8, icon: "📚", category: "Books" },
  { id: "16", name: "Face Serum", price: 45, rating: 4.5, icon: "🧴", category: "Beauty" },
  { id: "17", name: "Wireless Mouse", price: 29, rating: 4.2, icon: "🖱️", category: "Electronics" },
  { id: "18", name: "Minimalist Chair", price: 129, rating: 4.4, icon: "🪑", category: "Home" },
  { id: "19", name: "Winter Jacket", price: 119, rating: 4.6, icon: "🧥", category: "Fashion" },
  { id: "20", name: "Travel Mug", price: 24, rating: 4.3, icon: "☕", category: "Travel" },
  { id: "21", name: "Mechanical Keyboard", price: 89, rating: 4.7, icon: "⌨️", category: "Electronics" },
  { id: "22", name: "Office Chair", price: 149, rating: 4.5, icon: "💼", category: "Office" },
  { id: "23", name: "Skincare Kit", price: 55, rating: 4.6, icon: "🧼", category: "Beauty" },
  { id: "24", name: "Yoga Block Set", price: 34, rating: 4.4, icon: "🧘", category: "Sports" },
  { id: "25", name: "Nintendo Switch OLED", price: 349, rating: 4.8, icon: "🎮", category: "Gaming" },
  { id: "26", name: "Gaming Headset", price: 89, rating: 4.6, icon: "🎧", category: "Gaming" },
  { id: "27", name: "Carry-On Luggage", price: 129, rating: 4.5, icon: "🧳", category: "Travel" },
  { id: "28", name: "Travel Pillow", price: 27, rating: 4.4, icon: "🛏️", category: "Travel" },
  { id: "29", name: "Ergonomic Mouse", price: 59, rating: 4.6, icon: "🖱️", category: "Office" },
  { id: "30", name: "Standing Desk", price: 249, rating: 4.7, icon: "🖥️", category: "Office" },
];

const quickTags = ["Electronics", "Fashion", "Home", "Books", "Sports", "Beauty", "Gaming", "Travel", "Office"];

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { colors } = useTheme();

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Search 🔍</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products or categories..."
          placeholderTextColor={colors.subtext}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={[styles.clearBtn, { color: colors.subtext }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tagRow}>
        {quickTags.map((tag) => {
          const isActive = query.toLowerCase() === tag.toLowerCase();
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tagButton, { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border }]}
              onPress={() => setQuery(tag)}
            >
              <Text style={[styles.tagText, { color: isActive ? colors.white : colors.text }]}>{tag}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>Search for products or categories</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>No products found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
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
              <Text style={styles.productIcon}>{item.icon}</Text>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.productCategory, { color: colors.subtext }]}>{item.category}</Text>
                <Text style={[styles.productRating, { color: colors.subtext }]}>⭐ {item.rating}</Text>
              </View>
              <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  backButton: { marginRight: 10, padding: 6 },
  backButtonText: { fontSize: 22, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 20, marginBottom: 16 },
  tagButton: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  tagText: { fontSize: 13, fontWeight: "600" },
  clearBtn: { fontSize: 16, padding: 4 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 16, textAlign: "center" },
  list: { paddingHorizontal: 20 },
  productCard: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  productIcon: { fontSize: 40, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productCategory: { fontSize: 12, marginBottom: 4 },
  productRating: { fontSize: 12 },
  productPrice: { fontSize: 16, fontWeight: "bold" },
});