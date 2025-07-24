import { Transferencia } from '../../infrastructure/entities/transferencia.entity';

export interface TransferenciaRepositoryPort {
  create(transferencia: Partial<Transferencia>): Promise<Transferencia>;
  findById(id: number): Promise<Transferencia | null>;
  findByDominio(dominio: string): Promise<Transferencia[]>;
  findBySujetoPasivo(sujetoPasivoId: number): Promise<Transferencia[]>;
  update(
    id: number,
    transferencia: Partial<Transferencia>,
  ): Promise<Transferencia>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Transferencia[]>;
}
