const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String, // URL arba base64 koduota nuotrauka
    },
    backpack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Backpack",
      required: true,
    },
    reminderSent: {
      month: { type: Boolean, default: false },
      week: { type: Boolean, default: false },
      day: { type: Boolean, default: false },
      expired: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
