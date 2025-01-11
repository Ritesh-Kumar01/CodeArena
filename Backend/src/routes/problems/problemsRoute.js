import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

import {
  createProblem,
  editProblem,
  deleteProblem,
  getAllProblems,
  getProblemById
} from '../../controllers/problems/problemsController.js';

const router = express.Router();

// Create a new problem
router.post('/create', authMiddleware, createProblem);

// Edit an existing problem
router.put('/edit/:id', authMiddleware, editProblem);

// Delete a problem
router.delete('/delete/:id', authMiddleware, deleteProblem);

// Get all problems
router.get('/', getAllProblems);

// Get a problem by ID
router.get('/:id', getProblemById);

export default router;