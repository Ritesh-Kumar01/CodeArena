import mongoose from 'mongoose';

const { Schema } = mongoose;

const submissionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'wrong_answer', 'runtime_error', 'compilation_error'],
    required: true
  },
  executionTime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Submission', submissionSchema);