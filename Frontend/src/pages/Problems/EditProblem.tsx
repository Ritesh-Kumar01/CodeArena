import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const EditProblem: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    testCases: [{ input: "", output: "", isHidden: false }],
    timeLimit: 1000,
    memoryLimit: 256,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        
        const problem = response.data;
        setFormData({
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          testCases: problem.testCases,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problem or you do not have permission to edit it.");
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTestCaseChange = (index: number, field: string, value: string | boolean) => {
    const updatedTestCases = formData.testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setFormData({ ...formData, testCases: updatedTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", output: "", isHidden: false }],
    });
  };

  const removeTestCase = (index: number) => {
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: updatedTestCases });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/api/problems/edit/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Problem updated successfully");
      setTimeout(() => navigate("/problems"), 2000);
    } catch (err) {
      setError("Failed to update problem. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Problem</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white">Description (Markdown)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white">Time Limit (ms)</label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white">Memory Limit (MB)</label>
            <input
              type="number"
              name="memoryLimit"
              value={formData.memoryLimit}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Test Cases</h2>
            {formData.testCases.map((testCase, index) => (
              <div key={index} className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white">Input</label>
                  <input
                    type="text"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                    className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white">Output</label>
                  <input
                    type="text"
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                    className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white">Hidden</label>
                  <input
                    type="checkbox"
                    checked={testCase.isHidden}
                    onChange={(e) => handleTestCaseChange(index, "isHidden", e.target.checked)}
                    className="mt-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Test Case
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTestCase}
              className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Test Case
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none"
          >
            Update Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProblem;
