import { useTheme } from "@/context/ThemeContext";
import { AddressRecord, addAddress, deleteAddress, fetchAddresses, getCurrentUserId, updateAddress } from "@/lib/supabaseHelpers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Addresses() {
  const router = useRouter();
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressRecord | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const loadAddresses = async () => {
    const currentUserId = await getCurrentUserId();
    setUserId(currentUserId);

    if (!currentUserId) {
      setAddresses([]);
      setErrorMessage(null);
      setStatusMessage("Sign in to save delivery addresses and use this section.");
      setIsLoading(false);
      return;
    }

    const data = await fetchAddresses(currentUserId);
    if (!data) {
      setAddresses([]);
      setErrorMessage("Unable to load your saved addresses. Please try again later.");
      setStatusMessage(null);
    } else if (data.length === 0) {
      setAddresses([]);
      setErrorMessage(null);
      setStatusMessage("No saved addresses yet. Add one now to speed up checkout.");
    } else {
      setAddresses(data);
      setErrorMessage(null);
      setStatusMessage(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleDeleteAddress = (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          const userId = await getCurrentUserId();
          if (!userId) {
            setErrorMessage("Sign in to manage your addresses.");
            setIsLoading(false);
            return;
          }

          const deleted = await deleteAddress(userId, id);
          if (!deleted) {
            setErrorMessage("Unable to delete address at this time.");
            setIsLoading(false);
            return;
          }

          await loadAddresses();
        },
      },
    ]);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewLabel("");
    setNewAddress("");
    setNewCity("");
    setShowAddForm(true);
  };

  const handleEditAddress = (address: AddressRecord) => {
    setEditingAddress(address);
    setNewLabel(address.label);
    setNewAddress(address.address);
    setNewCity(address.city);
    setShowAddForm(true);
  };

  const handleSaveAddress = async () => {
    const trimmedLabel = newLabel.trim();
    const trimmedAddress = newAddress.trim();
    const trimmedCity = newCity.trim();

    if (!trimmedLabel || !trimmedAddress || !trimmedCity) {
      Alert.alert("Missing details", "Please enter a label, address, and city.");
      return;
    }

    if (!userId) {
      Alert.alert("Sign in required", "Please sign in before saving an address.");
      return;
    }

    setSavingAddress(true);
    const payload = {
      label: trimmedLabel,
      address: trimmedAddress,
      city: trimmedCity,
      default: addresses.length === 0 && !editingAddress,
    };

    let result: AddressRecord | null = null;
    if (editingAddress) {
      result = await updateAddress(userId, editingAddress.id, payload);
    } else {
      result = await addAddress(userId, payload);
    }

    setSavingAddress(false);

    if (!result) {
      Alert.alert("Error", "Unable to save address. Try again later.");
      return;
    }

    setEditingAddress(null);
    setNewLabel("");
    setNewAddress("");
    setNewCity("");
    setShowAddForm(false);
    await loadAddresses();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.placeholderText, { color: colors.subtext }]}>Loading addresses...</Text>
      </View>
    );
  }

  const signedOut = !userId;
  const showMessage = Boolean(errorMessage || statusMessage);

  if (signedOut && !showAddForm) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Sign in to save addresses</Text>
        <Text style={[styles.placeholderText, { color: colors.subtext, textAlign: 'center', marginTop: 10, paddingHorizontal: 24 }]}>Save multiple shipping addresses, speed up checkout, and access your preferred delivery details across devices.</Text>
        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(auth)/login")}> 
          <Text style={styles.loginBtnText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.signupBtn, { borderColor: colors.primary }]} onPress={() => router.push("/(auth)/signup")}> 
          <Text style={[styles.signupBtnText, { color: colors.primary }]}>Create an account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>My Addresses 📍</Text>
      {showMessage && (
        <View style={[styles.messageBox, { backgroundColor: errorMessage ? colors.error + "18" : colors.card }]}> 
          <Text style={[styles.placeholderText, { color: errorMessage ? colors.error : colors.subtext }]}>{errorMessage ?? statusMessage}</Text>
        </View>
      )}
      {showAddForm ? (
        <KeyboardAvoidingView behavior="padding" style={[styles.formContainer, { backgroundColor: colors.background }]}> 
          <Text style={[styles.formTitle, { color: colors.text }]}>{editingAddress ? "Edit address" : "Add address"}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Label (e.g. Home)"
            placeholderTextColor={colors.subtext}
            value={newLabel}
            onChangeText={setNewLabel}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Street address"
            placeholderTextColor={colors.subtext}
            value={newAddress}
            onChangeText={setNewAddress}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="City, state"
            placeholderTextColor={colors.subtext}
            value={newCity}
            onChangeText={setNewCity}
          />
          <View style={styles.formActions}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
              setNewLabel("");
              setNewAddress("");
              setNewCity("");
            }}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSaveAddress} disabled={savingAddress}>
              <Text style={styles.saveBtnText}>{savingAddress ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <>
          {addresses.length === 0 ? (
            <View style={[styles.emptyNotice, { backgroundColor: colors.card, borderColor: colors.border }]}> 
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved addresses yet</Text>
              <Text style={[styles.placeholderText, { color: colors.subtext, marginTop: 8 }]}>Add an address now and select it during checkout for faster delivery.</Text>
            </View>
          ) : (
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
                  <View style={styles.cardHeader}>
                    <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
                    {item.default && (
                      <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}> 
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.address, { color: colors.text }]}>{item.address}</Text>
                  <Text style={[styles.city, { color: colors.subtext }]}>{item.city}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.editBtn, { borderColor: colors.border }]}
                      onPress={() => handleEditAddress(item)}
                    > 
                      <Text style={[styles.editText, { color: colors.text }]}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteBtn, { borderColor: colors.error }]}
                      onPress={() => handleDeleteAddress(item.id)}
                    > 
                      <Text style={[styles.deleteText, { color: colors.error }]}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAddAddress}> 
            <Text style={styles.addBtnText}>+ Add New Address</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "bold" },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  defaultText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  address: { fontSize: 14, marginBottom: 4 },
  city: { fontSize: 14, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 12 },
  editBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", borderWidth: 1 },
  editText: { fontWeight: "bold" },
  deleteBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", borderWidth: 1 },
  deleteText: { fontWeight: "bold" },
  addBtn: { margin: 20, padding: 16, borderRadius: 12, alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  placeholderText: { fontSize: 14, color: "#999" },
});
