
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import { Server } from 'socket.io';

import { logger } from './core/utils/logger.js';
import { log } from '@org/utils'; // adjust if your logger export differs
import { env  } from './config/env.js'; // adjust path if needed

import app from './app.js';

import { authMiddleware } from './modules/auth/auth.middleware.js';
import AuthService from './modules/auth/auth.service.js';
import { devMode } from './config/appConfig.js';
import { connectUntilSuccess } from './core/utils/dbConnect.js';
import { prisma } from '@org/database';


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
    try {
      const hasAccess = await AuthService.CheakUserORganization({
        userId,
        organizationId: orgId,
      });

      if (!hasAccess) {
        socket.emit('error', 'Unauthorized organization');
        return;
      }

      if (socket.currentOrg) {
        socket.leave(`org:${socket.currentOrg}`);
      }

      socket.join(`org:${orgId}`);
      socket.currentOrg = orgId;

    } catch (error) {
      logger.error(error, 'join-org error');
      socket.emit('error', 'Something went wrong');
    }
  });


  socket.on('disconnect', () => {
    log.info(`${userId} disconnected`);
  });
});



async function startServer() {
  try {
    await connectUntilSuccess();

    server.listen(port, '0.0.0.0', () => {
      const actualPort = (server.address() as AddressInfo).port;

      log.success(`Server running on port ${actualPort}`);

      if (devMode) {
        log.info('🪛 Development Mode');
      }
    });

  } catch (error) {
    logger.fatal(error, 'Server startup failed');
    process.exit(1);
  }
}



let shuttingDown = false;


async function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`\n👋 ${signal} RECEIVED. Shutting down gracefully...`);


  try {

    io.close(() => {
      console.log('Socket.IO closed.');
    });


    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('HTTP server closed.');
        resolve();
      });
    });


    // Avoid reconnect delay during tsx watch restart
    if (!devMode) {
      await prisma.$disconnect();
      console.log('DB disconnected.');
    }


    console.log('Shutdown complete.');

  } catch (error) {
    logger.error(error, 'Shutdown error');

  } finally {
    process.exit(0);
  }
}



process.on('SIGINT', () => shutdown('SIGINT'));

process.on('SIGTERM', () => shutdown('SIGTERM'));



process.on('uncaughtException', (error) => {
  logger.fatal(error, 'uncaught exception');
  process.exit(1);
});


process.on('unhandledRejection', (error) => {
  logger.fatal(error, 'unhandled rejection');
});



if (env.nodeEnv !== 'test') {
  startServer();
}

