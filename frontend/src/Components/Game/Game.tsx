import Canvas from './Canvas/Canvas'

const Game = () => {
  return (
      <div className="flex m-auto  border-4  border-main-light-FERN dark:border-main-light-EGGSHELL rounded-xl">
      <Canvas
        width="600"
        height="400"
      />
    </div>
  );
}

export default Game;
