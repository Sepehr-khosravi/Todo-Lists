import { Body, Controller , Post } from '@nestjs/common';
import { SignInValidator , SignUpValidator } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){};
    @Post("signin")
    signin(@Body() user : SignInValidator ){
        return this.authService.signin(user)
    }
    @Post("signup")
    signup(@Body() user : SignUpValidator){
        return this.authService.signup(user);
    };
}
