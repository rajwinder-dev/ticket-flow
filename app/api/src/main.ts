import http from 'http';
import { AddressInfo } from 'net';
import { app } from './app.js';
import { devMode } from './config/appConfig.js';
import { env } from './config/env.js';
import { log } from '@org/utils';
import { connectUntilSuccess } from './core/utils/dbConnect.js';
import { prisma } from '@org/database';
import { logger } from './core/utils/logger.js';
import { Server } from 'socket.io';
import { authMiddleware } from './modules/auth/auth.middleware.js';
import AuthService from './modules/auth/auth.service.js';
const port = Number(env.port);
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: env.betterAuthUrl,
    credentials: true,
  },
});
io.use(authMiddleware.SocketAuth);

io.on('connection', (socket) => {
  const { userId } = socket.handshake.auth;

  socket.join(`user:${userId}`);
  socket.currentOrg = undefined;

  log.success(`${userId} connected`);

  socket.on('join-org', async (orgId) => {
    const hasAccess = await AuthService.CheakUserORganization({
      userId,
      organizationId: orgId,
    });
    if (!hasAccess) socket.emit('error', 'Unauthorized organization');

    if (socket.currentOrg) {
      socket.leave(`org:${socket.currentOrg}`);
    }

    socket.join(`org:${orgId}`);
    socket.currentOrg = orgId;
  });

  socket.on('disconnect', () => {
    log.info(`${userId} disconnected`);
  });
});

if (env.nodeEnv !== 'test')
  server.listen(port, '0.0.0.0', async () => {
    await connectUntilSuccess();
    const actualPort = (server.address() as AddressInfo).port;
    log.success(`Server running on port ${actualPort}`);

    if (devMode) log.info('🪛  Development Mode');
  });

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'uncaught exception');
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'unhandled rejection');
});

const shutdown = async (signal: string) => {
  console.log(`\n👋 ${signal} RECEIVED. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
  });

  try {
    await prisma.$disconnect();
    console.log('DB disconnected.');
  } catch (err) {
    console.error('Error during DB disconnect:', err);
  }

  console.log('Process terminated. 🛑');
  process.exit(0);
};

// Listen for BOTH restart and termination signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
