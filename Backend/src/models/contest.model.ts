import mongoose, { Schema, Document } from 'mongoose';

export interface IContest extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  problems: mongoose.Types.ObjectId[];
  participants: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const contestSchema = new Schema<IContest>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  problems: [{
    type: Schema.Types.ObjectId,
    ref: 'Problem',
  }],
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  }
}, {
  timestamps: true,
});

export default mongoose.model<IContest>('Contest', contestSchema);
