import { Avatar } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import LoadingComponent from "../shared/loading/loading";
import DataContext from "../../services/data.context";
interface Data {
    username: string;
    picture: string;
}

const GameStatus = (props: { socket: Socket | null; roomId: string }) => {
  const { socket, roomId } = props;
  const userData = useContext(DataContext);
  if (!userData) <LoadingComponent />;

  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (!socket) return;
    socket.on("userData", (userdata) => {
      console.log("Joined event from status game");
      console.log(userdata.username);
      setData(userdata);
    });
    socket?.emit("userData", { id: roomId, userData: userData[0] });
    return () => {
      socket?.off("roomJoined");
    };
    return () => {
      socket?.off("userData");
    }
  }, [socket]);

  return (
    <div className="h-16 m-auto dark:text-white text-black  flex justify-between items-center gap-2 w-full max-w-5xl rounded rounded-s-md ">
      {data ? (
        <>
          <div className="flex items-center gap-3 m-2">
            <Avatar img={userData[0].picture} rounded alt="player photo" />
            <span className="hidden sm:block ">{userData[0].username}</span>
          </div>
          <p>VS</p>
          <div className="flex items-center gap-3 m-2">
            <span className="hidden sm:block ">{data.username}</span>
            <Avatar img={data.picture} alt="player photo" rounded />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GameStatus;
