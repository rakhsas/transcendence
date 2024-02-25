import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Channel, Mute, Msg } from "../model/user.model";


const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;
export class UpdateUserDto {
    @IsNumber()
    @MinLength(3, {
        message: 'ID must have at least 4 charactes.'
    })
    @IsNotEmpty()
    @ApiProperty()
    id: number;

    @IsString()
    @MinLength(4, {
        message: 'First name must have at least 4 charactes.'
    })
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;
    
    @IsString()
    @MinLength(4, {
        message: 'Last name must have at least 4 charactes.'
    })
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;
    
    @IsString()
    @MinLength(1, {
        message: 'provider must have at least 4 charactes.'
    })
    @IsNotEmpty()
    @ApiProperty()
    provider: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Username must have at least 4 characters.'
    })
    username: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail({ allow_display_name: true }, { message: 'Please provide valid Email.' })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Picture must be Set'
    })
    picture: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Coalition must be Set'
    })
    coalition: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Coalition Picture must be Set'
    })
    coalitionPic: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Coalition Cover must be Set'
    })
    coalitionCover: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(4, {
        message: 'Coalition Color must be Set'
    })
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