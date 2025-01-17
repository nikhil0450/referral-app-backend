// models/activityLog.js

const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }  // Automatically adds createdAt
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
