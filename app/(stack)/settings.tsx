import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Settings() {
  const { colors, theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings ⚙️</Text>

      <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Preferences</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
            <Text style={[styles.settingSubLabel, { color: colors.subtext }]}>Receive push notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.settingSubLabel, { color: colors.subtext }]}>Switch to dark theme</Text>
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Updates</Text>
            <Text style={[styles.settingSubLabel, { color: colors.subtext }]}>Receive email newsletters</Text>
          </View>
          <Switch
            value={emailUpdates}
            onValueChange={setEmailUpdates}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Order Updates</Text>
            <Text style={[styles.settingSubLabel, { color: colors.subtext }]}>Get notified about orders</Text>
          </View>
          <Switch
            value={orderUpdates}
            onValueChange={setOrderUpdates}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.subtext }]}>About</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
          <Text style={[styles.arrow, { color: colors.subtext }]}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Terms of Service</Text>
          <Text style={[styles.arrow, { color: colors.subtext }]}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.aboutItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
          <Text style={[styles.version, { color: colors.subtext }]}>1.0.0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 8 },
  card: { marginHorizontal: 20, borderRadius: 12, marginBottom: 24, borderWidth: 1 },
  settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  settingLabel: { fontSize: 16, marginBottom: 2 },
  settingSubLabel: { fontSize: 12 },
  aboutItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  arrow: { fontSize: 20 },
  version: { fontSize: 14 },
});