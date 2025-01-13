import express from 'express';
// import { authenticateUser } from '../middleware/authentication.js';
import { authMiddleware } from "./../../middlewares/authMiddleware.js"
import {
  registerForContest,
  getContestLeaderboard,
  getGlobalRankings,
  exportParticipantsData,
  updateProblemStatus
} from './../../controllers/contests/contestParticipantController.js';

const router = express.Router();

// Contest participation routes
router.post('/:contestId/register', authMiddleware, registerForContest);
router.get('/:contestId/leaderboard', getContestLeaderboard);
router.get('/rankings', getGlobalRankings);
router.get('/:contestId/export', authMiddleware, exportParticipantsData);
router.patch('/:contestId/problems/:problemId/status', authMiddleware, updateProblemStatus);

export default router;