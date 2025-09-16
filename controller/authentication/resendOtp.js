// controllers/resendOtpController.js
import sendOtp from "../../nodemailer.js/setIt/sendSms.js";

const resend = async (req, res) => {
  try {
    const { phoneNumber } = req.cookies;

    if (!phoneNumber) {
      return res.status(400).json({ message: "No phone number found. Please request OTP first." });
    }

    try {
        await sendOtp(phoneNumber);
    } catch (otpError) {
        console.error('Error sending OTP:', otpError);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }

  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default resend;
