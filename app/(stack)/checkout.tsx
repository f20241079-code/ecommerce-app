import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { sendLocalNotification } from "@/lib/notifications";
import {
    AddressRecord,
    createOrder,
    fetchAddresses,
    getCurrentUserId,
} from "@/lib/supabaseHelpers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const steps = ["Cart", "Address", "Payment", "Confirm"];

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", detail: "**** **** **** 1234", icon: "💳" },
  { id: "upi", label: "UPI", detail: "Pay via any UPI app", icon: "📲" },
  { id: "cod", label: "Cash on Delivery", detail: "Pay when it arrives", icon: "💵" },
];

const STANDARD_DELIVERY_FEE = 5;
const FREE_DELIVERY_THRESHOLD = 50;

export default function Checkout() {
  const router = useRouter();
  const { colors } = useTheme();
  const { items, total, clearCart } = useCart();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressRecord | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);

  const qualifiesForFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
  const delivery = qualifiesForFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const amountToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - total, 0);
  const grandTotal = total + delivery;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Address required", "Please choose a delivery address before placing your order.");
      return;
    }

    const userId = await getCurrentUserId();
    let orderPlaced = false;

    if (userId) {
      const orderId = await createOrder(userId, {
        status: "Processing",
        total: grandTotal,
        items,
        delivery_address: `${selectedAddress.label}: ${selectedAddress.address}, ${selectedAddress.city}`,
      });
      orderPlaced = Boolean(orderId);
    }

    await sendLocalNotification(
      "Order Placed! 🎉",
      `Your order of $${grandTotal} has been placed successfully!`
    );

    Alert.alert(
      "Order Placed! 🎉",
      orderPlaced
        ? "Your order has been saved to your account."
        : "Your order has been placed locally. Sign in to save it to your account.",
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

  const goNext = () => {
    if (stepIndex === 1 && !selectedAddress) {
      Alert.alert("Address required", "Please select a delivery address before continuing.");
      return;
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else router.back();
  };

  useEffect(() => {
    const loadAddresses = async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        setAddressError("Sign in to save delivery addresses.");
        setAddressLoading(false);
        return;
      }

      const savedAddresses = await fetchAddresses(userId);
      if (!savedAddresses || savedAddresses.length === 0) {
        setAddressError("No saved delivery addresses found.");
      } else {
        setAddresses(savedAddresses);
        setSelectedAddress(savedAddresses.find((address) => address.default) ?? savedAddresses[0]);
        setAddressError(null);
      }
      setAddressLoading(false);
    };

    loadAddresses();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
      </View>

      {/* Progress steps */}
      <View style={styles.stepRow}>
        {steps.map((step, index) => {
          const isDone = index < stepIndex;
          const isActive = index === stepIndex;
          const isLast = index === steps.length - 1;
          return (
            <View key={step} style={styles.stepItem}>
              <View style={styles.stepCircleWrap}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: isDone || isActive ? colors.primary : colors.card,
                      borderColor: isDone || isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: isDone || isActive ? "#fff" : colors.subtext, fontWeight: "700", fontSize: 12 }}>
                    {isDone ? "✓" : index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: isActive ? colors.primary : colors.subtext, fontWeight: isActive ? "700" : "500" },
                  ]}
                >
                  {step}
                </Text>
              </View>
              {!isLast && (
                <View style={[styles.stepLine, { backgroundColor: isDone ? colors.primary : colors.border }]} />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Free delivery progress banner */}
        {!qualifiesForFreeDelivery ? (
          <View style={[styles.deliveryBanner, { backgroundColor: colors.primary + "12", borderColor: colors.primary }]}>
            <Text style={[styles.deliveryBannerText, { color: colors.text }]}>
              🚚 Add ${amountToFreeDelivery.toFixed(2)} more to get FREE delivery!
            </Text>
          </View>
        ) : (
          <View style={[styles.deliveryBanner, { backgroundColor: "#43E97B" + "18", borderColor: "#43E97B" }]}>
            <Text style={[styles.deliveryBannerText, { color: colors.text }]}>
              🎉 You've unlocked FREE delivery!
            </Text>
          </View>
        )}

        {/* Step 0: Cart */}
        {stepIndex === 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
            {items.map((item) => (
              <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.itemIconWrap, { backgroundColor: colors.background }]}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemQty, { color: colors.subtext }]}>Qty: {item.quantity}</Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Step 1: Address */}
        {stepIndex === 1 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
            {addressLoading ? (
              <Text style={[styles.placeholderText, { color: colors.subtext }]}>Loading saved addresses…</Text>
            ) : addressError ? (
              <Text style={[styles.placeholderText, { color: colors.subtext }]}>{addressError}</Text>
            ) : (
              <View style={[styles.addressCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
                {addresses.map((address) => {
                  const isSelected = selectedAddress?.id === address.id;
                  return (
                    <TouchableOpacity
                      key={address.id}
                      style={[
                        styles.addressOption,
                        {
                          backgroundColor: isSelected ? colors.primary + "10" : colors.card,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedAddress(address)}
                    >
                      <View style={styles.addressHeaderRow}>
                        <Text style={{ fontSize: 20 }}>📍</Text>
                        <Text style={[styles.addressName, { color: colors.text }]}>{address.label}</Text>
                      </View>
                      <Text style={[styles.addressText, { color: colors.subtext }]}>{address.address}</Text>
                      <Text style={[styles.addressText, { color: colors.subtext }]}>{address.city}</Text>
                      {isSelected && (
                        <Text style={[styles.selectedTag, { color: colors.primary }]}>Selected</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
        {stepIndex === 2 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
            {paymentMethods.map((method) => {
              const isActive = selectedPayment === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isActive ? colors.primary : colors.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <Text style={{ fontSize: 22, marginRight: 12 }}>{method.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.paymentLabel, { color: colors.text }]}>{method.label}</Text>
                    <Text style={[styles.paymentDetail, { color: colors.subtext }]}>{method.detail}</Text>
                  </View>
                  <View style={[styles.radioOuter, { borderColor: isActive ? colors.primary : colors.border }]}>
                    {isActive && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Step 3: Confirm */}
        {stepIndex === 3 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Review Your Order</Text>
            <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.reviewLabel, { color: colors.subtext }]}>Deliver to</Text>
              <Text style={[styles.reviewValue, { color: colors.text }]}> 
                {selectedAddress ? `${selectedAddress.label}: ${selectedAddress.address}, ${selectedAddress.city}` : "No address selected"}
              </Text>
              <Text style={[styles.reviewValue, { color: colors.text }]}>
                {paymentMethods.find((m) => m.id === selectedPayment)?.label}
              </Text>
            </View>
          </View>
        )}

        {/* Order summary — always visible */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>${total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Delivery</Text>
              {qualifiesForFreeDelivery ? (
                <Text style={[styles.summaryValue, { color: "#43E97B" }]}>FREE</Text>
              ) : (
                <Text style={[styles.summaryValue, { color: colors.text }]}>${delivery}</Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>${grandTotal}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.subtext }]}>Total</Text>
          <Text style={[styles.footerTotal, { color: colors.text }]}>${grandTotal}</Text>
        </View>
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={goNext}>
          <Text style={styles.nextBtnText}>
            {stepIndex === steps.length - 1 ? "Place Order 🎉" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  backButton: { marginRight: 10, padding: 6 },
  backButtonText: { fontSize: 22, fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "bold" },

  stepRow: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 20, alignItems: "flex-start" },
  stepItem: { flexDirection: "row", alignItems: "flex-start", flex: 1 },
  stepCircleWrap: { alignItems: "center", width: 60 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepLabel: { fontSize: 10, textAlign: "center" },
  stepLine: { flex: 1, height: 2, marginTop: 13, marginHorizontal: -4 },

  body: { paddingHorizontal: 20, paddingBottom: 20 },

  deliveryBanner: { borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 16 },
  deliveryBannerText: { fontSize: 13, fontWeight: "600", textAlign: "center" },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  itemCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1 },
  itemIconWrap: { width: 48, height: 48, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  itemQty: { fontSize: 12 },
  itemPrice: { fontSize: 15, fontWeight: "700" },

  addressCard: { borderRadius: 14, padding: 16, borderWidth: 1 },
  addressHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  addressName: { fontSize: 15, fontWeight: "700" },
  addressText: { fontSize: 13, marginBottom: 2, lineHeight: 19 },
  addressOption: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 12 },
  selectedTag: { marginTop: 10, fontSize: 13, fontWeight: "700" },
  changeAddressBtn: { marginTop: 10 },

  paymentCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 14, marginBottom: 10 },
  paymentLabel: { fontSize: 15, fontWeight: "600" },
  paymentDetail: { fontSize: 12, marginTop: 2 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5 },

  reviewCard: { borderRadius: 14, padding: 16, borderWidth: 1 },
  reviewLabel: { fontSize: 12, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  reviewValue: { fontSize: 15, fontWeight: "600", marginBottom: 4 },

  summaryCard: { borderRadius: 14, padding: 16, borderWidth: 1 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "800" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
  },
  footerLabel: { fontSize: 12 },
  footerTotal: { fontSize: 20, fontWeight: "800" },
  nextBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  nextBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});