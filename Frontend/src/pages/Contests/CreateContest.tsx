import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaSpinner,
  FaArrowLeft,
  FaSearch,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import DashboardLayout from '../../components/common/DashboardLayout';



const ProblemSearchCard = ({ problem, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(problem)}
    className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
        ? 'border-indigo-500 bg-indigo-500/10'
        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
      }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FaBook className="mr-2 text-gray-400" />
        <div>
          <h3 className="font-medium">{problem.title}</h3>
          <p className="text-sm text-gray-400">Difficulty: {problem.difficulty}</p>
        </div>
      </div>
      {isSelected && <FaCheck className="text-indigo-500" />}
    </div>
  </div>
);

const SelectedProblemsList = ({ problems, onRemove }) => (
  <div className="space-y-2">
    {problems.map(problem => (
      <div
        key={problem._id}
        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
      >
        <span className="text-sm">{problem.title}</span>
        <button
          onClick={() => onRemove(problem)}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    ))}
  </div>
);

const CreateContest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allProblems, setAllProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    selectedProblems: []
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response) throw new Error('Failed to fetch problems');


        setAllProblems(response.data);
      } catch (err) {
        setError('Failed to load problems');
      }
    };

    fetchProblems();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = allProblems.filter(problem =>
      problem.title.toLowerCase().includes(query.toLowerCase()) ||
      problem.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 3); // Show top 3 matches

    setSearchResults(results);
  };

  const handleProblemSelect = (problem) => {
    if (formData.selectedProblems.some(p => p._id === problem._id)) {
      setFormData(prev => ({
        ...prev,
        selectedProblems: prev.selectedProblems.filter(p => p._id !== problem._id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedProblems: [...prev.selectedProblems, problem]
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.startTime) return 'Start time is required';
    if (!formData.endTime) return 'End time is required';
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      return 'End time must be after start time';
    }
    if (formData.selectedProblems.length === 0) return 'Select at least one problem';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const data = {
            title: formData.title,
            description: formData.description,
            startTime: formData.startTime,
            endTime: formData.endTime,
            problems: formData.selectedProblems.map(p => p._id),
      }
      const response = await axios.post("http://localhost:5000/api/contests/create", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // const response = await fetch('http://localhost:5000/api/contests/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     title: formData.title,
      //     description: formData.description,
      //     startTime: formData.startTime,
      //     endTime: formData.endTime,
      //     problems: formData.selectedProblems.map(p => p._id),
      //   })
      // });


      if (!response) throw new Error('Failed to create contest');
      navigate('/contests');
    } catch (err) {
      console.log(err);

      setError(err.message || 'Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Link
              to="/contests"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Contests
            </Link>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Contest</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contest Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Enter contest title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Enter contest description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search and Add Problems
                </label>
                <div className="relative mb-4">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="Search problems by title or tags..."
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {searchResults.map(problem => (
                      <ProblemSearchCard
                        key={problem._id}
                        problem={problem}
                        isSelected={formData.selectedProblems.some(p => p._id === problem._id)}
                        onSelect={handleProblemSelect}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Selected Problems ({formData.selectedProblems.length})
                  </h3>
                  <SelectedProblemsList
                    problems={formData.selectedProblems}
                    onRemove={handleProblemSelect}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/contests')}
                  className="px-4 py-2 mr-4 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Contest'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>

  );
};

export default CreateContest;