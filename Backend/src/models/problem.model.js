import mongoose from 'mongoose';

const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    testCases: [{
      input: String,
      output: String,
      isHidden: {
        type: Boolean,
        default: false,
      },
    }],
    timeLimit: {
      type: Number,
      default: 1000, // 1 second
    },
    memoryLimit: {
      type: Number,
      default: 256, // 256 MB
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Problem', problemSchema);
