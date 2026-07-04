import { useEffect, useRef, useCallback } from 'react';

type StompClientLike = {
  connect: (headers: Record<string, unknown>, callback?: () => void) => void;
  subscribe: (destination: string, callback: (message: { body: string }) => void) => void;
  disconnect: () => void;
  send: (destination: string, headers: Record<string, unknown>, body: string) => void;
  connected?: boolean;
};

export const useWebSocket = (onTableUpdate: (data: any) => void) => {
  const stompClient = useRef<StompClientLike | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeSocket = async () => {
      if (typeof window === 'undefined') return;

      try {
        (globalThis as typeof globalThis & { global?: typeof globalThis }).global = globalThis;

        const SockJSModule = await import('sockjs-client');
        const StompModule = await import('stompjs');

        const SockJS = SockJSModule.default ?? SockJSModule;
        const Stomp = (StompModule as any).default ?? StompModule;

        const socket = new SockJS('/ws');
        const client = Stomp.over(socket) as StompClientLike;

        client.connect({}, () => {
          if (cancelled) return;
          client.subscribe('/topic/table-updates', (message: { body: string }) => {
            const data = JSON.parse(message.body);
            onTableUpdate(data);
          });
        });

        stompClient.current = client;
      } catch (error) {
        console.warn('WebSocket unavailable, continuing without live updates.', error);
      }
    };

    void initializeSocket();

    return () => {
      cancelled = true;
      stompClient.current?.disconnect();
    };
  }, [onTableUpdate]);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(destination, {}, JSON.stringify(body));
    }
  }, []);

  return { sendMessage };
};