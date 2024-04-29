import { useState } from "react";
import CanvasHeadToHead from "./headToHead/HeadToHead";
import img1 from "./images/table-tennis-ping-pong.jpg";
import img2 from "./images/ping-pong.jpg";
import img3 from "./images/pong.jpg";
import { PropaneSharp } from "@mui/icons-material";
import { useParams } from "react-router-dom";

const WithFriend = () => {
  const [selectedMap, setSelectedMap] = useState("map1"); // State to track the selected map
  const [isStarted, setIsStarted] = useState(false); // State to track if the game has started
	const { idFoFriend } = useParams();

  const handleChange = (map) => {
    setSelectedMap(map); // Update the selected map
  };

  // Array of map objects
  const maps = [
    { id: "map1", imgSrc: img1 },
    { id: "map2", imgSrc: img2 },
    { id: "map3", imgSrc: img3 },
  ];

  return (
    <div className="flex text-black dark:text-white justify-center w-full h-full items-center">
      <div className="flex justify-center w-[600px] h-[450px] border-2 border-red-600 rounded-xl">
        {isStarted && idFoFriend ? (
          <CanvasHeadToHead
            width="600"
            height="400"
            map={maps.find((map) => map.id === selectedMap)?.imgSrc} // Pass the selected image URL as bg prop
            idFoFriend={idFoFriend}
          />
        ) : (
          <div className="flex text-sm sm:text-2xl md:text-3xl flex-col justify-center items-center gap-3">
            <h1 className=" font-bold text-center">
              Chose your game background
            </h1>
            <div className="flex gap-3 flex-wrap justify-center items-center">
              {maps.map((map) => (
                <div
                  key={map.id}
                  className={`flex max-w-[200px] flex-col items-center transition-all duration-300 rounded-lg  ${
                    selectedMap === map.id
                      ? "border blur-none border-blue-500"
                      : "blur-sm"
                  }`}
                  onClick={() => handleChange(map.id)}
                >
                  <img
                    src={map.imgSrc}
                    width={200}
                    height={132}
                    alt={map.id}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsStarted(true)}
              className="bg-blue-500 sm:text-xl text-black dark:text-white px-6 mt-2 py-2 rounded"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithFriend;
