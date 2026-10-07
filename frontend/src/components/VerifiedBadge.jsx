// Blue tick: premium users ke naam ke saath dikhta hai
// Use: {user.isPremium && <VerifiedBadge />}
const VerifiedBadge = ({ className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-label="Premium member"
    className={`inline-block shrink-0 text-blue-500 ${className}`}
  >
    <title>Premium member</title>

    {/* Seal shape: ek square aur usi ka 45 degree ghooma hua square */}
    <g fill="currentColor">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" transform="rotate(45 12 12)" />
    </g>

    {/* Safed tick */}
    <path
      d="M8 12.4l2.6 2.6 5.4-5.6"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default VerifiedBadge;