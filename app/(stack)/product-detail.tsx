import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetail() {
  const { name, price, rating, icon, id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(id as string);

  const handleAddToCart = () => {
    addToCart({
      id: id as string,
      name: name as string,
      price: Number(price),
      icon: icon as string,
    });
    Alert.alert("Success", `${name} added to cart!`, [
      { text: "Continue Shopping", style: "cancel" },
      { text: "View Cart", onPress: () => router.push("/(tabs)/cart") },
    ]);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(id as string);
    } else {
      addToWishlist({
        id: id as string,
        name: name as string,
        price: Number(price),
        rating: Number(rating),
        icon: icon as string,
      });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
        <Text style={styles.productIcon}>{icon}</Text>
      </View>

      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.rating, { color: colors.subtext }]}>⭐ {rating}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>${price}</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
        <Text style={[styles.description, { color: colors.subtext }]}>
          This is a premium quality product with excellent features and
          durability. Perfect for everyday use and comes with a 1 year warranty.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.wishlistBtn,
              {
                borderColor: inWishlist ? colors.error : colors.primary,
                backgroundColor: inWishlist ? "#FFF0F0" : "transparent",
              },
            ]}
            onPress={handleWishlist}
          >
            <Text style={[styles.wishlistText, { color: inWishlist ? colors.error : colors.primary }]}>
              {inWishlist ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
          >
            <Text style={styles.cartText}>🛒 Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { alignItems: "center", paddingVertical: 40 },
  productIcon: { fontSize: 100 },
  details: { padding: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  rating: { fontSize: 16, marginBottom: 8 },
  price: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  buttons: { flexDirection: "row", gap: 12 },
  wishlistBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1 },
  wishlistText: { fontWeight: "bold" },
  cartBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  cartText: { color: "#fff", fontWeight: "bold" },
});