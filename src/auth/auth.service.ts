import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, 
        private readonly usersService: UserService,
      
      ){}


        // for login
    async signIn(username: string, password: string): Promise<{acces_token: string}> {
        const user = await this.usersService.authenticateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.userId, username: user.username, departement: user.departementIdDepartement};
        
        return {
            acces_token: await this.jwtService.signAsync(payload),
        };
    }

        // for generated token
     async generatedAccesToken(user: any): Promise<string> {
        const payload = {sub: user.userId, username: user.username, departement: user.departementIdDepartement};
        return await this.jwtService.signAsync(payload);
     }

     async extractUserId(acces_token: string): Promise<number>{
       try {
        const payload = await this.jwtService.verifyAsync(acces_token);
        
            return payload.sub;
        
       } catch {
        
       }
     }



     async logout() {
        

     }


    }
