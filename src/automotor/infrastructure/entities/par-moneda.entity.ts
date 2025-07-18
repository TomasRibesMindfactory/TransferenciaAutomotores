import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PAR_MONEDAS')
export class ParMoneda {
  @PrimaryColumn({ name: 'PMA_ID', length: 5 })
  id: string;

  @Column({ name: 'PMA_DESCRIPCION', length: 80 })
  descripcion: string;

  @Column({ name: 'PMA_FECHA_INICIO', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'PMA_FECHA_FIN', type: 'datetime', nullable: true })
  fechaFin: Date;

  @Column({ name: 'PMA_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'PMA_FECHA_ALTA', type: 'datetime' })
  fechaAlta: Date;

  @Column({ name: 'PMA_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'PMA_FECHA_ULT_MOD', type: 'datetime', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'PMA_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'PMA_FECHA_BAJA', type: 'datetime', nullable: true })
  fechaBaja: Date;
}
