import { Modal } from 'flowbite-react'
import { useState } from 'react';
interface ModalComponentProps {
  picPath: string;
  status: boolean;
  onClose: () => void;
}
const ModalComponent: React.FC<ModalComponentProps> = ({ picPath, status, onClose }) => {
  // const [openModal, setOpenModal] = useState(status);
  // setOpenModal(status);
  return (
    <Modal dismissible show={status} onClose={onClose} className='bg-zinc-950'>
      <Modal.Body className='bg-black'>
        <div className="flex justify-center items-center">
          <img src={picPath} alt="placeholder" />
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ModalComponent;
