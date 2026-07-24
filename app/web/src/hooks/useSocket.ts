import { authClient } from '@/lib/auth-client';
import { getSocket } from '@/lib/socketIo';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export const useSocket = () => {
  const {data} = authClient.useSession()
  useEffect(() => {
    let socket: Socket | null = null;
    let onConnect: (() => void) | null = null;
    let onDisconnect: (() => void) | null = null;
    let onNotification: (() => void) | null = null;
    const setup = async () => {
      if (!data) return console.log(data);
      socket = await getSocket({
        userId: data?.user.id ,
        token: data?.session.token ,
      });
      onConnect = () => console.log('socket connected');
      onDisconnect = () => console.log('socket disconnected');
      onNotification = () => console.log('notification');
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    };
    // setup condtion when to active socket
    if (true) setup().catch(console.error);
    // clean up is necssary, on disconnect manually
    return () => {
      if (!socket) return;
      if (onConnect) socket.off('connect', onConnect);
      if (onDisconnect) socket.off('disconnect', onDisconnect);
      if (onNotification) socket.off('notification:new', onNotification);
    };
  }, [data]);
};
