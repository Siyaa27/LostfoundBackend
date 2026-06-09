const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const {verifyToken,generateToken} = require('../authentication/jwt');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ username});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const generatetoken=generateToken({username:user.username});  

    res.status(200).json({ message: 'Login successful', user,Token: generatetoken });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
