import { Body, Injectable } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';



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



  async create(createInformationDto: CreateInformationDto, { hostname, IP}): Promise<Information> {
    try{
      
      const newInformation = this.informationRepository.create({
        ...createInformationDto,
        hostname,
        IP,
      });
      const savedInformation = await this.informationRepository.save(newInformation);
      return savedInformation;
    
  }catch (error) {
    throw new Error(`eerror for creating information: ${error.message}`);
  }
  }

  private getRemteAdress(req: Request) : {hostname: string; IP: string} {
    const ipAddress = req.headers['x-forwader-for'] as string | undefined;
    const hostname = req.hostname;
    if (ipAddress) {
      const ips = ipAddress.split(',');
      return {hostname, IP: ips[0].trim() };
    } else {
      return {hostname, IP: req.ip };
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



