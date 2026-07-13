import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResendConfirmation = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Missing email", "Enter your email before resending confirmation.");
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: trimmedEmail,
    });
    setResending(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Check your inbox", "A new confirmation email has been sent.");
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Missing details", "Please enter both your email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });
    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("not confirmed")) {
        Alert.alert(
          "Email confirmation required",
          "Please verify your email first, or resend the confirmation email.",
          [
            { text: "Cancel", style: "cancel" },
            { text: resending ? "Sending..." : "Resend email", onPress: handleResendConfirmation },
          ]
        );
      } else if (message.includes("invalid login credentials") || message.includes("user not found")) {
        Alert.alert(
          "Unable to sign in",
          "That email/password combination was not found. Please create an account first or double-check your details."
        );
      } else {
        Alert.alert("Login failed", error.message);
      }
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      Alert.alert("Session issue", sessionError.message);
      return;
    }

    if (session) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Login issue", "Your sign-in succeeded, but the session was not restored. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.badge, { color: colors.primary }]}>Shoply</Text>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back 👋</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Login to continue your shopping journey</Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            placeholder="Email"
            placeholderTextColor={colors.subtext}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}> 
            <Text style={[styles.forgot, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: colors.white }]}> 
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}> 
            <Text style={[styles.link, { color: colors.subtext }]}> 
              Don't have an account? <Text style={[styles.linkBold, { color: colors.primary }]}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badge: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  input: {
    padding: 15,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  forgot: {
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
  },
  linkBold: {
    fontWeight: "bold",
  },
});