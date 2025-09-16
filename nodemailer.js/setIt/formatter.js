import generateOTP from './otpGenerator.js';

function sms(expiryMinutes = 10) {
  const otp = generateOTP();

    const message = `Your Sehat376 verification code is ${otp}. It is valid for ${expiryMinutes} minutes. Please do not share this code with anyone.`;


  return { otp, message };
}

export default sms;
