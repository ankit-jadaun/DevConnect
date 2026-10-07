import { useSelector } from "react-redux";
import Payment from "./Payment";
import VerifiedBadge from "./VerifiedBadge";

// Premium ke fayde
const benefits = [
  {
    icon: "🚀",
    title: "Priority in feed",
    text: "Your profile is shown first to other developers.",
  },
  {
    icon: "⭐",
    title: "Super Like",
    text: "Stand out from the crowd and get noticed first.",
  },
  {
    icon: "✔️",
    title: "Blue tick",
    text: "A verified badge on your profile and cards.",
  },
];

// Plans: yahan sirf dikhane ke liye hain. Asli price backend ke utils/plans.js se aata hai,
// isliye dono jagah same rakhna.
const plans = [
  { id: "monthly", name: "Monthly", price: 199, period: "month", note: "Cancel anytime" },
  { id: "yearly", name: "Yearly", price: 1499, period: "year", note: "Save 37%", popular: true },
];

const Premium = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="flex-1 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Go <span className="brand-gradient-text">Premium</span>
          </h1>
          <p className="mt-3 text-base-content/60">
            Unlock Super Likes, a blue tick and a top spot in everyone's feed.
          </p>
        </div>

        {/* Already premium */}
        {user?.isPremium && (
          <div role="alert" className="alert alert-success alert-soft mb-8">
            <VerifiedBadge />
            <span>
              You're a Premium member
              {user.premiumExpiry &&
                ` until ${new Date(user.premiumExpiry).toLocaleDateString()}`}
              . Buy again to extend it.
            </span>
          </div>
        )}

        {/* Benefits */}
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="card border border-base-300 bg-base-200"
            >
              <div className="card-body gap-2 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-xl">
                  {benefit.icon}
                </div>
                <h2 className="font-bold">{benefit.title}</h2>
                <p className="text-sm text-base-content/60">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card bg-base-200 shadow-xl ${
                plan.popular
                  ? "border-2 border-primary"
                  : "border border-base-300"
              }`}
            >
              <div className="card-body gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  {plan.popular && (
                    <span className="badge badge-primary">Best value</span>
                  )}
                </div>

                <p>
                  <span className="text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="text-base-content/60"> / {plan.period}</span>
                </p>

                <p className="text-sm text-base-content/60">{plan.note}</p>

                <Payment
                  plan={plan.id}
                  label={user?.isPremium ? "Extend Premium" : "Get Premium"}
                  className={`btn w-full ${plan.popular ? "btn-primary" : "btn-outline"}`}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-base-content/50">
          Secure payments powered by Razorpay.
        </p>
      </div>
    </div>
  );
};

export default Premium;