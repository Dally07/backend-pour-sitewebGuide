import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { DepartementModule } from './departement/departement.module';
import { Departement } from './departement/entities/departement.entity';
import { InformationModule } from './information/information.module';
import { Information } from './information/entities/information.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';



const optionCORS: CorsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['content-type' , 'Authirization' , 'X-Request-With'],
  methods: ['GET', 'POST' , 'PUT', 'DELETE', 'OPTIONS']
}

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
UserModule,
DepartementModule,
InformationModule,
AuthModule,
],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
@EnableCors(optionCORS)
export class AppModule {
  constructor () {}
  
}
