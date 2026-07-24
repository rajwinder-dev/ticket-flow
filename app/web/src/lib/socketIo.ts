import { Socket, io } from 'socket.io-client';
export function getSocket({
  userId,
  token,
}: {
  userId: string;
  token: string;
}): Promise<Socket> {
  if (typeof window === 'undefined')
    throw new Error('Socket must run on client');
  if (window.__socket && window.__socket.connected)
    return Promise.resolve(window.__socket);
  if (window.__socketPromise) return window.__socketPromise;
  window.__socketPromise = (async () => {
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000',
      {
        transports: ['websocket'],
        auth: {
          userId,
          token,
        },
        autoConnect: true,
      },
    );
    window.__socket = socket;
    window.__socketPromise = undefined;
    return socket;
  })();
  return window.__socketPromise;
}
export function disconnectSocket() {
  window.__socket?.disconnect();
  window.__socket = undefined;
  window.__socketPromise = undefined;
}
