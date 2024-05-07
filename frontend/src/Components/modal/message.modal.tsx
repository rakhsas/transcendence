import { Button, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import { Socket } from "socket.io-client";
import { customTheme } from "../../utils/theme";

interface MessageProps {
    senderId: string;
    recieverId: string;
    isOpen: boolean;
    setNewMessageOpen: any;
    socketChat: any;
    recieverName: string;
}
const MessageModal: React.FC<MessageProps> = ({ senderId,recieverName, recieverId, isOpen, setNewMessageOpen, socketChat }) => {
    //console.log(socketChat)
    //console.log(recieverName)

    const [message, setMessage] = useState("");
    const sendMessage = () => {
        //console.log("message", message);
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
            <Modal.Header  theme={customTheme.modal?.header}> Send Message </Modal.Header>
            <Modal.Body className="overflow-hidden bg-neutral-100 dark:bg-main-dark-SPRUCE">
                <div className="flex flex-col p-4 items-center space-y-4">
                    <div className="input">
                        <TextInput  className="w-full" theme={customTheme.textInput} color="primary" placeholder="Type your message here" onChange={(e) => setMessage(e.target.value)} />
                    </div>
                    <Button color="success" onClick={() => sendMessage()}>
                        Send
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default MessageModal;