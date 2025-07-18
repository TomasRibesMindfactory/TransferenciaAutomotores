import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_TIPOS_VEHICULO')
export class ParTipoVehiculo {
  @PrimaryColumn({ name: 'PTH_ID', length: 5 })
  id: string;

  @Column({ name: 'PTH_GRUPO', length: 3, nullable: true })
  grupo: string;

  @Column({ name: 'PTH_DESCRIPCION', length: 80 })
  descripcion: string;

  @Column({ name: 'PTH_FECHA_INICIO', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'PTH_FECHA_FIN', type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PTH_FECHA_ALTA', type: 'datetime' })
  fechaAlta: Date;

  @Column({ name: 'PTH_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PTH_FECHA_BAJA', type: 'datetime', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'PTH_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PTH_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PTH_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PTH_VALIDA_RNPA', length: 1, nullable: true })
  validaRnpa: string;

  @Column({ name: 'PTH_VALIDA_CIP', length: 1, nullable: true })
  validaCip: string;
}
