import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { BASE_URL } from "../utils/constants";

import { toast } from "sonner";

import VerifiedBadge from "./VerifiedBadge";

// preview = true  ->  sirf dikhane ke liye (EditProfile ke live preview mein), swipe aur buttons band
const UserCard = ({ user, onAction, preview = false }) => {
  const {
    firstName,
    lastName,
    age,
    photoUrl,
    gender,
    about,
    skills,
    isPremium,
    _id,
  } = user;

  const cardRef = useRef(null);

  // Logged-in user (Super Like ke liye premium check)
  const me = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Swipe karte waqt "Interested" / "Ignore" ka stamp dikhane ke liye (0 se 1)
  const interestedOpacity = Math.min(Math.max(position.x / 120, 0), 1);
  const ignoreOpacity = Math.min(Math.max(-position.x / 120, 0), 1);

  // Send Connection Request
  const sendRequest = async (status) => {
    try {
      const res = await axios.post(
        BASE_URL + `/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );

      toast.success(
        status === "interested"
          ? "Connection request sent successfully"
          : status === "superliked"
          ? "Super Like sent!"
          : "User ignored successfully"
      );

      // Remove current user from feed
      onAction(_id);
    } catch (error) {
      console.error("Error sending request:", error);

      toast.error(
        error.response?.data?.error ||
          "Something went wrong. Please try again."
      );

      // Reset card if API fails
      setPosition({ x: 0, y: 0 });
    }
  };

  // Super Like: premium nahi hai to Premium page par bhej do
  const handleSuperLike = () => {
    if (!me?.isPremium) {
      toast("Super Like is a Premium feature", {
        description: "Upgrade to Premium to stand out.",
      });
      navigate("/premium");
      return;
    }

    sendRequest("superliked");
  };

  // Start dragging
  const handlePointerDown = (e) => {
    if (preview) return;

    setIsDragging(true);
    setStartX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Drag card
  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const x = e.clientX - startX;

    setPosition({
      x,
      y: Math.abs(x) * 0.08,
    });
  };

  // Release card
  const handlePointerUp = async () => {
    if (!isDragging) return;

    setIsDragging(false);

    const swipeThreshold = 120;

    // Swipe Right → Interested
    if (position.x > swipeThreshold) {
      setPosition({
        x: window.innerWidth,
        y: position.y,
      });

      await sendRequest("interested");
      return;
    }

    // Swipe Left → Ignore
    if (position.x < -swipeThreshold) {
      setPosition({
        x: -window.innerWidth,
        y: position.y,
      });

      await sendRequest("ignored");
      return;
    }

    // Not enough swipe → Return card to center
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 });
      }}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.08}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
        touchAction: "pan-y",
        cursor: preview ? "default" : isDragging ? "grabbing" : "grab",
      }}
      className="w-full select-none"
    >
      <div className="card overflow-hidden border border-base-300 bg-base-200 shadow-2xl">
        {/* Photo */}
        <figure className="relative h-72 sm:h-80">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="User Photo"
              draggable="false"
              className="h-full w-full object-cover"
            />
          ) : (
            // Photo nahi hai to naam ka pehla akshar
            <div className="brand-gradient flex h-full w-full items-center justify-center text-7xl font-extrabold text-white">
              {firstName?.[0] || "?"}
            </div>
          )}

          {/* Neeche se halka fade, taaki naam saaf dikhe */}
          <div className="absolute inset-0 bg-linear-to-t from-base-200 via-transparent to-transparent" />

          {/* Swipe stamps */}
          {!preview && (
            <>
              <span
                style={{ opacity: interestedOpacity }}
                className="absolute left-4 top-4 -rotate-12 rounded-lg border-2 border-success px-3 py-1 text-lg font-extrabold tracking-wide text-success"
              >
                INTERESTED
              </span>

              <span
                style={{ opacity: ignoreOpacity }}
                className="absolute right-4 top-4 rotate-12 rounded-lg border-2 border-error px-3 py-1 text-lg font-extrabold tracking-wide text-error"
              >
                IGNORE
              </span>
            </>
          )}

          {/* Name + age/gender */}
          <div className="absolute bottom-3 left-5 right-5">
            <h2 className="flex items-center gap-1.5 text-2xl font-extrabold">
              {firstName || "Unknown"} {lastName || ""}
              {isPremium && <VerifiedBadge />}
            </h2>

            <p className="text-sm capitalize text-base-content/70">
              {[age && `${age} years old`, gender].filter(Boolean).join(" • ")}
            </p>
          </div>
        </figure>

        {/* Card Body */}
        <div className="card-body gap-4 p-5">
          <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
            {about || "No information available about this user."}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {skills?.length > 0 ? (
              skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="badge badge-primary badge-soft">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-base-content/50">No skills added</span>
            )}

            {skills?.length > 5 && (
              <span className="badge badge-ghost">+{skills.length - 5} more</span>
            )}
          </div>

          {/* Buttons */}
          {!preview && (
            <div className="card-actions mt-2 flex-nowrap gap-2">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => sendRequest("ignored")}
                className="btn btn-outline flex-1 px-2"
              >
                Ignore
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleSuperLike}
                className="btn btn-info flex-1 px-2"
              >
                {me?.isPremium ? "★ Super Like" : "🔒 Super Like"}
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => sendRequest("interested")}
                className="btn btn-primary flex-1 px-2"
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;