import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors } from '@nestjs/common';
import { InformationService } from './information.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { IpHostnameMiddleware } from 'src/ip-hostname/ip-hostname.middleware';



export interface ExtendedRequest extends Request {
  IP: string;
  hostname: string;
  clientIp: string;
}




@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}
  

  @Post()
  @UseInterceptors(IpHostnameMiddleware)
  async create(@Body() createInformationDto: CreateInformationDto, @Request() req: ExtendedRequest) {
    try {
    const { IP, hostname} = req;

      const information = await this.informationService.create(createInformationDto, { IP, hostname});
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
  findAll() {
    return this.informationService.findAll();
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
