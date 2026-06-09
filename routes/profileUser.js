const express = require('express');
const router = express.Router();
const User = require('../models/signup'); // Update with actual path
const { verifyToken } = require('../authentication/jwt');

router.get('/', verifyToken, async (req, res) => {
    console.log("Entered profile route");
  try {
    const username = req.username.username;

    const user = await User.findOne(
      { username }
     
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Change password without bcrypt
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword);
    
    const username = req.username.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Direct comparison of plain-text passwords
    if (user.password !== oldPassword) {
      
      
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Update the password directly
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


module.exports = router;
