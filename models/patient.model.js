// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
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
        enum: ['patient'],
        default: 'patient',
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },

    password: {
      type: String,
      required: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    disabilities: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    appLanguage: {
      type: String,
      default: 'en',
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    // OTP verification
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
