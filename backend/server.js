// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ----------------- MONGODB CONNECTION -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 👍"))
  .catch((err) => console.error("DB Error:", err));

// ----------------- SCHEMAS / MODELS -----------------

// Artwork schema
const artworkSchema = new mongoose.Schema({
  title: String,
  artist: String,
  price: Number,
  image: String,
});

const Artwork = mongoose.model("Artwork", artworkSchema);

// Order schema (for purchases)
const orderSchema = new mongoose.Schema({
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
  artworkTitle: String,
  buyerName: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// ✅ User schema (extended for settings + manage users)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }, // plain text for project demo
  email: { type: String },                     // optional for now
  role: {
    type: String,
    enum: ["Visitor", "Artist", "Admin"],
    default: "Visitor",
  },
  status: {
    type: String,
    enum: ["Active", "Blocked"],
    default: "Active",
  },

  // Settings / profile fields
  photo: String,
  bio: String,

  payoutMethod: String,
  payoutDetails: Object,      // { upiId, bankAccount, ifsc, paypalEmail }

  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    productUpdates: { type: Boolean, default: true },
  },

  privacy: {
    profileVisibility: { type: String, default: "public" },
    showSoldPrices: { type: Boolean, default: true },
  },
});

const User = mongoose.model("User", userSchema);

// ----------------- BASIC ROUTE -----------------
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ----------------- ARTWORK ROUTES -----------------

// Get artworks
app.get("/api/artworks", async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch (err) {
    console.error("Error fetching artworks:", err);
    res.status(500).json({ error: "Cannot fetch artworks" });
  }
});

// Add artwork
app.post("/api/artworks", async (req, res) => {
  try {
    const newArt = new Artwork(req.body);
    const saved = await newArt.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving artwork:", err);
    res.status(400).json({ error: "Cannot save artwork" });
  }
});

// ----------------- ORDER ROUTES -----------------

// Create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ error: "Cannot create order" });
  }
});

console.log("✅ Orders routes registered");

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Cannot fetch orders" });
  }
});

// Simple test route (optional, for debugging)
app.get("/test-orders", (req, res) => {
  res.send("TEST ORDERS ROUTE IS WORKING");
});

// ----------------- AUTH ROUTES (SIGNUP / LOGIN) -----------------

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, password, role, email } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ error: "Name and password are required" });
    }

    // Check if user with same name + role already exists
    const existing = await User.findOne({ name, role });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = new User({ name, password, role, email });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email || "",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ error: "Name and password are required" });
    }

    const user = await User.findOne({ name, role });
    if (!user) {
      return res
        .status(401)
        .json({ error: "User not found for this role" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email || "",
      status: user.status,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ----------------- USER MANAGEMENT + SETTINGS ROUTES -----------------

// ✅ Get ALL users (for ManageUsers.jsx)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Cannot fetch users" });
  }
});

// ✅ Get ONE user (for SettingsPage.jsx)
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Cannot fetch user" });
  }
});

// ✅ Update profile (name, photo, bio, email)
app.put("/api/users/:id/profile", async (req, res) => {
  try {
    const { name, photo, bio, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, photo, bio, email },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ Change password
app.put("/api/users/:id/password", async (req, res) => {
  try {
    const { current, next } = req.body;
    if (!current || !next) {
      return res.status(400).json({ error: "Current and new password required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.password !== current) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = next;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ✅ Update payout method/details
app.put("/api/users/:id/payout", async (req, res) => {
  try {
    const { method, details } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { payoutMethod: method, payoutDetails: details },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Payout update error:", err);
    res.status(500).json({ error: "Failed to update payout" });
  }
});

// ✅ Update notifications + privacy
app.put("/api/users/:id/privacy", async (req, res) => {
  try {
    const { notifications, privacy } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { notifications, privacy },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// ✅ Change role (Promote in ManageUsers)
app.patch("/api/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// ✅ Change status (Active / Blocked)
app.patch("/api/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// ✅ Delete account (used by ManageUsers + Settings delete)
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ----------------- START SERVER -----------------
app.listen(process.env.PORT, () =>
  console.log(`Server running 👉 http://localhost:${process.env.PORT}`)
);
