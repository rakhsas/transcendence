import { Avatar } from "flowbite-react";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

const GameStatus = (props: { socket: Socket | null }) => {
  const { socket } = props;
  useEffect(() => {
    if(!socket) return;
    socket.on("roomJoined", () => {
      console.log("Joined event from status game");
    });

    return () => {
      socket.off("roomJoined");
    };
  }, [socket]);
  return (
    <div className="h-16 m-auto dark:text-white text-black  flex justify-between items-center gap-2 w-full max-w-5xl rounded rounded-s-md ">
      <div className="flex items-center gap-3 m-2">
        <Avatar
          img="https://cdn.intra.42.fr/users/6e8cc2655463afb4932678d496f32011/hbenfadd.JPG"
          alt="player photo"
          rounded
        />
        <span className="hidden sm:block ">hamza</span>
      </div>
      <p>VS</p>
      <div className="flex items-center gap-3 m-2">
        <span className="hidden sm:block ">hamza</span>
        <Avatar
          img="https://cdn.intra.42.fr/users/6e8cc2655463afb4932678d496f32011/hbenfadd.JPG"
          alt="player photo"
          rounded
        />
      </div>
    </div>
  );
};

export default GameStatus;
