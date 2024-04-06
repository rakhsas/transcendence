import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsArray } from 'class-validator';


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    recieverId: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    senderId: number;

}

