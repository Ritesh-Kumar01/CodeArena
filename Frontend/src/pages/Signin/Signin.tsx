import React, { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import axios from "axios";

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    // const newErrors: { [key: string]: string } = {};
    const newErrors: { email: string; password: string; } = { email: "", password: "" };


    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/user/login", formData);
        
        localStorage.setItem("token", response.data.token);
  
        // Reset form after successful login
        setFormData({
          email: "",
          password: "",
        });

        navigate("/dashboard");

      } catch (error: any) {
        console.error("There was an error logging in the user!", error);
        const errMessage = error.response?.data?.message || "An error occurred. Please try again.";
        alert(errMessage);
      }
    }
  };
  

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <Navbar/>
      <div className="w-full xl:mx-auto max-w-8xl flex h-full shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-10">
          <div className="w-full max-w-sm space-y-4 bg-white/10 p-8 rounded-xl text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white">Sign In</h1>
              <p className="text-gray-100">Please login to access your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 font-semibold rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="bg-red-500 text-white px-2 py-1 font-semibold text-sm">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white font-semibold placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="bg-red-500 text-white px-2 py-1 font-semibold text-sm">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="text-sm text-gray-100 font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none"
              >
                Submit
              </button>
            </form>
            <p className="text-gray-100">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-violet-100 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <div className="absolute inset-0 bg-opacity-30"></div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-40rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>

          <div
            className="absolute inset-x-0 -top-40 z-10 transform-gpu overflow-hidden blur-2xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-start p-10 space-y-6 text-white">
            <h1 className="text-3xl font-bold">Welcome Back to CodeArena!</h1>
            <p className="text-gray-300">
              Dive back into competitive coding, collaborate, and enhance your
              skills with real-time contests.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✔</span>
                Participate in live coding contests
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✔</span>
                Practice with a wide range of problems
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✔</span>
                Collaborate with fellow coders
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✔</span>
                Get insights and detailed solutions
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✔</span>
                And much more!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
