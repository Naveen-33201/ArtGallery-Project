// src/pages/Signup.jsx
import React, { useState } from "react";
import { signupUser } from "../api/auth";

const Signup = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Visitor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signupUser({ name: name.trim(), password: password.trim(), role });
      setSuccess("Signup successful! You can now log in.");
      // optional: switch to login automatically after a short delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
    } catch (err) {
      console.error("Signup failed:", err);
      const msg =
        err.response?.data?.error || "Signup failed. Try a different name.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5eee5]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Create your Museo account
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Sign up to start exploring and showcasing art.
        </p>

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
              placeholder="Choose a password"
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
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full mt-4 text-sm text-indigo-600 hover:underline"
        >
          Already have an account? Log in
        </button>

        <p className="mt-4 text-xs text-slate-400">
          Your account is stored in MongoDB using our Node.js backend.
        </p>
      </div>
    </div>
  );
};

export default Signup;
