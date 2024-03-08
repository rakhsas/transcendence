import User from "./user.model";

interface messageUser {
    profile: string;
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
    __reciever__: User;
    __owner__: User;
}

interface messageUser1 {
    sender: string;
    message: string;
    date: string;
    recieverId: number;
    img: string;
    profile: string;
    username: string;
    recieverUserName: string;
}

export type { messageUser, messageUser1}