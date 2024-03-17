import { Body, Injectable } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import * as dns from 'dns';
import requestIp from 'request-ip'

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



  async create(createInformationDto: CreateInformationDto, req: Request) {
    try {
      const { hostname, IP } = await this.getHostnameAndIP(req);
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

  private async getHostnameAndIP(req: Request): Promise<{ hostname: string; IP: string }> {
    const ipAddress = await this.getIpAddress(req); 
    const hostname = await this.getHostname(ipAddress);
    return { hostname, IP: ipAddress };
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


  private async getIpAddress(req: Request): Promise<string> {
    return requestIp.getClientIp(req);
  }

  private async getHostname(ip: string): Promise<string> {
    return new Promise((resolve, reject) => {
      dns.lookup(ip, (err, address, family) => {
        if (err) {
          reject(err);
        } else {
          resolve(address);
        }
      });
    });
  }

 
}



