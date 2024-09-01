import { useEffect, useState} from "react"
import { io, Socket} from "socket.io-client"

const SOCKET_SERVER_URL = " http://localhost:3000"


type SocketType = Socket | null;

export const useSocket = ():  SocketType => {
  const [socket, setSocket] = useState<SocketType>(null);

  useEffect(() => {

    const socketInstance: Socket = io(SOCKET_SERVER_URL)

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
        console.log("Connected to socket server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected to socket server");
  })

  return () => {
    if(socketInstance) {
      socketInstance.disconnect();
      console.log("Socket disconnected on cleanup")
      }
    }
  }, [])

  return socket;
}
