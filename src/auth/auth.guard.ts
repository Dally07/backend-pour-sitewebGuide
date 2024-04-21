import { CanActivate,ExecutionContext,Injectable,UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constantes";
import { Request } from "express";
import { error } from "console";




@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}



    
    async canActivate (context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
                console.log('payload:' ,payload);
                console.log('payload.sub:' , payload.sub);
                request.userId = payload.sub;
                request.user = payload;
        } catch {
            console.error('erreur de verification jwt' , error);
            throw new UnauthorizedException();
        }
        return true;
    }
    
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token: undefined;
    }
    }
