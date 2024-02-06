import Game from './Game.ts'
import { useRef, useEffect } from 'react';

const Canvas = (props: any) =>{
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current;
    if(!canvas)
      return;

    const game = new Game(canvas);
    game.render();

  },[]);


  return (
    <canvas ref={ref} className='border-black border-2' {...props} />
  )
} 

export default Canvas;
