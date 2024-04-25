import { Modal, FlowbiteModalHeaderTheme, FloatingLabel } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import Cookies from 'js-cookie';
interface InfoModalProps {
    userData: any,
    socketChat: Socket;
}
const header: FlowbiteModalHeaderTheme = {
    "base": "flex items-center rounded-t border-b p-5 dark:border-gray-600", // Modified
    "popup": "border-b-0 p-2",
    "title": "text-md font-medium text-gray-900 dark:text-white",
    "close": {
      "base": "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      "icon": "h-5 w-5"
    }
  };
  
// function InfoModal () {
    const InfoModal: React.FC<InfoModalProps> = ({userData, socketChat}) => {
    const [openModal, setOpenModal] = useState(true);
    const [userNameInput, setUsername] = useState<string>('');
    const [usernameExist, setUsernameExist] = useState(false);
    useEffect(() => {
        if (!userNameInput) return;
        setUsernameExist(false);
        socketChat?.emit('checkUsername', {username: userNameInput});
    }, [userNameInput]);
    socketChat?.on("usernameExist", (data: any) => {
        setUsernameExist(data);
    })
    const UpdateUserName = async () => {
        if (usernameExist) return;
        socketChat?.emit('updateUsername', {username: userNameInput, userId: userData[0].id});
    }
    socketChat?.on("usernameUpdated", async (data: any) => {
        setOpenModal(false);
        Cookies.set('firstLogin', 'false');
    })
    const closeModal = () => {
        Cookies.set('firstLogin', 'false');
        setOpenModal(false);

    }
    return (
        <>
            <Modal show={openModal} size="md" popup onClose={() => closeModal()} className="bg-zinc-900 text-center">
                <Modal.Header theme={header} >Edit Profile (OPTIONAL)</Modal.Header>
                <Modal.Body className="bg-zinc-900 p-4">
                    <div className="h-auto">
                        <FloatingLabel variant="outlined" onChange={(e) => setUsername(e.target.value)} label="username"/>
                        {usernameExist && <div className="text-red-500 text-sm mt-1"> Username already exist. </div>}
                        <div className="text-white bg-main-light-FERN hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={UpdateUserName}>
                            Green
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default InfoModal;