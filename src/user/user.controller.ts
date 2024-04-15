import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

@Post('login')
  async login(@Body() loginData: any) {
    const user = await this.userService.authenticateUser(loginData.username, loginData.password);
     if (user) {
      return user;
     } else {
        return { message: `user or password incorect`};
     }
  }

@Get()
  findAll() {
    return this.userService.findAll();
  }

@Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

@Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

@Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
