const jwt = require('jsonwebtoken');
const { User } = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id }).select('_id firstName lastName email isAdmin');

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
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
