const { User } = require('../models/User.model');
const jwt = require('jsonwebtoken');

function stripPassword(userDoc) {
  if (!userDoc) return userDoc;
  const plain = typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;
  const { password, ...rest } = plain;
  return rest;
}

//Sign up user
async function signUp(req, res) {
  try {
    const { firstName, lastName, email, phoneNumber, password, isAdmin } = req.body;

    // Validate the email address
    if (!email.includes('@')) {
      return res.status(400).send({ error: 'Invalid email address' });
    }

    // Validate the phone number
    if (phoneNumber.length !== 11) {
      return res.status(400).send({ error: 'Phone number must be 11 digits' });
    }

    // Validate the password
    if (password.length < 6) {
      return res.status(400).send({ error: 'Password must be at least 6 characters' });
    }

    // Create new user with default isAdmin = false
    // Note: isAdmin can only be set by another admin, which will be controlled
    // through middleware in admin routes
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      // isAdmin is ignored here - it can only be set by admin users through a separate endpoint
    });
    await user.save();
    res.status(201).send({ user: stripPassword(user) });
  } catch (error) {
    res.status(400).send({ error: 'User registration failed', details: error.message });
  }
}

//login user
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'Invalid email or password' });
    }
    const isPasswordMatch = await user.checkPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    // Generate JWT token with expiry (7 days)
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.send({ user: stripPassword(user), token });
  } catch (error) {
    res.status(400).send(error);
  }
}

// Get current user
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({ user: stripPassword(user) });
  } catch (error) {
    res.status(500).send({ error: 'Failed to get user profile', details: error.message });
  }
}

module.exports = { signUp, login, getCurrentUser, stripPassword };
