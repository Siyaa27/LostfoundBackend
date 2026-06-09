const express     = require('express');
const router      = express.Router();
const multer      = require('multer');
const Post        = require('../models/newPost');
const {verifyToken} = require('../authentication/jwt');

// Multer setup (store files in /uploads)
const storage=multer.memoryStorage();
const upload = multer({ storage });


router.put(
  '/:id',
  verifyToken,
  upload.single('image'),
  async (req, res) => {
    
    
    try {
      console.log("Entered in PostUpdate Route");
      
      const postId = req.params.id;
      const { description } = req.body;
      const file = req.file?req.file.buffer.toString("base64"):null;

      // 1) Fetch the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

     
      // 2) Ensure the current user is the owner
      if (post.postedBy.toString() !== req.username.username) {
        
        return res.status(403).json({ message: 'Not authorized' });
      }

      // 3) Build the updates object
      const updates = {};
      if (description) updates.description = description;
      if (file) {
        updates.imageUrl =file;
      }

      // 4) Perform the update
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updates },
        { new: true }  // return the updated document
      );

      return res.json({ message: 'Post updated', post: updatedPost });
    } catch (err) {
      console.error('Update Post Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
