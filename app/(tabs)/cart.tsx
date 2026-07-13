import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  emptyCard: { width: "100%", borderRadius: 24, borderWidth: 1, padding: 24, alignItems: "center" },
  emptyIcon: { fontSize: 70, marginBottom: 12 },
  emptyText: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  shopBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  title: { fontSize: 24, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  itemIcon: { fontSize: 38, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "bold" },
  itemPrice: { fontSize: 14, marginTop: 4 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  quantityBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  quantityBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  quantity: { fontSize: 15, fontWeight: "600", marginHorizontal: 10 },
  removeIcon: { fontSize: 18 },
  footer: { padding: 20, borderTopWidth: 1 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 22, fontWeight: "bold" },
  checkoutBtn: { padding: 16, borderRadius: 14, alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});