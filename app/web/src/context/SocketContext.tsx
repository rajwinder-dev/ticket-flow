import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';
import { getSocket } from '@/lib/socketIo';

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!data) return;

    let instance: Socket;

    const setup = async () => {
      instance = await getSocket({
        userId: data.user.id,
        token: data.session.token,
      });

      setSocket(instance);

      const onConnect = () => setConnected(true);
      const onDisconnect = () => setConnected(false);

      const onEvent = (payload: any) => {
        switch (payload.type) {
          case 'invalidate':
            payload.keys.forEach((key: string[] | string) => {
              if (typeof key === 'string') {
                queryClient.invalidateQueries({ queryKey: [key] });
              } else if (Array.isArray(key)) {
                console.log(key)
                queryClient.invalidateQueries({ queryKey: key });
              } else {
                console.error('Invalid invalidate payload');
              }
            });
            break;
        }
      };

      instance.on('connect', onConnect);
      instance.on('disconnect', onDisconnect);
      instance.on('event', onEvent);

      return () => {
        instance.off('connect', onConnect);
        instance.off('disconnect', onDisconnect);
        instance.off('event', onEvent);
      };
    };

    let cleanup: (() => void) | undefined;

    setup().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cleanup?.();
    };
  }, [data, queryClient]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used inside SocketProvider');
  }

  return context;
}
