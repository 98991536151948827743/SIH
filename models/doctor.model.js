// models/Doctor.js
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
        type: String,
        enum: ['doctor'],
        default: 'doctor',
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    yoe: {
      type: Number, // Years of Experience
      required: true,
      min: 0,
    },
    profilePicture: {
      type: String, // URL
    },
    employmentType: {
      type: String,
      enum: ['Government', 'Private'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },

    // Reference to ClinicInfo
    clinicInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClinicInfo',
      required: true,
    },

    // OTP verification
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
