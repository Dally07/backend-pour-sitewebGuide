import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { InformationController } from './information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DepartementService } from 'src/departement/departement.service';
import { DepartementModule } from 'src/departement/departement.module';
import { Departement } from 'src/departement/entities/departement.entity';







@Module({
  imports: [TypeOrmModule.forFeature([Information,User, Departement]),
MulterModule.register({

 storage: diskStorage({
  destination: './uploads',
  filename(req, file, callback) {
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, `${randomName}-${file.originalname}`);
  },
 })
  
}),
UserModule,
DepartementModule,
],
  controllers: [InformationController],
  providers: [InformationService,  UserService, AuthGuard,  AuthService, DepartementService,  Logger],

})
export class InformationModule {
}
