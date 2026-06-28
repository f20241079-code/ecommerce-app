import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { name, price, rating, icon, id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.productIcon}>{icon}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>⭐ {rating}</Text>
        <Text style={styles.price}>${price}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          This is a premium quality product with excellent features and
          durability. Perfect for everyday use and comes with a 1 year warranty.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.wishlistBtn}>
            <Text style={styles.wishlistText}>❤️ Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartText}>🛒 Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  imageContainer: {
    backgroundColor: Colors.light.card,
    alignItems: "center",
    paddingVertical: 40,
  },
  productIcon: { fontSize: 100 },
  details: { padding: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, marginBottom: 8 },
  rating: { fontSize: 16, color: Colors.light.subtext, marginBottom: 8 },
  price: { fontSize: 28, fontWeight: "bold", color: Colors.light.primary, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.light.text, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.light.subtext, lineHeight: 22, marginBottom: 24 },
  buttons: { flexDirection: "row", gap: 12 },
  wishlistBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  wishlistText: { color: Colors.light.primary, fontWeight: "bold" },
  cartBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.light.primary,
  },
  cartText: { color: "#fff", fontWeight: "bold" },
});