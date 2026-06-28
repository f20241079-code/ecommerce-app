import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";

const wishlistItems = [
  { id: "1", name: "MacBook Pro", price: 1999, rating: 4.9, icon: "💻" },
  { id: "2", name: "Sony Headphones", price: 299, rating: 4.7, icon: "🎧" },
  { id: "3", name: "Samsung TV", price: 799, rating: 4.6, icon: "📺" },
];

export default function Wishlist() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist ❤️</Text>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.addToCartBtn}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeBtn}>
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  actions: {
    alignItems: "center",
    gap: 8,
  },
  addToCartBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    fontSize: 20,
  },
});