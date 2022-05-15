import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      min: 3,
      max: 20,
      required: true
    },
    email: {
      type: String,
      unique: true,
      max: 30,
      required: true
    },
    password: {
      type: String,
      min: 8,
      required: true
    },
    follwers: {
      type: Array,
      default: []
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('user', userSchema);
