import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

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
];

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search 🔍</Text>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or categories..."
          placeholderTextColor={Colors.light.subtext}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Search for products or categories</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={styles.emptyText}>No products found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
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
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productRating}>⭐ {item.rating}</Text>
              </View>
              <Text style={styles.productPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.card, marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.light.border },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: Colors.light.text },
  clearBtn: { fontSize: 16, color: Colors.light.subtext, padding: 4 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 16, color: Colors.light.subtext, textAlign: "center" },
  list: { paddingHorizontal: 20 },
  productCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.light.border },
  productIcon: { fontSize: 40, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold", color: Colors.light.text, marginBottom: 4 },
  productCategory: { fontSize: 12, color: Colors.light.subtext, marginBottom: 4 },
  productRating: { fontSize: 12, color: Colors.light.subtext },
  productPrice: { fontSize: 16, fontWeight: "bold", color: Colors.light.primary },
});