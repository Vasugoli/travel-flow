import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Global Core Middlewares
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root / Health Check API
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'TransportFlow TMS Service is healthy',
    timestamp: new Date(),
  });
});

// Fallback Route Handler (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`❌ Server Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server Listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 TransportFlow server running on port ${PORT}`);
  });
}

export default app;
