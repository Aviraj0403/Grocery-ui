import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../features/cart/cartSlice";
import { getProfile, addAddress } from "../../services/authApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createOrder as createOrderApi,
  createRazorpayOrder,
  verifyPayment,
} from "../../services/orderApi";
import useRazorpay from "../../hooks/useRazorpay";

// ─── Razorpay logo SVG (inline, no external dep needed) ─────────────────────
const RazorpayBadge = () => (
  <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[11px] font-bold text-blue-700 tracking-wide">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="#3395FF" />
    </svg>
    Razorpay
  </span>
);

// ─── Helper: payment status badge ─────────────────────────────────────────────
const paymentMethodInfo = {
  cod: { label: "Cash on Delivery 💵", desc: "Pay when your order arrives" },
  online: { label: "Pay Online", desc: "Secure payment via Razorpay – UPI, Cards, NetBanking & more" },
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded: rzpLoaded, openRazorpay } = useRazorpay();

  const discount = Number(location.state?.discount) || 0;
  const finalAmount = Number(location.state?.finalAmount) || Number(totalAmount);

  // ── Local state ────────────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // ── Fetch profile & addresses ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const userData = res.data?.userProfileDetail;
        if (!userData) { setAddresses([]); return; }

        setAddresses(userData.addresses || []);
        const defaultAddr = userData.addresses?.find((a) => a.isDefault);

        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setFormData({
            ...defaultAddr,
            fullName: userData.userName || "",
            email: userData.email || "",
            phoneNumber: defaultAddr.phoneNumber || "",
          });
          setAddingNewAddress(false);
        } else {
          setFormData({
            fullName: userData.userName || "",
            email: userData.email || "",
            phoneNumber: user?.phoneNumber || "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          });
          setAddingNewAddress(userData.addresses.length === 0);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setAddresses([]);
      }
    };
    fetchProfile();
  }, [user]);

  // ── Sync form when address selection changes ────────────────────────────────
  useEffect(() => {
    if (selectedAddressId && !addingNewAddress) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setFormData({
          fullName: user?.userName || "",
          email: user?.email || "",
          phoneNumber: addr.phoneNumber || user?.phoneNumber || "",
          street: addr.street,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
        });
        setErrors({});
      }
    }
  }, [selectedAddressId, addingNewAddress, addresses, user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    ["fullName", "email", "phoneNumber", "street", "city", "state", "postalCode", "country"].forEach(
      (f) => { if (!formData[f]) newErrors[f] = "This field is required"; }
    );
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Build shared shipping payload (used by both COD & Online) ────────────
  const buildShipping = () => ({
    fullName: formData.fullName,
    phoneNumber: formData.phoneNumber,
    email: formData.email,
    street: formData.street,
    addressLine2: formData.addressLine2 || "",
    city: formData.city,
    state: formData.state,
    postalCode: formData.postalCode,
    country: formData.country,
  });

  const buildOrderItems = () =>
    items.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant || null,
      price: item.selectedVariant?.price || item.price || 0,
      name: item.name,
    }));

  // ── Save address if new ─────────────────────────────────────────────────────
  const resolveAddress = async () => {
    if (addingNewAddress) {
      const res = await addAddress(formData);
      if (res.status !== 201) throw new Error("Failed to save address.");
      const updatedAddresses = res.data.addresses;
      const newAddr = updatedAddresses[updatedAddresses.length - 1];
      setAddresses(updatedAddresses);
      setSelectedAddressId(newAddr.id);
      setAddingNewAddress(false);
      return newAddr;
    }
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (!addr) throw new Error("Please select a valid address.");
    return addr;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // ONLINE PAYMENT – Razorpay integration
  // ══════════════════════════════════════════════════════════════════════════════
  const handleOnlinePayment = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!validateForm()) return;
    if (items.length === 0) return toast.error("Your cart is empty!");

    setIsProcessing(true);
    try {
      await resolveAddress(); // save address to user profile if new

      // ── Step 1: Create Razorpay order on backend ──────────────────────────
      const rzpData = await createRazorpayOrder(finalAmount);
      if (!rzpData?.success) {
        throw new Error(rzpData?.message || "Could not initiate payment");
      }

      const orderPayload = {
        items: buildOrderItems(),
        totalAmount,
        finalAmount,
        discount,
        offerApplied: null,
        shipping: buildShipping(),
      };

      // ── Step 2: Open Razorpay modal ────────────────────────────────────────
      openRazorpay({
        key: rzpData.key,
        order_id: rzpData.razorpayOrderId,
        amount: rzpData.amount,          // paise
        currency: rzpData.currency || "INR",
        name: "Shanu Mart",
        description: "Online Shopping – Groceries",
        image: "/logo.png",             // your logo path
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#16a34a" },           // green matching your brand

        // ── Payment success callback ─────────────────────────────────────────
        handler: async (response) => {
          // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload,
            });

            if (verifyRes?.success) {
              dispatch(clearCart());
              toast.success("🎉 Payment successful! Order placed.");
              navigate("/order-confirmation", { state: { order: verifyRes.order } });
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verify payment error:", err);
            toast.error("Payment verification failed: " + (err.message || "Unknown error"));
          } finally {
            setIsProcessing(false);
          }
        },

        // ── Payment failed callback ─────────────────────────────────────────
        onPaymentFailed: (response) => {
          console.error("[Razorpay] Payment failed:", response.error);
          toast.error(
            `Payment failed: ${response.error?.description || "Please try again."}`
          );
          setIsProcessing(false);
        },

        // ── Modal closed without payment ────────────────────────────────────
        modal: {
          ondismiss: () => {
            toast.info("Payment was cancelled.");
            setIsProcessing(false);
          },
        },
      });
    } catch (err) {
      console.error("Online payment error:", err);
      toast.error("Payment initiation failed: " + (err.message || "Unknown error"));
      setIsProcessing(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // COD PAYMENT
  // ══════════════════════════════════════════════════════════════════════════════
  const handleCODOrder = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!validateForm()) return;
    if (items.length === 0) return toast.error("Your cart is empty!");

    setIsProcessing(true);
    try {
      await resolveAddress();

      const orderPayload = {
        items: buildOrderItems(),
        totalAmount,
        finalAmount,
        discount,
        offerApplied: null,
        shipping: buildShipping(),
        paymentMethod: "COD",
      };

      const response = await createOrderApi(orderPayload);
      if (response.success) {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", { state: { order: response.order } });
      } else {
        toast.error("Failed to place order: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      console.error("COD order error:", err);
      toast.error("Order failed: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = paymentMethod === "online" ? handleOnlinePayment : handleCODOrder;

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">

        {/* ── Left: Shipping + Payment form ─────────────────────────────── */}
        <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded shadow space-y-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          {!addingNewAddress ? (
            <>
              <label className="block mb-2 font-medium">Choose Address</label>
              {addresses.length === 0 ? (
                <p className="mb-4 text-gray-600">You have no saved addresses. Please add one.</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block border rounded-md p-4 cursor-pointer transition ${selectedAddressId === addr.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 hover:border-green-400"
                        }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mr-3"
                      />
                      <span className="font-semibold">{addr.label}</span>:{" "}
                      {addr.street}, {addr.city}, {addr.state} – {addr.postalCode}
                    </label>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setAddingNewAddress(true);
                  setSelectedAddressId(null);
                  setFormData({
                    fullName: user?.userName || "", email: user?.email || "",
                    phoneNumber: "", street: "", city: "", state: "", postalCode: "", country: "",
                  });
                  setErrors({});
                }}
                className="inline-block mt-2 text-green-600 hover:underline font-semibold"
              >
                + Add New Address
              </button>
            </>
          ) : (
            <>
              {["fullName", "email", "phoneNumber", "street", "city", "state", "postalCode", "country"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize text-sm font-medium text-gray-700">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="text-blue-600 hover:underline mt-2 font-medium text-sm"
                onClick={() => {
                  setAddingNewAddress(false);
                  if (addresses.length > 0) setSelectedAddressId(addresses[0].id);
                }}
              >
                ← Back to Addresses
              </button>
            </>
          )}

          {/* ── Payment Method ───────────────────────────────────────────── */}
          {!addingNewAddress && (
            <div>
              <label className="block mb-3 font-semibold text-gray-800">Payment Method</label>
              <div className="space-y-3">
                {/* COD option */}
                <label className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "cod" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
                  }`}>
                  <input
                    type="radio" name="paymentMethod" value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{paymentMethodInfo.cod.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{paymentMethodInfo.cod.desc}</p>
                  </div>
                </label>

                {/* Online option */}
                <label className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "online" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  }`}>
                  <input
                    type="radio" name="paymentMethod" value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      {paymentMethodInfo.online.label}
                      <RazorpayBadge />
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{paymentMethodInfo.online.desc}</p>
                    {/* Accepted methods */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {["UPI", "Cards", "NetBanking", "Wallets"].map((m) => (
                        <span key={m} className="text-[10px] bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-gray-600 font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              </div>

              {/* Razorpay SDK not loaded warning */}
              {paymentMethod === "online" && !rzpLoaded && (
                <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                  <span>⏳</span> Loading payment gateway…
                </p>
              )}
            </div>
          )}

          {/* ── Submit button ────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={
              isProcessing ||
              items.length === 0 ||
              (!addingNewAddress && !selectedAddressId) ||
              (paymentMethod === "online" && !rzpLoaded)
            }
            className={`w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${paymentMethod === "online"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                {paymentMethod === "online" ? "Opening Payment..." : "Placing Order..."}
              </span>
            ) : addingNewAddress ? (
              "Save & Place Order"
            ) : paymentMethod === "online" ? (
              `Pay ₹${Number(finalAmount).toFixed(2)} Online`
            ) : (
              "Place Order (COD)"
            )}
          </button>

          {/* Security note for online */}
          {paymentMethod === "online" && (
            <p className="text-xs text-center text-gray-400 mt-1 flex items-center justify-center gap-1">
              <span>🔒</span> 100% Secure. Powered by Razorpay.
            </p>
          )}
        </form>

        {/* ── Right: Order Summary ──────────────────────────────────────── */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map((item, idx) => (
                <li key={idx} className="flex justify-between py-2 text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{((item.selectedVariant?.price || 0) * item.quantity).toFixed(2)}</span>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4 flex justify-between text-sm">
            <span>Total Items:</span>
            <span>{totalQuantity}</span>
          </div>

          <div className="mt-2 flex justify-between font-semibold text-red-600 line-through text-sm">
            <span>MRP:</span>
            <span>₹{Number(totalAmount).toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="mt-1 flex justify-between text-green-600 text-sm font-medium">
              <span>Discount:</span>
              <span>– ₹{Number(discount).toFixed(2)}</span>
            </div>
          )}

          <div className="mt-3 flex justify-between font-bold text-green-700 text-lg border-t pt-3">
            <span>You Pay:</span>
            <span>₹{Number(finalAmount).toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <p className="text-xs text-right text-green-600 italic mt-1">
              🎉 You saved ₹{Number(discount).toFixed(2)}!
            </p>
          )}

          <Link
            to="/dashboard/cart"
            className="block mt-6 text-green-600 hover:underline text-center text-sm"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
