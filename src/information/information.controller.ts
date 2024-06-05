import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UseGuards, UnauthorizedException, UploadedFile, PipeTransform, Res } from '@nestjs/common';
import { InformationService } from './information.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { IpHostnameMiddleware } from 'src/ip-hostname/ip-hostname.middleware';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';






export interface ExtendedRequest extends Request {
  IP: string;
  hostname: string;
  clientIp: string;
  user: {
    sub: number;
    username: string;
    departement: number;
}
}








@Controller('information')

export class InformationController {
  constructor(private readonly informationService: InformationService) {}
  

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(IpHostnameMiddleware, FileInterceptor('image'))
  async create(@Body() createInformationDto: CreateInformationDto, 
                @Request() req: ExtendedRequest,
              @UploadedFile() file: Express.Multer.File) {
  
    
    const userId = req.user.sub;
    const { IP, hostname} = req;
    let imageData;

    if (file) {
      imageData = file.path;
    } else {
      imageData = createInformationDto.imageData ?? null;
    }
    console.log(file);
    console.log(imageData);

    try {
   
      const information = await this.informationService.create
      (createInformationDto, { IP, hostname}, userId, imageData );
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


  

  @Get('department/:userId')
  async findAllByUserDepartement(@Param('userId') userId: number) {
    await this.informationService.findAllByUserDepartement(userId)
  }



@Get()
async getAll() {
  const allinfo = await this.informationService.findAll();
  return allinfo.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
  remove(@Param('id') id: number) {
    return this.informationService.remove(+id);
  }
 @Get('departement')
 async getInformationByDepatement() {
  return await this.informationService.getInformationByDepartement();
 }

 @Get('date')
 async getInformationByDate() {
  return await this.informationService.getInformationByDate();
 }
 
}
