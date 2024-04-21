import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constantes';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [UserModule,JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '3600s'}
  }), 
],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
