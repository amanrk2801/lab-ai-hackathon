const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./database/connection');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initializeDatabase() {
  try {
    await database.connect();
    console.log('Connected to MySQL database');
    
    // Make db available globally for routes
    app.locals.db = database;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Library Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await database.query('SELECT 1');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Import route modules
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const issueRoutes = require('./routes/issues');
const paymentRoutes = require('./routes/payments');
const rackRoutes = require('./routes/racks');
const copyRoutes = require('./routes/copies');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/copies', copyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(console.error);

module.exports = app;

