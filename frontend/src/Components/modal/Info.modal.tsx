import { Button, Modal, Label, TextInput, Checkbox, FlowbiteModalHeaderTheme, FloatingLabel } from "flowbite-react";
import { useState, useRef } from "react";

interface InfoModalProps {
    userData: any
}
const header: FlowbiteModalHeaderTheme = {
    "base": "flex items-center justify-between rounded-t border-b p-5 dark:border-gray-600", // Modified
    "popup": "border-b-0 p-2",
    "title": "text-md font-medium text-gray-900 dark:text-white bg-red-500",
    "close": {
      "base": "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      "icon": "h-5 w-5"
    }
  };
  
// function InfoModal () {
    const InfoModal: React.FC<InfoModalProps> = ({userData}) => {
    const [openModal, setOpenModal] = useState(true);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    
    return (
        <>
        {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} className="bg-zinc-900 text-center">
                <Modal.Header theme={header} >Edit Profile (OPTIONAL)</Modal.Header>
                <Modal.Body className="bg-zinc-900 p-4">
                    <div className="h-auto">
                        {/* <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Your email" />
                            </div>
                            <TextInput id="email"  placeholder="name@company.com" required />
                        </div> */}
                        <FloatingLabel variant="outlined" ref={emailInputRef} label="Label" />
                        {/* <div className="w-auto">
                            <Button>Log in to your account</Button>
                        </div> */}
                        <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Green</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default InfoModal;