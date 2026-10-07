import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";

const linkClass = "text-base-content/60 transition hover:text-primary";

const Footer = () => {
  const user = useSelector((store) => store.user);

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <Link to="/" aria-label="DevConnect home">
            <Logo tagline />
          </Link>

          {/* Links (login ke baad hi dikhte hain) */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {user && (
              <>
                <Link to="/" className={linkClass}>
                  Feed
                </Link>
                <Link to="/connections" className={linkClass}>
                  Connections
                </Link>
                <Link to="/requests" className={linkClass}>
                  Requests
                </Link>
                <Link to="/profile" className={linkClass}>
                  Profile
                </Link>
              </>
            )}

            {/* TODO: yahan apna GitHub repo ka link daal dena */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              GitHub
            </a>
          </nav>

          <p className="text-xs text-base-content/50">
            © {new Date().getFullYear()} DevConnect
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;