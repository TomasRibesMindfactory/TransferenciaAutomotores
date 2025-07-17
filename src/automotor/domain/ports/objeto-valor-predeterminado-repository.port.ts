import { ObjetoValorPredeterminado } from '../../infrastructure/entities/objeto-valor-predeterminado.entity';

export abstract class ObjetoValorPredeterminadoRepositoryPort {
  abstract findByAutomotorId(
    automotorId: number,
  ): Promise<ObjetoValorPredeterminado[]>;
  abstract findById(id: number): Promise<ObjetoValorPredeterminado | null>;
}
