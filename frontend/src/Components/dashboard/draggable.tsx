import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import User from '../../model/user.model';

interface props {
    socketCHAT: Socket;
    user: User;
    setUserCallingWith: any;
    setCallPermission: any;
}
const DraggableDiv = ({socketCHAT, user, setCallPermission, setUserCallingWith}: props) => {
  const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    useEffect(() => {
      getVideo();
    }, [socketCHAT]);
    const createPeerConnection = () => {
      return new RTCPeerConnection({
          iceServers: [
              {
                  urls: "stun:stun.stunprotocol.org",
              },
          ],
      });
  };
  const peer = createPeerConnection();
  const getVideo = async () => {
      const constraints = {
        audio: true,
        video: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const localVideo = document.getElementById(
        "localVideo"
    ) as HTMLVideoElement;
    localVideo.srcObject = stream;
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
  }
  // Initial position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // State to track if dragging is in progress
  const [isDragging, setIsDragging] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
  // Event handlers for mouse down, move, and up
  const handleMouseDown = (event: any) => {
    event.preventDefault(); // Prevent default text selection behavior
    setIsDragging(true);
    // Calculate the initial offset of the mouse pointer relative to the div's position
    let offsetX = event.clientX - position.x;
    let offsetY = event.clientY - position.y;
  
    const handleMouseMove = (event: any) => {
      if (isDragging) {
        // Update the position based on mouse movement
        setPosition({
          x: event.clientX - offsetX,
          y: event.clientY - offsetY,
        });
        offsetX =  0;
        offsetY = 0;
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      // Remove event listeners when dragging ends
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    // Add event listeners for mouse move and up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  socketCHAT?.on("callVideoEnded", (data: any) => {
    setCallPermission(false);
    setUserCallingWith()
  })
  return (
    <div
      className={`draggable justify-between flex-col z-50 flex select-none rounded-2xl absolute bg-zinc-800 cursor-grab active:cursor-grabbing m-2 p-2 ${fullscreen ? 'w-[80%] h-[80%]' : 'w-72 h-[450px]'}`}
      draggable
      style={{ left: position.x, top: position.y }}
      onDrag={handleMouseDown}
    >
        <video id="localVideo" className="w-full h-auto" playsInline autoPlay muted></video>
        <div className="first flex flex-row justify-end cursor-pointer absolute">
            <svg onClick={() => {
              setCallPermission(false);
              setUserCallingWith()
              socketCHAT?.emit("callVideoEnded", {
                opponnet: user.username,
                permission: true
              })
            }} className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </div>
        <div className="second flex flex-row justify-between w-full absolute bottom-2">
            <svg onClick={() => setFullscreen(!fullscreen)} className="w-6 h-6 text-gray-800 dark:text-white self-end cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"/>
            </svg>
            <div className={`mine flex bg-green-500 mr-2 rounded-3xl ${fullscreen ? 'w-64 h-64' : 'h-32 w-32'}`}>
            </div>
        </div>
    </div>
  );
};

export default DraggableDiv;
