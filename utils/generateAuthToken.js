// services/authService.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const AuthService = {
  /**
   * Generate JWT token for a user
   * @param {Object} user - User document
   * @param {Object} options - Optional overrides
   * @param {string} options.expiresIn - Token expiration (default '7d')
   * @returns {string} JWT token
   */
  generateToken: (user, options = {}) => {
    const secret = process.env.JWT_SECRET_KEY;
    const expiresIn = options.expiresIn || '10d';

    const token = {
      sub: user._id.toString(),      
      phoneNumber: user.phoneNumber,  
      role: user.role || 'user',      
      jti: crypto.randomUUID(),   
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(token, secret, { expiresIn });
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token string
   * @returns {Object} Decoded payload
   * @throws Error if token is invalid or expired
   */
  verifyToken: (token) => {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  },
};
export default AuthService;

