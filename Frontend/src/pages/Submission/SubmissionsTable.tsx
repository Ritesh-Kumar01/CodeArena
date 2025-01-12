import React, { useState, useEffect } from 'react';
import { FaSearch, FaExternalLinkAlt, FaClock, FaMemory, FaCode } from 'react-icons/fa';
import axios from 'axios';
import MonacoEditor from "@monaco-editor/react";

const SubmissionDetailsModal = ({ submission, onClose }) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-gray-900 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">Submission Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-800 p-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-400" />
            <span className="text-gray-400">Execution Time:</span>
            <span className="text-gray-100">{submission.executionTime}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMemory className="text-green-400" />
            <span className="text-gray-400">Memory Used:</span>
            <span className="text-gray-100">{submission.memory}KB</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCode className="text-purple-400" />
            <span className="text-gray-400">Language:</span>
            <span className="text-gray-100">{submission.language}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-100">Code</h3>
          
<div className="flex-grow border border-gray-700 rounded overflow-hidden">
      <MonacoEditor
        height="200px"
        language={submission.language}
        value={submission.code}
        theme="vs-dark"
        options={{
          fontSize: 24,
          lineNumbersMinChars: 2,
          readOnly: true,
        }}
      />
    </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-gray-100 hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmissionsTable = ({ initialSubmissions = [] }) => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    accepted: 'bg-green-800 text-green-100',
    wrong_answer: 'bg-red-800 text-red-100',
    runtime_error: 'bg-yellow-800 text-yellow-100',
    compilation_error: 'bg-orange-800 text-orange-100'
  };

  const fetchSubmissionDetails = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSelectedSubmission(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching submission details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.problemId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="">
      {/* Search and Filter Section */}
      <div className="flex flex-col my-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by problem or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-gray-800 pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg bg-gray-800 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="accepted">Accepted</option>
          <option value="wrong_answer">Wrong Answer</option>
          <option value="runtime_error">Runtime Error</option>
          <option value="compilation_error">Compilation Error</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Problem</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Language</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Memory</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Submitted At</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id} className="group hover:bg-gray-800">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-100">
                      {submission.problemId.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[submission.status]}`}>
                    {submission.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{submission.language}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{submission.executionTime}ms</td>
                <td className="px-6 py-4 text-sm text-gray-300">{submission.memory}KB</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => fetchSubmissionDetails(submission._id)}
                    className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-100 opacity-1 transition-opacity hover:bg-gray-600 group-hover:opacity-100"
                  >
                    <FaExternalLinkAlt size={12} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Submission Details Modal */}
      {isModalOpen && (
        <SubmissionDetailsModal
          submission={selectedSubmission}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
};

export default SubmissionsTable;