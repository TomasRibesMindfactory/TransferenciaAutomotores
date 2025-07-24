import { ParTipoVehiculo } from '../../infrastructure/entities/par-tipo-vehiculo.entity';

export interface ParTipoVehiculoRepositoryPort {
  findAll(): Promise<ParTipoVehiculo[]>;
  findById(id: string): Promise<ParTipoVehiculo | null>;
  findActiveByGrupo(grupo: string): Promise<ParTipoVehiculo[]>;
}
