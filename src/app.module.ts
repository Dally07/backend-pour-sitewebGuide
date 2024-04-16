import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { DepartementModule } from './departement/departement.module';
import { Departement } from './departement/entities/departement.entity';
import { InformationModule } from './information/information.module';
import { Information } from './information/entities/information.entity';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
    
    type : "mysql",
    host : "localhost",
    port : 3306,
    username : "root",
    password : "",
    database : "websites",
    entities : [User,Departement,Information],
    synchronize : true

}),
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {expiresIn: '3600s'}
}),
UserModule,
DepartementModule,
InformationModule,
AuthModule,
],
  controllers: [AppController],
  providers: [AppService, JwtService, JwtService],
})
export class AppModule {
  configure (consumer: MiddlewareConsumer) {
    const corsOption: CorsOptions ={
      origin: 'http://localhost:4200',
      credentials: true,
      allowedHeaders: ['content-type' , 'Authirization' , 'X-Request-With'],
      methods: ['GET', 'POST' , 'PUT', 'DELETE', 'OPTIONS']
    };
    consumer.apply(cors(corsOption)).forRoutes('*');
  }
  
}
