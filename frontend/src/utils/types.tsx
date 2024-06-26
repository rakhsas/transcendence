import User from "../model/user.model";

export type PathLiteral = '' | 'profile' | 'analytics' | 'chat' | 'settings';

export enum Paths {
    EMPTY = '',
    PROFILE = 'profile',
    ANALYTICS = 'analytics',
    CHAT = 'chat',
    SETTINGS = 'settings'
}

export enum ChannelTypes {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private',
}


export interface Channel {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    private: boolean;
    password: string;
    type: ChannelTypes;
    picture: string;
}

export interface NotificationType {
    MESSAGE: string;
    FRIEND_REQUEST: string;
    CALL_REQUEST: string;
    CHANNEL_MESSAGE: string;
    CHANNEL_INVITE: string;
    ROOM_MESSAGE: string;
}

export interface NotificationMessage {
    message: string;
    audio: string;
    image: string;

}

export interface notificationInterface {
    id: number;
    type: string;
    message: string;
    audio: string;
    image: string;
    seen: boolean;
    read: boolean;
    channel: Channel;
    issuer: User;
    target: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface gameScores {
    id: number;
    user_score: number;
    player_score: number;
    TotalScoore: number;
    finishedAt: Date;
    player1: User;
    player2: User;
    winner: User;
}

export interface totalGames {
    gamePlayed: number;
    gameWon: number;
    gameWithMaxScore: number;
}

export interface MutedUsers {
    id: number;
    createdAt: Date;
    finishedAt: Date;
    finished: boolean;
    userId: string;
    cid: number;
}