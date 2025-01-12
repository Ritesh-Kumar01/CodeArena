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

// Pre-remove middleware
problemSchema.pre('remove', async function(next) {
  try {
    const problem = this;
    
    // Remove problem reference from all contests
    await mongoose.model('Contest').updateMany(
      { problems: problem._id },
      { $pull: { problems: problem._id } }
    );
    
    // Delete all submissions for this problem
    await mongoose.model('Submission').deleteMany({ problemId: problem._id });
    
    next();
  } catch (error) {
    next(error);
  }
});

// Add middleware for findOneAndDelete and deleteOne operations
problemSchema.pre('findOneAndDelete', async function(next) {
  try {
    // Get the document that's about to be deleted
    const problem = await this.model.findOne(this.getQuery());
    if (problem) {
      // Remove problem reference from all contests
      await mongoose.model('Contest').updateMany(
        { problems: problem._id },
        { $pull: { problems: problem._id } }
      );
      
      // Delete all submissions for this problem
      await mongoose.model('Submission').deleteMany({ problemId: problem._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

problemSchema.pre('deleteOne', async function(next) {
  try {
    const problem = await this.model.findOne(this.getQuery());
    if (problem) {
      // Remove problem reference from all contests
      await mongoose.model('Contest').updateMany(
        { problems: problem._id },
        { $pull: { problems: problem._id } }
      );
      
      // Delete all submissions for this problem
      await mongoose.model('Submission').deleteMany({ problemId: problem._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add static method to safely delete a problem
problemSchema.statics.safeDelete = async function(problemId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the problem
    const problem = await this.findById(problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }

    // Remove problem reference from all contests
    await mongoose.model('Contest').updateMany(
      { problems: problemId },
      { $pull: { problems: problemId } },
      { session }
    );

    // Delete all submissions for this problem
    await mongoose.model('Submission').deleteMany(
      { problemId: problemId },
      { session }
    );

    // Delete the problem
    await this.findByIdAndDelete(problemId).session(session);

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

export default mongoose.model('Problem', problemSchema);