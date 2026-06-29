import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeContext";

const menuItems = [
  { id: "1", icon: "📦", label: "Order History", route: "/(stack)/order-history" },
  { id: "2", icon: "📍", label: "Address Management", route: "/(stack)/addresses" },
  { id: "3", icon: "✏️", label: "Edit Profile", route: "/(stack)/edit-profile" },
  { id: "4", icon: "🔔", label: "Notifications", route: null },
  { id: "5", icon: "⚙️", label: "Settings", route: "/(stack)/settings" },
  { id: "6", icon: "❓", label: "Help & Support", route: null },
];

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.user_metadata?.full_name || "User"}
        </Text>
        <Text style={[styles.email, { color: colors.subtext }]}>{user?.email || ""}</Text>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Orders</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>5</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Wishlist</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>3</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Reviews</Text>
        </View>
      </View>

      <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => item.route && router.push(item.route as any)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Text style={[styles.menuArrow, { color: colors.subtext }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { alignItems: "center", paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 14 },
  statsRow: { flexDirection: "row", marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1 },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, marginTop: 4 },
  statDivider: { width: 1 },
  menu: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16 },
  menuArrow: { fontSize: 20 },
  logoutBtn: { marginHorizontal: 20, marginBottom: 40, backgroundColor: "#FFF0F0", padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#FFD0D0" },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
});