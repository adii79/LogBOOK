// // const express = require('express');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const connectDB = require('./config/database');

// // dotenv.config();

// // const app = express();

// // // Connect to MongoDB
// // connectDB();

// // // Middleware
// // app.use(cors({
// //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// //   credentials: true
// // }));
// // app.use(express.json());

// // // Routes
// // app.use('/api/auth', require('./routes/auth'));
// // app.use('/api/projects', require('./routes/projects'));
// // app.use('/api/tasks', require('./routes/tasks'));
// // app.use('/api/notes', require('./routes/notes'));

// // // Health check
// // app.get('/health', (req, res) => {
// //   res.json({ status: 'Server is running' });
// // });

// // const PORT = process.env.PORT || 4000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });



// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/database');

// dotenv.config();

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users')); // Add this line
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/notes', require('./routes/notes'));

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'Server is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;



// backend/server.js - Debug version with logging
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Add logging middleware to debug routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check (move this before other routes for testing)
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Routes - Add error handling for require statements
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  app.use('/api/projects', require('./routes/projects'));
  console.log('Projects routes loaded successfully');
} catch (error) {
  console.error('Error loading projects routes:', error.message);
}

try {
  app.use('/api/tasks', require('./routes/tasks'));
  console.log('Tasks routes loaded successfully');
} catch (error) {
  console.error('Error loading tasks routes:', error.message);
}

try {
  app.use('/api/notes', require('./routes/notes'));
  console.log('Notes routes loaded successfully');
} catch (error) {
  console.error('Error loading notes routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler (should be last)
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;