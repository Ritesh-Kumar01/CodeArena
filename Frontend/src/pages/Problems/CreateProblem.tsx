import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";

const CreateProblem = () => {
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
  const navigate = useNavigate();

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
      await axios.post("http://localhost:5000/api/problems/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Problem created successfully");
      setTimeout(() => navigate("/problems"), 2000);
    } catch (err) {
      setError("Failed to create problem. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Create New Problem</h1>
            <button
              onClick={() => navigate("/problems")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Problems
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-500">{successMessage}</p>
            </div>
          )}

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
              <label className="block text-sm font-semibold text-white">
                Description (Markdown)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <label className="block text-sm font-semibold text-white">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  name="memoryLimit"
                  value={formData.memoryLimit}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-100/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Test Cases</h2>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Test Case
                </button>
              </div>

              {formData.testCases.map((testCase, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={testCase.isHidden}
                        onChange={(e) => handleTestCaseChange(index, "isHidden", e.target.checked)}
                        className="w-4 h-4 rounded text-violet-500 focus:ring-violet-500"
                      />
                      <label className="text-sm font-semibold text-white">Hidden Test Case</label>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none"
            >
              Create Problem
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateProblem;