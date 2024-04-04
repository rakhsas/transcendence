interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    picture: string;
    email: string;
    coalition: string;
    coalitionPic: string;
    coalitionCover: string;
    coalitionColor: string;
    providerId: string;
    createdAt: string;
    isTwoFactorAuthenticationEnabled: boolean;
    updatedAt: string;
    provider: string;
    score: number;
}


export default User;
