// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // change if your backend port is different

export default function SettingsPage({ onLogout }) {
  const [loading, setLoading] = useState(true);

  // get current user id from localStorage (set in Login.jsx)
  const [userId] = useState(localStorage.getItem("userId"));

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [payoutMethod, setPayoutMethod] = useState("upi");
  const [payoutDetails, setPayoutDetails] = useState({
    upiId: "",
    bankAccount: "",
    ifsc: "",
    paypalEmail: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    productUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showSoldPrices: true,
  });

  // ---------- LOAD SETTINGS FROM DATABASE ----------
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        const u = res.data;

        setProfile({
          name: u.name || "",
          email: u.email || "",
          photo: u.photo || "",
          bio: u.bio || "",
        });

        setPayoutMethod(u.payoutMethod || "upi");
        setPayoutDetails({
          upiId: u.payoutDetails?.upiId || "",
          bankAccount: u.payoutDetails?.bankAccount || "",
          ifsc: u.payoutDetails?.ifsc || "",
          paypalEmail: u.payoutDetails?.paypalEmail || "",
        });

        setNotifications(
          u.notifications || { email: true, sms: false, productUpdates: true }
        );
        setPrivacy(
          u.privacy || { profileVisibility: "public", showSoldPrices: true }
        );
      } catch (err) {
        console.error("Error loading user settings:", err);
        alert("Failed to load settings from server");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ---------- HANDLERS THAT SAVE TO DB ----------

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/profile`, {
        name: profile.name,
        photo: profile.photo,
        bio: profile.bio,
        email: profile.email,
      });
      alert("Profile saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/password`, {
        current: passwords.current,
        next: passwords.next,
      });
      alert("Password changed!");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error || "Failed to change password. Check current password."
      );
    }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/payout`, {
        method: payoutMethod,
        details: payoutDetails,
      });
      alert("Payout method saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save payout method");
    }
  };

  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/privacy`, {
        notifications,
        privacy,
      });
      alert("Notification & privacy settings saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "This will permanently delete your account. Continue?"
    );
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
      localStorage.removeItem("userId");
      alert("Account deleted");
      onLogout();
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  // ---------- RENDER ----------

  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-serif mb-2">Settings</h1>
        <p className="text-sm text-gray-500">
          No user ID found. Please log out and log in again.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, security, payouts and privacy for Museo Virtual
          Gallery.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* EDIT PROFILE */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Profile Photo URL
              </label>
              <input
                type="text"
                value={profile.photo}
                onChange={(e) =>
                  setProfile({ ...profile, photo: e.target.value })
                }
                className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                placeholder="https://example.com/me.jpg"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Later you can replace this with an image upload.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Short Bio
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                placeholder="Tell collectors a bit about you…"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Save Profile
            </button>
          </form>
        </section>

        {/* CHANGE PASSWORD */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* PAYMENT / PAYOUT METHOD */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Payment / Payout Method</h2>

          <form onSubmit={handlePayoutSubmit} className="space-y-4">
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setPayoutMethod("upi")}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  payoutMethod === "upi"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod("bank")}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  payoutMethod === "bank"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod("paypal")}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  payoutMethod === "paypal"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                PayPal
              </button>
            </div>

            {payoutMethod === "upi" && (
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={payoutDetails.upiId}
                  onChange={(e) =>
                    setPayoutDetails({
                      ...payoutDetails,
                      upiId: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                  placeholder="yourname@upi"
                />
              </div>
            )}

            {payoutMethod === "bank" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={payoutDetails.bankAccount}
                    onChange={(e) =>
                      setPayoutDetails({
                        ...payoutDetails,
                        bankAccount: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={payoutDetails.ifsc}
                    onChange={(e) =>
                      setPayoutDetails({
                        ...payoutDetails,
                        ifsc: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                  />
                </div>
              </div>
            )}

            {payoutMethod === "paypal" && (
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={payoutDetails.paypalEmail}
                  onChange={(e) =>
                    setPayoutDetails({
                      ...payoutDetails,
                      paypalEmail: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                  placeholder="you@example.com"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Save Payout Method
            </button>
          </form>
        </section>

        {/* NOTIFICATIONS + PRIVACY */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Notifications & Privacy</h2>

          <form onSubmit={handlePrivacySubmit} className="space-y-4">
            {/* Notifications */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Notifications
              </h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  Email notifications (sales, bids, updates)
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        sms: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  SMS alerts for important activity
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.productUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        productUpdates: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  Product tips & feature announcements
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Privacy
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Profile visibility
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        profileVisibility: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-200 text-sm focus:border-gray-400 focus:ring-gray-300"
                  >
                    <option value="public">Public – visible to everyone</option>
                    <option value="collectors">
                      Only logged-in collectors & curators
                    </option>
                    <option value="private">Private – only you</option>
                  </select>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={privacy.showSoldPrices}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        showSoldPrices: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  Show sale prices for artworks that are sold
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Save Settings
            </button>
          </form>
        </section>
      </div>

      {/* LOGOUT & DELETE ACCOUNT */}
      <section className="bg-red-50 border border-red-100 rounded-xl p-5">
        <h2 className="font-semibold text-red-700">Logout & Delete Account</h2>
        <p className="text-xs text-red-600 mt-1">
          Deleting your account is permanent in a real app.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-md border border-red-400 text-red-700 text-sm hover:bg-red-100"
          >
            Logout
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
