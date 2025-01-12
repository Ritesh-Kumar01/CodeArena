// controllers/submission.controller.js
import Submission from './../../models/submission.model.js';
import Problem from './../../models/problem.model.js';

// Create new submission
export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    
    // Validate if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission
    const submission = new Submission({
      userId: req.user.userId, // from auth middleware
      problemId,
      code,
      language,
      status: 'pending', // Initial status
      executionTime: 0,
      memory: 0
    });

    // Here you would typically:
    // 1. Run code evaluation
    // 2. Update submission status based on results
    // For this example, we'll simulate acceptance
    submission.status = 'accepted';
    
    await submission.save();

    res.status(201).json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('Submission creation error:', error);
    res.status(500).json({
      success: false,
      message: "Error creating submission",
      error: error.message
    });
  }
};

// Get all submissions (with pagination)
export const getAllSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find()
      // .populate('userId', 'email') // Assuming user has username
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments();

    res.json({
      success: true,
      data: submissions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message
    });
  }
};

// Get recent submissions (last 4)
export const getRecentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .limit(4);

    res.json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Get recent submissions error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent submissions",
      error: error.message
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ userId })
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ userId });

    res.json({
      success: true,
      data: submissions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching user submissions",
      error: error.message
    });
  }
};

// Get specific submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('userId', 'email')
      .populate('problemId', 'title difficulty');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    // Check if user has permission to view this submission
    if (submission.userId._id.toString() !== req.user.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this submission"
      });
    }

    res.json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching submission",
      error: error.message
    });
  }
};