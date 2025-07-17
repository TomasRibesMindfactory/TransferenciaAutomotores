import { Automotor } from '../../infrastructure/entities/automotor.entity';

export abstract class AutomotorRepositoryPort {
  abstract findByDominio(dominio: string): Promise<Automotor | null>;
  abstract findById(id: number): Promise<Automotor | null>;
}
