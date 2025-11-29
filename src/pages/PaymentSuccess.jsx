// src/pages/PaymentSuccess.jsx
import React, { useEffect, useMemo } from "react";
import { createOrder } from "../api/orders";

export default function PaymentSuccess({ artwork, onDone, role }) {
  // Safety check
  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">No payment data</h2>
        <p className="text-gray-600">Please go back to the gallery.</p>
        <button
          onClick={onDone}
          className="px-4 py-2 rounded-full bg-black text-white"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const basePrice = artwork.price ?? 0;
  const gst = Math.round(basePrice * 0.05);
  const platformFee = 49;
  const total = basePrice + gst + platformFee;

  // Keep orderId & time stable during render
  const { orderId, paidAt } = useMemo(
    () => ({
      orderId: `ART-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: new Date().toLocaleString("en-IN"),
    }),
    []
  );

  // ⬇️ NEW EFFECT: save order to MongoDB once
  useEffect(() => {
    async function saveOrder() {
      try {
        await createOrder({
          artworkId: artwork._id,          // MongoDB id
          artworkTitle: artwork.title,
          buyerName: role || "Visitor",    // simple demo
          amount: total,                   // store final paid amount
        });
        console.log("Order saved to DB");
      } catch (err) {
        console.error("Error saving order:", err);
      }
    }

    saveOrder();
    // run once when component mounts
  }, [artwork._id, artwork.title, role, total]);

  // existing redirect after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone(); // 👉 Go back after 8s
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-50 to-white px-4">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl p-8">
        {/* ✅ SUCCESS HEADER */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
            ✅
          </div>

          <h1 className="text-2xl font-semibold">Payment Successful</h1>

          <p className="text-sm text-gray-700 mt-1">
            Thank you for purchasing{" "}
            <span className="font-semibold">{artwork.title}</span> by{" "}
            <span className="font-semibold">{artwork.artist}</span>.
          </p>

          <p className="text-xs text-gray-500 mt-1">
            You will be redirected to the gallery shortly.
          </p>
        </div>

        {/* ✅ RECEIPT BOX */}
        <div className="border rounded-xl bg-gray-50 overflow-hidden">
          {/* Top Bar */}
          <div className="bg-black text-white px-5 py-3 flex justify-between text-sm">
            <div>
              <p className="text-xs text-gray-300">Order ID</p>
              <p className="font-semibold">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-300">Paid on</p>
              <p className="font-semibold">{paidAt}</p>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-5 bg-white space-y-3">
            {/* Artwork Info */}
            <div className="flex gap-4">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-16 h-16 rounded-lg object-cover border"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{artwork.title}</p>
                <p className="text-xs text-gray-500">by {artwork.artist}</p>
                <p className="text-xs text-gray-500">Qty: 1</p>
              </div>
              <p className="font-semibold">₹{basePrice}</p>
            </div>

            <hr />

            {/* Price Breakdown */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>₹{basePrice}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-sm">
                <span>Total Paid</span>
                <span>₹{total}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 pt-2">
              Payment Method: Card (Mock) <br />
              This is a generated receipt for a college project only.
            </p>
          </div>
        </div>

        {/* ✅ ACTION BUTTON */}
        <div className="mt-5 text-center">
          <button
            onClick={onDone}
            className="px-4 py-2 rounded-full bg-black text-white text-sm"
          >
            Back to Gallery now
          </button>
        </div>
      </div>
    </div>
  );
}
