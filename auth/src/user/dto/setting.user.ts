import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SettingProfileDto{
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}