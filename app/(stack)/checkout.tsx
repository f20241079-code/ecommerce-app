import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { sendLocalNotification } from "@/lib/notifications";

export default function Checkout() {
  const router = useRouter();
  const { colors } = useTheme();
  const { items, total, clearCart } = useCart();

  const handlePlaceOrder = async () => {
    await sendLocalNotification(
      "Order Placed! 🎉",
      `Your order of $${total + 5} has been placed successfully!`
    );
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderIcon}>{item.icon}</Text>
            <Text style={[styles.orderName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.orderQty, { color: colors.subtext }]}>x{item.quantity}</Text>
            <Text style={[styles.orderPrice, { color: colors.primary }]}>${item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.addressText, { color: colors.text }]}>📍 123 Main Street</Text>
        <Text style={[styles.addressSubText, { color: colors.subtext }]}>New York, NY 10001</Text>
        <TouchableOpacity>
          <Text style={[styles.changeText, { color: colors.primary }]}>Change Address</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.addressText, { color: colors.text }]}>💳 Credit Card</Text>
        <Text style={[styles.addressSubText, { color: colors.subtext }]}>**** **** **** 1234</Text>
        <TouchableOpacity>
          <Text style={[styles.changeText, { color: colors.primary }]}>Change Payment</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.totalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>Subtotal</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>${total}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>Delivery</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>$5</Text>
        </View>
        <View style={[styles.grandTotalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.grandTotalValue, { color: colors.primary }]}>${total + 5}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.orderBtn, { backgroundColor: colors.primary }]}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.orderBtnText}>Place Order 🎉</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 8 },
  card: { marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  orderItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  orderIcon: { fontSize: 24, marginRight: 8 },
  orderName: { flex: 1, fontSize: 14 },
  orderQty: { fontSize: 14, marginRight: 8 },
  orderPrice: { fontSize: 14, fontWeight: "bold" },
  addressText: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  addressSubText: { fontSize: 14, marginBottom: 8 },
  changeText: { fontWeight: "bold" },
  totalCard: { marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 14 },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 18, fontWeight: "bold" },
  grandTotalValue: { fontSize: 18, fontWeight: "bold" },
  orderBtn: { margin: 20, padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  orderBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});