interface messageUser {
    profile: string;
    username: string;
    message: string;
    date: string;
    status: string;
}
interface messageUser1 {
    sender: number;
    profile: string;
    username: string;
    message: string;
    date: string;
    img: string;
    recieverId: number;
    recieverUserName: string;
}

export type { messageUser, messageUser1}