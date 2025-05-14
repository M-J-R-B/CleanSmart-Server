const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

// Import routes
const authRoutes = require('./routes/auth');
const taskGroupRoutes = require('./routes/taskGroup');
const tasksRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Set mongoose debug mode
mongoose.set('debug', true);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Log the database name
    console.log('Database name:', mongoose.connection.db.databaseName);
    // Log all collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Error listing collections:', err);
        return;
      }
      console.log('Collections:', collections.map(c => c.name));
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', process.env.MONGODB_URI);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/taskGroups', taskGroupRoutes);
app.use('/api/tasks', tasksRoutes);

// Test endpoint to list all users
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    console.log('All users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('CleanSmart Backend is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is accessible at http://localhost:${PORT}`);
  console.log(`For Android emulator or device at 192.168.1.9, use: http://192.168.1.9:${PORT}`);
}); 