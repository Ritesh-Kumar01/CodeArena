import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/common/DashboardLayout";

const CodeEditor: React.FC = () => {
  const { id } = useParams(); // Get problem ID from URL
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false); // Track if code is running
  const [executionError, setExecutionError] = useState<string | null>(null); // Error message for execution
  const [executionOutput, setExecutionOutput] = useState<string | null>(null); // Output after execution


  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!problem || !code) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setExecutionError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/code/submit",
        {
          code,
          language,
          problemId: id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 'accepted') {
        setSubmissionStatus('success');
        setExecutionOutput('All test cases passed! Solution submitted successfully.');
      } else {
        setSubmissionStatus('error');
        setExecutionError('Some test cases failed. Please check your solution.');
      }

    } catch (error) {
      setSubmissionStatus('error');
      setExecutionError(
        error?.response?.data?.error || 'Error submitting code. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  // Fetch problem details from backend
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(response.data);
        setCode(response.data?.solution || ""); // Optionally, prefill the editor with the solution if available
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    if (!problem) return; // Ensure problem data is loaded

    // Set loading state
    setIsRunning(true);
    setExecutionError(null); // Clear previous error
    setExecutionOutput(null); // Clear previous output

    const payload = {
      code,
      language,
      testCases: problem.testCases.map((testCase: any) => ({
        input: testCase.input,
        expectedOutput: testCase.output,
        isHidden: testCase.isHidden,
      })),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/code/execute", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error) {
        setExecutionError(`Execution failed: ${response.data.error}`);
      } else {
        console.log(response);
        
        setExecutionOutput(response.data.output); // Display output if execution is successful
      }
    } catch (error) {
      setExecutionError("Error executing code. Please try again.");
      setExecutionError(error?.response?.data?.error);
      console.log("Execution error:", error);
    } finally {
      setIsRunning(false); // Reset the loading state
    }
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <DashboardLayout>
    <div className="h-screen flex flex-col bg-gray-900 text-white">

<div className="flex flex-grow overflow-hidden flex-col lg:flex-row">
  <div className="w-full lg:w-1/2 p-4 overflow-y-auto bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-700">
    <h3 className="text-lg text-gray-900 font-semibold">{problem.title}</h3>

    <ReactMarkdown
      children={problem.description}
      remarkPlugins={[remarkGfm]}
      className="prose prose-invert"
    />

    <div className="bg-gray-700 p-6 rounded-md">
      <h3 className="text-lg font-semibold">Test Cases</h3>
      {problem.testCases.map((testCase: any, index: number) => (
        <div key={index} className="mt-2">
          <h4 className="font-medium">Test Case {index + 1}</h4>
          <p><strong>Input:</strong> {testCase.input}</p>
          <p><strong>Output:</strong> {testCase.output}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="w-full lg:w-1/2 p-4 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="p-2 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
      </select>
      <div className="space-x-4">
        <button
          onClick={handleRun}
          className={`px-4 py-2 ${isRunning ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded hover:bg-blue-700`}
          disabled={isRunning} // Disable button when running
        >
          {isRunning ? "Running..." : "Run"}
        </button>
        

        <button
    onClick={handleSubmit}
    className={`px-4 py-2 ${
      isSubmitting 
        ? 'bg-gray-600' 
        : submissionStatus === 'success'
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-blue-600 hover:bg-blue-700'
    } text-white rounded transition-colors`}
    disabled={isSubmitting}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </button>

      </div>
    </div>


<div className="flex-grow border border-gray-700 rounded overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 24,
          lineNumbersMinChars: 2,
        }}
      />
    </div>
    <div className="flex-grow border m-5 p-5 min-h-[100px] border-gray-700 rounded overflow-hidden">
    <h3 className="text-lg text-gray-100 font-semibold px-2 mb-2 py-2">
      Results : 
    </h3>
      
    {executionError && (
      <div className="bg-red-600 p-4 rounded-md mb-4">
        <p className="text-white">{executionError}</p>
      </div>
    )}

    {executionOutput && (
      <div className="bg-green-600 p-4 rounded-md mb-4">
        <p className="text-white">{executionOutput}</p>
      </div>
    )}

    {!executionOutput && !executionError && (
      <div className="bg-gray-700 p-4 rounded-md mb-4">
        <p className="text-white">No results to display.</p>
      </div>
    )}

    </div>
  </div>
</div>
</div>

    </DashboardLayout>

  );
};



export default CodeEditor;
