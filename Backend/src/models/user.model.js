import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'organizer'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);