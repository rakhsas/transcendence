import Game from "./Game";
import io, { Socket } from "socket.io-client";
import { useRef, useEffect, useState, useContext } from "react";
import GameStatus from "../GameStatus";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: any) => {
  const ref = useRef(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [counter, setCounter] = useState<number>(0);

  // Third Attempts
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {clearInterval(timer);}
  }, [counter]);

  useEffect(() => {
    const newSocket: Socket = io(url, {
      path: "/sogame",
      transports: ["polling"],
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
    <div className=" flex  flex-col  items-center text-white border-red-700 border w-screen h-screen ">
      {/* {roomId ? (
        roomId === "win" ? (
          <p>right click to go back to dashboard</p>
        ) : (
            <p>Start playing  {counter === 0 ? 'Go Go': counter} </p>
        )
      ) : (
        <p>Waiting for another player to join...</p>
      )} */}
      <GameStatus hamza="hello" />
      <canvas ref={ref} className="border-black my-auto border-2 w-full max-w-2xl" {...props} />
    </div>
  );
};

export default CanvasHeadToHead;
