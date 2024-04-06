import { Avatar } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import LoadingComponent from "../shared/loading/loading";
import DataContext from "../../services/data.context";
interface Data {
    username: string;
    picture: string;
}
import "./game.css"
const GameStatus = (props: { socket: Socket | null; roomId: string }) => {
  const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
  const globalSocket = useRef<Socket>();
  const { socket, roomId } = props;
  const userData = useContext(DataContext);
  if (!userData) <LoadingComponent />;

  useEffect(() => {
    if (!userData) return;
    globalSocket.current=userData[2];
  }, [userData]);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (!socket || !globalSocket) return;
    socket.on("userData", (userdata) => {
      //console.log("Joined event from status game");
      //console.log(globalSocket)
      setData(userdata);
      globalSocket.current?.emit("inGame", userdata);
    });
    socket?.emit("userData", { id: roomId, userData: userData[0] });
    return () => {
      socket?.off("userData");
      globalSocket.current?.emit("offGame", { userData });
    };
  }, [socket]);

  return (
    <div className="h-16 m-auto border-b-2 dark:text-white text-black  flex justify-between items-center gap-2 w-full max-w-5xl rounded rounded-s-md ">
      {data ? (
        <>
          <div className="flex items-center gap-3 m-2">
            <Avatar img={baseAPIUrl + userData[0].picture} className="object-cover" rounded alt="player photo" />
            <span className="hidden sm:block ">{userData[0].username}</span>
          </div>
          <p>VS</p>
          <div className="flex items-center gap-3 m-2">
            <span className="hidden sm:block ">{data.username}</span>
            <Avatar img={baseAPIUrl + data.picture} className="object-cover"  alt="player photo" rounded />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GameStatus;
