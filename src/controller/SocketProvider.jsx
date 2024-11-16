import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const identity = localStorage.getItem('identity');

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 2000,
    });

    newSocket.on('connect', () => {
      console.log(`Conectado ao servidor: ${newSocket.id}`);
      newSocket.emit('setIdentity', identity); // Tratamento para identity nulo
      setConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      setError(reason);
    });

    newSocket.on('connect_error', (error) => {
      setError(error);
    });

    // Reconexão
    newSocket.on("reconnect_attempt", (attempt) => {
        console.log(`Tentativa de reconexão #${attempt}`);
    });

    // Falha da reconexão
    newSocket.on("reconnect_failed", () => {
        console.log("Falha ao reconectar. Atualizando a página...");
        location.reload();
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("Desconectando do socket...");
        newSocket.off('disconnect');
        newSocket.disconnect();
      }
    };
  }, []);

  const value = { socket, connected, error };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };