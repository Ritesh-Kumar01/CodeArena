import React, { useState, useEffect } from 'react';
import { FaBars, FaTachometerAlt, FaUserCircle, FaTrophy } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setLoading(false);
        } catch (err: any) {
            // setError("Failed to load profile. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin'); // Redirect to login if token is missing
        } else {
            setIsLoggedIn(true);
            fetchProfile(); // Fetch user profile on mount
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/signin");
        window.location.reload();
    };

    const maskEmail = (email: string): string => {
        const [username, domain] = email.split('@');
        if (username.length <= 4) {
            return `${username[0]}****@${domain}`;
        }
        const firstTwo = username.slice(0, 2);
        const lastTwo = username.slice(-2);
        return `${firstTwo}****${lastTwo}@${domain}`;
    };

    

    return (
        <div className="flex dark">
            {/* Sidebar */}
            <div className={`bg-gray-900 ${isSidebarOpen ? 'w-[350px]' : 'w-20'} transition-all duration-300`}>
                <span className="flex items-center justify-center gap-2 py-[20px] text-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-md">
                    <FaTrophy className="text-yellow-400" size={22} />
                    <span className='text-xl'>{isSidebarOpen ? 'CodeArena' : ''}</span>
                </span>

                <div className="flex h-screen flex-col justify-between border-e bg-gray-900">
                    {/* Sidebar Header */}
                    <div className="px-4 py-2">
                        {/* Menu Items */}
                        <ul className="mt-6 space-y-1">
                        <li>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-4 rounded-lg px-4 py-3 text-md font-medium text-gray-100 hover:bg-gray-800"
                                >
                                    <FaTachometerAlt size={20} />
                                    {isSidebarOpen && <span>Dashboard</span>}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-4 rounded-lg px-4 py-3 text-md font-medium text-gray-100 hover:bg-gray-800"
                                >
                                    <FaTachometerAlt size={20} />
                                    {isSidebarOpen && <span>Profile</span>}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/problems"
                                    className="flex items-center gap-4 rounded-lg px-4 py-3 text-md font-medium text-gray-100 hover:bg-gray-800"
                                >
                                    <FaTachometerAlt size={20} />
                                    {isSidebarOpen && <span>Problems</span>}
                                </Link>
                            </li>

                            <li>
                                <details className="group [&_summary::-webkit-details-marker]:hidden">
                                    <summary
                                        className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-100 hover:bg-gray-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <FaTrophy size={20} />
                                            {isSidebarOpen && <span className="text-md font-medium">Contests</span>}
                                        </div>

                                        {isSidebarOpen && (
                                            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="size-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </summary>

                                    <ul className="mt-2 space-y-1 px-4">
                                        <li>
                                            <Link
                                                to="/contests"
                                                className="block rounded-lg px-4 py-3 text-md font-medium text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                                            >
                                                All contests
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-700 p-4">
                        <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700">
                            <FaUserCircle className="h-10 w-10 text-gray-400" />
                            {isSidebarOpen && !loading && user && (
                                <div>
                                    <p className="text-md font-medium text-gray-100 ">{user.fullname}</p>
                                    
                                    <p className="text-xs text-gray-400">{maskEmail(user.email)}</p>
                                </div>
                            )}
                        </div>
                        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-gray-100 dark:bg-gray-800 w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shadow-md sm:px-6 lg:px-8">
                    <button
                        onClick={toggleSidebar}
                        className="text-white hover:bg-gray-700 p-2 rounded-md focus:outline-none"
                    >
                        <FaBars size={20} />
                    </button>

                    <Link
                        className="mt-4 block rounded-lg bg-red-600 px-5 py-3 text-center text-sm font-medium text-gray-100 transition hover:bg-red-500 focus:outline-none sm:mt-0"
                        onClick={handleLogout}
                    >
                        Logout
                    </Link>
                </div>

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;
