import { Body, Injectable, UseFilters, UseGuards } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';





@Injectable()
export class InformationService {

  constructor(
    @InjectRepository(Information)
    private readonly informationRepository: Repository<Information>,
   
  ){}
  


  async findAllByDepartement(departementName: string): Promise<Information[]> {
    return this.informationRepository
      .createQueryBuilder('info')
      .innerJoin('info.user', 'user')
      .innerJoin('user.departement', 'departement')
      .where('departement.nomDepartement = :departementName', { departementName })
      .getMany();
  }

  @UseGuards(AuthGuard)
  async findAllByUserDepartement(currentUser: any): Promise<Information[]> {
    return this.informationRepository.find({
      where: {user: {departementIdDepartement: currentUser.departementIdDepartement}}
    })
  }



  async create(createInformationDto: CreateInformationDto, user: any, { IP, hostname }): Promise<Information> {
    try{
      

      const newInformation = this.informationRepository.create({
        ...createInformationDto,
        IP,
        hostname,
        date: new Date(),
        user,
        
      });
      const savedInformation = await this.informationRepository.save(newInformation);
      return savedInformation;
    
  }catch (error) {
    throw new Error(`eerror for creating information: ${error.message}`);
  }
  }

 

  

  update(idInformation: number, updateInformationDto: UpdateInformationDto) {
    return this.informationRepository.update(idInformation, updateInformationDto);
  }

  remove(idInformation: number) {
    return this.informationRepository.delete(idInformation);
  }

  findAll() {
    return this.informationRepository.find();
  }

  findOne(idInformation: number) {
    return this.informationRepository.findOneBy({idInformation});
  }
 
}



