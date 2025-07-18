import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_MODELOS')
export class ParModelo {
  @PrimaryColumn({ name: 'PMO_ID', length: 15 })
  id: string;

  @Column({ name: 'PMO_DESCRIPCION', length: 40 })
  descripcion: string;

  @Column({ name: 'PMO_FECHA_INICIO', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'PMO_FECHA_FIN', type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PMO_FECHA_ULT_MOD', type: 'datetime', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PMO_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PMO_FECHA_ALTA', type: 'datetime' })
  fechaAlta: Date;

  @Column({ name: 'PMO_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PMO_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PMO_COD_MARCA', length: 3, nullable: true })
  codMarca: string;

  @Column({ name: 'PMO_CILINDRADAS', type: 'bigint', nullable: true })
  cilindradas: number;

  @Column({ name: 'PMO_CILINDROS', type: 'bigint', nullable: true })
  cilindros: number;

  @Column({ name: 'PMO_PESO', type: 'int', nullable: true })
  peso: number;

  @Column({ name: 'PMO_FECHA_BAJA', type: 'datetime', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'PMO_CIP', type: 'int', nullable: true })
  cip: number;

  @Column({ name: 'PMO_PCG_ID', length: 5, nullable: true })
  pcgId: string;
}
