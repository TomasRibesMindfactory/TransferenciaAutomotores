import { SujetoPasivo } from '../../infrastructure/entities/sujeto-pasivo.entity';

export abstract class SujetoPasivoRepositoryPort {
  abstract findByCuit(cuit: string): Promise<SujetoPasivo | null>;
  abstract findById(id: number): Promise<SujetoPasivo | null>;
}
