
import Problem from './../../models/problem.model.js';

// Create a new problem
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases, timeLimit, memoryLimit } = req.body;
    const createdBy = req.user.userId;

    console.log(req.body,createdBy);
    

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      testCases,
      timeLimit,
      memoryLimit,
      createdBy,
    });

    await newProblem.save();
    res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create problem' });
  }
};

// Edit an existing problem
export const editProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const problem = await Problem.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      updatedData,
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found or unauthorized' });
    }

    res.status(200).json({ message: 'Problem updated successfully', problem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update problem' });
  }
};

// Delete a problem
export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOneAndDelete({
      _id: id
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found or unauthorized' });
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete problem' });
  }
};

// Get all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().populate('createdBy', 'name email');
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

// Get a single problem by ID
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id).populate('createdBy', 'name email');

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};
