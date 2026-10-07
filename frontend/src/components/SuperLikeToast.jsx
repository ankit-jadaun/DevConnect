import VerifiedBadge from "./VerifiedBadge";

// Super Like aane par dikhne wala notification card
// person = { firstName, lastName, photoUrl, isPremium }
const SuperLikeToast = ({ person, onView, onClose }) => (
  <div className="flex w-88 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-box border border-info/40 bg-base-200 p-3 shadow-2xl">
    {/* Photo */}
    <div className="avatar">
      <div className="w-12 rounded-full ring-2 ring-info ring-offset-2 ring-offset-base-200">
        {person.photoUrl ? (
          <img src={person.photoUrl} alt={person.firstName} />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-neutral text-lg font-semibold text-neutral-content">
            {person.firstName?.[0]}
          </span>
        )}
      </div>
    </div>

    {/* Text */}
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-wide text-info">★ Super Like</p>

      <p className="flex items-center gap-1 font-semibold">
        <span className="truncate">
          {person.firstName} {person.lastName}
        </span>
        {person.isPremium && <VerifiedBadge className="h-4 w-4" />}
      </p>

      <p className="text-sm text-base-content/60">super liked you!</p>
    </div>

    {/* Buttons */}
    <div className="flex flex-col gap-1">
      <button onClick={onView} className="btn btn-info btn-xs">
        View
      </button>
      <button onClick={onClose} className="btn btn-ghost btn-xs">
        Dismiss
      </button>
    </div>
  </div>
);

export default SuperLikeToast;