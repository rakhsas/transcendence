import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
export class CreateUserDto {
    @IsString()
    @MinLength(3, {
        message: 'ID must have at least 4 charactes.'
    })
    @IsNotEmpty()
    @ApiProperty()
    id: string;

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
    // @IsNotEmpty()
    // @ApiProperty()
    // @Matches(passwordRegEx, { message: `Password too weak` })
    // password: string;
    
    
    // @IsString()
    // @ApiProperty()
    // @IsEnum(['f', 'm', 'u'])
    // gender: string;
}