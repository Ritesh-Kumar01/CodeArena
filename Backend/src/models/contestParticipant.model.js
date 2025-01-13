// contestParticipant.model.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const contestParticipantSchema = new Schema({
  contestId: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  problemStatus: [{
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem'
    },
    status: {
      type: String,
      enum: ['not_attempted', 'attempted', 'solved'],
      default: 'not_attempted'
    },
    attempts: {
      type: Number,
      default: 0
    },
    submissionTime: Date,
    score: {
      type: Number,
      default: 0
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique participation
contestParticipantSchema.index({ contestId: 1, userId: 1 }, { unique: true });

// Add a method to update problem status
contestParticipantSchema.methods.updateProblemStatus = async function(problemId, submission) {
  const problemStatus = this.problemStatus.find(
    p => p.problemId.toString() === problemId.toString()
  );

  if (!problemStatus) {
    this.problemStatus.push({
      problemId,
      status: submission.status === 'accepted' ? 'solved' : 'attempted',
      attempts: 1,
      submissionTime: new Date(),
      score: submission.status === 'accepted' ? 100 : 0
    });
  } else {
    problemStatus.attempts += 1;
    if (submission.status === 'accepted' && problemStatus.status !== 'solved') {
      problemStatus.status = 'solved';
      problemStatus.score = 100;
      problemStatus.submissionTime = new Date();
    } else if (submission.status !== 'accepted') {
      problemStatus.status = 'attempted';
    }
  }

  // Update total score
  this.totalScore = this.problemStatus.reduce((sum, p) => sum + p.score, 0);
  
  await this.save();
};

export default mongoose.model('ContestParticipant', contestParticipantSchema);