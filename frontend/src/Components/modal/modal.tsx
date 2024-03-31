import {  Modal, Toast } from "flowbite-react";
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
    const socketChat: Socket = userData[1];
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    function onCloseModal() {
        setOpenModal(false);
    }
    
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
        socketChat?.on("channelPasswordInvalid", (data: any) => {
            console.log('channelPasswordInvalid: ', data)
            setIncorrectPassword(true);
        });
        socketChat?.on("channelJoined", (data: any) => {
            console.log('channelJoined: ', data)
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setOpenModal(false);
            }, 2000);
        });
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
    useEffect(() => {}, [incorrectPassword])
    return (
        <Modal size="md" show={isOpen} onClose={onCloseModal} popup className="bg-black items-center">
            <Modal.Header className="overflow-hidden bg-neutral-100 dark:bg-main-dark-SPRUCE" />
            <Modal.Body className="overflow-hidden bg-neutral-100 dark:bg-main-dark-SPRUCE">
                <div className="relative flex min-h-fit flex-col justify-center overflow-hidden bg-gray-50 dark:bg-inherit py-12">
                    <div className={`toast my-4 px-6 `}>
                        <Toast className={`w-full max-w-full dark:bg-zinc-900 justify-between ${incorrectPassword? 'block' : 'hidden'}`}>
                            <div className="errorRowHolder flex items-center justify-between">
                                <div className="holder flex items-center">
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Incorrect Password.</div>
                                </div>
                                <div className="close cursor-pointer" onClick={() => {
                                        setIncorrectPassword(false)
                                    }}>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" ></path>
                                    </svg>
                                </div>
                            </div>
                        </Toast>
                        <Toast className={`w-full max-w-full dark:bg-zinc-900 justify-between ${success ? 'block': 'hidden'}`}>
                            <div className="successRowHolder  flex items-center justify-between">
                                <div className="holder flex items-center">
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Successfully Joined the Room.</div>
                                </div>
                                <div className="close cursor-pointer" onClick={() => {
                                        setSuccess(false)
                                        setOpenModal(false)
                                    }}>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" ></path>
                                    </svg>
                                </div>
                            </div>
                        </Toast>
                    </div>
                    <div className="mx-auto flex w-full max-w-md flex-col gap-12">
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