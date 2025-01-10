import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/common/Navbar";

const CodeEditor: React.FC = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const markdownContent = `
# Sample Problem Statement

## Problem Description
Write a function that takes an array of integers and returns the sum of all positive numbers.

### Example
Input: [1, -2, 3, 4]
Output: 8

### Constraints
- The array length will be between 1 and 100.
- Each element will be between -100 and 100.

## Solution

\`\`\`javascript
function sumPositiveNumbers(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
      sum += arr[i];
    }
  }
  return sum;
}
\`\`\`

## Time Complexity
- Time Complexity: O(N)
- Space Complexity: O(1)

## Additional Notes
- This solution uses a simple loop to iterate over the array and add positive numbers together.

## References
- [Wikipedia: Sum](https://en.wikipedia.org/wiki/Sum)

## Test Cases

### Test Case 1

Input: [1, -2, 3, 4]
Output: 8

### Test Case 2

Input: [0, 0, 0, 0]
Output: 0



`;

  const handleRun = () => {
    alert("Running code...");
  };

  const handleSubmit = () => {
    alert("Submitting code...");
  };

  return (
    <>
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header Section */}
      <div className="py-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
        <Navbar/>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden flex-col lg:flex-row">
        {/* Problem Statement Section */}
        <div className="w-full lg:w-1/2 p-4 overflow-y-auto bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-700">
          <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm]}
            className="prose"
          />
        </div>

        {/* Code Editor Section */}
        <div className="w-full lg:w-1/2 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <div className="space-x-4">
              <button
                onClick={handleRun}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Run
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
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
                }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default CodeEditor;
