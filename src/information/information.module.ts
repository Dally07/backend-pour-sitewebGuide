import { Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { InformationController } from './information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';





@Module({
  imports: [TypeOrmModule.forFeature([Information, User])],
  controllers: [InformationController],
  providers: [InformationService, UserModule, UserService, AuthService, AuthGuard],

})
export class InformationModule {

}
