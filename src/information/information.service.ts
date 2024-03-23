import { Body, Injectable } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import { ExtendedRequest } from './information.controller';


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



  async create(createInformationDto: CreateInformationDto, req: ExtendedRequest): Promise<Information> {
    try{
      const {hostname, IP} = this.getHostnameAndIP(req);
      const newInformation = this.informationRepository.create({
        ...createInformationDto,
        hostname,
        IP: req.clientIp,
      });
      const savedInformation = await this.informationRepository.save(newInformation);
      return savedInformation;
    
  }catch (error) {
    throw new Error(`eerror for creating information: ${error.message}`);
  }
  }

  private getHostnameAndIP(req: ExtendedRequest) : {hostname: string; IP: string} {
    const ipAddress = req.clientIp;
    const hostname = req.hostname;
    return {hostname, IP: ipAddress};
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



