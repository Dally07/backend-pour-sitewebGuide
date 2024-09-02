import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UseGuards, UnauthorizedException, UploadedFile, PipeTransform, Res, Logger, ParseIntPipe, UseFilters, NotFoundException, Query, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { InformationService } from './information.service';
import { CreateInformationDto} from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { IpHostnameMiddleware } from 'src/ip-hostname/ip-hostname.middleware';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { HttpExceptionFilter } from 'src/http-exception-filter/http-exception-filter';
import { Information } from './entities/information.entity';







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
@UseFilters(HttpExceptionFilter)
@UsePipes(new ValidationPipe())

export class InformationController {
  constructor(private readonly informationService: InformationService, 
    private readonly logger: Logger
  ) {}
  
 

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



  @Get('departement')
  async getInformationByDepatement() { 
   return await this.informationService.getInformationByDepartement();
  }
 
  @Get('date')
  async getInformationByDate() {
   return await this.informationService.getInformationByDate();
  }

  @Get('total-informations')
  async getTotalInformations() {
    return this.informationService.getTotalInformations();
  }

  @Get('total-users')
  async getTotalUsers() {
    return this.informationService.getTotalUsers();
  }

  @Get('search')
  async search(@Query('departementName') departementName: string) {
    return await this.informationService.searchInfoByDepartement(departementName);
  }



  
  @UseGuards(AuthGuard)
  @Get('total-informations-by-user/:userId')
  async getTotalInformationsByUser(@Request() req: ExtendedRequest,) {
    const userId = req.user.sub;
    return this.informationService.getTotalInformationsByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('current-username')
  async getCurrentUsername(@Request() req: ExtendedRequest) {
    const username = req.user.username;
    return  username;
  }
 


@Get()
async getAll() {
  const allinfo = await this.informationService.findAll();
  return allinfo.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

@Get('last')
findLastInfo(): Promise<Information> {
  return this.informationService.getTitreInformationByDepartement();
}


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) idInformation: number) {
    this.logger.log(`fetching info with id ${idInformation} not found`);

    

    const information = await this.informationService.findOne(idInformation);
    if(isNaN(idInformation)){
      throw new BadRequestException(`invalid ID ${idInformation} format`);
    }

    if (!information) {
      this.logger.warn(`information with id ${idInformation} not found`);
      throw new NotFoundException(`information with id ${idInformation} not found`);
    }
    console.log(information);
    return information;
  }
  





  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationService.update(+id, updateInformationDto);
  }

  @Delete(':id')
  remove(@Param('id', ) id: number) {
    return this.informationService.remove(+id);
  }

 
}
