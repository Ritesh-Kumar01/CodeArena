import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaChevronRight, 
  FaSpinner,
  FaPencilAlt,
  FaTrash,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';

import DashboardLayout from '../../components/common/DashboardLayout';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, contestTitle, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Delete Contest</h3>
          <p className="text-gray-300 mb-2">Are you sure you want to delete:</p>
          <p className="text-white font-medium mb-6">{contestTitle}?</p>
          <p className="text-gray-300 mb-6">This action cannot be undone.</p>

          <div className="flex space-x-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Existing utility functions
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

const ContestCard = ({ contest, onSelect, onDelete }) => {
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const checkCreatorStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsCreator(response.data._id === contest.createdBy._id);
      } catch (error) {
        console.error('Error checking creator status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contest && contest.createdBy) {
      checkCreatorStatus();
    }
  }, [contest]);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/contests/${contest._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleteModalOpen(false);
      onDelete(contest._id);
    } catch (error) {
      console.error('Error deleting contest:', error);
      // You might want to show an error message here
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCardClick = (e) => {
    // Only navigate if the click wasn't on the action buttons
    if (!e.target.closest('.action-buttons')) {
      onSelect(contest._id);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
      >
        {!loading && isCreator && contest.status === 'upcoming' && (
          <div className="action-buttons absolute top-4 right-4 flex items-center gap-2 opacity-1 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/contests/edit/${contest._id}`}
              className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPencilAlt className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        )}

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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        contestTitle={contest.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </>
  );
};

// EmptyState component remains the same
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

// Main Contests component with delete handling
const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/contests", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleDelete = (contestId) => {
    setContests(prevContests => prevContests.filter(contest => contest._id !== contestId));
  };

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
                  onDelete={handleDelete}
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