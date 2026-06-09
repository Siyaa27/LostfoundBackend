const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const Posts=require('../models/newPost')
const {verifyToken,generateToken} = require('../authentication/jwt');

// Protected route
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await Posts.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/postdetail/:id',verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    
    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    console.log('✅ Post fetched successfully:', post.postedBy);
    res.status(200).json({ post });
  } catch (err) {
    console.error('❌ Error fetching post:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
