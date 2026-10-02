import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { toast } from "sonner";
import UserCard from "./UserCard";

const EditProfile = () => {
  const user = useSelector((store) => store.user);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Error message + save button loading
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Prefill logged-in user data
  useEffect(() => {
    if (!user) return; // If user is not available, do nothing
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setSkills(user.skills?.join(", ") || "");
    setAbout(user.about || "");
    setAge(user.age || "");
    setGender(user.gender || "");
    setPhotoUrl(user.photoUrl || "");
  }, [user]); // Update form fields when user data changes

  // Convert skills string into array ("React, Node" -> ["React", "Node"])
  const skillsArray = skills
    .split(",") // Split by commas
    .map((skill) => skill.trim()) // Trim whitespace
    .filter((skill) => skill); // Filter out empty strings

  // Handle Edit Profile
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    // Basic validation
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    setSaving(true);

    try {
      // Update profile API
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          skills: skillsArray,
          about,
          age,
          gender,
          photoUrl,
        },
        {
          withCredentials: true,
        }
      );

      // Success notification
      toast.success(res.data.message || "Profile updated successfully!");
    } catch (error) {
      // Backend error message
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Live preview user (khali fields par placeholder text dikhega)
  const previewUser = {
    firstName: firstName || "First Name",
    lastName: lastName || "Last Name",
    skills: skillsArray,
    about: about || "Your about section will appear here...",
    age,
    gender,
    photoUrl,
  };

  return (
    <div className="flex-1 px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
        {/* Edit Profile Form */}
        <div className="card w-full max-w-2xl border border-base-300 bg-base-200 shadow-xl">
          <div className="card-body gap-6 p-6 sm:p-8">
            {/* Heading */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Edit Profile</h1>
              <p className="mt-1 text-base-content/60">Update your DevConnect profile</p>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-5">
              {/* First Name + Last Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="mb-1 block text-sm font-medium">
                  Skills
                </label>
                <input
                  id="skills"
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="input w-full"
                />
                <p className="mt-1 text-xs text-base-content/50">
                  Separate skills with commas
                </p>
              </div>

              {/* About */}
              <div>
                <label htmlFor="about" className="mb-1 block text-sm font-medium">
                  About
                </label>
                <textarea
                  id="about"
                  placeholder="Tell something about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="4"
                  className="textarea w-full resize-none"
                />
              </div>

              {/* Age + Gender */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="age" className="mb-1 block text-sm font-medium">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="mb-1 block text-sm font-medium">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label htmlFor="photoUrl" className="mb-1 block text-sm font-medium">
                  Photo URL
                </label>
                <input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input w-full"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div role="alert" className="alert alert-error alert-soft text-sm">
                  <span>{error}</span>
                </div>
              )}

              {/* Save Button */}
              <button type="submit" disabled={saving} className="btn btn-primary w-full">
                {saving && <span className="loading loading-spinner loading-sm" />}
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>

        {/* Live Preview: ye wahi UserCard hai jo feed mein dikhta hai */}
        <div className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:mx-0">
          <h2 className="mb-4 text-xl font-bold">Live Preview</h2>

          <UserCard user={previewUser} preview />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;