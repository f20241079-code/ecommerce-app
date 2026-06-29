import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";

const orders = [
  { id: "1", date: "June 25, 2026", status: "Delivered", total: 999, items: ["📱 iPhone 15 Pro"] },
  { id: "2", date: "June 20, 2026", status: "Delivered", total: 258, items: ["👟 Nike Air Max x2"] },
  { id: "3", date: "June 15, 2026", status: "Cancelled", total: 299, items: ["🎧 Sony Headphones"] },
];

const statusColor = (status: string) => {
  if (status === "Delivered") return Colors.light.success;
  if (status === "Cancelled") return Colors.light.error;
  return Colors.light.primary;
};

export default function OrderHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History 📦</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={[styles.status, { color: statusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
            {item.items.map((i, index) => (
              <Text key={index} style={styles.item}>{i}</Text>
            ))}
            <View style={styles.cardFooter}>
              <Text style={styles.total}>Total: ${item.total}</Text>
              <TouchableOpacity style={styles.reorderBtn}>
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
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
  card: { backgroundColor: Colors.light.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.light.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  orderId: { fontSize: 16, fontWeight: "bold", color: Colors.light.text },
  status: { fontSize: 14, fontWeight: "bold" },
  date: { fontSize: 12, color: Colors.light.subtext, marginBottom: 8 },
  item: { fontSize: 14, color: Colors.light.text, marginBottom: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 8 },
  total: { fontSize: 16, fontWeight: "bold", color: Colors.light.text },
  reorderBtn: { backgroundColor: Colors.light.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  reorderText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});