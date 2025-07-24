import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('USUARIO')
export class Usuario {
  @PrimaryColumn({ name: 'CUSUARIO', length: 10 })
  cusuario: string;

  @Column({ name: 'USR_PPW_ID', type: 'int', nullable: true })
  usrPpwId: number;

  @Column({ name: 'USR_FECHA_DESDE', type: 'date', nullable: true })
  usrFechaDesde: Date;

  @Column({ name: 'USR_FECHA_HASTA', type: 'date', nullable: true })
  usrFechaHasta: Date;

  @Column({ name: 'USUARIO_ALTA', length: 10, nullable: true })
  usuarioAlta: string;

  @Column({ name: 'FECHA_ALTA', type: 'date', nullable: true })
  fechaAlta: Date;

  @Column({ name: 'USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'USR_ISA_ID', length: 10, nullable: true })
  usrIsaId: string;
}
