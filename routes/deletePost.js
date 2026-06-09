const express     = require('express');
const router      = express.Router();
const Post        = require('../models/newPost');
const {verifyToken} = require('../authentication/jwt');

// DELETE /api/posts/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {

    const postId = req.params.id;
    const username = req.username.username;
    

    // 1) Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 2) Check ownership
    if (post.postedBy!== username) {
      console.log('Post owner:', post.postedBy.toString());
      console.log('Current user:', username);
 
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // 3) Delete it
    await Post.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete Post Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
