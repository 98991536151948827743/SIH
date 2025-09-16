import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import Patient from "../../models/patient.model.js";

const registerPatient = async (req, res) => {
  try {
    // 1️⃣ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //phone number from cookie
    const phoneNumber =req.cookies.phoneNumber;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'please verify First' });
    }
    const {
      firstName,
      lastName,
      age,
      allergies,
      disabilities,
      gender,
      appLanguage,
      district,
      state,
      password,
    } = req.body;

    // 2️⃣ Check if patient already exists
    const existingPatient = await Patient.findOne({ phoneNumber });
    if (existingPatient) {
      return res.status(400).json({
        message: 'Patient with this phone number already exists. Please login.',
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create Patient document
    const patient = new Patient({
      firstName,
      lastName,
      age,
      allergies,
      disabilities,
      gender,
      appLanguage,
      district,
      state,
      phoneNumber,
      password: hashedPassword,
      isVerified: false,
    });

    await patient.save();
    //clear cookie
    res.clearCookie('phoneNumber');

    //jwt token
    const token = AuthService.generateToken(patient);

    // 7️⃣ Respond
    res.status(200).json({
      message: 'Patient registered successfully. Please verify OTP sent to your phone.',
      otpSent: true, // optional flag
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
    });
  }
};

export default registerPatient;
