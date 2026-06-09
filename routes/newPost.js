const express = require('express');
const multer = require('multer');
const Post = require('../models/newPost');
const router = express.Router();
const {verifyToken}  = require('../authentication/jwt'); // Adjust the path as needed
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multer setup (using memory storage for uploads)

router.post( '/' ,verifyToken, upload.single('image'), async (req, res) => {
    try {
      const { description } = req.body;
      const imageBuffer = req.file ? req.file.buffer.toString("base64") : null;
      console.log("Image:", req.username.username);
      // Ensure req.user exists and has username
      if (req.user==="undefined") {
        return res.status(401).json({ message: 'Invalid  in token' });
      }

      const newPost = new Post({
        description,
        imageUrl: imageBuffer,
        postedBy: req.username.username// comes from JWT payload
      });

      await newPost.save();
      res.status(201).json({ message: 'Post created', post: newPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
