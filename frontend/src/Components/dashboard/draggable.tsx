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
    const [isMute, setIsMute] = useState(false);
    const [isCamOpen, setIsCamOpen] = useState(true);
    const [peer, setPeer] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        console.log("peer connection created")
        const createPeerConnection = () => {
            return new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.stunprotocol.org",
                    },
                ],
            });
        };

        setPeer(createPeerConnection());

    }, []);
    useEffect(() => {
        if (!peer) return;
        peer.onconnectionstatechange = () => {
            const state = peer.connectionState;
            if (["disconnected", "failed", "closed"].includes(state)) {
                console.log("Peer connection closed");
                setCallPermission(false);
                setUserCallingWith();
                stream?.getTracks().forEach((track: any) => track.stop());
                const localVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
                localVideo.srcObject = null;
                peer?.close();
            }
        };
    }, [peer]);
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
            try {
                stream.getTracks().forEach((track: MediaStreamTrack) => track.enabled = true);
                const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
                localVideo.srcObject = stream;
                stream.getTracks().forEach((track: any) => peer!.addTrack(track, stream));
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
        const state = peer!.connectionState;
        if (state?.toString() != "have-remote-offer") {
            if (caller.username === userData[0].username) {
                const localOfferPeer = await peer!.createOffer();
                await peer!.setLocalDescription(new RTCSessionDescription(localOfferPeer));
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
            console.log("mediaOffer");
            if (peer!.connectionState === "new" || peer!.connectionState === "connecting")
            {
                await peer!.setRemoteDescription(new RTCSessionDescription(data.offer));
                const peerAnswer = await peer!.createAnswer();
                await peer!.setLocalDescription(new RTCSessionDescription(peerAnswer));
                socketCHAT?.emit("mediaAnswer", {
                    answer: peerAnswer,
                    from: socketCHAT?.id,
                    to: userList.find((one) => one.name === caller.username).id,
                });
            }
        } catch (error) {
            //console.log("Media Offer", error);
        }
    };
    socketCHAT?.on("mediaOffer", onMediaOffer);
        const state = peer ? peer.connectionState : '';
        const onMediaAnswer = async (data: any) => {
            try {
                if (["new", "connecting"].includes(state))
                {
                    await peer!.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            } catch (error) {
                //console.log("Error setting remote description:", error);
            }
        };
        socketCHAT?.on("mediaAnswer", onMediaAnswer);
    const onIceCandidateEvent = (event: any) => {
        socketCHAT?.emit("iceCandidate", {
            to: selectedUserSocketId,
            candidate: event.candidate,
        });
    };
    peer && (peer.onicecandidate = onIceCandidateEvent);
    const onRemotePeerIceCandidate = async (data: any) => {
        try {
            const candidate = new RTCIceCandidate(data.candidate);
            await peer!.addIceCandidate(candidate);
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
    peer && (peer.addEventListener("track", gotRemoteStream));
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
                offsetX = 10;
                offsetY = 10;
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
        peer?.close();
        setPeer(null);
    });
    const mute = () => {
        if (!stream) return;
    
        stream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMute(prev => !prev);
    
    };
    const Camera = () => {
        if (!stream) return;
    
        stream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsCamOpen(prev => !prev);
    
    };
    

    // useEffect(() => {
    //     // stream?.getAudioTracks()[0].enabled = isMute;
    // }, [isMute]);
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
                    className="w-full h-full rounded-3xl"
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
                            peer?.close();
                            setPeer(null);
                        }}
                        className="w-full h-full rotate-45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.67962 3.32038L7.29289 2.70711C7.68342 2.31658 8.31658 2.31658 8.70711 2.70711L11.2929 5.29289C11.6834 5.68342 11.6834 6.31658 11.2929 6.70711L9.50048 8.49952C9.2016 8.7984 9.1275 9.255 9.31653 9.63307C10.4093 11.8186 12.1814 13.5907 14.3669 14.6835C14.745 14.8725 15.2016 14.7984 15.5005 14.4995L17.2929 12.7071C17.6834 12.3166 18.3166 12.3166 18.7071 12.7071L21.2929 15.2929C21.6834 15.6834 21.6834 16.3166 21.2929 16.7071L20.6796 17.3204C18.5683 19.4317 15.2257 19.6693 12.837 17.8777L11.6286 16.9714C9.88504 15.6638 8.33622 14.115 7.02857 12.3714L6.12226 11.163C4.33072 8.7743 4.56827 5.43173 6.67962 3.32038Z" fill="white"/>
                    </svg>
                </div>
            </div>
            <div className="absolute bottom-16 w-full px-2">
                <div className="row flex flex-row justify-end">
                    <div className={`local-video bg-green-500 rounded-3xl ${fullscreen ? "w-64 h-64" : "h-32 w-32"}`}>
                        <video
                            id="localVideo"
                            className="w-full h-auto"
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            </div>
                <div className="absolute flex w-full h-10 leading-10 bottom-0">
                    <div className="flex bg-zinc-900 h-full w-full justify-between p-2">
                        <svg onClick={() => setFullscreen(!fullscreen)} className="w-6 h-6 text-white cursor-pointer self-end" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"
                                />
                        </svg>
                        <svg className={`w-6 h-6 fill-white ${isCamOpen ? 'block': 'hidden'}`} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"  onClick={() => { Camera()}}><path d="M22.903,6.538c-.676-.338-1.473-.267-2.077,.188-.039,.029-.076,.062-.11,.096l-1.757,1.773c-.211-2.565-2.341-4.594-4.959-4.594H5C2.243,4,0,6.243,0,9v6c0,2.757,2.243,5,5,5H14c2.629,0,4.768-2.047,4.962-4.627l1.756,1.754c.034,.033,.069,.063,.107,.092,.352,.264,.768,.398,1.188,.398,.303,0,.606-.069,.89-.211,.677-.338,1.097-1.019,1.097-1.774v-7.318c0-.757-.42-1.437-1.097-1.775Zm-8.903,11.462H5c-1.654,0-3-1.346-3-3v-6c0-1.654,1.346-3,3-3H14c1.654,0,3,1.346,3,3v6c0,1.654-1.346,3-3,3Zm5-5.417v-1.189l3-3.028,.025,7.238-3.025-3.022Z"/></svg>
                        <svg className={`w-6 h-6 fill-white ${!isCamOpen ? 'block': 'hidden'}`}  onClick={() => { Camera()}} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M15,19c0,.552-.447,1-1,1H5C2.244,20,0,17.757,0,15v-6C0,8.152,.217,7.314,.625,6.577c.269-.482,.877-.655,1.36-.389,.483,.268,.657,.877,.389,1.36-.245,.441-.374,.943-.374,1.452v6c0,1.654,1.346,3,3,3H14c.553,0,1,.448,1,1Zm3.637-2.125c-.033,.081-.08,.151-.129,.218l5.2,5.2c.391,.391,.391,1.023,0,1.414-.195,.195-.451,.293-.707,.293s-.512-.098-.707-.293L4.294,5.707h0L.293,1.707C-.097,1.316-.097,.684,.293,.293S1.317-.098,1.708,.293l3.707,3.707H14c2.618,0,4.748,2.03,4.959,4.594l1.757-1.772c.034-.034,.07-.066,.109-.096,.604-.454,1.399-.526,2.078-.188,.677,.338,1.097,1.018,1.097,1.775v7.319c0,.757-.42,1.437-1.097,1.775-.283,.141-.587,.211-.889,.211-.421,0-.837-.135-1.189-.399-.037-.028-.073-.059-.106-.092l-1.754-1.752c-.038,.516-.134,1.022-.328,1.501Zm.363-4.292l3.026,3.022-.026-7.238-3,3.027v1.189Zm-2-3.583c0-1.654-1.346-3-3-3H7.414l9.535,9.535c.031-.175,.051-.353,.051-.535v-6Z"/></svg>
                        <svg className={`w-4 h-4 fill-white ${!isMute ? 'block': 'hidden'}`} onClick={() => mute()} xmlns="http://www.w3.org/2000/svg" strokeWidth={2} viewBox="0 0 24 24" width="400" height="400"><g id="_01_align_center" data-name="01 align center"><path d="M12,20a8.009,8.009,0,0,0,8-8V8A8,8,0,0,0,4,8v4A8.009,8.009,0,0,0,12,20ZM6,9h4V7H6.09A5.993,5.993,0,0,1,17.91,7H14V9h4v2H14v2h3.91A5.993,5.993,0,0,1,6.09,13H10V11H6Z"/><path d="M22,13a9.01,9.01,0,0,1-9,9H11a9.011,9.011,0,0,1-9-9H0A11.013,11.013,0,0,0,11,24h2A11.013,11.013,0,0,0,24,13Z"/></g></svg>
                        <svg className={`w-4 h-4 fill-white ${isMute ? 'block': 'hidden'}`} onClick={() => mute()} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m6,11v1c0,3.309,2.691,6,6,6,.286,0,.575-.021.859-.061.551-.079,1.053.303,1.131.85.078.547-.303,1.053-.85,1.131-.377.053-.761.081-1.141.081-4.411,0-8-3.589-8-8v-1c0-.552.448-1,1-1s1,.448,1,1Zm17.707,11.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293L.293,1.707C-.098,1.316-.098.684.293.293S1.316-.098,1.707.293l3.49,3.49c1.44-2.335,3.984-3.783,6.803-3.783,4.411,0,8,3.589,8,8v4c0,1.797-.591,3.508-1.68,4.906l1.423,1.423c1.46-1.783,2.257-4.004,2.257-6.329,0-.552.448-1,1-1s1,.448,1,1c0,2.857-1.003,5.583-2.837,7.748l2.544,2.544ZM6.665,5.25l10.226,10.226c.527-.739.877-1.583,1.026-2.477h-2.917c-.552,0-1-.448-1-1s.448-1,1-1h3v-2h-3c-.552,0-1-.448-1-1s.448-1,1-1h2.916c-.477-2.834-2.948-5-5.916-5-2.275,0-4.313,1.259-5.335,3.25Zm9.507,15.841c-1.312.603-2.715.909-4.171.909-5.514,0-10-4.486-10-10,0-.552-.448-1-1-1s-1,.448-1,1c0,6.617,5.383,12,12,12,1.747,0,3.431-.367,5.006-1.091.502-.231.722-.825.491-1.326-.23-.502-.825-.723-1.326-.491Z"/></svg>

                    </div>
                </div>
        </div>
    );
};

export default DraggableDiv;
