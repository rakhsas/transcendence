import React, { useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import User from '../../model/user.model';
import DataContext from '../../services/data.context';

interface props {
	socketCHAT: Socket;
	user: User;
	setUserCallingWith: any;
	setCallPermission: any;
}
const DraggableDiv = ({ socketCHAT, user, setCallPermission, setUserCallingWith }: props) => {
	const userData = useContext(DataContext);
	const [stream, setStream] = useState<any>();

	useEffect(() => {
		if (!userData) return;
		setStream(userData[9]);
		console.log(userData[9]);
	}, [userData]);
	const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	const localStream = useRef(null);
	const createPeerConnection = () => {
		return new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.stunprotocol.org",
				}
			],
		});
	};
	const peer = createPeerConnection();
	useEffect(() => {
		const getVideo = async () => {
			try {
				const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
				localVideo.srcObject = stream;
				stream.getTracks().forEach((track) => peer.addTrack(track, stream));
			} catch (error) {
				console.error('Error getting video stream:', error);
			}
		};
	
		getVideo();
	}, [peer]);
	
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const handleMouseDown = (event: any) => {
		event.preventDefault();
		setIsDragging(true);
		let offsetX = event.clientX - position.x;
		let offsetY = event.clientY - position.y;

		const handleMouseMove = (event: any) => {
			if (isDragging) {
				setPosition({
					x: event.clientX - offsetX,
					y: event.clientY - offsetY,
				});
				offsetX = 0;
				offsetY = 0;
			}
		};
		const handleMouseUp = () => {
			setIsDragging(false);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};
	
	socketCHAT?.on("callVideoEnded", (data: any) => {
		setCallPermission(false);
		setUserCallingWith()
	})
	return (
		<div className={`draggable justify-between flex-col z-50 flex select-none rounded-2xl absolute bg-zinc-800 cursor-grab active:cursor-grabbing ${fullscreen ? 'w-[80%] h-[80%]' : 'w-72 h-[450px]'}`} draggable style={{ left: position.x, top: position.y }} onDrag={handleMouseDown}>
			<div className="absolute top-2 right-2 cursor-pointer">
				<svg onClick={() => {
					setCallPermission(false);
					setUserCallingWith();
					socketCHAT?.emit('callVideoEnded', {
						opponnet: user.username,
						permission: true,
					});
				}}
					className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
				</svg>
			</div>
			<div className="absolute bottom-2 w-full px-2">
				<div className="row flex flex-row justify-between">
					<svg onClick={() => setFullscreen(!fullscreen)} className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer self-end" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5" />
					</svg>
					<div className={`peer-video bg-green-500 rounded-3xl ${fullscreen ? 'w-64 h-64' : 'h-32 w-32'}`} >
						<video id="localVideo" ref={localStream} className="w-full h-auto" autoPlay />
					</div>
				</div>
			</div>
		</div>


	);
};

export default DraggableDiv;
