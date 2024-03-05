import { Body, Injectable } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import os from 'os';

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

  async create(createInformationDto: CreateInformationDto) {
    try {
      const hostname = os.hostname();
      const IP = getIPAddress();
      const newInformation = this.informationRepository.create({
        ...createInformationDto,
        hostname,
        IP,
      });
      const savedInformation = await this.informationRepository.save(newInformation);
      return savedInformation;
    } catch (error) {
      throw new Error(`Error creating information: ${error.message}`);
    }
  }

  findAll() {
    return this.informationRepository.find();
  }

  findOne(idInformation: number) {
    return this.informationRepository.findOneBy({idInformation});
  }

  update(idInformation: number, updateInformationDto: UpdateInformationDto) {
    return this.informationRepository.update(idInformation, updateInformationDto);
  }

  remove(idInformation: number) {
    return this.informationRepository.delete(idInformation);
  }
}

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const details of interfaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return '127.0.0.1'; 
}

