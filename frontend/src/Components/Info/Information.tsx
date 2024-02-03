
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import './Information.css';


function ValidInformation(): JSX .Element{
     const [openModal, setOpenModal] = useState(false);
    return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Information </Modal.Header>
        <Modal.Body>
        <div className="p-4 md:p-5 space-y-4 Sp2">
              <form action="list1">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div className="user-img">
                    <img src="./client/src/42.jpeg" id="photo" alt="list"/>
                    <input type="file" id="file" />
                    <label htmlFor="file" id="uploadbtn">
                      <i className="fas fa-camera"></i>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email1" value="Your email" />
                  </div>
                  <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                </div>

                {/* <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mohamed Darify"
                    required
                  />
                </div> */}
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nick Name
                  </label>
                  <input
                    type="text"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="mdarify"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Gender
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="fruitSelect"
                      name="fruits"
                    >
                      <option value="apple">Male</option>
                      <option value="banana">Female</option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </form>
            </div>
        </Modal.Body>
      </Modal>

    </>
  );
}

export default ValidInformation;
