import {  Modal } from "flowbite-react";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
type ModalProps = {
    isOpen: boolean;
    channelData: any;
    setOpenModal?: any;
    userData: any;
  }
const ModalComponent: React.FC<ModalProps> = ({isOpen, channelData, setOpenModal, userData}) => {
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    const socketChat = userData[1];
    function onCloseModal() {
        setOpenModal(false);
    }
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    
    const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && e.currentTarget.value === '') {
            inputRefs[index - 1].current?.focus();
        } else if (e.key !== 'Backspace' && e.currentTarget.value !== '' && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };
    const joinChannel = () => {
        const otp = inputRefs.map(inputRef => inputRef.current?.value).join('');
        socketChat?.emit('acceptJoinChannel', {
            id: channelData.id,
            __owner__: userData[0].id,
            role: 'MEMBER',
            requestedUserId: userData[0].id,
            userName: userData[0].username,
            password: otp
        });
        setOpenModal(false);
    }
    useEffect(() => {
        const close = (e: any) => {
            if(e.keyCode === 27){
                setOpenModal(false)
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    },[])
    return (
        <Modal size="md" show={isOpen} onClose={onCloseModal} popup className="bg-black items-center">
            <Modal.Header className="overflow-hidden bg-neutral-100 dark:bg-main-dark-SPRUCE" />
            <Modal.Body className="overflow-hidden bg-neutral-100 dark:bg-main-dark-SPRUCE">
                <div className="relative flex min-h-fit flex-col justify-center overflow-hidden bg-gray-50 dark:bg-inherit py-12">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <div className="pic rounded-full">
                                <img className="w-24 h-24 rounded-full" src={baseAPIUrl + channelData.picture}/>
                            </div>
                            <div className="font-semibold text-3xl text-black dark:text-white">
                                <p>{channelData.name}</p>
                            </div>
                        </div>
                        <div>
                            {/* <form action="" method="post"> */}
                                <div className="flex flex-col space-y-16">
                                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs gap-1">
                                    {inputRefs.map((inputRef, index) => (
                                        <div className="w-16 h-16" key={index}>
                                        <input
                                            ref={inputRef}
                                            className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border-2 border-gray-200 focus:border-main-light-FERN text-lg bg-white dark:bg-zinc-900 focus:bg-gray-50 focus:ring-0 ring-main-light-FERN text-black dark:text-white"
                                            type="text"
                                            name={`otp-${index}`}
                                            maxLength={1}
                                            minLength={1}
                                            id={`otp-${index}`}
                                            onKeyUp={(e) => handleKeyUp(index, e)}
                                        />
                                        </div>
                                    ))}
                                    </div>
                                    <div className="flex flex-col space-y-2 px-4">
                                    <div onClick={joinChannel}>
                                        <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-main-light-FERN dark:bg-main-light-EGGSHELL border-none text-white text-sm shadow-sm">
                                        Verify Access
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalComponent;