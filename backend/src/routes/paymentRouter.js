const express = require("express");
const crypto = require("crypto");
const paymentRouter = express.Router();
const userAuth = require("../middlewares/auth");
const razorpay = require("../utils/razorpay");
const plans = require("../utils/plans");
const { Payment } = require("../Models/paymentModel");
const { User } = require("../Models/userModel");

//<-------------Create Razorpay Order API---------------->
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { plan } = req.body;

    // Plan backend ke utils/plans.js mein hona chahiye (price frontend se kabhi nahi lete)
    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    // Razorpay amount paise mein leta hai (1 rupee = 100 paise)
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(), // max 40 characters
      notes: { userId: req.user._id.toString(), plan },
    });

    // Database mein "created" status ke saath save karo
    await Payment.create({
      userId: req.user._id,
      orderId: order.id,
      plan,
      amount: order.amount,
      currency: order.currency,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // key_id public hoti hai, secret nahi
    });
  } catch (error) {
    console.log("Create order error:", error);
    res.status(500).json({ message: "Could not create the order" });
  }
});

//<-------------Verify Payment API---------------->
paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details are missing" });
    }

    // Razorpay ka signature = HMAC-SHA256("order_id|payment_id", key_secret)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Ye order isi logged-in user ka hona chahiye
    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify dobara call ho jaye to premium dobara extend na ho
    if (payment.status === "paid") {
      return res.status(200).json({ message: "Payment already verified" });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;
    await payment.save();

    // Premium abhi chal raha hai to uski expiry ke baad se jodo, warna aaj se
    const now = new Date();
    const currentExpiry = req.user.premiumExpiry;
    const startFrom = currentExpiry && currentExpiry > now ? currentExpiry : now;

    const days = plans[payment.plan].days;
    const newExpiry = new Date(startFrom.getTime() + days * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(req.user._id, {
      isPremium: true,
      premiumPlan: payment.plan,
      premiumExpiry: newExpiry,
    });

    res.status(200).json({ message: "You are now a Premium member!" });
  } catch (error) {
    console.log("Verify payment error:", error);
    res.status(500).json({ message: "Something went wrong while verifying the payment" });
  }
});

module.exports = paymentRouter;