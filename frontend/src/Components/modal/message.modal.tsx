import { Button, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Socket } from "socket.io-client";

interface MessageProps {
    senderId: string;
    recieverId: string;
    isOpen: boolean;
    setNewMessageOpen: any;
    socketChat: any;
    recieverName: string;
}
const MessageModal: React.FC<MessageProps> = ({ senderId,recieverName, recieverId, isOpen, setNewMessageOpen, socketChat }) => {
    console.log(socketChat)
    console.log(recieverName)

    const [message, setMessage] = useState("");
    const sendMessage = () => {
        console.log("message", message);
        socketChat?.emit("message", {
            senderId,
            recieverId,
            message,
            to: recieverId,
            from: senderId,
            recieverName
        });
        setNewMessageOpen(false);
    }
    return (
        <>
        <Modal show={isOpen} size="md" onClose={() => setNewMessageOpen(false)} popup>
            <Modal.Header />
            <Modal.Body>
            <div className="w-full mt-4 h-32">
                <TextInput placeholder="Type your message here" onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex justify-center gap-4">
                <Button color="success" onClick={() => sendMessage()}>
                    {"Yes, I'm sure"}
                </Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default MessageModal;