import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

const categories = [
  { id: "1", name: "Electronics", icon: "📱" },
  { id: "2", name: "Fashion", icon: "👗" },
  { id: "3", name: "Home", icon: "🏠" },
  { id: "4", name: "Sports", icon: "⚽" },
  { id: "5", name: "Books", icon: "📚" },
  { id: "6", name: "Beauty", icon: "💄" },
];

const products = [
  { id: "1", name: "iPhone 15 Pro", price: 999, rating: 4.8, icon: "📱" },
  { id: "2", name: "Nike Air Max", price: 129, rating: 4.5, icon: "👟" },
  { id: "3", name: "MacBook Pro", price: 1999, rating: 4.9, icon: "💻" },
  { id: "4", name: "Sony Headphones", price: 299, rating: 4.7, icon: "🎧" },
];

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.name}>Find your product</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => router.push("/(stack)/search")}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search products...</Text>
      </TouchableOpacity>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🛍️ Big Sale!</Text>
        <Text style={styles.bannerSubtext}>Up to 50% off on electronics</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Featured Products */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
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
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productRating}>⭐ {item.rating}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: Colors.light.subtext },
  name: { fontSize: 22, fontWeight: "bold", color: Colors.light.text },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchPlaceholder: { fontSize: 16, color: Colors.light.subtext },
  banner: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  bannerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  bannerSubtext: { fontSize: 14, color: "#fff", opacity: 0.9, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesList: { paddingHorizontal: 20, marginBottom: 24 },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: Colors.light.card,
    padding: 12,
    borderRadius: 12,
    width: 80,
  },
  categoryIcon: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 11, color: Colors.light.text, textAlign: "center" },
  productsList: { paddingHorizontal: 20, marginBottom: 24 },
  productCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  productIcon: { fontSize: 48, marginBottom: 8 },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productRating: { fontSize: 12, color: Colors.light.subtext },
});