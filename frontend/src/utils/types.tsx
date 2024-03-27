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