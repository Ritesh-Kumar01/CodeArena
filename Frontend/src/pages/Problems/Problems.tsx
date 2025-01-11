import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCode } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import DashboardLayout from "../../components/common/DashboardLayout";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  createdBy: {
    _id: string;
    fullname: string;
  };
}

interface User {
  _id: string;
  fullname: string;
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [userResponse, problemsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/problems"),
      ]);

      setUser(userResponse.data);
      setProblems(problemsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (problemId: string) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/problems/delete/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(problems.filter((p) => p._id !== problemId));
      } catch (err) {
        alert("Failed to delete problem. Please try again later.");
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'hard':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <IoMdRefresh className="animate-spin text-2xl" />
            <span>Loading problems...</span>
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
      <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Coding Problems</h1>
            <Link
              to="/create-problem"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <FaPlus className="text-sm" />
              Create New Problem
            </Link>
          </div>

          {/* Problems Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden hover:border-gray-600 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-white">{problem.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                    Created by: {problem.createdBy.fullname}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <Link
                      to={`/editor/${problem._id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-600"
                    >
                      <FaCode className="text-xs" />
                      Solve
                    </Link>
                    
                    {user && user._id === problem.createdBy._id && (
                      <>
                        <Link
                          to={`/edit-problem/${problem._id}`}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-600"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-red-500"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {problems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No problems found</p>
              <Link
                to="/create-problem"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600"
              >
                <FaPlus className="text-sm" />
                Create Your First Problem
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Problems;