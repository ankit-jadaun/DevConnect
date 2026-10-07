// Razorpay ka ek hi instance poore backend mein use hoga

const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // isko kabhi frontend mein mat bhejna kyuki ye secret hai. Ye sirf backend mein hi rahna chahiye.
});

module.exports = razorpayInstance;