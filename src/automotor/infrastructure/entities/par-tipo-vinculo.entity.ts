import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_TIPOS_VINCULOS')
export class ParTipoVinculo {
  @PrimaryColumn({ name: 'PTV_ID', length: 5 })
  id: string;

  @Column({ name: 'PTV_DESCRIPCION', length: 40 })
  descripcion: string;

  @Column({ name: 'PTV_FECHA_INICIO', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'PTV_FECHA_FIN', type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PTV_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PTV_FECHA_ALTA', type: 'datetime' })
  fechaAlta: Date;

  @Column({ name: 'PTV_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PTV_FECHA_ULT_MOD', type: 'datetime', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PTV_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PTV_FECHA_BAJA', type: 'datetime', nullable: true })
  fechaBaja: Date;
}
