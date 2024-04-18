import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UseGuards } from '@nestjs/common';
import { InformationService } from './information.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { IpHostnameMiddleware } from 'src/ip-hostname/ip-hostname.middleware';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current_user.decorator';



export interface ExtendedRequest extends Request {
  IP: string;
  hostname: string;
  clientIp: string;
  user: any;
}




@Controller('information')
@UseGuards(AuthGuard)
export class InformationController {
  constructor(private readonly informationService: InformationService, private readonly userService: UserService) {}
  

  @Post()
  @UseInterceptors(IpHostnameMiddleware)
  async create(@Body() createInformationDto: CreateInformationDto, @Request() req: ExtendedRequest, @CurrentUser() user: any) {
    try {
    const { IP, hostname} = req;
      const user = req.user;
      const information = await this.informationService.create(createInformationDto, user, { IP, hostname});
      return information;

    } catch (error) {
      return this.handleCreateError(error);
    }
    
  }


  private handleCreateError(error: Error): any {
    if (error.message.includes('ER DUP ENTRY')) {
      return {
        success: false,
        message: `l'identifiant est deja utiliser`,
      };
    } else if (error.message.includes('ER REFERENCED ROW')) {
      return{
        success: false,
        message: `l'utilisateur n'existe pas`
      };
    } else {
      return{
        success: false,
        message: `erreur lors de la creation de l'information: ${error.message}`
      }
    }
  }

  @Get()
  async findAll(@Request() req: any) {
    const user = req.user;
    return this.informationService.findAllByUserDepartement(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationService.update(+id, updateInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationService.remove(+id);
  }
}
