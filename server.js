
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const env = require('dotenv');
const cors = require('cors');
const connectDb = require('./database/db');
const {verifyToken}=require('./authentication/jwt')
const dns=require('dns');

dns.setServers(["1.1.1.1","8.8.8.8"]);



env.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://lostandfound27.netlify.app/signup', // Match your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: 'https://lostandfound27.netlify.app/signup',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// MongoDB Connection
connectDb();

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
const Message = require('./models/Message');

app.post('/messages', async (req, res) => {
  const newMsg = new Message(req.body);
  await newMsg.save();
  res.status(201).json(newMsg);
});

app.get('/messages/:roomId', async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId });
  res.json(messages);
});



// Message Routes
app.post('/send', verifyToken, async (req, res) => {
  const { receiver, message, postId } = req.body;
  const sender = req.username.username;

  try {
    const newMsg = new Chat({ sender, receiver, message, postId });
    await newMsg.save();
    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
});
app.get('/conversation/:receiver/:postId', verifyToken, async (req, res) => {
  const sender = req.username.username;
  const { receiver, postId } = req.params;

  try {
    const messages = await Chat.find({
      postId,
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort('timestamp');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Existing Routes
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const showPostRoutes = require('./routes/ShowPost');
const newPostRoutes = require('./routes/newPost');
const myPostRoutes = require('./routes/mypost');
const updatePostRoutes = require('./routes/updatePost');
const deletePostRoutes = require('./routes/deletePost');
const postByIdRoutes = require('./routes/postByid');
const profileUserRoutes = require('./routes/profileUser');

app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/showpost', showPostRoutes);
app.use('/newpost', newPostRoutes);
app.use('/mypost', myPostRoutes);
app.use('/updatepost', updatePostRoutes);
app.use('/deletepost', deletePostRoutes);
app.use('/postbyid', postByIdRoutes);
app.use('/profile', profileUserRoutes);

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
