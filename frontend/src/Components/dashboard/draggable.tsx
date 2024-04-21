import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import User from "../../model/user.model";
import DataContext from "../../services/data.context";
import { CoPresentSharp } from "@mui/icons-material";

interface props {
    socketCHAT: Socket;
    user: User;
    setUserCallingWith: any;
    setCallPermission: any;
    selectedUserSocketId: string;
    caller: User;
}
const DraggableDiv = ({ socketCHAT, user, setCallPermission, setUserCallingWith, selectedUserSocketId, caller}: props) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const userData = useContext(DataContext);
	const [userList, setUserList] = useState<any[]>([]);
    const [stream, setStream] = useState<MediaStream>();
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
    useEffect(() => {
        if (!userData) return;
        setStream(userData[9]);
        setUserList(userData[10]);
    }, [userData]);
    useEffect(() => {
    }, [userList])
    useEffect(() => {
        if (!stream || userList.length < 0) return;
        const getVideo = async () => {
            console.log('getVideo')
            try {
                stream.getTracks().forEach((track: MediaStreamTrack) => track.enabled = true);
                const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
                localVideo.srcObject = stream;
                stream.getTracks().forEach((track: any) => peer.addTrack(track, stream));
            } catch (error) {
                console.error("Error getting video stream:", error);
            }
        };
        getVideo();
        handleClick();
    }, [stream]);
    const handleClick = useCallback(() => {
        call1();
    }, [userList]);
    const call1 = async () => {
        if (userList.length < 2) return;
        const state = peer.connectionState;
        if (state.toString() != "have-remote-offer") {
            if (caller.username === userData[0].username) {
                const localOfferPeer = await peer.createOffer();
                await peer.setLocalDescription(new RTCSessionDescription(localOfferPeer));
                console.log("localOffer")
                socketCHAT?.emit("mediaOffer", {
                    offer: localOfferPeer,
                    from: socketCHAT?.id,
                    to: userList.find((one) => one.name === user.username).id,
                    fromUsername: userData[0].username,
                    toUsername: user.username
                });
            }
        } else {
            console.log("Peer connection already has a remote offer. Creating answer...");
        }
    };
    const onMediaOffer = async (data: any) => {
        try {
            if (userList.length < 2) return;
            console.log("mediaOffer")
            await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
            const peerAnswer = await peer.createAnswer();
            await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));
            socketCHAT?.emit("mediaAnswer", {
                answer: peerAnswer,
                from: socketCHAT?.id,
                to: userList.find((one) => one.name === caller.username).id,
            });
        } catch (error) {
            console.error(error);
        }
    };
    socketCHAT?.on("mediaOffer", onMediaOffer);
    const onMediaAnswer = async (data: any) => {
        try {
            console.log("mediaAnswer")
            const state = peer.connectionState;
            console.log("data.answer", data.answer);
            if (caller.username === userData[0].username || state.toString() == "have-remote-offer")
                await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    };
    socketCHAT?.on("mediaAnswer", onMediaAnswer);
    const onIceCandidateEvent = (event: any) => {
        socketCHAT?.emit("iceCandidate", {
            to: selectedUserSocketId,
            candidate: event.candidate,
        });
    };
    peer.onicecandidate = onIceCandidateEvent;
    const onRemotePeerIceCandidate = async (data: any) => {
        try {
            const candidate = new RTCIceCandidate(data.candidate);
            await peer.addIceCandidate(candidate);
        } catch (error) {
        }
    };
    socketCHAT?.on("remotePeerIceCandidate", onRemotePeerIceCandidate);
    const gotRemoteStream = (event: any) => {
        const [stream] = event.streams;
        const remoteVideo =
            document.querySelector<HTMLVideoElement>("#remoteVideo");
        if (remoteVideo) {
            remoteVideo.srcObject = stream;
        }
    };
    peer.addEventListener("track", gotRemoteStream);
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
                // offsetX = 0;
                // offsetY = 0;
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    socketCHAT?.on("callVideoEnded", (data: any) => {
        setCallPermission(false);
        setUserCallingWith();
        if (stream)
            stream.getTracks().forEach((track: any) =>  track.stop());
        const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
        localVideo.srcObject = null;
    });
    return (
        <div
            className={`draggable justify-between flex-col z-50 flex select-none rounded-3xl absolute bg-zinc-700 cursor-grab active:cursor-grabbing ${fullscreen ? "w-[80%] h-[80%]" : "w-72 h-[450px]"
                }`}
            draggable
            style={{ left: position.x, top: position.y }}
            onDragCapture={handleMouseDown}
        >
            <div className={`peer-video h-full w-full bg-zinc-900`}>
                <video
                    id="remoteVideo"
                    playsInline
                    className="w-full h-full rounded-3xl  object-cover"
                    autoPlay
                />
            </div>
            <div className="absolute top-2 right-4 cursor-pointer rounded-2xl rotate-90 bg-red-600">
                <div className="svg flex justify-center items-center w-6 h-10 overflow-hidden">
                    <svg
                        onClick={() => {
                            setCallPermission(false);
                            setUserCallingWith();
                            socketCHAT?.emit("callVideoEnded", {
                                opponnet: user.username,
                                permission: true,
                            });
                            stream?.getTracks().forEach((track: any) => track.stop());
                            const localVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
                            localVideo.srcObject = null;
                        }}
                        className="w-full h-full rotate-45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.67962 3.32038L7.29289 2.70711C7.68342 2.31658 8.31658 2.31658 8.70711 2.70711L11.2929 5.29289C11.6834 5.68342 11.6834 6.31658 11.2929 6.70711L9.50048 8.49952C9.2016 8.7984 9.1275 9.255 9.31653 9.63307C10.4093 11.8186 12.1814 13.5907 14.3669 14.6835C14.745 14.8725 15.2016 14.7984 15.5005 14.4995L17.2929 12.7071C17.6834 12.3166 18.3166 12.3166 18.7071 12.7071L21.2929 15.2929C21.6834 15.6834 21.6834 16.3166 21.2929 16.7071L20.6796 17.3204C18.5683 19.4317 15.2257 19.6693 12.837 17.8777L11.6286 16.9714C9.88504 15.6638 8.33622 14.115 7.02857 12.3714L6.12226 11.163C4.33072 8.7743 4.56827 5.43173 6.67962 3.32038Z" fill="white"/>
                    </svg>
                </div>
            </div>
            <div className="absolute bottom-2 w-full px-2">
                <div className="row flex flex-row justify-between">
                    <svg
                        onClick={() => setFullscreen(!fullscreen)}
                        className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer self-end"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"
                        />
                    </svg>
                    <div className={`local-video bg-green-500 rounded-3xl ${fullscreen ? "w-64 h-64" : "h-32 w-32"}`}>
                        <video
                            id="localVideo"
                            // ref={localStream}
                            className="w-full h-auto"
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraggableDiv;
