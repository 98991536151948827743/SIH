import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import AuthService from "../../utils/generateAuthToken.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
    try {
        // Validate input
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required.' });
        }

        // Find user (Patient or Doctor) by phone number
        let user = await Patient.findOne({ phoneNumber });
        let userType = 'Patient';

        if (!user) {
            user = await Doctor.findOne({ phoneNumber });
            userType = 'Doctor';
        }

        // If user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials. Wrong password.' });
        }

        // Check verification
        if (!user.isVerified) {
            return res.status(200).json({
                message: `${userType} found but not verified. Please verify OTP.`,
                verified: false,
            });
        }

        // Generate token if verified
        const token = AuthService.generateToken(user);

        return res.status(200).json({
            message: `${userType} logged in successfully.`,
            verified: true,
            token,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            message: 'Server error. Please try again later.',
        });
    }
};

export default login;
