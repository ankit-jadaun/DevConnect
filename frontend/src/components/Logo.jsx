// Sirf icon: gradient box ke andar "< • >" (code brackets + beech mein connection ka dot)
// Size badalni ho to className do, jaise <LogoMark className="h-14 w-14" />
export const LogoMark = ({ className = "h-9 w-9" }) => (
  <span
    className={`brand-gradient inline-flex shrink-0 items-center justify-center rounded-xl text-white shadow-md shadow-primary/30 ${className}`}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3/5 w-3/5"
      aria-hidden="true"
    >
      <path d="M9 7l-5 5 5 5" />
      <path d="M15 7l5 5-5 5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  </span>
);

// Icon + "DevConnect" naam. tagline dena ho to <Logo tagline />
const Logo = ({ tagline = false }) => (
  <span className="inline-flex items-center gap-2.5">
    <LogoMark />

    <span className="flex flex-col leading-none">
      <span className="text-xl font-extrabold tracking-tight">
        Dev<span className="brand-gradient-text">Connect</span>
      </span>

      {tagline && (
        <span className="mt-1 text-xs font-medium text-base-content/50">
          Connect. Code. Grow.
        </span>
      )}
    </span>
  </span>
);

export default Logo;