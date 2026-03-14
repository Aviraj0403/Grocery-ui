import React, { useRef } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────────
const PaymentMethodBadge = ({ method }) =>
    method === "ONLINE" ? (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            💳 Online (Razorpay)
        </span>
    ) : (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            💵 Cash on Delivery
        </span>
    );

const PaymentStatusBadge = ({ status }) => {
    const map = {
        Paid: "bg-green-100 text-green-700 border-green-300",
        Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        Failed: "bg-red-100 text-red-700 border-red-300",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${map[status] || map.Pending}`}>
            {status === "Paid" ? "✅ Paid" : status === "Failed" ? "❌ Failed" : "⏳ Pending"}
        </span>
    );
};

const OrderStatusBadge = ({ status }) => {
    const map = {
        Pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
        Processing: "bg-blue-50 text-blue-700 border-blue-300",
        Shipped: "bg-purple-50 text-purple-700 border-purple-300",
        Delivered: "bg-green-50 text-green-700 border-green-300",
        Cancelled: "bg-red-50 text-red-700 border-red-300",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${map[status] || map.Pending}`}>
            {status}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminOrderDetails = ({ order, onClose }) => {
    const receiptRef = useRef();

    if (!order) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center">
                <h1 className="text-2xl font-semibold mb-4">No order selected.</h1>
                <button onClick={onClose} className="text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const handlePrint = () => {
        const printContent = receiptRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    // Normalize shipping info (dashboard uses shippingAddress, orders page uses shipping)
    const shippingInfo = order.shipping || order.shippingAddress;
    
    // In our backend, totalAmount is already the final amount (subtotal - discount).
    // So to show original total, we add discount back.
    const discount = order.discountAmount || 0;
    const amountPaid = order.totalAmount; 
    const originalTotal = amountPaid + discount;
    const isOnline = order.paymentMethod === "ONLINE";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
            <div
                ref={receiptRef}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-8 relative border border-gray-200"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none rounded-full"
                    aria-label="Close order details"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Admin Order Receipt</h1>

                {/* ── Order meta & shipping ──────────────────────────────────── */}
                <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left: Order info */}
                    <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-semibold">Order ID:</span> <span className="font-mono text-xs text-gray-500">{order._id}</span></p>
                        <p><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Order Status:</span>
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Payment Method:</span>
                            <PaymentMethodBadge method={order.paymentMethod} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Payment Status:</span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>

                        {/* ── Razorpay tracking (online only) ─────────────── */}
                        {isOnline && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1.5">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Razorpay Payment Info</p>
                                <p className="text-xs">
                                    <span className="font-semibold text-gray-600">Payment ID:</span>{" "}
                                    <span className="font-mono text-blue-800">{order.razorpayPaymentId || "—"}</span>
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold text-gray-600">Order ID:</span>{" "}
                                    <span className="font-mono text-blue-800">{order.razorpayOrderId || "—"}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Shipping */}
                    <div className="text-sm text-gray-700">
                        <h2 className="text-base font-semibold mb-2 border-b pb-1">Shipping Information</h2>
                        <p className="font-semibold">{shippingInfo?.fullName || "N/A"}</p>
                        <p>{shippingInfo?.addressLine1 || "N/A"}{shippingInfo?.addressLine2 ? `, ${shippingInfo.addressLine2}` : ""}</p>
                        <p>{shippingInfo?.city || "N/A"}, {shippingInfo?.state || "N/A"} – {shippingInfo?.pinCode || "N/A"}</p>
                        <p>{shippingInfo?.country || "N/A"}</p>
                        <p className="mt-1">📧 {order.user?.email || "N/A"}</p>
                        <p>📞 {shippingInfo?.phone || "N/A"}</p>
                    </div>
                </section>

                {/* ── Items ────────────────────────────────────────────────── */}
                <section className="mb-6">
                    <h2 className="text-base font-semibold mb-3 border-b pb-1">Items Ordered</h2>
                    <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm text-gray-800">{item.product?.name || item.name || "Unknown product"}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    {item.selectedVariant && (
                                        <p className="text-xs text-gray-400">
                                            {item.selectedVariant.unit && `Unit: ${item.selectedVariant.unit}`}
                                            {item.selectedVariant.weight && ` · ${item.selectedVariant.weight}`}
                                        </p>
                                    )}
                                </div>
                                <div className="font-semibold text-right text-blue-700 text-sm">
                                    ₹{((item.selectedVariant?.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Totals ───────────────────────────────────────────────── */}
                <section className="border-t pt-4 space-y-2">
                    {discount > 0 ? (
                        <>
                            <div className="flex justify-between text-sm text-gray-400 line-through">
                                <span>Original Total:</span>
                                <span>₹{originalTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}:</span>
                                <span>– ₹{discount.toFixed(2)}</span>
                            </div>
                        </>
                    ) : null}
                    <div className="flex justify-between font-bold text-blue-700 text-lg">
                        <span>{discount > 0 ? "Amount Paid:" : "Total Amount:"}</span>
                        <span>₹{amountPaid.toFixed(2)}</span>
                    </div>
                </section>

                {/* ── Actions ──────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    {order.paymentStatus === "Pending" && (
                        <button
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to mark this order as PAID?")) {
                                    try {
                                        const res = await axiosInstance.put(`/updateOrderStatus/${order._id}`, {
                                            paymentStatus: "Paid"
                                        });
                                        if (res.data.success) {
                                            toast.success("Order marked as Paid");
                                            window.location.reload();
                                        }
                                    } catch (err) {
                                        toast.error("Failed to update payment status");
                                    }
                                }
                            }}
                            className="bg-green-600 text-white px-8 py-2.5 rounded-lg hover:bg-green-700 font-semibold shadow flex items-center justify-center gap-2"
                        >
                            💰 Mark as Paid
                        </button>
                    )}
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow flex items-center justify-center gap-2"
                    >
                        🖨 Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
