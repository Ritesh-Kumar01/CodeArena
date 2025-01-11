import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaUserShield, FaClock, FaEdit } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import DashboardLayout from "../../components/common/DashboardLayout";

interface User {
  fullname: string;
  email: string;
  role: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({
    fullname: "",
    email: "",
    role: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <IoMdRefresh className="animate-spin text-2xl" />
            <span>Loading profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-red-500 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-4 border-gray-600">
                <FaUser className="text-4xl text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.fullname}</h1>
              <span className="px-4 py-1.5 bg-gray-700 rounded-full text-sm text-gray-200 font-medium border border-gray-600">
                {user.role}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Details</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-gray-200">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FaUser className="text-xl text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="font-medium">{user.fullname}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-200">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-xl text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-200">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FaUserShield className="text-xl text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-200">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FaClock className="text-xl text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/edit-profile"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <FaEdit />
                Edit Profile
              </Link>
              <button
                onClick={fetchProfile}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <IoMdRefresh />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;