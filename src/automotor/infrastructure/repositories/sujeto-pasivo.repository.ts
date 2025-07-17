import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SujetoPasivo } from '../entities/sujeto-pasivo.entity';
import { SujetoPasivoRepositoryPort } from '../../domain/ports/sujeto-pasivo-repository.port';

@Injectable()
export class SujetoPasivoRepository implements SujetoPasivoRepositoryPort {
  constructor(
    @InjectRepository(SujetoPasivo)
    private readonly sujetoPasivoRepository: Repository<SujetoPasivo>,
  ) {}

  async findByCuit(cuit: string): Promise<SujetoPasivo | null> {
    return this.sujetoPasivoRepository.findOne({
      where: {
        cuit,
        fechaBaja: null,
      },
    });
  }

  async findById(id: number): Promise<SujetoPasivo | null> {
    return this.sujetoPasivoRepository.findOne({
      where: { id },
    });
  }
} 