import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice.js";
import { BASE_URL } from "../utils/constants.js";
import { LogoMark } from "./Logo";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError(""); // Clear previous errors because we are validating again
    setPasswordError("");
    setLoginError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.user));

      navigate("/");
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
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

          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>

          <p className="mt-2 text-base-content/60">
            Login to your DevConnect account
          </p>
        </div>

        {/* Card */}
        <div className="card border border-base-300 bg-base-200 shadow-xl">
          <div className="card-body gap-5">
            {/* Login Error */}
            {loginError && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-4">
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
                    setLoginError("");
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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setLoginError("");
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
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up */}
        <p className="mt-6 text-center text-sm text-base-content/60">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;