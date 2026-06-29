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

export default function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, total } = useCart();
  const { colors } = useTheme();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={[styles.emptyText, { color: colors.text }]}>Your cart is empty!</Text>
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
      <Text style={[styles.title, { color: colors.text }]}>My Cart 🛒</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityBtn, { backgroundColor: colors.primary }]}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityBtn, { backgroundColor: colors.primary }]}
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
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>${total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(stack)/checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
  cartItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1 },
  itemIcon: { fontSize: 40, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14, marginTop: 4 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  quantityBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  quantityBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  quantity: { fontSize: 16, fontWeight: "bold", marginHorizontal: 12 },
  footer: { padding: 20, borderTopWidth: 1 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  totalLabel: { fontSize: 18 },
  totalAmount: { fontSize: 22, fontWeight: "bold" },
  checkoutBtn: { padding: 16, borderRadius: 12, alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});