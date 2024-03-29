import { Avatar } from "flowbite-react";

const GameStatus = (props) => {
  return (
    <div className="bg-green-800 h-16 mx-auto flex justify-between items-center gap-2 w-full max-w-5xl rounded rounded-s-md ">
      <div className="flex items-center gap-3 m-2">
        <Avatar
          img="https://cdn.intra.42.fr/users/6e8cc2655463afb4932678d496f32011/hbenfadd.JPG"
          alt="player photo"
          rounded
        />
        
      <span className="hidden sm:block ">hamza</span>
      </div>
      <span >3</span>
      <p>VS</p>
      <span>2</span>
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
