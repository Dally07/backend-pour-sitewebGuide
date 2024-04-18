import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService,
        private readonly jwtService: JwtService){}

    async signIn(username: string, password: string): Promise<{acces_token: string}> {
        const user = await this.usersService.authenticateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.userId, username: user.username};
        
        return {
            acces_token: await this.jwtService.signAsync(payload),
        };
    }
     async generatedAccesToken(user: any): Promise<string> {
        const payload = {sub: user.userId, username: user.username};
        return await this.jwtService.signAsync(payload);
     }
}
