import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md bg-white/10 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
          <div className="text-white space-y-4">
            <p><span className="font-semibold">Name:</span> {user.fullname}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
          <div className="mt-6">
            <a
              href="/edit-profile"
              className="block w-full text-center py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
