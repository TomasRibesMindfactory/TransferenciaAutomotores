import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinculoSujetoObjeto } from '../entities/vinculo-sujeto-objeto.entity';
import { VinculoSujetoObjetoRepositoryPort } from '../../domain/ports/vinculo-sujeto-objeto-repository.port';

@Injectable()
export class VinculoSujetoObjetoRepository implements VinculoSujetoObjetoRepositoryPort {
  constructor(
    @InjectRepository(VinculoSujetoObjeto)
    private readonly vinculoRepository: Repository<VinculoSujetoObjeto>,
  ) {}

  async findTitularActual(ovpId: number): Promise<VinculoSujetoObjeto | null> {
    return this.vinculoRepository.findOne({
      where: {
        objetoValorPredeterminadoId: ovpId,
        fechaHasta: null,
        fechaBaja: null,
      },
      relations: ['sujetoPasivo'],
    });
  }

  async create(vinculo: Partial<VinculoSujetoObjeto>): Promise<VinculoSujetoObjeto> {
    const nuevoVinculo = this.vinculoRepository.create(vinculo);
    return this.vinculoRepository.save(nuevoVinculo);
  }

  async updateFechaHasta(id: number, fechaHasta: Date): Promise<void> {
    await this.vinculoRepository.update(id, { fechaHasta });
  }
} 