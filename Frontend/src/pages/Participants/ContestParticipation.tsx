import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaTrophy, 
  FaUserPlus, 
  FaSpinner,
  FaDownload,
  FaMedal,
  FaUserFriends
} from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../components/common/DashboardLayout';

const ContestParticipation = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContestData();
    fetchLeaderboard();
  }, [contestId, currentPage]);

  const fetchContestData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/participation/${contestId}`);
      setContest(response.data);
    } catch (error) {
      console.error('Error fetching contest:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/participation/${contestId}/leaderboard?page=${currentPage}`
      );
      setLeaderboard(response.data.leaderboard);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/participation/${contestId}/register`, registrationForm);
      fetchContestData(); // Refresh contest data
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Registration error:', error);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/participation/${contestId}/export`);
      // Handle CSV download
      const blob = new Blob([JSON.stringify(response.data)], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contest-${contestId}-participants.csv`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <DashboardLayout>
<div className="min-h-screen bg-gray-900 p-6">
      {/* Contest Header */}
      <div className="mb-8">
        {contest && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-4">{contest.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaUserFriends className="w-5 h-5" />
                <span>{contest.participants?.length || 0} Participants</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaTrophy className="w-5 h-5" />
                <span>{contest.problems?.length || 0} Problems</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaMedal className="w-5 h-5" />
                <span>{contest.totalPoints || 0} Total Points</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Register for Contest</h2>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={registrationForm.fullName}
                  onChange={(e) => setRegistrationForm({
                    ...registrationForm,
                    fullName: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({
                    ...registrationForm,
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={registrationForm.phoneNumber}
                  onChange={(e) => setRegistrationForm({
                    ...registrationForm,
                    phoneNumber: e.target.value
                  })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FaUserPlus className="w-5 h-5" />
                <span>Register Now</span>
              </button>
            </form>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
              <button
                onClick={exportData}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-sm">
                        <th className="pb-4 text-left">Rank</th>
                        <th className="pb-4 text-left">Participant</th>
                        <th className="pb-4 text-right">Score</th>
                        <th className="pb-4 text-right">Problems Solved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((participant) => (
                        <tr 
                          key={participant._id}
                          className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              {participant.rank <= 3 && (
                                <FaTrophy className={`w-4 h-4 ${
                                  participant.rank === 1 ? 'text-yellow-500' :
                                  participant.rank === 2 ? 'text-gray-400' :
                                  'text-orange-500'
                                }`} />
                              )}
                              <span className="text-white">{participant.rank}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-white">{participant.fullName}</div>
                            <div className="text-gray-400 text-sm">{participant.email}</div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-white font-medium">{participant.totalScore}</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-gray-300">
                              {participant.problemStatus?.filter(p => p.status === 'solved').length || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
    
  );
};

export default ContestParticipation;