const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const Posts=require('../models/newPost')
const {verifyToken,generateToken} = require('../authentication/jwt');

// Protected route
router.get('/', verifyToken, async (req, res) => {
  try {
    const myPosts = await Posts.find({postedBy:req.username.username});
    res.status(200).json(myPosts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
