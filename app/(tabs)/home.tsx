import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.subtext }]}>Good Morning 👋</Text>
          <Text style={[styles.name, { color: colors.text }]}>Find your product</Text>
        </View>
        <TouchableOpacity style={[styles.notifButton, { backgroundColor: colors.card }]}>
          <Text style={{ fontSize: 24 }}>🔔</Text>
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
        <Text style={styles.bannerText}>🛍️ Big Sale!</Text>
        <Text style={styles.bannerSubtext}>Up to 50% off on electronics</Text>
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
            style={[styles.categoryItem, { backgroundColor: colors.card }]}
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
  greeting: { fontSize: 14 },
  name: { fontSize: 22, fontWeight: "bold" },
  notifButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, borderWidth: 1 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchPlaceholder: { fontSize: 16 },
  banner: { marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 24 },
  bannerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  bannerSubtext: { fontSize: 14, color: "#fff", opacity: 0.9, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 12 },
  categoriesList: { paddingHorizontal: 20, marginBottom: 24 },
  categoryItem: { alignItems: "center", marginRight: 16, padding: 12, borderRadius: 12, width: 80 },
  categoryIcon: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 11, textAlign: "center" },
  productsList: { paddingHorizontal: 20, marginBottom: 24 },
  productCard: { borderRadius: 16, padding: 16, marginRight: 16, width: 160, borderWidth: 1 },
  productIcon: { fontSize: 48, marginBottom: 8 },
  productName: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productRating: { fontSize: 12 },
});