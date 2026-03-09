import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Import routes
import inventoryRoutes from './routes/inventory.js';
import requestRoutes from './routes/requests.js';
import recordRoutes from './routes/records.js';
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/records', recordRoutes);
  app.use('/api/auth', authRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, '../../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      path: req.path,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
