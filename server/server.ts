/**
 * Express Server for Patient Management System
 * Syncfusion EJ2 Angular Grid + UrlAdaptor compatible
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import patientRoutes from './routes/patient-routes';  // ← .ts extension added to fix TS2307

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helpful request logging for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`\n→ ${req.method} ${req.path}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2).substring(0, 500) + (JSON.stringify(req.body).length > 500 ? '...' : ''));
  }
  next();
});

// Routes
app.use('/api/patients', patientRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🏥 Patient Management API Server`);
  console.log('========================================');
  console.log(`Running on: http://localhost:${PORT}`);
  console.log(`API base:  http://localhost:${PORT}/api/patients`);
  console.log(`Health:    http://localhost:${PORT}/health`);
  console.log('========================================\n');
});