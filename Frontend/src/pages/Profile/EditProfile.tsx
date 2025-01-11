import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (err: any) {
        alert("Failed to load profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    // const newErrors: { [key: string]: string } = {};
    const newErrors: { fullname: string; email: string } = { fullname: "", email: "" };


    if (!formData.fullname) {
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
      } catch (err: any) {
        alert("Failed to update profile. Please try again later.");
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md bg-white/10 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your name"
              />
              {errors.fullname && (
                <p className="bg-red-500 text-white px-2 py-1 font-semibold text-sm">
                  {errors.fullname}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="bg-red-500 text-white px-2 py-1 font-semibold text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            {!successMessage && (
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none"
            >
              Save Changes
            </button>
            )}
          </form>
          {successMessage && (
            <>
            <p className="mt-4 text-green-400 font-semibold text-center">
              {successMessage}
            </p>
            <div className="mt-6">
            <a
              href="/profile"
              className="block w-full text-center py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              View Profile
            </a>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;