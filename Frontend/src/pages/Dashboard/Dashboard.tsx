import React from 'react';
import { 
  FaTrophy, 
  FaCode, 
  FaUsers, 
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const submissionData = [
    { date: 'Mon', submissions: 23 },
    { date: 'Tue', submissions: 45 },
    { date: 'Wed', submissions: 32 },
    { date: 'Thu', submissions: 67 },
    { date: 'Fri', submissions: 89 },
    { date: 'Sat', submissions: 54 },
    { date: 'Sun', submissions: 43 }
  ];

  const upcomingContests = [
    { id: 1, title: "Weekly Algorithm Challenge", time: "2 days", participants: 145 },
    { id: 2, title: "Data Structures Sprint", time: "5 days", participants: 89 },
    { id: 3, title: "Code Masters Cup", time: "1 week", participants: 234 }
  ];

  const recentSubmissions = [
    { id: 1, problem: "Two Sum", status: "Accepted", time: "2 min ago", language: "Python" },
    { id: 2, problem: "Valid Parentheses", status: "Wrong Answer", time: "15 min ago", language: "Java" },
    { id: 3, problem: "Merge Sort", status: "Time Limit", time: "1 hour ago", language: "C++" },
  ];

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
            <h3 className="text-2xl font-bold text-white mb-1">247</h3>
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
                <FaUsers className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">15</h3>
            <p className="text-gray-400 text-sm">Contests Participated</p>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Submission Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionData}>
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '0.5rem',
                      color: '#fff' 
                    }}
                  />
                  <Bar dataKey="submissions" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Contests</h2>
              <FaCalendarAlt className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingContests.map(contest => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Submissions</h2>
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
                {recentSubmissions.map(submission => (
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;