// lib/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true },
    userName: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    items: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "confirmed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent model recompilation during hot reloads in development
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
