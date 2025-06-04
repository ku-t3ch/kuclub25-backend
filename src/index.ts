import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import pool from './configs/db';
import { setupSwagger } from './doc/swagger';


// Import routes
import tokenRoutes from './routes/token.route';
import projectRoutes from './routes/project.route';
import organizationRoutes from './routes/organization.route';
import campusRoutes from './routes/campus.route';
import organizationTypeRoutes from './routes/organizationType.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    ...(process.env.ADDITIONAL_FRONTEND_URLS?.split(',') || [])
  ],
  credentials: true
}));
app.use(morgan('combined'));

// Enhanced JSON parsing with error handling
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString());
    } catch (err) {
      console.log('Invalid JSON received:', buf.toString());
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Setup Swagger documentation BEFORE routes
setupSwagger(app);

// Health check with database status
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      message: 'KU Club Backend API', 
      status: 'running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'KU Club Backend API', 
      status: 'running',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/api/auth', tokenRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/organization-types', organizationTypeRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Enhanced error handler with JSON parsing error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', {
    message: err.message,
    url: req.url,
    method: req.method,
    contentType: req.headers['content-type'],
    body: req.body
  });

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body. For GET requests, please ensure no body is sent.',
      hint: 'If using Postman, select "None" for the body type on GET requests'
    });
  }

  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!' 
  });
});

// CORS preflight and headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  await pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`📚 Available endpoints (🔒 = Token Required):`);
  console.log(`   POST  /api/auth/get-token`);
  console.log(`   🔒 GET  /api/projects`);
  console.log(`   🔒 GET  /api/organizations`);
  console.log(`   🔒 GET  /api/campuses`);
  console.log(`   🔒 GET  /api/organization-types`);
  console.log(`\n📝 Usage: Include 'Authorization: Bearer <token>' header for protected routes`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;