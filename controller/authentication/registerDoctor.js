// controllers/doctorController.js
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import Doctor from "../../models/doctor.model.js";
import ClinicInfo from '../../models/ClinicInfo.model.js';


const registerDoctor = async (req, res) => {
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
      yoe,
      employmentType,
      gender,
      specialization,
      degree,
      clinicLocation,
      password,
    } = req.body;

    // 2️⃣ Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ phoneNumber });
    if (existingDoctor) {
      return res.status(400).json({
        message: 'Doctor with this phone number already exists. Please login.',
      });
    }

    // 3️⃣ Create ClinicInfo document
    const clinicInfo = new ClinicInfo({ specialization, degree, clinicLocation });
    await clinicInfo.save();

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create Doctor document
    const doctor = new Doctor({
      firstName,
      lastName,
      phoneNumber,
      yoe,
      employmentType,
      gender,
      clinicInfo: clinicInfo._id,
      password: hashedPassword,
      isVerified: false,
    });

    await doctor.save();
    // 6️⃣ Clear OTP cooki
    res.clearCookie('phoneNumber');
    //sign jwt token and send as cookie
    const token = AuthService.generateToken(doctor);


    // 7️⃣ Respond
    res.status(200).json({
      message: 'Doctor registered successfully.',
      doctorId: doctor._id,
      verified: true,
    });

  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
    });
  }
};

export default registerDoctor;
