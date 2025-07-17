import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automotor } from '../entities/automotor.entity';
import { AutomotorRepositoryPort } from '../../domain/ports/automotor-repository.port';

@Injectable()
export class AutomotorRepository implements AutomotorRepositoryPort {
  constructor(
    @InjectRepository(Automotor)
    private readonly automotorRepository: Repository<Automotor>,
  ) {}

  async findByDominio(dominio: string): Promise<Automotor | null> {
    return this.automotorRepository.findOne({
      where: {
        dominio,
        fechaBaja: null,
      },
      relations: ['objetosValorPredeterminado'],
    });
  }

  async findById(id: number): Promise<Automotor | null> {
    return this.automotorRepository.findOne({
      where: { id },
      relations: ['objetosValorPredeterminado'],
    });
  }
} 