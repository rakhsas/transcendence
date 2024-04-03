import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CanvasHeadToHead from "./headToHead/HeadToHead";
import img1 from "./images/table-tennis-ping-pong.jpg";

const HeadToHead = () => {
  const [selectedMap, setSelectedMap] = useState("map1"); // State to track the selected map
  const [isStarted, setIsStarted] = useState(false); // State to track if the game has started

  const handleChange = (event) => {
    setSelectedMap(event.target.value); // Update the selected map when a radio button is clicked
  };
  return (
    <div className="flex justify-center w-full h-full items-center" >
      <div className="flex justify-center w-[600px] h-[450px] border-2 border-red-600 rounded-xl">
        {isStarted ? (
          <CanvasHeadToHead width="600" height="400" />
        ) : (
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-2xl font-bold">Customize your game</h1>
            <div className="flex gap-3 flex-wrap justify-center items-center">
              <div className="flex flex-col items-center">
                <img src={img1} width={200} alt="map1" />
                <FormControlLabel
                  control={<Radio />}
                  value="map1"
                  checked={selectedMap === "map1"}
                  onChange={handleChange}
                  label={undefined}
                />
              </div>
              <div className="flex flex-col items-center">
                <img src="https://via.placeholder.com/150" alt="map2" />
                <FormControlLabel
                  control={<Radio />}
                  value="map2"
                  checked={selectedMap === "map2"}
                  onChange={handleChange}
                  label={undefined}
                />
              </div>
              <div className="flex flex-col items-center">
                <img src="https://via.placeholder.com/150" alt="map3" />
                <FormControlLabel
                  control={<Radio />}
                  value="map3"
                  checked={selectedMap === "map3"}
                  onChange={handleChange}
                  label={undefined}
                />
              </div>
            </div>
            <button
              onClick={() => setIsStarted(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadToHead;
