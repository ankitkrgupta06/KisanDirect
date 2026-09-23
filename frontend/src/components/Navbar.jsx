import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    label: "Home",
    to: "/",
    description: "Return to the KisanDirect home and discover our connected agriculture platform.",
  },
  {
    label: "Explore",
    to: "/marketplace",
    description: "Explore fresh produce, buyers and opportunities across the KisanDirect marketplace.",
  },
  {
    label: "Logistics",
    to: "/logistics",
    description: "Sign in to access your KisanDirect account, tools and personal dashboard.",
  },
  {
    label: "Forecast",
    to: "/forecast",
    description: "Sign in to access your KisanDirect account, tools and personal dashboard.",
  },
  {
    label: "Start Now",
    to: "/register",
    description: "Create your account and start connecting with agriculture opportunities today.",
  },
  {
    label: "Login",
    to: "/login",
    description: "Sign in to access your KisanDirect account, tools and personal dashboard.",
  },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Home");
  const isHome = location.pathname === "/";
  const handleHomeClick = (event) => {
  event.preventDefault();
  setMenuOpen(false);

  if (location.pathname === "/") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 150);
  }
};


  const dashboardPath = user?.role === "farmer" ? "/farmer" : user?.role === "buyer" ? "/buyer" : "/";

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("kd-menu-open", menuOpen);
    return () => document.body.classList.remove("kd-menu-open");
  }, [menuOpen]);

  return (
    <>
      <nav
  className={`home-navbar ${
    isHome ? "home-navbar-home" : "home-navbar-inner"
  } ${menuOpen ? "navbar-menu-open" : ""}`}
>
        <div className="home-navbar-brand">
          <Link to="/" className="home-navbar-logo" aria-label="KisanDirect home">
            <span>Kisan</span>
            <span>Direct</span>
          </Link>
        </div>

        <div className="home-navbar-actions">
          <Link
            to="/"
            className="home-navbar-link home-navbar-home-link"
            onClick={handleHomeClick}
          >
            HOME
          </Link>

          <Link to="/marketplace" className="home-navbar-link home-navbar-explore-link">
            EXPLORE
          </Link>

          <Link to="/register" className="home-navbar-primary">
            START NOW
          </Link>

          <Link to="/login" className="home-navbar-login">
            LOGIN
          </Link>

          {user && (
            <Link to={dashboardPath} className="home-navbar-user">
              Hi {user.name}!
            </Link>
          )}

          <motion.button
            type="button"
            className="home-navbar-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open);
              setActiveMenuItem("Home");
            }}
            whileHover={{ scale: 1.08, rotate: menuOpen ? -4 : 4 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                >
                  <X size={31} strokeWidth={2.3} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                >
                  <Menu size={31} strokeWidth={2.3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="kd-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="kd-menu-noise" aria-hidden="true" />

            <motion.div
              className="kd-menu-leaf kd-menu-leaf-one"
              initial={{ opacity: 0, scale: 0, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            />
            <motion.div
              className="kd-menu-leaf kd-menu-leaf-two"
              initial={{ opacity: 0, scale: 0, rotate: 25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            />
            <motion.div
              className="kd-menu-leaf kd-menu-leaf-three"
              initial={{ opacity: 0, scale: 0, rotate: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
            />

            <div className="kd-menu-header">
              <Link to="/" className="kd-menu-logo" onClick={() => setMenuOpen(false)}>
                <span>Kisan</span>
                <span>Direct</span>
              </Link>

              <button
                type="button"
                className="kd-menu-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X size={40} strokeWidth={2.1} />
              </button>
            </div>

            <div className="kd-menu-content">
              <div className="kd-menu-links" aria-label="Main navigation">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="kd-menu-item"
                    initial={{ opacity: 0, x: -45 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.to}
                      onMouseEnter={() => setActiveMenuItem(item.label)}
                      onFocus={() => setActiveMenuItem(item.label)}
                      onClick={(event) => {
                        if (item.label === "Home") {
                          handleHomeClick(event);
                        } else {
                          setMenuOpen(false);
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={22} strokeWidth={2.2} />
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    className="kd-menu-item kd-menu-user-item"
                    initial={{ opacity: 0, x: -45 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.36, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={dashboardPath}
                      onMouseEnter={() => setActiveMenuItem("Hi " + user.name + "!")}
                      onFocus={() => setActiveMenuItem("Hi " + user.name + "!")}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>Hi {user.name}!</span>
                      <ArrowUpRight size={22} strokeWidth={2.2} />
                    </Link>
                  </motion.div>
                )}
              </div>

              <motion.aside
                className="kd-menu-contact"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.7 }}
              >
                <div className="kd-menu-preview" aria-live="polite">
                  <span className="kd-menu-label">EXPLORE THIS PAGE</span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMenuItem}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3>{activeMenuItem}</h3>
                      <p>
                        {activeMenuItem === "Hi " + user?.name + "!"
                          ? "Open your personal dashboard and manage your KisanDirect activity."
                          : menuItems.find((item) => item.label === activeMenuItem)?.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="kd-menu-contact-details">
                  <span className="kd-menu-label kd-menu-label-spaced">CONTACT</span>
                  <a href="mailto:kisandirect@example.com">kisandirect@example.com</a>

                  {user && (
                    <button type="button" className="kd-menu-logout" onClick={handleLogout}>
                      LOG OUT
                    </button>
                  )}
                </div>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
