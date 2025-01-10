import mongoose from 'mongoose';

const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    contest: {
      type: Schema.Types.ObjectId,
      ref: 'Contest',
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong_answer'], // Simplified status
      default: 'pending',
    },
    executionTime: Number,
    memoryUsed: Number,
    testCasesPassed: Number,
    totalTestCases: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Submission', submissionSchema);
