const mongoose = require("mongoose");

// Har payment attempt ka record (order banate hi "created" status ke saath save hota hai)
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
    },

    plan: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true, // paise mein (Razorpay paise hi leta hai)
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };