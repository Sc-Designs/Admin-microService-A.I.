import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    avtarProfileId: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
// JWT token Generation
AdminSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.EXPIRE_DATE,
  });
};

// Password compare
AdminSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

// Static method for hashing
AdminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, +process.env.SALT_NUMBER);
};

const adminModel = mongoose.model("Admin", AdminSchema);

export default adminModel;