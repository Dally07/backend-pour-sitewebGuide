import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(@Body() createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(userId: number) {
    return this.userRepository.findOneBy({userId});
  }

  update(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(userId, updateUserDto);
  }

  remove(userId: number) {
    return this.userRepository.delete(userId) ;
  }
}
