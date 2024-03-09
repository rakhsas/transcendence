import Game from './Game';
import io, { Socket } from 'socket.io-client';
import { useRef, useEffect, useContext } from 'react';
import DataContext from '../../../services/data.context';

const url: string = 'wss://' + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend

const CanvasHeadToHead = (props: any) => {
  const ref = useRef(null)

  const userData = useContext(DataContext);
  useEffect(() => {
    if (!userData) return;
    const canvas = ref.current;
    if (!canvas)
      return;
    const socket: Socket = userData[2];
    // const socket: Socket = io(url, {
    //     path: "/sogame"
    //   });
    new Game(canvas, socket);

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('ready', socket.id)
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      socket.emit('stop')
      socket.disconnect();
    });

    return () => {
      socket.disconnect();
    };

  }, []);


  return (
    <canvas ref={ref} className='border-black border-2' {...props} />
  )
}

export default CanvasHeadToHead;
