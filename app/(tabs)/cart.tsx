import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your cart is empty!</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart 🛒</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => increaseQuantity(item.id)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/(stack)/checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.light.background },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: "bold", color: Colors.light.text, marginBottom: 24 },
  shopBtn: { backgroundColor: Colors.light.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  cartItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.card, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.light.border },
  itemIcon: { fontSize: 40, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", color: Colors.light.text },
  itemPrice: { fontSize: 14, color: Colors.light.primary, marginTop: 4 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  quantityBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.light.primary, justifyContent: "center", alignItems: "center" },
  quantityBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  quantity: { fontSize: 16, fontWeight: "bold", color: Colors.light.text, marginHorizontal: 12 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: Colors.light.border },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  totalLabel: { fontSize: 18, color: Colors.light.subtext },
  totalAmount: { fontSize: 22, fontWeight: "bold", color: Colors.light.text },
  checkoutBtn: { backgroundColor: Colors.light.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});