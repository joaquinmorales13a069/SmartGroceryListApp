// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      console.log("Incoming Token:", token);
      console.log("JWT_SECRET being used:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // || 'fallback_secret_key');

      req.user = await User.findById(decoded.userId || decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Token validation failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
