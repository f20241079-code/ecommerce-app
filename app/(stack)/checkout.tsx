import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const handlePlaceOrder = () => {
    Alert.alert(
      "Order Placed! 🎉",
      "Your order has been placed successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.replace("/(tabs)/home");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.card}>
        {items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderIcon}>{item.icon}</Text>
            <Text style={styles.orderName}>{item.name}</Text>
            <Text style={styles.orderQty}>x{item.quantity}</Text>
            <Text style={styles.orderPrice}>${item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Delivery Address */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.card}>
        <Text style={styles.addressText}>📍 123 Main Street</Text>
        <Text style={styles.addressSubText}>New York, NY 10001</Text>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change Address</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.card}>
        <Text style={styles.addressText}>💳 Credit Card</Text>
        <Text style={styles.addressSubText}>**** **** **** 1234</Text>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery</Text>
          <Text style={styles.totalValue}>$5</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>${total + 5}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
        <Text style={styles.orderBtnText}>Place Order 🎉</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 8 },
  card: { backgroundColor: Colors.light.card, marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.light.border },
  orderItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  orderIcon: { fontSize: 24, marginRight: 8 },
  orderName: { flex: 1, fontSize: 14, color: Colors.light.text },
  orderQty: { fontSize: 14, color: Colors.light.subtext, marginRight: 8 },
  orderPrice: { fontSize: 14, fontWeight: "bold", color: Colors.light.primary },
  addressText: { fontSize: 16, fontWeight: "bold", color: Colors.light.text, marginBottom: 4 },
  addressSubText: { fontSize: 14, color: Colors.light.subtext, marginBottom: 8 },
  changeText: { color: Colors.light.primary, fontWeight: "bold" },
  totalCard: { backgroundColor: Colors.light.card, marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.light.border },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalLabel: { fontSize: 14, color: Colors.light.subtext },
  totalValue: { fontSize: 14, color: Colors.light.text },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 18, fontWeight: "bold", color: Colors.light.text },
  grandTotalValue: { fontSize: 18, fontWeight: "bold", color: Colors.light.primary },
  orderBtn: { backgroundColor: Colors.light.primary, margin: 20, padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  orderBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});