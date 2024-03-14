import Game from "./Game";
import io, { Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: any) => {
  const ref = useRef(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const canvas = ref.current;
    const socket: Socket = io(url, {
      path: "/sogame",
    });

    // Event listener for receiving roomJoined event
    socket.on("roomJoined", (roomId) => {
      console.log("Joinded room");
      if (!canvas || !socket || !roomId) return () => socket.close();
      new Game(canvas, socket, roomId);
      setRoomId(roomId);
    });

    socket.on("win", () => {
      setRoomId(null);
    });

    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));

    return () => {
      socket.off("roomJoined");
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
      socket.close(); // Close the WebSocket connection when component unmounts
    };
  }, []);

  return (
    <div className="relative">
      {roomId ? (
        <div>
          <p>You are in room: {roomId}</p>
        </div>
      ) : (
        <>
          <p>Waiting for another player to join...</p>
        </>
      )}
      {/* Your game UI here */}
      {/* <div  className="absolute gap-5 bg-white   text-black flex flex-col justify-around   items-center  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-center h-1/2 w-1/2" >
        {" "}
        <span>You win</span>
        <div className="flex gap-20" >
          <div className="bg-red-600 ">
            <h2>hamza</h2>
            <span>5</span>
          </div>
          <div className="inline">
            <h2>walid</h2>
            <span>3</span>
          </div>
        </div>
        <div className="flex gap-20">
          <button ><IoHomeOutline /></button>
          <button onClick={() => window.location.reload()}><IoIosRefresh /></button>
        </div>
      </div> */}
      <canvas ref={ref} className="border-black border-2" {...props} />
    </div>
  );
};

export default CanvasHeadToHead;
