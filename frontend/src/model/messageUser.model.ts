import User from "./user.model";

interface messageUser {
    // profile: string;
    // username: string;
    // message: string;
    // date: string;
    // status: string;
    recieverId: string;
    senderId: string;
    img: string;
    message: string;
    cid: number;
    date: string;
    id: number;
    audio: string;
    __reciever__: User;
    __owner__: User;
}

interface messageUser1 {
    to: string;
    from: string;
    message: string;
    image: string | null;
    audio: string | null;
    senderId: string;
    recieverId: string;
    recieverName: string;
    date: string;
}

export type { messageUser, messageUser1}