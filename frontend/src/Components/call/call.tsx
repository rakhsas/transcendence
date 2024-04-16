
import { useState, useContext } from "react";
import DataContext from "../../services/data.context";
import LoadingComponent from "../shared/loading/loading";

const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL;
function CallComponent() {
    const [selectedUser, setSelectedUser] = useState<string | null>('')
    const userData = useContext(DataContext);
    if (!userData)
        return <LoadingComponent />;
    const socket = userData[1];
    // var selectedUser: string;
    const onUpdateUserList = ({ userIds }: any) => {
        // //console.log(userIds);
        const usersList = document.getElementById("usersList");
        const usersToDisplay = userIds.filter(
            (userId: any) => userId !== socket?.id
        );
        usersList!.innerHTML = "";

        usersToDisplay.forEach((user: string) => {
            const userItem = document.createElement("button", { is: "user-button" });
            userItem.textContent = user;
            // //console.log(user)
            userItem.className = "user-button mb-1 bg-red-900";
            userItem.addEventListener("click", () => {
                setSelectedUser(user);
                // //console.log("selectedUser: ", selectedUser)
            });
            usersList?.appendChild(userItem);
        });
    };
    socket?.on("update-user-list", onUpdateUserList);
    const onUserCall = (data: any) => {
        console.log("data.from", data.from);
        console.log("data.to", data.to);
    }
    socket?.on("RequestCall", onUserCall)
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
        let element = document.getElementById("userId");
        if (element) element.innerHTML = `My user id is: ${socket?.id}`;
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
    };
    const EndCall = () => {
        const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
        const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
        peer.close();
        socket?.disconnect();
    };
    socket?.on("connect", onSocketConnect);
    const call = async () => {
        //console.log("selectedUser: 1111", selectedUser)
        // console.log('from: ', socket?.id);
        // console.log('to: ', selectedUser);
        // console.log('senderId: ', userData[0].id);
        socket?.emit("callUser", {
            from: socket?.id,
            to: selectedUser,
            senderId: userData[0].id,
            target: 'df52828c-75fa-475c-a454-971cc757f472'
        });
    };
    // const localOfferPeer = await peer.createOffer();
    // await peer.setLocalDescription(new RTCSessionDescription(localOfferPeer));
    // socket?.emit("mediaOffer", {
    //     offer: localOfferPeer,
    //     from: socket?.id,
    //     to: selectedUser,
    // });
    // //console.log(`mediaOffer is emitted`);
    // const onMediaOffer = async (data: any) => {
    //     try {
    //         //console.log("Received media offer:", data.offer);
    //         await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
    //         const peerAnswer = await peer.createAnswer();
    //         await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));

    //         socket?.emit("mediaAnswer", {
    //             answer: peerAnswer,
    //             from: socket?.id,
    //             to: data.from,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    // socket?.on("mediaOffer", onMediaOffer);
    // const onMediaAnswer = async (data: any) => {
    //     try {
    //         //console.log("Received media answer:", data.answer);
    //         await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
    //     } catch (error) {
    //         console.error("Error setting remote description:", error);
    //     }
    // };
    // const onIceCandidateEvent = (event: any) => {
    //     socket?.emit("iceCandidate", {
    //         to: selectedUser,
    //         candidate: event.candidate,
    //     });
    // };
    // socket?.on("mediaAnswer", onMediaAnswer);
    // peer.onicecandidate = onIceCandidateEvent;
    // const onRemotePeerIceCandidate = async (data: any) => {
    //     try {
    //         const candidate = new RTCIceCandidate(data.candidate);
    //         await peer.addIceCandidate(candidate);
    //     } catch (error) {
    //     }
    // };
    // socket?.on("remotePeerIceCandidate", onRemotePeerIceCandidate);
    // const gotRemoteStream = (event: any) => {
    //     const [stream] = event.streams;
    //     //console.log("Got remote stream:", stream);
    //     const remoteVideo =
    //         document.querySelector<HTMLVideoElement>("#remoteVideo");
    //     if (remoteVideo) {
    //         remoteVideo.srcObject = stream;
    //     }
    // };
    // peer.addEventListener("track", gotRemoteStream);
    // socket?.on('user-disconnected', (data: any) => {
    //     const disconnectedUserId = data.userId;
    // });


    return (
        <div className="w-full h-[90vh] m-4">
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="max-w-3xl w-full p-8 bg-gray-800 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Video Call</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <video id="remoteVideo" className="w-full h-auto" playsInline autoPlay></video>
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity opacity-100">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Enlarge</button>
                            </div>
                            {/* <div id="userId" className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white font-semibold rounded-lg">User ID</div> */}
                        </div>
                        <div className="relative overflow-hidden rounded-lg">
                            <video id="localVideo" className="w-full h-auto" playsInline autoPlay muted></video>
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity opacity-100">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Enlarge</button>
                            </div>
                            <div id="userId" className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white font-semibold rounded-lg">User ID</div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Connected Users</h2>
                        <ul id="usersList">
                            {/* <!-- Add more users dynamically --> */}
                        </ul>
                    </div>
                    <div id="IncomingCall" className="mt-4 p-4 bg-red-500 text-white font-semibold rounded-lg text-center">
                        Incoming Call...
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button id="call" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg" onClick={call}>
                            Call
                        </button>
                        <button id="end" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg" onClick={EndCall}>
                            End Call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CallComponent;
// export default React.memo(CallComponent);


