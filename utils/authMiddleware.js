// middleware/authMiddleware.js
import { AuthService } from '../services/authService.js';

export const authenticate = (req, res, next) => {
  try {
    // Look for token in Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const decoded = AuthService.verifyToken(token);

    // Attach user payload to request
    req.user = decoded;

    next(); // Continue to the route
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
