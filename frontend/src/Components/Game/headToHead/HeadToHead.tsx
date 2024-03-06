import Game from './Game';
import io, { Socket } from 'socket.io-client';
import { useRef, useEffect } from 'react';

const url: string = 'wss://10.14.51.220'; // URL of your backend

const CanvasHeadToHead = (props: any) =>{
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current;
    if(!canvas)
      return;

    
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 	  try {
	// 		const authService = new AuthService();
	// 		const fetchedPayloadData = await authService.getPayload();
	// 		const userService = new UserService();
	// 		const fetchedUserData = await userService.getUser(fetchedPayloadData.id);
	// 		setUserData(fetchedUserData);
	// 	} catch (error) {
	// 		console.error('Error fetching user ', error);
	// 	  }
	// 	};
	// 	fetchData();
	// }, []);const socket: Socket = io(url, {
      path: "/sogame"
    });
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

  },[]);


  return (
    <canvas ref={ref} className='border-black border-2' {...props} />
  )
} 

export default CanvasHeadToHead;
