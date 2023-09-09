import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "ws://127.0.0.1";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIO = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
