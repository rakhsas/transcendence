import Canvas from './Canvas/Canvas'

const Game = () => {
  return (
      <div className="flex m-auto  border-2 border-red-600 rounded-xl">
      <Canvas
        width="600"
        height="400"
      />
    </div>
  );
}

export default Game;
