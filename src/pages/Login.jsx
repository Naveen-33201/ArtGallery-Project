// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../api/auth";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Visitor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser({
        name: name.trim(),
        password: password.trim(),
        role,
      });

      // ✅ store info for SettingsPage & others
      localStorage.setItem("userId", user.id);      // Mongo _id from backend
      localStorage.setItem("userName", user.name);  // optional
      localStorage.setItem("userRole", user.role);  // optional

      // success: send role back to App
      onLogin(user.role); // App stores role: "Visitor" | "Artist" | "Admin"
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err.response?.data?.error || "Invalid name, password, or role.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPassword("");
    setRole("Visitor");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5eee5]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Welcome to Museo
        </h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Visitor">Visitor</option>
              <option value="Artist">Artist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Reset
            </button>
          </div>

          <button
            type="button"
            onClick={onSwitchToSignup}
            className="w-full mt-3 text-sm text-indigo-600 hover:underline"
          >
            Don&apos;t have an account? Sign up
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          This demo stores your account in MongoDB via our Node.js backend.
        </p>
      </div>
    </div>
  );
};

export default Login;
