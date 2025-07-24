import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjetoValorPredeterminado } from '../entities/objeto-valor-predeterminado.entity';
import { ObjetoValorPredeterminadoRepositoryPort } from '../../domain/ports/objeto-valor-predeterminado-repository.port';

@Injectable()
export class ObjetoValorPredeterminadoRepository
  implements ObjetoValorPredeterminadoRepositoryPort
{
  constructor(
    @InjectRepository(ObjetoValorPredeterminado)
    private readonly ovpRepository: Repository<ObjetoValorPredeterminado>,
  ) {}

  async findByAutomotorId(
    automotorId: number,
  ): Promise<ObjetoValorPredeterminado[]> {
    return this.ovpRepository.find({
      where: { atrId: automotorId },
      order: { fechaInicio: 'DESC' },
    });
  }

  async findById(id: number): Promise<ObjetoValorPredeterminado | null> {
    return this.ovpRepository.findOne({
      where: { id },
      relations: ['automotor'],
    });
  }

  async create(
    objetoValor: Partial<ObjetoValorPredeterminado>,
  ): Promise<ObjetoValorPredeterminado> {
    const newObjetoValor = this.ovpRepository.create(objetoValor);
    return this.ovpRepository.save(newObjetoValor);
  }
}
