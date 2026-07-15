import { useTheme } from "@/context/ThemeContext";
import { fetchOrders, getCurrentUserId, OrderRecord } from "@/lib/supabaseHelpers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OrderHistory() {
  const router = useRouter();
  const { colors } = useTheme();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        setRequiresLogin(true);
        setErrorMessage("Sign in to view your order history.");
        setIsLoading(false);
        return;
      }

      setRequiresLogin(false);
      const data = await fetchOrders(userId);
      if (!data) {
        setOrders([]);
        setErrorMessage("Unable to load orders at this time.");
      } else if (data.length === 0) {
        setOrders([]);
        setErrorMessage(null);
      } else {
        setOrders(data);
        setErrorMessage(null);
      }
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const statusColor = (status: string) => {
    if (status === "Delivered") return colors.success;
    if (status === "Cancelled") return colors.error;
    return colors.primary;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.placeholderText, { color: colors.subtext }]}>Loading orders...</Text>
      </View>
    );
  }

  if (requiresLogin) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Your order history is private</Text>
        <Text style={[styles.placeholderText, { color: colors.subtext, textAlign: 'center', marginTop: 10, paddingHorizontal: 24 }]}>Sign in to see all your past orders, shipping details, and order status updates.</Text>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(auth)/login")}> 
          <Text style={styles.actionBtnText}>Sign in to view orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.placeholderText, { color: colors.subtext }]}>{errorMessage}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>No orders yet</Text>
        <Text style={[styles.placeholderText, { color: colors.subtext, textAlign: 'center', marginTop: 10, paddingHorizontal: 24 }]}>Once you place your first order, it will appear here with status updates and details.</Text>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(tabs)/home")}> 
          <Text style={styles.actionBtnText}>Continue shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}> 
        <Text style={[styles.title, { color: colors.text }]}>Order History 📦</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>A quick view of your recent purchases</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.cardHeader}>
              <Text style={[styles.orderId, { color: colors.text }]}>Order #{item.id}</Text>
              <Text style={[styles.status, { color: statusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.subtext }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
            {item.items.map((orderItem, index) => (
              <Text key={index} style={[styles.item, { color: colors.text }]}>• {orderItem.name} x{orderItem.quantity} — ${orderItem.price * orderItem.quantity}</Text>
            ))}
            <View style={styles.cardFooter}>
              <Text style={[styles.total, { color: colors.text }]}>Total: ${item.total}</Text>
              <TouchableOpacity
                style={[styles.reorderBtn, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('Reorder', 'Reorder is not implemented yet.')}
              > 
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 13 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  orderId: { fontSize: 16, fontWeight: "700" },
  status: { fontSize: 13, fontWeight: "700" },
  date: { fontSize: 12, marginBottom: 10 },
  item: { fontSize: 14, marginBottom: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, borderTopWidth: 1, paddingTop: 10 },
  total: { fontSize: 15, fontWeight: "700" },
  reorderBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  reorderText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  placeholderText: { fontSize: 14, color: "#999" },
});