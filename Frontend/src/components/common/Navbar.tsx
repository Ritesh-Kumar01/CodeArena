import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-6 px-8 z-50 transition-all duration-300 ${
        isScrolled ? " bg-slate-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="text-xl text-white flex items-center gap-2 font-bold">
          <div className="bg-blue-500 p-2 rounded-2xl">
            <FaCode className="w-6 h-6 text-yellow-400" />
          </div>
          Code<span className="text-yellow-400">Arena</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-gray-100">
          <li>
            <Link to="/" className="font-semibold text-white hover:text-gray-300 transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link to="/problems" className="font-semibold text-white hover:text-gray-300 transition-all">
              Problems
            </Link>
          </li>
          <li>
            <Link to="/contests" className="font-semibold text-white hover:text-gray-300 transition-all">
              Contests
            </Link>
          </li>
          {isLoggedIn ? (
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="font-semibold text-white hover:text-gray-300 transition-all"
              >
                Account
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 text-white rounded-lg shadow-lg p-4"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-600 rounded-lg"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 hover:bg-blue-600 rounded-lg"
                  >
                    Change Password
                  </Link>
                  <Link
                    to="/contests"
                    className="block px-4 py-2 hover:bg-blue-600 rounded-lg"
                  >
                    My Contests
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 mt-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/signin"
                  className="font-semibold text-white hover:text-gray-300 transition-all"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-gray-100 shadow-md hover:bg-blue-700 transition-all"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-100 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-800/80 backdrop-blur-md shadow-lg rounded-lg mt-4 p-4"
        >
          <ul className="space-y-4 text-gray-100">
            <li>
              <Link to="/" className="font-semibold text-white hover:text-gray-300 transition-all">
                Home
              </Link>
            </li>
            <li>
              <Link to="/contests" className="font-semibold text-white hover:text-gray-300 transition-all">
                Contests
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/profile" className="block hover:text-gray-300">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/change-password" className="block hover:text-gray-300">
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link to="/contests" className="block hover:text-gray-300">
                    My Contests
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signin" className="font-semibold text-white hover:text-gray-300 transition-all">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-gray-100 shadow-md hover:bg-blue-700 transition-all"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;