const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const Posts=require('../models/newPost')
const {verifyToken,generateToken} = require('../authentication/jwt');
router.get('/:id',verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    
    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

   
    res.status(200).json({ post });
  } catch (err) {
    console.error('❌ Error fetching post:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;