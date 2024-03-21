import { Body, Injectable } from '@nestjs/common';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Departement } from '../departement/entities/departement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class DepartementService {

  constructor (
    @InjectRepository(Departement)
    private readonly departementRepository : Repository<Departement>,
   ) {}


 async create(@Body() createDepartementDto: CreateDepartementDto): Promise<Departement> {
   try{
    const newdep = this.departementRepository.create({
      ...createDepartementDto
    });
    const savedDep = await this.departementRepository.save(newdep);
    return savedDep;
   } catch (error) {
    throw new Error(`erreur lors de la creation du depatement: ${error.message}`);
   }
  }

  findAll() {
    return this.departementRepository.find();
  }

  findOne(idDepartement: number) {
    return this.departementRepository.findOneBy({idDepartement});
  }

  update(idDepartement: number, updateDepartementDto: UpdateDepartementDto) {
    return this.departementRepository.update(idDepartement, updateDepartementDto);
  }

  remove(idDepartement: number) {
    return this.departementRepository.delete(idDepartement);
  }
}
