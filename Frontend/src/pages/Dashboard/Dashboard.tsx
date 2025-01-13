import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, 
  FaCode, 
  FaUsers, 
  FaCalendarAlt,
  FaChartLine,
  FaCalendarTimes ,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaExclamationCircle,
  FaChartBar
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import axios from 'axios';

const EmptyState = ({ icon: Icon, message, submessage }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Icon className="w-16 h-16 text-gray-600 mb-4" />
    <h3 className="text-xl font-medium text-gray-400 mb-2">{message}</h3>
    <p className="text-gray-500 text-sm">{submessage}</p>
  </div>
);

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [contests, setContests] = useState([]);
  const [submissionStats, setSubmissionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalSolved: 0,
    rank: 1234,
    successRate: 0,
    contestsParticipated: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Fetch recent submissions 
        const submissionsResponse = await axios.get('http://localhost:5000/api/submissions/my-submissions', { headers });
        
        // Format submissions data
        const formattedSubmissions = submissionsResponse.data.data.map(submission => ({
          id: submission._id,
          problem: submission.problemId.title,
          status: formatStatus(submission.status),
          time: getTimeDifference(submission.submittedAt),
          language: submission.language
        }));

        // Fetch contests
        const contestsResponse = await axios.get('http://localhost:5000/api/contests', { headers });
        
        // Format contests data - assuming the response has a data property
        const upcomingContests = (contestsResponse.data.contests || [])
          .filter(contest => contest.status === 'upcoming')
          .slice(0, 3)
          .map(contest => ({
            id: contest._id,
            title: contest.title,
            time: getTimeUntilStart(contest.startTime),
            participants: contest.participants?.length || 0
          }));

        // Calculate submission stats for past 7 days
        const stats = calculateSubmissionStats(submissionsResponse.data.data);

        // Calculate user statistics
        const acceptedSubmissions = submissionsResponse.data.data.filter(sub => sub.status === 'accepted');
        const totalSubmissions = submissionsResponse.data.data.length;
        
        setUserStats({
          totalSolved: acceptedSubmissions.length,
          rank: 1234, // This should come from an API endpoint
          successRate: totalSubmissions > 0 ? 
            Math.round((acceptedSubmissions.length / totalSubmissions) * 100) : 0,
          contestsParticipated: 15 // This should come from an API endpoint
        });

        setSubmissions(formattedSubmissions);
        setContests(upcomingContests);
        setSubmissionStats(stats);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatStatus = (status) => {
    const statusMap = {
      'accepted': 'Accepted',
      'wrong_answer': 'Wrong Answer',
      'runtime_error': 'Runtime Error',
      'compilation_error': 'Compilation Error',
      'time_limit': 'Time Limit'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Rest of your helper functions remain the same
  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 7) return `${Math.floor(days / 7)} weeks`;
    if (days > 0) return `${days} days`;
    return 'Today';
  };

  const getTimeDifference = (submittedAt) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diff = now - submitted;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const calculateSubmissionStats = (submissions) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const stats = new Array(7).fill(0);
    const now = new Date();
    
    submissions.forEach(submission => {
      const submissionDate = new Date(submission.submittedAt);
      const dayDiff = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
      if (dayDiff < 7) {
        const dayIndex = submissionDate.getDay();
        stats[dayIndex]++;
      }
    });

    return days.map((day, index) => ({
      date: day,
      submissions: stats[index]
    }));
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg">
          <p className="text-gray-300">{label}</p>
          <p className="text-indigo-400 font-semibold">
            {payload[0].value} submissions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Coder!</h1>
          <p className="text-gray-400">Track your progress and upcoming challenges</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <FaCode className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-400">Past 7 days</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {submissionStats.reduce((acc, curr) => acc + curr.submissions, 0)}
            </h3>
            <p className="text-gray-400 text-sm">Problems Solved</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <FaTrophy className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-gray-400">Current</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">1,234</h3>
            <p className="text-gray-400 text-sm">Global Rank</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <FaChartLine className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-gray-400">This month</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">89%</h3>
            <p className="text-gray-400 text-sm">Success Rate</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <FaQuestionCircle className="w-6 h-6 text-yellow-500" />
              </div>

              <span className="text-xs text-gray-400">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">15</h3>
            <p className="text-gray-400 text-sm">Total Questions</p>
          </div>



        </div>

        {/* Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Submission Activity</h2>
            <div className="h-64">
              {submissionStats.some(stat => stat.submissions > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionStats}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="submissions" 
                      fill="#4F46E5"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState 
                  icon={FaChartBar}
                  message="No Recent Activity"
                  submessage="Start solving problems to see your activity chart"
                />
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Contests</h2>
              <FaCalendarAlt className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {contests.length > 0 ? (
                contests.map(contest => (
                  <div key={contest.id} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors cursor-pointer">
                    <h3 className="text-white font-medium mb-2">{contest.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-400">
                        <FaClock className="w-4 h-4 mr-2" />
                        <span>Starts in {contest.time}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaUsers className="w-4 h-4 mr-2" />
                        <span>{contest.participants}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState 
                  icon={FaCalendarTimes}
                  message="No Upcoming Contests"
                  submessage="Check back later for new contests"
                />
              )}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Submissions</h2>
          {submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm">
                    <th className="pb-4 text-left">Problem</th>
                    <th className="pb-4 text-left">Status</th>
                    <th className="pb-4 text-left">Language</th>
                    <th className="pb-4 text-left">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {submissions.map(submission => (
                    <tr key={submission.id} className="border-t border-gray-700">
                      <td className="py-4">
                        <span className="text-white hover:text-indigo-400 cursor-pointer transition-colors">
                          {submission.problem}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 ${
                          submission.status === 'Accepted' 
                            ? 'text-green-500' 
                            : submission.status === 'Wrong Answer'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                        }`}>
                          {submission.status === 'Accepted' && <FaCheckCircle className="w-4 h-4" />}
                          {submission.status === 'Wrong Answer' && <FaExclamationCircle className="w-4 h-4" />}
                          {submission.status === 'Time Limit' && <FaClock className="w-4 h-4" />}
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-300">{submission.language}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-400">{submission.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              icon={FaCode}
              message="No Recent Submissions"
              submessage="Your submission history will appear here"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;