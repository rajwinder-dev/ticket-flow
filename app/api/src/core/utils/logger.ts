//config/logger.ts
import type { Application } from 'express';
import path from 'path';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import crypto from 'crypto';
// Base directory for logs
const base = path.resolve('./logs');
// File paths for info and error logs
const infoPath = path.join(base, 'info/info.log');
const errorPath = path.join(base, 'error/error.log');
// Configure logger with transports
const transports = pino.transport({
  targets: [
    {
      target: 'pino-roll',
      level: 'info',
      options: {
        file: infoPath,
        frequency: 'daily',
        mkdir: true,
        limit: { count: 15 },
        dateFormat: 'dd-MM-yyyy',
      },
    },
    {
      target: 'pino-roll',
      level: 'error',
      options: {
        file: errorPath,
        frequency: 'daily',
        mkdir: true,
        limit: { count: 15 },
        dateFormat: 'dd-MM-yyyy',
      },
    },
  ],
});
// Main logger instance
const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'req.headers.cookie',
        'req.headers.authorization',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]'
    },
  },
  transports,
);

// Middleware to log HTTP requests
const configLogger = (app: Application) => {
  app.use(
    pinoHttp({
      logger,
      //This function generates a request id and set in header to use as requestId
      genReqId: (req, res) => {
        const existingID = req.id ?? req.headers['x-request-id'];
        if (existingID) return existingID;
        const id = crypto.randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
    }),
  );
};
export { logger, configLogger };
