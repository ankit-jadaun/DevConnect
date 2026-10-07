import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";
import { LogoMark } from "./Logo";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setSignupError("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
      return;
    }

    if (!emailRegex.test(emailId)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(BASE_URL + "/signup", {
        firstName,
        lastName,
        emailId,
        password,
      });

      setSuccessMessage(res.data.message || "Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setSignupError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto mb-4 h-14 w-14" />

          <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>

          <p className="mt-2 text-base-content/60">
            Join DevConnect and start connecting
          </p>
        </div>

        {/* Card */}
        <div className="card border border-base-300 bg-base-200 shadow-xl">
          <div className="card-body gap-5">
            {/* Signup Error */}
            {signupError && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <span>{signupError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div role="alert" className="alert alert-success alert-soft text-sm">
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignup} noValidate className="space-y-4">
              {/* First Name + Last Name (badi screen par side by side) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError("");
                      setSignupError("");
                    }}
                    required
                    className={`input w-full ${firstNameError ? "input-error" : ""}`}
                  />

                  {firstNameError && (
                    <p className="mt-1 text-xs text-error">{firstNameError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameError("");
                      setSignupError("");
                    }}
                    required
                    className={`input w-full ${lastNameError ? "input-error" : ""}`}
                  />

                  {lastNameError && (
                    <p className="mt-1 text-xs text-error">{lastNameError}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={emailId}
                  onChange={(e) => {
                    setEmailId(e.target.value);
                    setEmailError("");
                    setSignupError("");
                  }}
                  required
                  className={`input w-full ${emailError ? "input-error" : ""}`}
                />

                {emailError && (
                  <p className="mt-1 text-xs text-error">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>

                <div className={`input w-full ${passwordError ? "input-error" : ""}`}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setSignupError("");
                    }}
                    required
                    className="grow"
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {passwordError && (
                  <p className="mt-1 text-xs text-error">{passwordError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading && <span className="loading loading-spinner loading-sm" />}
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;