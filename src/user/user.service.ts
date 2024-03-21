  import { Body, Injectable } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from '../user/entities/user.entity';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcryptjs';


  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

    
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const newUser = this.userRepository.create({
          ...createUserDto,
          password: hashedPassword,
          salt: salt
        });
    
        const savedUser = await this.userRepository.save(newUser);
        return savedUser;
      } catch (error) {
        
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
      }
    }
    
    async findByUsername(username: string): Promise<User | undefined> {
      return this.userRepository.findOne({ where: { username: username } });
    }
    
    async authenticateUser(username: string, password: string): Promise<boolean> {
      const user = await this.findByUsername(username);
      if (!user) {
        return false;
      }
      return bcrypt.compare(password, user.password);
    }




    findAll() {
      return this.userRepository.find();
    }



    findOne(userId: number) {
      return this.userRepository.findOneBy({userId});
    }



    async update(userId: number, updateUserDto: UpdateUserDto) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
        const newUser = this.userRepository.create({
          ...updateUserDto,
          password: hashedPassword,
          salt: salt
        });
    
        const savedUser = this.userRepository.update(userId, updateUserDto);
        return savedUser;
      } catch (error) {
        
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
      }
     
    }



    remove(userId: number) {
      return this.userRepository.delete(userId) ;
    }
  }
