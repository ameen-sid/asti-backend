import express from 'express';
import path from 'path';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, prismaErrorHandler, genericErrorHandler } from './middleware/error.middleware';
import { attachCorrelationIdMiddleware } from './middleware/correlation.middleware';
import logger from './config/logger.config';

const app = express();

app.use(express.json());

// Serve frontend static files in production
const frontendDistPath = path.join(process.cwd(), '../frontend/dist');
app.use(express.static(frontendDistPath));

// Registering all the routers and their corresponding routes without app server object.
app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Fallback to index.html for React routing
app.get('*all', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    time: new Date()
  });
});

// Add the error handler middleware
app.use(appErrorHandler);
app.use(prismaErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});