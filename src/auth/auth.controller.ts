import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';



interface AuthRequest extends Request{
    user: {
        sub: number;
        username: string;
        departement: number;
    }
}

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private readonly userServive: UserService ){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        return await this.authService.signIn(signInDto.username, signInDto.password, );
       
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfil(@Request() req: AuthRequest) {
        return req.user;   
    }

    async  logout(@Request() req: AuthRequest) {
        const userId = req.user.sub;
        
    }


    
   
}
