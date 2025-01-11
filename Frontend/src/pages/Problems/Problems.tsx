import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/common/Navbar";

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null); // Store the logged-in user's data

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err);
      }
    };

    // Fetch problems
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/problems");
        setProblems(response.data);
        console.log(response.data);
        
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load problems. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData(); // Fetch user data
    fetchProblems(); // Fetch problems
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading problems...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Handle delete functionality
  const handleDelete = async (problemId: string) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/problems/delete/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setProblems(problems.filter((p: any) => p._id !== problemId));
      } catch (err) {
        alert("Failed to delete problem. Please try again later.");
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <Navbar />
      <h1 className="text-3xl font-bold text-white mb-6">Problems</h1>
      <Link
        to="/create-problem"
        className="mb-4 inline-block py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
      >
        Create New Problem
      </Link>
      <div className="mt-4 space-y-4">
        {problems.map((problem: any) => (
          <div key={problem._id} className="p-4 bg-white/10 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white">{problem.title}</h2>
            <p className="text-gray-300">Difficulty: {problem.difficulty}</p>

            <div className="mt-2 space-x-4">
              <Link
                to={`/editor/${problem._id}`}
                className="text-blue-400 hover:underline"
              >
                View
              </Link>
              
              {/* Conditionally render Edit and Delete buttons if the logged-in user is the creator */}
              {user && user._id === problem.createdBy._id && (
                <>
                  <Link
                    to={`/edit-problem/${problem._id}`}
                    className="text-yellow-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
