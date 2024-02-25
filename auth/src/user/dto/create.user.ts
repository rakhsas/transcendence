import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Channel, Msg, Mute } from '../model/user.model';

export class CreateUserDto {
    @IsNumber()
    @ApiProperty()
    id: number;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;
    
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;
    
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @ApiProperty()
    provider: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    username: string;
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
    
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    picture: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    coalition: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    coalitionPic: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
    coalitionCover: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @ApiProperty()
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
}
