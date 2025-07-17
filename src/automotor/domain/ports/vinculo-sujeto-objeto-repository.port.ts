import { VinculoSujetoObjeto } from '../../infrastructure/entities/vinculo-sujeto-objeto.entity';

export abstract class VinculoSujetoObjetoRepositoryPort {
  abstract findTitularActual(ovpId: number): Promise<VinculoSujetoObjeto | null>;
  abstract create(vinculo: Partial<VinculoSujetoObjeto>): Promise<VinculoSujetoObjeto>;
  abstract updateFechaHasta(id: number, fechaHasta: Date): Promise<void>;
}
