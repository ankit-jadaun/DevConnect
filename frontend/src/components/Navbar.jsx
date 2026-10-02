import Logo from "./Logo";
import { useSelector, useDispatch } from "react-redux";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";

// Desktop par navbar ke beech mein, mobile par avatar dropdown ke andar
const navLinks = [
  { to: "/", label: "Feed" },
  { to: "/connections", label: "Connections" },
  { to: "/requests", label: "Requests" },
];

// Theme ke naam (index.css mein jo name rakhe hain wahi)
const DARK = "devconnect";
const LIGHT = "devconnect-light";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Theme: pehle localStorage se uthao, nahi mila to dark
  const [theme, setTheme] = useState(localStorage.getItem("theme") || DARK);

  // Theme badalte hi <html data-theme="..."> set karo aur yaad rakho
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === DARK ? LIGHT : DARK);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Dropdown ko click ke baad band karne ke liye
  const closeDropdown = () => document.activeElement?.blur();

  useEffect(() => {
    if (user?.firstName) {
      toast.success(`Welcome back, ${user.firstName}`, {
        description: "Great to see you again!",
        duration: 1000,
      });
    }
  }, [user?.firstName]);

  return (
    <>
      <div className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-200/80 px-4 backdrop-blur">
        {/* Logo / Brand */}
        <div className="navbar-start">
          <Link to={"/"} aria-label="DevConnect home" className="btn btn-ghost h-12 px-2">
            <Logo />
          </Link>
        </div>

        {/* Desktop links (mobile par hide) */}
        {user && (
          <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end
                    className={({ isActive }) => (isActive ? "menu-active" : "")}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="navbar-end gap-1">
          {/* Theme toggle (login se pehle bhi dikhta hai) */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label={theme === DARK ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === DARK ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Profile Dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open profile menu"
              >
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-200">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="DevConnect Profile" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-neutral text-lg font-semibold text-neutral-content">
                      {user.firstName?.[0]}
                    </span>
                  )}
                </div>
              </div>

              <ul
                tabIndex={-1}
                onClick={closeDropdown}
                className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-200 p-2 shadow-lg"
              >
                <li className="menu-title">
                  {user.firstName} {user.lastName}
                </li>

                {/* Ye 3 links sirf mobile par dikhte hain */}
                {navLinks.map((link) => (
                  <li key={link.to} className="md:hidden">
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}

                <li>
                  <Link to={"/profile"}>Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Toaster
        position="top-right"
        offset={{ top: "80px", right: "10px" }}
        theme={theme === DARK ? "dark" : "light"}
      />
    </>
  );
};

export default Navbar;