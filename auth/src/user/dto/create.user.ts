import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsArray } from 'class-validator';
import { Channel, Msg, Mute } from '../model/user.model';


export class CreateUserDto {

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    lastName: string;

    @IsNumber()
    providerId: number;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    provider: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    picture: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    coalition: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    coalitionPic: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    coalitionCover: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    coalitionColor: string;

    friends: number[];

    adding: number[];

    added: number[];

    blocks: number[];

    blocking: number[];

    owner: Channel[];

    admin: Channel[];

    member: Channel[];

    invited: Channel[];

    chanBlocked: Channel[];

    Muted: Mute[];

    sendmessages: Msg[];

    receivedMessages: Msg[];

    // Add any missing properties here

}

