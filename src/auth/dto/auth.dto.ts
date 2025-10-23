import { IsEmail , IsNotEmpty , IsString , MinLength } from "class-validator";

export class SignInValidator{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsString()
    @MinLength(6)
    password : string;
}

export class SignUpValidator{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password : string;
}