import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

// Razorpay ki script sirf ek baar load hogi (index.html mein script tag nahi lagana padega)
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Use: <Payment plan="monthly" label="Get Premium" />
// plan ka naam backend ke utils/plans.js se match hona chahiye
const Payment = ({ plan, label = "Get Premium", className = "btn btn-primary w-full" }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // Step 3: payment ke baad backend se verify karwao, phir user ko refresh karo
  const verifyPayment = async (response) => {
    try {
      // response mein razorpay_order_id, razorpay_payment_id, razorpay_signature hote hain
      await axios.post(BASE_URL + "/payment/verify", response, {
        withCredentials: true,
      });

      // Updated user (isPremium: true) wapas lao, taaki blue tick turant dikhe
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user));

      toast.success("Payment successful! You are now a Premium member.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Payment was taken but verification failed. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Razorpay script load karo
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load Razorpay. Check your internet and try again.");
        setLoading(false);
        return;
      }

      // Step 2: backend se order banwao (amount backend decide karta hai, frontend nahi)
      const res = await axios.post(
        BASE_URL + "/payment/create",
        { plan },
        { withCredentials: true }
      );
      const { orderId, amount, currency, keyId } = res.data;

      // Razorpay checkout popup ke options
      const options = {
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "DevConnect",
        description: "Premium membership",
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.emailId || "",
        },
        theme: { color: "#ef4b6c" },
        handler: verifyPayment, // payment successful hone par chalega
        modal: {
          ondismiss: () => setLoading(false), // user ne popup band kar diya
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not start the payment. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading} className={className}>
      {loading && <span className="loading loading-spinner loading-sm" />}
      {loading ? "Processing..." : label}
    </button>
  );
};

export default Payment;