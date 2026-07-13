import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const categories = [
  { id: "1", name: "Electronics", icon: "📱" },
  { id: "2", name: "Fashion", icon: "👗" },
  { id: "3", name: "Sports", icon: "⚽" },
  { id: "4", name: "Books", icon: "📚" },
  { id: "5", name: "Beauty", icon: "💄" },
  { id: "6", name: "Gaming", icon: "🎮" },
  { id: "7", name: "Travel", icon: "🧳" },
  { id: "8", name: "Office", icon: "💼" },
];

const products = [
  { id: "1", name: "iPhone 15 Pro", price: 999, rating: 4.8, icon: "📱" },
  { id: "2", name: "Nike Air Max", price: 129, rating: 4.5, icon: "👟" },
  { id: "3", name: "MacBook Pro", price: 1999, rating: 4.9, icon: "💻" },
  { id: "4", name: "Sony Headphones", price: 299, rating: 4.7, icon: "🎧" },
];

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.greeting, { color: colors.subtext }]}>Good Morning 👋</Text>
          <Text style={[styles.name, { color: colors.text }]}>Find your perfect pick</Text>
        </View>
        <TouchableOpacity style={[styles.notifButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push("/(stack)/search")}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={[styles.searchPlaceholder, { color: colors.subtext }]}>Search products...</Text>
      </TouchableOpacity>

      <View style={[styles.banner, { backgroundColor: colors.primary }]}> 
        <Text style={styles.bannerText}>🛍️ Big Sale</Text>
        <Text style={styles.bannerSubtext}>Up to 50% off on curated essentials</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: "/(stack)/category",
                params: { name: item.name },
              })
            }
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
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
            <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price}</Text>
            <Text style={[styles.productRating, { color: colors.subtext }]}>⭐ {item.rating}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 20 },
  headerTextWrap: { flex: 1, paddingRight: 12 },
  greeting: { fontSize: 13, marginBottom: 2 },
  name: { fontSize: 22, fontWeight: "bold" },
  notifButton: { width: 46, height: 46, borderRadius: 23, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  notifIcon: { fontSize: 22 },
  searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, borderWidth: 1 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchPlaceholder: { fontSize: 16 },
  banner: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  bannerText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  bannerSubtext: { fontSize: 14, color: "#fff", opacity: 0.95, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 12 },
  categoriesList: { paddingHorizontal: 20, marginBottom: 24 },
  categoryItem: { alignItems: "center", marginRight: 16, padding: 14, borderRadius: 16, width: 88, borderWidth: 1 },
  categoryIcon: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 11, textAlign: "center", fontWeight: "600" },
  productsList: { paddingHorizontal: 20, marginBottom: 24 },
  productCard: { borderRadius: 18, padding: 16, marginRight: 16, width: 166, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  productIcon: { fontSize: 44, marginBottom: 8 },
  productName: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productRating: { fontSize: 12 },
});