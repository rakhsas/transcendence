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
    seen: false;
    read: false;
    channel: Channel;
    issuer: User;
    createdAt: Date;
    updatedAt: Date;
}
