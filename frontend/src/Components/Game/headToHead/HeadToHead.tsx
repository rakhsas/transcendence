import Game from "./Game";
import io, { Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import GameStatus from "../GameStatus";
import { Button, Spinner } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import CallComponent from "../../call/call";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: { width: string; height: string }) => {
  const ref = useRef(null);
  const index = useRef(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [counter, setCounter] = useState<number>(0);

  // // Third Attempts
  // useEffect(() => {
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [counter]);

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

    if (!canvas || !socket || !roomId) {
      console.error("Canvas, socket, or roomId is not available.");
      return () => socket.close();
    }

    // Initialize the game
    let gameInstance: Game | null = new Game(
      canvas,
      socket,
      roomId,
      index.current
    );
    gameInstance.render();

    return () => {
      gameInstance = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    // Event listener for receiving roomJoined event
    socket.on("roomJoined", (roomId, i) => {
      console.log("Joined room");
      index.current = i;
      setRoomId(roomId);
    });

    socket.on("win", () => {
      setRoomId("win");
    });

    socket.on("lose", () => {
      setRoomId("win");
    });
    socket.on("gameOver",()=>{
      setRoomId('win');
    });
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      // Clean up event listeners when component unmounts
      socket.off("roomJoined");
      socket.off("win");
      socket.off("lose");
      socket.off("gameOver");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    console.log("You clicked submit.");
    window.location.replace("/dashboard");
  }
  return (
    <div className="flex relative flex-col  items-center justify-center  text-white  border-e border  ">
      {roomId ? (
        <>
          <GameStatus socket={socket} />
          <canvas
            ref={ref}
            className="border-black  my-auto border-2 w-full max-w-2xl"
            {...props}
          />
          {/* { <p className=" border-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center overflow-hidden">go back </p>} */}
          {roomId === "win" && (
            <div className="absolute bg-[#FD0363] rounded-xl w-1/2 h-1/2 flex flex-col p-4  items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex-1 text-center ">
                <p className="text-xl pb-4">Game Over</p>
                <p className="text-xl">You win</p>
              </div>
              <Button
                onClick={handleClick}
                outline
                gradientDuoTone="greenToBlue"
                className="mb-0"
              >
                Go back
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />

              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center ">
            {" "}
            <h2 className=" md:text-3xl text-center  lg:text-4xl sm:text-xl text-sm font-extrabold text-black dark:text-white">
              {" "}
              Waiting for another player to join...{" "}
            </h2>
            <div className="w-10 h-10 o text-center">
              <Spinner
                color="failure"
                aria-label="Failure spinner example"
                size="lg"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasHeadToHead;
