import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Wishlist() {
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { items, removeFromWishlist } = useWishlist();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={[styles.emptyText, { color: colors.text }]}>Your wishlist is empty!</Text>
        <TouchableOpacity
          style={[styles.shopBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Wishlist ❤️</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.rating, { color: colors.subtext }]}>⭐ {item.rating}</Text>
              <Text style={[styles.price, { color: colors.primary }]}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
                onPress={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    icon: item.icon,
                  })
                }
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromWishlist(item.id)}
              >
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  shopBtn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 24, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
  card: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  icon: { fontSize: 40, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  rating: { fontSize: 12, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: "bold" },
  actions: { alignItems: "center", gap: 8 },
  addToCartBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addToCartText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  removeBtn: { padding: 4 },
  removeText: { fontSize: 20 },
});