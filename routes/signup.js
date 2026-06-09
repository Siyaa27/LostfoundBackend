const express = require('express');
const router = express.Router();
const User = require('../models/signup'); // adjust path if needed


// POST /api/signup
router.post('/', async (req, res) => {
  try {
    const { username, password, mobileNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create and save new user
    const newUser = new User({ username, password, mobileNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: `Server error =${error.message}`, error: error.message });
  }
});

module.exports = router;


