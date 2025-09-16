import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import AuthService from "../../utils/generateAuthToken.js";
import sendOtp from "../../nodemailer.js/setIt/sendSms.js";

const opening = async (req, res) => {
  try {
    const { phoneNumber, role } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    // Check if user already exists
    let user = await Patient.findOne({ phoneNumber });
    let userType = "Patient";

    if (!user) {
      user = await Doctor.findOne({ phoneNumber });
      userType = "Doctor";
    }

    if (user) {
      if (user.isVerified) {
        // Verified → generate token
        const token = AuthService.generateToken(user);

        // Optionally set cookie
        res.cookie("phoneNumber", phoneNumber, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 10 * 60 * 1000,
        });

        return res.status(200).json({
          message: `${userType} login successful.`,
          verified: true,
          token,
        });
      } 
      
    } else {
      // 🚀 New user → send OTP
      try {
        //send otp
        try {
          await sendOtp(phoneNumber);
        } catch (otpError) {
          console.error("Error sending OTP:", otpError);
          return res
            .status(500)
            .json({ message: "Failed to send OTP. Please try again later." });
        }
        if (role === "Patient") {
          const newPatient = new Patient({ phoneNumber, isVerified: false });
          await newPatient.save();
        } else if (role === "Doctor") {
          const newDoctor = new Doctor({ phoneNumber, isVerified: false });
          await newDoctor.save();
        } else {
          return res.status(400).json({ message: "Invalid role specified." });
        }
      } catch (otpError) {
        console.error("Error sending OTP:", otpError);
        return res
          .status(500)
          .json({ message: "Failed to send OTP. Please try again later." });
      }

      // Set cookie for OTP verification
      res.cookie("phoneNumber", phoneNumber, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      return res.status(200).json({
        message: "OTP sent to your phone. Please verify to complete registration.",
        verified: false,
      });
    }
  } catch (error) {
    console.error("Error in opening controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default opening;
