import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";

const cartItems = [
  { id: "1", name: "iPhone 15 Pro", price: 999, quantity: 1, icon: "📱" },
  { id: "2", name: "Nike Air Max", price: 129, quantity: 2, icon: "👟" },
];

export default function Cart() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart 🛒</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityBtn}>
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity style={styles.quantityBtn}>
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  cartItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.card, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.light.border },
  itemIcon: { fontSize: 40, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", color: Colors.light.text },
  itemPrice: { fontSize: 14, color: Colors.light.primary, marginTop: 4 },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
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