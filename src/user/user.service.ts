  import { Body, Injectable, NotFoundException } from '@nestjs/common';
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
          salt: salt,
          
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




    
  async authenticateUser(username: string, password: string): Promise<User | undefined> {
      const user = await this.userRepository.findOne({where: {username: username}});
      if (!user) {
        return null;
      }
      const isPaswordValid = await bcrypt.compare(password, user.password);
      if (isPaswordValid) {
        return user;
      }
      return null;
    }




  findAll() {
      return this.userRepository.find();
    }





  async findOne(userId: number) {
      return this.userRepository.findOneBy({ userId  });
}




  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.departementIdDepartement) {
      user.departementIdDepartement = updateUserDto.departementIdDepartement;
    }

    if (updateUserDto.password) {
      if (!(await bcrypt.compare(updateUserDto.currentPassword, user.password))) {
        throw new Error('Mot de passe actuel incorrect');
      }
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.save(user);
  }






  remove(userId: number) {
      return this.userRepository.delete(userId) ;
    }
  }
