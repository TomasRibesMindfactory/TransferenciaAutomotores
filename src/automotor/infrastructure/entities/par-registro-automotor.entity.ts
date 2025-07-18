import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_REGISTRO_AUTOMOTORES')
export class ParRegistroAutomotor {
  @PrimaryColumn({ name: 'PRT_ID', length: 5 })
  id: string;

  @Column({ name: 'PRT_DESCRIPCION', length: 40 })
  descripcion: string;

  @Column({ name: 'PRT_FECHA_INICIO', type: 'datetime2' })
  fechaInicio: Date;

  @Column({ name: 'PRT_FECHA_FIN', type: 'datetime2', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PRT_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PRT_FECHA_ALTA', type: 'datetime2' })
  fechaAlta: Date;

  @Column({ name: 'PRT_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PRT_FECHA_ULT_MOD', type: 'datetime2', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PRT_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PRT_FECHA_BAJA', type: 'datetime2', nullable: true })
  fechaBaja: Date;
}
