import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";

export default function EditProfile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setFullName(user?.user_metadata?.full_name || "");
      setEmail(user?.email || "");
      setPhone(user?.user_metadata?.phone || "");
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile ✏️</Text>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {fullName.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changePhoto}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
          placeholder="Email"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.text, paddingHorizontal: 20, marginBottom: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.light.primary, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  changePhoto: { color: Colors.light.primary, fontWeight: "bold" },
  form: { paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: Colors.light.text, marginBottom: 8 },
  input: { backgroundColor: Colors.light.card, padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: Colors.light.border, color: Colors.light.text },
  disabledInput: { opacity: 0.5 },
  saveBtn: { margin: 20, backgroundColor: Colors.light.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});