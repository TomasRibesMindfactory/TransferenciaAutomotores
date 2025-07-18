import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transferencia } from '../entities/transferencia.entity';
import { TransferenciaRepositoryPort } from '../../domain/ports/transferencia-repository.port';

@Injectable()
export class TransferenciaRepository implements TransferenciaRepositoryPort {
  constructor(
    @InjectRepository(Transferencia)
    private readonly repository: Repository<Transferencia>,
  ) {}

  async create(transferencia: Partial<Transferencia>): Promise<Transferencia> {
    const entity = this.repository.create(transferencia);
    return await this.repository.save(entity);
  }

  async findById(id: number): Promise<Transferencia | null> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'sujetoPasivoActual',
        'sujetoPasivoNuevo',
        'objetoValorPredeterminado',
      ],
    });
  }

  async findByDominio(dominio: string): Promise<Transferencia[]> {
    return await this.repository.find({
      where: { atrDominio: dominio },
      relations: [
        'sujetoPasivoActual',
        'sujetoPasivoNuevo',
        'objetoValorPredeterminado',
      ],
      order: { fechaTransferencia: 'DESC' },
    });
  }

  async findBySujetoPasivo(sujetoPasivoId: number): Promise<Transferencia[]> {
    return await this.repository
      .createQueryBuilder('transferencia')
      .leftJoinAndSelect('transferencia.sujetoPasivoActual', 'spoActual')
      .leftJoinAndSelect('transferencia.sujetoPasivoNuevo', 'spoNuevo')
      .leftJoinAndSelect('transferencia.objetoValorPredeterminado', 'ovp')
      .where(
        'transferencia.spoId = :spoId OR transferencia.spoIdNuevoDueno = :spoId',
        {
          spoId: sujetoPasivoId,
        },
      )
      .orderBy('transferencia.fechaTransferencia', 'DESC')
      .getMany();
  }

  async update(
    id: number,
    transferencia: Partial<Transferencia>,
  ): Promise<Transferencia> {
    await this.repository.update(id, transferencia);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Transferencia[]> {
    return await this.repository.find({
      relations: [
        'sujetoPasivoActual',
        'sujetoPasivoNuevo',
        'objetoValorPredeterminado',
      ],
      order: { fechaTransferencia: 'DESC' },
    });
  }
}
