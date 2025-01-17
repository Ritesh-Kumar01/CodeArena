import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import axios from 'axios';
 

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { log } from 'console';

const execPromise = util.promisify(exec);

const CODE_DIR = path.join(dirname(fileURLToPath(import.meta.url)), '../temp_code');

if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR);
}

const LANGUAGE_CONFIG = {
  python: {
    extension: 'py',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.py python:3.9 sh -c "python /app/code.py 2>&1"`
  },
  c: {
    extension: 'c',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.c gcc:latest sh -c "gcc /app/code.c -o /app/code && /app/code"`
  },
  cpp: {
    extension: 'cpp',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.cpp gcc:latest sh -c "g++ /app/code.cpp -o /app/code && /app/code"`
  },
};


export const executeCode = async (req, res) => {
  const { code, language, input } = req.body;
  console.log('Received request:', req.body);

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const fileName = `code-${Date.now()}.${config.extension}`;
  const filePath = path.join(CODE_DIR, fileName);

  try {
    fs.writeFileSync(filePath, code);
    console.log(`Code written to: ${filePath}`);

    const { stdout, stderr } = await execPromise(config.command(filePath));
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);

    if (stderr) {
      console.error('Docker execution error:', stderr);
      return res.status(400).json({ error: stderr });
    }

    res.json({ output: stdout });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  } finally {
    try {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
};



const executeTestCases = async (code, language, testCases) => {
  const results = [];
  let totalExecutionTime = 0;
  let maxMemoryUsage = 0;

  const sanitizeOutput = (output) => {
    return output.toString().trim().replace(/\r\n/g, '\n');
  };

  try {
    for (const testCase of testCases) {
      const startTime = process.hrtime();
      const startMemory = process.memoryUsage().heapUsed;

      const executionPayload = {
        code,
        language,
        input: testCase.input,
      };

      const response = await axios.post(
        'http://localhost:5000/api/code/execute',
        executionPayload
      );

      const endTime = process.hrtime(startTime);
      const endMemory = process.memoryUsage().heapUsed;

      const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
      const memoryUsed = endMemory - startMemory;

      totalExecutionTime += executionTime;
      maxMemoryUsage = Math.max(maxMemoryUsage, memoryUsed);

      const actualOutput = sanitizeOutput(response.data.output);
      const expectedOutput = sanitizeOutput(testCase.output);
      const passed = actualOutput === expectedOutput;

      results.push({
        passed,
        executionTime,
        memory: memoryUsed,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: response.data.output,
        error: response.data.error || null,
        isHidden: testCase.isHidden || false
      });

      if (response.data.error) {
        break;
      }
    }

    return {
      success: true,
      results,
      metrics: {
        totalExecutionTime,
        maxMemoryUsage
      }
    };

  } catch (error) {
    console.error('Test case execution error:', error);
    return {
      success: false,
      error: error.message || 'Error executing test cases',
      results
    };
  }
};

export const submitCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    console.log('Received request:', req.body);
    
    const userId = req.user.userId;
    console.log(userId);
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const executionResults = await executeTestCases(code, language, problem.testCases);

    if (!executionResults.success) {
      return res.status(400).json({
        error: 'Test case execution failed',
        details: executionResults.error
      });
    }

    const allTestsPassed = executionResults.results.every(result => result.passed);
    const status = allTestsPassed ? 'accepted' : 'wrong_answer';

    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status,
      executionTime: executionResults.metrics.totalExecutionTime,
      memory: executionResults.metrics.maxMemoryUsage
    });

    await submission.save();

    const visibleResults = executionResults.results.map(result => ({
      ...result,
      input: result.isHidden ? 'Hidden' : result.input,
      expectedOutput: result.isHidden ? 'Hidden' : result.expectedOutput,
      actualOutput: result.isHidden ? 'Hidden' : result.actualOutput,
      passed: result.passed
    }));

    res.status(201).json({
      message: 'Submission processed successfully',
      submissionId: submission._id,
      status,
      results: visibleResults,
      metrics: executionResults.metrics,
      allTestsPassed
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Error processing submission' });
  }
};
