// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const listRoutes = require('./routes/listRoutes');


const app = express();

// const bcrypt = require('bcryptjs');
// const password = 'password123'; // or any password you want
// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) console.error(err);
//   console.log(hash);
// });

const corsOption = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type', 'x-auth-token'],
};

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors(corsOption)); // Enables Cross-Origin Resource Sharing


// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CSInfo"
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the database
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
