import Game from './Game';
import io, { Socket } from 'socket.io-client';
import { useRef, useEffect } from 'react';

const socket: Socket = io('http://localhost:3002'); // URL of your backend

const CanvasHeadToHead = (props: any) =>{
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current;
    if(!canvas)
      return;

   new Game(canvas, socket);

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('ready', socket.id)
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      socket.emit('stop')
    });

    return () => {
      socket.disconnect();
    };

  },[]);


  return (
    <canvas ref={ref} className='border-black border-2' {...props} />
  )
} 

export default CanvasHeadToHead;
