import client from './transporter.js';
import createOtpMessage from './formatter.js';
import dotenv from 'dotenv';
dotenv.config();

import Patient from '../../models/patient.model.js';
import Doctor from '../../models/doctor.model.js';

const fromNumber = process.env.TWILIO_PHONE_NUMBER;

async function sendOtp(to, expiryMinutes = 10) {
  if (!to) throw new Error('Recipient phone number is required');

  const { otp, message } = createOtpMessage(expiryMinutes);

  const sms = await client.messages.create({
    body: message,
    from: fromNumber,
    to,
  });

  console.log(`OTP sent to ${to}`);
//   Save OTP to DB (Patient or Doctor)
    
    let user = await Patient.findOne({to});
    if (!user) {
      user = await Doctor.findOne({to});
    }
    if (!user) {
      throw new Error('User with this phone number does not exist');
    }
    user.otp = otp;
    user.otpExpiry = Date.now() + expiryMinutes * 60000; // expiry time in ms
    await user.save();
    console.log(`OTP saved for user ${user._id}`);

  return { otp, sid: sms.sid };
}
export default sendOtp;
