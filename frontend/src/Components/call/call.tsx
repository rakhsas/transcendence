import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("https://10.13.249.229",{
    path: '/chat',
});

function call() {
    let selectedUser: string;
    
    // const userTrackMap: { [userId: string]: MediaStreamTrack } = {};
    const userTrackMap = new Map<string, MediaStreamTrack>();
    const onUpdateUserList = ({ userIds }: any) => {
        // console.log(userIds)
        const usersList = document.getElementById("usersList");
        const usersToDisplay = userIds.filter(
            (userId: any) => userId !== socket.id
        );
        usersList!.innerHTML = "";

        usersToDisplay.forEach((user: string) => {
            const userItem = document.createElement("div");
            userItem.innerHTML = user;
            userItem.className = "user-item";

            userItem.addEventListener("click", () => {
                selectedUser = user;
            });
            usersList?.appendChild(userItem);
        });
    };
    socket.on("update-user-list", onUpdateUserList);
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
    const onSocketConnect = async () => {
        //   console.log(`My user id is: ${socket.id}`)
        let element = document.getElementById("userId");
        if (element) element.innerHTML = `My user id is: ${socket.id}`;
        const constraints = {
            audio: true,
            video: true,
        };
        console.log("Getting user media with constraints", constraints);    
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const localVideo = document.getElementById(
            "localVideo"
        ) as HTMLVideoElement;
        localVideo.srcObject = stream;
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    };
    const handleClick = useCallback(() => {
        call1();
      }, []);
    socket.on("connect", onSocketConnect);
    const call1 = async () => {
        const localOfferPeer = await peer.createOffer();
        await peer.setLocalDescription(new RTCSessionDescription(localOfferPeer));
        socket.emit("mediaOffer", {
            offer: localOfferPeer,
            from: socket.id,
            to: selectedUser,
        });
        console.log(`mediaOffer is emitted`);
    };
    const onMediaOffer = async (data: any) => {
        try {
            console.log("Received media offer:", data.offer);
            await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
            const peerAnswer = await peer.createAnswer();
            await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));

            socket.emit("mediaAnswer", {
                answer: peerAnswer,
                from: socket.id,
                to: data.from,
            });
        } catch (error) {
            console.error(error);
        }
    };
    socket.on("mediaOffer", onMediaOffer);
    const onMediaAnswer = async (data: any) => {
        try {
            console.log("Received media answer:", data.answer);
            await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    };
    const onIceCandidateEvent = (event: any) => {
        socket.emit("iceCandidate", {
            to: selectedUser,
            candidate: event.candidate,
        });
    };
    socket.on("mediaAnswer", onMediaAnswer);
    peer.onicecandidate = onIceCandidateEvent;
    const onRemotePeerIceCandidate = async (data: any) => {
        try {
            const candidate = new RTCIceCandidate(data.candidate);
            await peer.addIceCandidate(candidate);
        } catch (error) {
        }
    };
    socket.on("remotePeerIceCandidate", onRemotePeerIceCandidate);
    const gotRemoteStream = (event: any) => {
        console.log(event)
        const [stream] = event.streams;
        const remoteVideo =
            document.querySelector<HTMLVideoElement>("#remoteVideo");
        if (remoteVideo) {
            remoteVideo.srcObject = stream;
            stream.getTracks().forEach((track: MediaStreamTrack) => {
                // userTrackMap[track.label] = track;
                // userTrackMap.set()
            });
        }
    };
    peer.addEventListener("track", gotRemoteStream);
    socket.on('user-disconnected', (data: any) => {
        // console.log('User disconnected:', data.userId)
        const disconnectedUserId = data.userId;
    
        // const disconnectTrack = userTrackMap[disconnectedUserId];
        // for (let [key, value] of Object.entries(userTrackMap)) {
        //     console.log(key, value);
        // }
        // console.log(disconnectTrack);
        // if (disconnectTrack)
        // {
        //     disconnectTrack.stop();
        //     delete userTrackMap[disconnectedUserId];
        // }
    });

    return (
        <div className="w-screen flex flex-col items-center ">
            <div className=" bg-gray-600 p-4">
                My user id: <div id="userId"></div>
                Remote camera: <video id="remoteVideo" playsInline autoPlay></video>
                My camera: <video id="localVideo" playsInline autoPlay muted></video>
                <div id="usersList" className="bg-slate-400">
                    No users connected
                </div>
                <button id="call" className="cursor-pointer" onClick={handleClick}>
                    Call
                </button>
            </div>
        </div>
    );
}

export default call;
