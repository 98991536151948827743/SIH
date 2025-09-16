// controllers/verifyOtpController.js
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

const verifyOtp = async (req, res) => {
  try {
    // 1️⃣ Get phone number from cookie and OTP from request body
    const { otp } = req.body;
    const { phoneNumber } = req.cookies;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'No phone number found. please send otp first.' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required.' });
    }
    let user = await Patient.findOne({ phoneNumber });
    let userType = "Patient";

    if (!user) {
      user = await Doctor.findOne({ phoneNumber });
      userType = "Doctor";
    }

    // Replace this with your actual OTP validation logic
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    //  Mark user as verified
    user.isVerified = true;
    user.otp = null; // clear OTP after verification
    await user.save();

    // 6 Respond
    res.status(200).json({
      message: `${userType} verified successfully.`,
      verified: true,
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
    });
  }
};

export default verifyOtp;
