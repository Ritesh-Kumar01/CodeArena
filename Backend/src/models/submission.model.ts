import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  contest?: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error';
  executionTime?: number;
  memoryUsed?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
}

const submissionSchema = new Schema<ISubmission>({
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
    enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error'],
    default: 'pending',
  },
  executionTime: Number,
  memoryUsed: Number,
  testCasesPassed: Number,
  totalTestCases: Number,
}, {
  timestamps: true,
});

export default mongoose.model<ISubmission>('Submission', submissionSchema);
