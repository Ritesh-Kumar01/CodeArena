import Contest from './../../models/contest.model.js';
import { StatusCodes } from 'http-status-codes';

// Create a new contest
export const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;
    
    // Validate required fields
    if (!title || !description || !startTime || !endTime || !problems || problems.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Please provide all required fields'
      });
    }
    console.log(req.body);

    // Calculate initial status
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    let status = 'upcoming';
    if (now >= start && now < end) {
      status = 'ongoing';
    } else if (now >= end) {
      status = 'completed';
    }
    console.log({
      title,
      description,
      startTime,
      endTime,
      problems,
      status,
      createdBy: req.user.userId,
      participants: [] // Initialize empty participants array
    });
    
    const contest = await Contest.create({
      title,
      description,
      startTime,
      endTime,
      problems,
      status,
      createdBy: req.user.userId,
      participants: [] // Initialize empty participants array
    });

    res.status(StatusCodes.CREATED).json(contest);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create contest',
      error: error.message
    });
  }
};

// Get all contests with pagination and filters
export const getAllContests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Update contest statuses based on current time
    const now = new Date();
    await Contest.updateMany(
      { startTime: { $lte: now }, endTime: { $gt: now }, status: 'upcoming' },
      { $set: { status: 'ongoing' } }
    );
    await Contest.updateMany(
      { endTime: { $lte: now }, status: { $ne: 'completed' } },
      { $set: { status: 'completed' } }
    );

    const contests = await Contest.find(query)
      .populate('createdBy', 'username')
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contest.countDocuments(query);

    res.status(StatusCodes.OK).json({
      contests,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalContests: total
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch contests',
      error: error.message
    });
  }
};

// Get a single contest by ID
export const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('participants', 'username');

    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    res.status(StatusCodes.OK).json(contest);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch contest',
      error: error.message
    });
  }
};

// Update a contest
export const updateContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    // Check if user is the creator
    if (contest.createdBy.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Not authorized to update this contest'
      });
    }

    // Don't allow updates if contest has started
    if (contest.status !== 'upcoming') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Cannot update contest after it has started'
      });
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json(updatedContest);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update contest',
      error: error.message
    });
  }
};

// Delete a contest
export const deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    // Check if user is the creator
    if (contest.createdBy.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Not authorized to delete this contest'
      });
    }

    // Don't allow deletion if contest has started
    if (contest.status !== 'upcoming') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Cannot delete contest after it has started'
      });
    }

    await contest.remove();

    res.status(StatusCodes.OK).json({
      message: 'Contest deleted successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to delete contest',
      error: error.message
    });
  }
};

// Join a contest
export const joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    // Check if contest is upcoming or ongoing
    if (contest.status === 'completed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Cannot join completed contest'
      });
    }

    // Check if user is already a participant
    if (contest.participants.includes(req.user._id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Already joined this contest'
      });
    }

    contest.participants.push(req.user._id);
    await contest.save();

    res.status(StatusCodes.OK).json({
      message: 'Successfully joined contest'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to join contest',
      error: error.message
    });
  }
};

// Get contest problems
export const getContestProblems = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems');

    if (!contest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Contest not found'
      });
    }

    // Only show problems if contest has started or user is creator
    const now = new Date();
    const isCreator = contest.createdBy.toString() === req.user._id.toString();
    
    if (!isCreator && new Date(contest.startTime) > now) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Problems will be visible when contest starts'
      });
    }

    res.status(StatusCodes.OK).json(contest.problems);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch contest problems',
      error: error.message
    });
  }
};