import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_CODIGOS_ALTAS')
export class ParCodigoAlta {
  @PrimaryColumn({ name: 'PCA_ID', length: 5 })
  id: string;

  @PrimaryColumn({ name: 'PCA_PTA_ID', length: 5 })
  ptaId: string;

  @Column({ name: 'PCA_CODIGO_ALTA', length: 40 })
  codigoAlta: string;

  @Column({ name: 'PCA_FECHA_INICIO', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'PCA_DESCRIPCION', length: 40, nullable: true })
  descripcion: string;

  @Column({ name: 'PCA_FECHA_FIN', type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PCA_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PCA_FECHA_ALTA', type: 'datetime' })
  fechaAlta: Date;

  @Column({ name: 'PCA_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PCA_FECHA_ULT_MOD', type: 'datetime', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PCA_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PCA_FECHA_BAJA', type: 'datetime', nullable: true })
  fechaBaja: Date;
}
