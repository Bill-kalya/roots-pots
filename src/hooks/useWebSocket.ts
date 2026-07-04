import { useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

export const useWebSocket = (onTableUpdate: (data: any) => void) => {
  const stompClient = useRef<any>(null);

  useEffect(() => {
    const socket = new SockJS('/ws');
    const client = Stomp.over(socket);
    
    client.connect({}, () => {
      client.subscribe('/topic/table-updates', (message: any) => {
        const data = JSON.parse(message.body);
        onTableUpdate(data);
      });
    });

    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [onTableUpdate]);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(destination, {}, JSON.stringify(body));
    }
  }, []);

  return { sendMessage };
};