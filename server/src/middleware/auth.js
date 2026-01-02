const jwt = require('jsonwebtoken');
const { User } = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify token - jwt.verify automatically checks expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id }).select('_id firstName lastName email isAdmin');

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired. Please login again.', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token. Please login again.', code: 'INVALID_TOKEN' });
    }
    res.status(401).send({ error: 'Please authenticate.', code: 'AUTH_REQUIRED' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).send({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: 'Server error', details: error.message });
  }
};

module.exports = { auth, isAdmin };
