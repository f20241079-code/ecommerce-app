import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";

const addresses = [
  { id: "1", label: "Home", address: "123 Main Street", city: "New York, NY 10001", default: true },
  { id: "2", label: "Work", address: "456 Office Ave", city: "New York, NY 10002", default: false },
];

export default function Addresses() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Addresses 📍</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{item.label}</Text>
              {item.default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.city}>{item.city}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn}>
                <Text style={styles.deleteText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
  card: { backgroundColor: Colors.light.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.light.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "bold", color: Colors.light.text },
  defaultBadge: { backgroundColor: Colors.light.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  defaultText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  address: { fontSize: 14, color: Colors.light.text, marginBottom: 4 },
  city: { fontSize: 14, color: Colors.light.subtext, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 12 },
  editBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: Colors.light.border },
  editText: { color: Colors.light.text, fontWeight: "bold" },
  deleteBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: Colors.light.error },
  deleteText: { color: Colors.light.error, fontWeight: "bold" },
  addBtn: { margin: 20, backgroundColor: Colors.light.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});