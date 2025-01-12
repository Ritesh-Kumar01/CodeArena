// routes/submission.routes.js
import express from 'express';
import { 
  createSubmission, 
  getAllSubmissions, 
  getSubmissionById,
  getUserSubmissions,
  getRecentSubmissions
} from './../../controllers/code_execute/submissionController.js';
import { authMiddleware } from './../../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Create new submission
router.post('/', createSubmission);

// Get all submissions (maybe for admin)
router.get('/all', getAllSubmissions);

// Get recent submissions (limited to last 4)
router.get('/recent', getRecentSubmissions);

// Get user's submissions
router.get('/my-submissions', getUserSubmissions);

// Get specific submission by ID
router.get('/:id', getSubmissionById);

export default router;