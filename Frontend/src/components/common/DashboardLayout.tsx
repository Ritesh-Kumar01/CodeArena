import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaListAlt, FaCalendarAlt, FaChartLine, FaUserFriends, FaPlay } from 'react-icons/fa';
import { FaCode, FaHistory, FaUserClock, FaCheckCircle } from 'react-icons/fa';
import { FaBars, FaTachometerAlt, FaTrophy, FaTimes, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import axios from 'axios';

// User Dropdown Component
const UserDropdown = ({ user, onLogout, isSidebarOpen, isHeader = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 4) return `${username[0]}****@${domain}`;
    const firstTwo = username.slice(0, 2);
    const lastTwo = username.slice(-2);
    return `${firstTwo}****${lastTwo}@${domain}`;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 ${
          isHeader ? 'p-2' : 'p-4'
        } bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200`}
      >
        <FaUserCircle className={`${isHeader ? 'h-8 w-8' : 'h-10 w-10'} text-gray-400`} />
        {((isSidebarOpen && !isHeader) || (isHeader && !isMobile)) && user && (
          <div className="flex-1 text-left">
            <p className="text-md font-medium text-gray-100">{user.fullname}</p>
            <p className="text-xs text-gray-400">{maskEmail(user.email)}</p>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${
          isHeader ? 'right-0 top-full mt-2' : 'bottom-full left-0 mb-2'
        } w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50`}>
          {(!isSidebarOpen || isHeader || isMobile) && (
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-gray-100">{user?.fullname}</p>
              <p className="text-xs text-gray-400">{user?.email ? maskEmail(user.email) : ''}</p>
            </div>
          )}
          <Link
            to="/settings"
            className="flex items-center font-semibold gap-2 px-4 py-3 text-gray-100 hover:bg-gray-700 transition-colors duration-200"
          >
            <FaCog size={16} />
            <span>Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center font-semibold gap-2 px-4 py-3 text-red-500 hover:bg-red-500/20 hover:text-red-500 transition-colors duration-200"
          >
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Navigation Link Component
const NavLink = ({ to, icon, label, showLabel }) => (
  <Link
    to={to}
    className="flex items-center gap-4 rounded-lg px-4 py-3 text-gray-100 hover:bg-gray-800 transition-colors duration-200"
  >
    {icon}
    {showLabel && <span className="text-sm font-semibold">{label}</span>}
  </Link>
);

// Main Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenMenus([]); // Close all submenus when sidebar collapses
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      fetchProfile();
    }
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const toggleMenu = (menuId) => {
    if (isSidebarOpen) {
      setOpenMenus(prev => 
        prev.includes(menuId) 
          ? prev.filter(id => id !== menuId)
          : [...prev, menuId]
      );
    } else {
      // If sidebar is collapsed, open it when clicking on a menu
      setIsSidebarOpen(true);
    }
  };

  const isMenuOpen = (menuId) => openMenus.includes(menuId);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          isSidebarOpen ? 'md:w-64' : 'md:w-20'
        } fixed md:relative inset-y-0 left-0 z-30 bg-gray-900 transition-all duration-300 transform h-full flex flex-col`}
      >
        {/* Mobile Close Button */}
        {isMobile && isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-white md:hidden"
          >
            <FaTimes size={24} />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 to-indigo-600">
          <FaTrophy className="text-yellow-400" size={22} />
          {(isSidebarOpen || isMobile) && (
            <span className="ml-2 text-xl font-semibold text-white">CodeArena</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <NavLink 
            to="/dashboard" 
            icon={<FaTachometerAlt size={20} />} 
            label="Dashboard" 
            showLabel={isSidebarOpen || isMobile} 
          />
          <NavLink 
            to="/profile" 
            icon={<ImProfile size={20} />} 
            label="Profile" 
            showLabel={isSidebarOpen || isMobile} 
          />
          <NavLink 
            to="/problems" 
            icon={<BsFillQuestionSquareFill size={20} />} 
            label="Problems" 
            showLabel={isSidebarOpen || isMobile} 
          />

          {/* Contests Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('contests')}
              className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-gray-100 hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <FaTrophy size={20} />
                {(isSidebarOpen || isMobile) && (
                  <span className="text-sm font-medium">Contests</span>
                )}
              </div>
              {(isSidebarOpen || isMobile) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isMenuOpen('contests') ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            
            {isMenuOpen('contests') && (isSidebarOpen || isMobile) && (
              <div className="mt-2 ml-4 space-y-1">
                <Link
                  to="/contests"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaListAlt size={16} />
                  <span>All Contests</span>
                </Link>
                <Link
                  to="/contests/upcoming"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaCalendarAlt size={16} />
                  <span>Upcoming Contests</span>
                </Link>
                <Link
                  to="/contests/ongoing"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaPlay size={16} />
                  <span>Ongoing Contests</span>
                </Link>
                <Link
                  to="/contests/past"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaHistory size={16} />
                  Past Contests
                </Link>
                <Link
                  to="/contests/rankings"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaChartLine size={16} />
                  <span>Rankings</span>
                </Link>
                <Link
                  to="/contests/registered"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaUserFriends size={16} />
                  <span>My Registrations</span>
                </Link>
              </div>
            )}
          </div>

          {/* Submissions Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('submissions')}
              className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-gray-100 hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <FaCode size={20} />
                {(isSidebarOpen || isMobile) && (
                  <span className="text-sm font-medium">Submissions</span>
                )}
              </div>
              {(isSidebarOpen || isMobile) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isMenuOpen('submissions') ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            
            {isMenuOpen('submissions') && (isSidebarOpen || isMobile) && (
              <div className="mt-2 ml-4 space-y-1">
                <Link
                  to="/submissions/all"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaHistory size={16} />
                  <span>All Submissions</span>
                </Link>
                <Link
                  to="/submissions/my"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaUserClock size={16} />
                  <span>My Submissions</span>
                </Link>
                <Link to="/submissions/accepted"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 font-semibold text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                >
                  <FaCheckCircle size={16} />
                  <span>Accepted</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer with User Dropdown */}
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-700 p-4">
          <UserDropdown
            user={user}
            onLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            className="w-full"
          />
        </div>
      </aside>

{/* Main Content Section */}
<div className="flex-1 flex flex-col overflow-hidden">
  {/* Header */}
  <header className="bg-gray-900 text-white h-16 flex items-center justify-between px-4">
    <div className="flex items-center justify-center self-center w-full md:justify-start">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Logo */}
      <div className="flex items-center mx-auto md:hidden">
        <FaTrophy className="text-yellow-400" size={22} />
        <span className="ml-2 text-xl font-semibold ml-2">CodeArena</span>
      </div>
    </div>

    {/* Header User Dropdown */}
    <UserDropdown
      user={user}
      onLogout={handleLogout}
      isSidebarOpen={isSidebarOpen}
      isHeader={true}
      className="w-fit"
    />
  </header>

  {/* Main Content Area */}
  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      children
    )}
  </main>
</div>


      </div>
  );
};

export default DashboardLayout;