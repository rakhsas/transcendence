import Game from "./Game";
import io, { Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import GameStatus from "../GameStatus";
import { Button, Spinner } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: {
  width: string;
  height: string;
  map: string | undefined;
  idFoFriend: string | null;
}) => {
  const ref = useRef(null);
  const index = useRef(0);
  const status = useRef("win");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inGame, setInGame] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const newSocket: Socket = io(url, {
      path: "/sogame",
      transports: ["polling"],
    });
    const handleBeforeUnload = () => {
      // Disconnect socket without asking for confirmation
      newSocket.disconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    setSocket(newSocket);
    return (): void => {
      newSocket.close(); // Close the WebSocket connection when component unmounts
      // Clean up the event listener when the component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!socket || !roomId || roomId === "win") return;

    const canvas = ref.current;
    if (!canvas || !roomId) {
      console.error("Canvas, or roomId is not available.");
    }

    // Initialize the game
    let gameInstance: Game | null = new Game(
      canvas,
      socket,
      roomId,
      index.current,
      props.map
    );
    gameInstance.render();

    return () => {
      gameInstance = null;
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    // Event listener for receiving roomJoined event
    socket.on("roomJoined", (roomId, i, id) => {
      //console.log("Joined room");
      //console.log(id);

      index.current = i;
      setRoomId(roomId);
    });

    socket.on("win", () => {
      setRoomId("win");
    });

    socket.on("lose", () => {
      setRoomId("win");
    });
    socket.on("gameOver", (i) => {
      status.current = i.index == index.current ? "win" : "lose";
      setRoomId("win");
    });
    socket.on("connect", () => {
      //console.log("Connected");
      //console.log('props.idFoFriend', props.idFoFriend)
      if (props.idFoFriend) {
        socket.emit("playWithFriend", {me:props.idFoFriend});
      } else socket.emit("playRandomMatch");
    });
    socket.on("disconnect", () => {
      //console.log("Disconnected");
    });
    socket.on("inGame", () => {
      setInGame(true);
    });

    return () => {
      // Clean up event listeners when component unmounts
      socket.off("roomJoined");
      socket.off("win");
      socket.off("lose");
      socket.off("gameOver");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("inGame");
    };
  }, [socket]);
  function handleClick() {
    navigate("/dashboard");
  }
  return (
    <div className="flex  flex-col h-full w-full  items-center justify-center text-black  dark:text-white  ">
      {roomId ? (
        <div className="flex flex-col w-full h-full ">
          <GameStatus socket={socket} roomId={roomId} />
          {roomId === "win" ? (
            <div className=" flex-1 flex justify-center items-center ">
              <div className="flex flex-col gap-4 px-9  py-4 items-center ">
                <div className="flex-1 text-center ">
                  <p className="text-xl pb-4">Game Over</p>
                  <p className="text-xl">You {status.current}</p>
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
            </div>
          ) : (
            <canvas
              ref={ref}
              className="border-black  my-auto border-2 w-full max-w-2xl"
              width={props.width}
              height={props.height}
            />
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center ">
            {" "}
            <h2 className=" md:text-3xl text-center  lg:text-4xl sm:text-xl text-sm font-extrabold text-black dark:text-white">
              {inGame
                ? "You already in a game"
                : "Waiting for another player to join..."}
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
