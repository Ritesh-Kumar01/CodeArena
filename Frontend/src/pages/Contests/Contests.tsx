import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaChevronRight, 
  FaSpinner 
} from 'react-icons/fa';
import DashboardLayout from '../../components/common/DashboardLayout';

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDuration = (startTime, endTime) => {
  const diff = new Date(endTime) - new Date(startTime);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const getStatusStyle = (status) => {
  const styles = {
    upcoming: 'bg-blue-500/10 text-blue-500 border-blue-500',
    ongoing: 'bg-green-500/10 text-green-500 border-green-500',
    completed: 'bg-gray-500/10 text-gray-500 border-gray-500'
  };
  return styles[status] || styles.completed;
};

// Contest card component
const ContestCard = ({ contest, onSelect }) => (
  <div
    onClick={() => onSelect(contest._id)}
    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
  >
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold text-white">{contest.title}</h2>
        <p className="text-gray-300 line-clamp-2">{contest.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4" />
            <span>Start: {formatDate(contest.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="w-4 h-4" />
            <span>Duration: {getDuration(contest.startTime, contest.endTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="w-4 h-4" />
            <span>{contest.participants.length} Participants</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(contest.status)}`}>
          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
        </span>
        <div className="flex items-center">
          <span className="text-gray-300 mr-2">{contest.problems.length} Problems</span>
          <FaChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ onCreate }) => (
  <div className="text-center py-12">
    <p className="text-gray-300 text-lg">No contests available</p>
    <button
      onClick={onCreate}
      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
    >
      Create Your First Contest
    </button>
  </div>
);

// Main Contests component
const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/contests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data?.contests);
        
        setContests(response.data?.contests || []);
        setError("");
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch contests";
        setError(errorMessage);
        console.error('Error fetching contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Contests</h1>
            <button
              onClick={() => navigate("/create-contest")}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              Create Contest
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {contests.length > 0 ? (
              contests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  onSelect={(id) => navigate(`/contests/${id}`)}
                />
              ))
            ) : (
              <EmptyState onCreate={() => navigate("/create-contest")} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contests;