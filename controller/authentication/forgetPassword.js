import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import sendOtp from "../../nodemailer.js/setIt/sendSms.js";

const forgetPassword = async (req, res) => {
    try {
        // 1️⃣ Get phone number from body and send otp
        const {phoneNumber} = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required.' });
        }

        // 2️⃣ Find user (Patient or Doctor) by phone number
        let user = await Patient.findOne({ phoneNumber });
        let userType = 'Patient';
        if (!user) {
            user = await Doctor.findOne({ phoneNumber });
            userType = 'Doctor';
        }
        if (user) {
            try {
                await sendOtp(phoneNumber);
            } catch (otpError) {
                console.error('Error sending OTP:', otpError);
                return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
            }
            //store phone number in cookie for verification
            res.cookie('phoneNumber', phoneNumber, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // use secure cookies in production
                sameSite: ''
            });
            return res.status(200).json({
                message: `OTP sent to your phone. Please verify to reset your ${userType} password.`,
                verified: false,
            });
        } else {
            return res.status(404).json({ message: 'User with this phone number does not exist.' });
        }
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        res.status(500).json({
            message: 'Server error. Please try again later.',
        });
    }
};

export default forgetPassword;