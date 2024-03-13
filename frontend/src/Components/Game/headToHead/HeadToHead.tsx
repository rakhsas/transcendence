import Game from './Game';
import io, { Socket } from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';

const url: string = 'wss://' + import.meta.env.VITE_API_SOCKET_URL; // URL of your backend


const CanvasHeadToHead = (props: any) =>{
  const ref = useRef(null);
  const [roomId, setRoomId] = useState(null);

  const userData = useContext(DataContext);
  useEffect(() => {
    if (!userData) return;
    const canvas = ref.current;
    const socket: Socket = io(url, {
      path: "/sogame"
    });

    // Event listener for receiving roomJoined event
    socket.on('roomJoined', (roomId) => {
      console.log("Joinded room");
      if (!canvas || !socket || !roomId)
        return () => socket.close();
      new Game(canvas, socket, roomId);
      setRoomId(roomId);
    });

    socket.on('connect', () => console.log('Connected'));
    socket.on('disconnect', () => console.log('Disconnected'));

    return () => {
      socket.off('roomJoined');
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
      socket.close(); // Close the WebSocket connection when component unmounts
    };
  },[]);

  return (
    <div>
      {roomId ? (
        <div>
          <p>You are in room: {roomId}</p>
        </div>
      ) : (
        <>
            <p>Waiting for another player to join...</p>
        </>
      )}
          {/* Your game UI here */}
        <canvas ref={ref} className='border-black border-2' {...props} />
    </div>
  )
}

export default CanvasHeadToHead;
