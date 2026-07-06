import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);

  const handleNotifications = () => {
    router.push("/(stack)/settings");
  };

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need help with your order or account?\n\nEmail: support@shoply.app\nPhone: +1-800-555-0199"
    );
  };

  const menuItems = [
    { id: "1", icon: "📦", label: "Order History", route: "/(stack)/order-history" },
    { id: "2", icon: "📍", label: "Address Management", route: "/(stack)/addresses" },
    { id: "3", icon: "✏️", label: "Edit Profile", route: "/(stack)/edit-profile" },
    { id: "4", icon: "🔔", label: "Notifications", onPress: handleNotifications },
    { id: "5", icon: "⚙️", label: "Settings", route: "/(stack)/settings" },
    { id: "6", icon: "❓", label: "Help & Support", onPress: handleHelpSupport },
  ];

  useEffect(() => {
    const fetchUser = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        )}
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
            onPress={() => {
              if (item.onPress) {
                item.onPress();
              } else if (item.route) {
                router.push(item.route as any);
              }
            }}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Text style={[styles.menuArrow, { color: colors.subtext }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: colors.error }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  heroCard: { alignItems: "center", paddingVertical: 24, marginHorizontal: 20, borderRadius: 24, borderWidth: 1, marginBottom: 18, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  avatar: { width: 86, height: 86, borderRadius: 43, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatarImage: { width: 86, height: 86, borderRadius: 43, marginBottom: 12 },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 14 },
  statsRow: { flexDirection: "row", marginHorizontal: 20, borderRadius: 18, padding: 20, marginBottom: 24, borderWidth: 1 },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, marginTop: 4 },
  statDivider: { width: 1 },
  menu: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, marginBottom: 24 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16 },
  menuArrow: { fontSize: 20 },
  logoutBtn: { marginHorizontal: 20, marginBottom: 40, padding: 16, borderRadius: 14, alignItems: "center", borderWidth: 1 },
  logoutText: { fontSize: 16, fontWeight: "bold" },
});