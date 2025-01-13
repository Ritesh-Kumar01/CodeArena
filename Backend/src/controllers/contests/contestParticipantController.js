// contestParticipantController.js
// import ContestParticipant from '../models/contestParticipant.model.js';
// import Contest from '../models/contest.model.js';
import Contest from "./../../models/contest.model.js";
import ContestParticipant from "./../../models/contestParticipant.model.js";
import { StatusCodes } from 'http-status-codes';

// Register for a contest
export const registerForContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { fullName, email, phoneNumber } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if contest exists and is not completed
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    if (contest.status === 'completed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Cannot register for completed contest'
      });
    }

    // Create participant entry
    const participant = await ContestParticipant.create({
      contestId,
      userId,
      fullName,
      email,
      phoneNumber,
      problemStatus: contest.problems.map(problemId => ({
        problemId,
        status: 'not_attempted',
        attempts: 0
      }))
    });

    // Add participant to contest
    contest.participants.push(userId);
    await contest.save();

    res.status(StatusCodes.CREATED).json(participant);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'Already registered for this contest'
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to register for contest',
      error: error.message
    });
  }
};

// Get contest leaderboard
export const getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Get participants sorted by total score and submission time
    const participants = await ContestParticipant.find({ contestId })
      .sort({ totalScore: -1, updatedAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email')
      .lean();

    // Calculate ranks
    const totalParticipants = await ContestParticipant.countDocuments({ contestId });
    
    const leaderboard = participants.map((participant, index) => ({
      ...participant,
      rank: skip + index + 1
    }));

    res.status(StatusCodes.OK).json({
      leaderboard,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalParticipants / limit),
      totalParticipants
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
};

// Get global rankings
export const getGlobalRankings = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Aggregate to calculate total problems solved and score across all contests
    const rankings = await ContestParticipant.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$totalScore' },
          contestsParticipated: { $sum: 1 },
          problemsSolved: {
            $sum: {
              $size: {
                $filter: {
                  input: '$problemStatus',
                  as: 'problem',
                  cond: { $eq: ['$$problem.status', 'solved'] }
                }
              }
            }
          }
        }
      },
      { $sort: { totalScore: -1, problemsSolved: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          fullName: '$user.fullname',
          email: '$user.email',
          totalScore: 1,
          contestsParticipated: 1,
          problemsSolved: 1,
          rank: { $add: [skip, { $const: 1 }] }
        }
      }
    ]);

    const total = await ContestParticipant.aggregate([
      {
        $group: {
          _id: '$userId'
        }
      },
      {
        $count: 'total'
      }
    ]);

    res.status(StatusCodes.OK).json({
      rankings,
      currentPage: parseInt(page),
      totalPages: Math.ceil((total[0]?.total || 0) / limit),
      totalParticipants: total[0]?.total || 0
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch global rankings',
      error: error.message
    });
  }
};

// Export participants data
export const exportParticipantsData = async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const participants = await ContestParticipant.find({ contestId })
      .sort({ totalScore: -1, updatedAt: 1 })
      .populate('userId', 'username email')
      .lean();

    // Format data for export
    const exportData = participants.map((p, index) => ({
      rank: index + 1,
      fullName: p.fullName,
      email: p.email,
      phoneNumber: p.phoneNumber || 'N/A',
      totalScore: p.totalScore,
      problemsSolved: p.problemStatus.filter(ps => ps.status === 'solved').length,
      registrationDate: new Date(p.registeredAt).toLocaleDateString()
    }));

    res.status(StatusCodes.OK).json(exportData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to export participants data',
      error: error.message
    });
  }
};

// Update participant problem status (called after submission)
export const updateProblemStatus = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const userId = req.user.userId;

    const participant = await ContestParticipant.findOne({ contestId, userId });
    if (!participant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Participant not found'
      });
    }

    await participant.updateProblemStatus(problemId, req.body.submission);
    
    res.status(StatusCodes.OK).json({
      message: 'Problem status updated successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update problem status',
      error: error.message
    });
  }
};