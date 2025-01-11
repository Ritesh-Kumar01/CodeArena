// contestRouter.js
import express from 'express';
import { 
  createContest, 
  getAllContests, 
  getContestById,
  updateContest,
  deleteContest,
  joinContest,
  getContestProblems
} from '../../controllers/contests/contestController.js';

import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Contest CRUD routes
router.post('/create', createContest);
router.get('/', getAllContests);
router.get('/:id', getContestById);
router.put('/:id', updateContest);
router.delete('/:id', deleteContest);

// Contest participation routes
router.post('/:id/join', joinContest);
router.get('/:id/problems', getContestProblems);

export default router;