import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private readonly userServive: UserService ){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfil(@Request() req) {
        const user = await this.userServive.findByUsername(req.user.userId)
        return user;

        
    }
}
