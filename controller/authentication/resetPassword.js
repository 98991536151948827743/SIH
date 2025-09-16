import bcrypt from "bcryptjs";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

const resetPassword = async (req, res) => {
  try {

    const { phoneNumber } = req.cookies;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number not found in cookie/session." });
    }


    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    let user = await Patient.findOne({ phoneNumber });
    let userType = "Patient";

    if (!user) {
      user = await Doctor.findOne({ phoneNumber });
      userType = "Doctor";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    if (!user.isVerified) {
      return res.status(403).json({ message: "Phone number not verified. Please verify OTP first." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.clearCookie("phoneNumber");

    return res.status(200).json({
      message: `${userType} password reset successfully.`,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default resetPassword;
