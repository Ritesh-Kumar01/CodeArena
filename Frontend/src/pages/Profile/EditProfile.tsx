import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaSave, FaTimes } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import DashboardLayout from "../../components/common/DashboardLayout";
import { Link } from "react-router-dom";

interface FormData {
  fullname: string;
  email: string;
}

interface FormErrors {
  fullname: string;
  email: string;
}

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    fullname: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load profile data.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: FormErrors = { fullname: "", email: "" };

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Name is required";
      valid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const token = localStorage.getItem("token");
        await axios.put("http://localhost:5000/api/user/profile", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Profile updated successfully");
      } catch (err) {
        alert("Failed to update profile. Please try again later.");
      }
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Edit Profile Form Card */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                {errors.fullname && (
                  <p className="mt-2 text-sm text-red-400">{errors.fullname}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!successMessage ? (
                  <>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      <FaSave />
                      Save Changes
                    </button>
                    <Link
                      to="/profile"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      <FaTimes />
                      Cancel
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-700 px-4 py-3 rounded-lg">
                      <p className="text-green-400 text-center font-medium">
                        {successMessage}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      <FaUser />
                      View Profile
                    </Link>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;