const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Visitor", "Artist", "Admin"],
    default: "Visitor"
  },
  status: {
    type: String,
    enum: ["Active", "Blocked"],
    default: "Active"
  },
  photo: String,
  bio: String,

  payoutMethod: String,
  payoutDetails: Object,

  notifications: Object,
  privacy: Object
});

module.exports = mongoose.model("User", userSchema);
