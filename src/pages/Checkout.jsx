// src/pages/Checkout.jsx
import React, { useState } from "react";

export default function CheckoutPage({ artwork, onBack, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Safety check if user opens without artwork
  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">No artwork selected</h2>
        <p className="text-gray-600">
          Please go back to the gallery and select an artwork.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-black text-white"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert("Please fill all payment details.");
      return;
    }

    setIsProcessing(true);

    // Fake payment delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(); // 👉 tell App that payment is done
    }, 1500);
  };

  const gst = Math.round(artwork.price * 0.05);
  const platformFee = 49;
  const total = artwork.price + gst + platformFee;

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl grid md:grid-cols-[1.1fr,1.3fr] overflow-hidden">
        {/* LEFT – ORDER SUMMARY */}
        <div className="border-r border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-6 md:p-8">
          <button
            onClick={onBack}
            className="text-sm text-slate-600 mb-4 hover:underline"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-1">Order Summary</h2>
          <p className="text-sm text-slate-600">
            Review your artwork before completing payment.
          </p>

          <div className="mt-6 flex gap-4 p-3 rounded-xl bg-white/70 border border-slate-200">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{artwork.title}</h3>
              <p className="text-sm text-slate-600 mb-1">
                by {artwork.artist}
              </p>
              <p className="text-xs text-slate-500 mb-1">Quantity: 1</p>
              <p className="font-semibold text-base">₹{artwork.price}</p>
            </div>
          </div>

          <div className="mt-6 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Item total</span>
              <span>₹{artwork.price}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>₹{platformFee}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* RIGHT – PAYMENT FORM */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-1">Payment</h2>
          <p className="text-sm text-slate-600 mb-4">
            Choose your payment method and complete your purchase.
          </p>

          <div className="flex gap-3 mb-5">
            <label className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>

            <label className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI (Mock)
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name on card"
              className="w-full px-3 py-2 rounded border"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Card number"
              className="w-full px-3 py-2 rounded border"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 rounded border"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input
                type="password"
                placeholder="CVV"
                className="w-full px-3 py-2 rounded border"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-full bg-black text-white font-semibold disabled:opacity-70"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500 text-center">
            This is a mock payment for college project only.
          </p>
        </div>
      </div>
    </div>
  );
}
