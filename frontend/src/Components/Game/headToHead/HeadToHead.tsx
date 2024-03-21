import Game from "./Game";
import io, { Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: any) => {
  const ref = useRef(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io(url, {
      path: "/sogame",
      transports: ['polling'],
    });
    setSocket(newSocket);
    return (): void => {
      newSocket.close(); // Close the WebSocket connection when component unmounts
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const canvas = ref.current;
    // Event listener for receiving roomJoined event
    socket.on("roomJoined", (roomId, index) => {
      console.log("Joinded room");
      if (!canvas || !socket || !roomId) return () => socket.close();
      new Game(canvas, socket, roomId, index);
      setRoomId(roomId);
    });

    socket.on("win", () => {
      setRoomId("win");
    });

    socket.on("lose", () => {
      setRoomId("win");
    });
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.off("roomJoined");
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <div className="font-kenia text-GREEN size-6 text-center w-auto h-auto">
      {roomId ? (
        roomId === "win" ? (
          <p className="font-kenia ">
            right click to go back to dashboard or left click to play again
          </p>
        ) : (
          <p className="font-kenia">start playing {roomId}</p>
        )
      ) : (
        <p>Waiting for another player to join...</p>
      )}
      <canvas ref={ref} className="border-black border-2" {...props} />
    </div>
  );
};

export default CanvasHeadToHead;
