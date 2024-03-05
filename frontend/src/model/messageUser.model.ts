interface messageUser {
    profile: string;
    username: string;
    message: string;
    date: string;
    status: string;
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