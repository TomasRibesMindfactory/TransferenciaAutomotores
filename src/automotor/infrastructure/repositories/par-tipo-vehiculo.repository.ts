import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParTipoVehiculo } from '../entities/par-tipo-vehiculo.entity';
import { ParTipoVehiculoRepositoryPort } from '../../domain/ports/par-tipo-vehiculo-repository.port';

@Injectable()
export class ParTipoVehiculoRepository
  implements ParTipoVehiculoRepositoryPort
{
  constructor(
    @InjectRepository(ParTipoVehiculo)
    private readonly repository: Repository<ParTipoVehiculo>,
  ) {}

  async findAll(): Promise<ParTipoVehiculo[]> {
    return await this.repository.find({
      where: { fechaFin: null },
      order: { descripcion: 'ASC' },
    });
  }

  async findById(id: string): Promise<ParTipoVehiculo | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findActiveByGrupo(grupo: string): Promise<ParTipoVehiculo[]> {
    return await this.repository.find({
      where: { grupo, fechaFin: null },
      order: { descripcion: 'ASC' },
    });
  }
}
