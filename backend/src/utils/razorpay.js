// Razorpay ka ek hi instance poore backend mein use hoga
// npm i razorpay
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // ye kabhi frontend mein mat bhejna
});

module.exports = razorpayInstance;