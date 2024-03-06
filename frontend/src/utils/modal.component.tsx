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
    <Modal dismissible show={status} onClose={onClose}>
      <Modal.Body className='bg-black'>
        <img src={picPath} alt="placeholder" />
      </Modal.Body>
    </Modal>
  );
};
export default ModalComponent;
