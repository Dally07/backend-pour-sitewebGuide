import { Body, Injectable } from '@nestjs/common';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Departement } from '../departement/entities/departement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DepartementService {

  constructor (
    @InjectRepository(Departement)
    private readonly departementRepository : Repository<Departement>,
   ) {}


  create(@Body() createDepartementDto: CreateDepartementDto) {
    return this.departementRepository.create(createDepartementDto);
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
