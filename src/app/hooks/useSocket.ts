// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your server URL

// Define a type for the socket instance
type SocketType = Socket | null;

export const useSocket = (): SocketType => {
  const [socket, setSocket] = useState<SocketType>(null);

  useEffect(() => {
    // Create a socket connection
    const socketInstance: Socket = io(SOCKET_SERVER_URL);

    // Set the socket instance to state
    setSocket(socketInstance);

    // Log connection status
    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup on component unmount to avoid memory leaks
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, []); // Empty dependency array to run only once

  return socket;
};
