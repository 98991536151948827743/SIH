import crypto from 'crypto';
function generateOTP(length = 6) {
  if (length <= 0) throw new Error('length must be > 0');
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

export default generateOTP;
