import {Injectable, Logger,  UseGuards } from '@nestjs/common';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Information } from '../information/entities/information.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
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

    private readonly logger = new Logger(InformationService.name),
   
   
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
  async findAllByUserDepartement(userId: number): Promise<Information[]> {
    const user = await this.informationRepository.findOne({
      where: {userId},
      relations: ['userId' , 'userId.departementIdDepartement']
    });

    if (user) {
      return this.informationRepository.find({
        where: {userId: user.userId},
      });
    }
    return [];
  }



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

  findOne(idInformation: number) {
    return this.informationRepository.findOneBy({idInformation});
  }

  async getInformationByDepartement() {

    try {
      return await this.informationRepository.query(`
      SELECT departement.nomDepartement, COUNT(*) AS nombre_informations
      FROM information
      INNER JOIN user ON information.userId = user.userId
      INNER JOIN departement ON user.departementIdDepartement = departement.idDepartement
      GROUP BY departement.nomDepartement;
      `);
      
     
    } catch (error) {
      this.logger.error(`failed to get info dep: ${error.message}`);
      throw error;
    }
  }

  async getInformationByDate() {
    try {
      return await this.informationRepository.query(`
      SELECT DATE(information.date) AS date_information, COUNT(*) AS nombre_informations
      FROM information
      GROUP BY DATE(information.date)
      ORDER BY date_information;
      `); 
      
     
    } catch (error) {
      this.logger.log(`failed to get info date: ${error.message}`);
      throw error;
    }

 
}

}

