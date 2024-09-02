import {Injectable, Logger,  NotFoundException,  UseGuards } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Departement } from 'src/departement/entities/departement.entity';



@Injectable()
export class InformationService {


  constructor(
    @InjectRepository(Information) 
    private readonly informationRepository: Repository<Information>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Departement)
    private readonly departementRepository: Repository<Departement>,

    private readonly logger : Logger
   
   
  ){}
  
  async create(createInformationDto: CreateInformationDto , { IP, hostname }: { IP: string; hostname: string; }, userId: number , imageData: string): Promise<Information> {
    try{
      
      
      const newInformation = this.informationRepository.create({
        ...createInformationDto,
        IP,
        hostname,
        date: new Date(),
        userId,
        imageData,
       
      });
      console.log(userId);
      const savedInformation = await this.informationRepository.save(newInformation);
      return savedInformation;
    
  }catch (error) {
    throw new Error(`eerror for creating information: ${error.message}`);
  }
  }

  async getInformationByDepartement(): Promise <any> {

    try {
      const query = `
      SELECT departement.nomDepartement, COUNT(*) AS nombre_informations
      FROM information
      INNER JOIN user ON information.userId = user.userId
      INNER JOIN departement ON user.departementIdDepartement = departement.idDepartement
      GROUP BY departement.nomDepartement;
      `;
      console.log(query);
      return await this.informationRepository.query(query);
      
     
    } catch (error) {
      this.logger.error(`failed to get info dep: ${error.message}`);
      throw error;
    }
  }

  async getInformationByDate(): Promise<any> {
    try {
      const query = await this.informationRepository.query( `
      SELECT DATE(information.date) AS date_information, COUNT(*) AS nombre_information
      FROM information
      GROUP BY DATE(information.date)
      ORDER BY date_information;
      `); 
      console.log(query);
      return (query);
      
     
    } catch (error) {
      this.logger.log(`failed to get info date: ${error.message}`);
      throw error;
    } 
}

async searchInfoByDepartement(departementName: string): Promise<any> {
  const departement = await this.departementRepository.findOne({where: {nomDepartement: departementName}});
  if (!departement){
    return[];
  }

  const informations = await this.informationRepository.createQueryBuilder('information')
  .innerJoin('information.user', 'user')
  .where('user.departementIdDepartement = :departementId', {departementId: departement.idDepartement})
  .select(['information.titreInfo'])
  .getMany();
  return informations;
}

async getLastinfo(): Promise<Information> {
  const lastInfo =  this.informationRepository.find({
    order: {
      date: 'DESC',
    },
    take: 1,
  });
  return lastInfo[0];
}

async getTitreInformationByDepartement() {
  try {
    const query = await this.informationRepository.query(`
    SELECT * FROM information ORDER BY date DESC LIMIT 1
    `)
    console.log(query);
    return query[0];

  }catch (error) {
    this.logger.log(`404 not found ${error.message}`);
  }
}

async getTotalInformations(): Promise<number> {
  const result = await this.informationRepository.query('SELECT COUNT(*) AS total_informations FROM information');
  return result[0].total_informations;
}

async getTotalUsers(): Promise<number> {
  const result = await this.informationRepository.query('SELECT COUNT(*) AS total_users FROM user');
  return result[0].total_users;
}

async getTotalInformationsByUser(userId: number): Promise<Information> {
  const result = await this.informationRepository.query('SELECT COUNT(*) AS total_informations_by_user FROM information WHERE userId = ?', [userId]);
  return result[0].total_informations_by_user;
}

async getcurrentUsername() {

}


  update(idInformation: number, updateInformationDto: UpdateInformationDto) {
    return this.informationRepository.update(idInformation, updateInformationDto);
  }

  remove(id: number) {
    return this.informationRepository.delete(id);
  }

  async findAll(): Promise<Information[] & {imageData: string | null}[]> {
    const informationlist = await this.informationRepository.find();
    for (const information of informationlist) {
      if (information.imageData) {
        information.imageData = Buffer.from(information.imageData).toString( 'base64');
      }
    }
    return informationlist;
  }

  async findOne(idInformation: number){
    this.logger.log(`attempting to find info with id ${idInformation}`);
    const information = await this.informationRepository.findOneBy({ idInformation});
    if (!information) {
      this.logger.warn(`info with id ${idInformation} not found`);
      throw new NotFoundException(`info with id ${idInformation} not found`);

    }
    this.logger.log(`found information: ${JSON.stringify(information)}`);
    return information;
    
  }

  

}

