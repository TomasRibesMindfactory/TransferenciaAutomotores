import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SujetoPasivo } from './sujeto-pasivo.entity';
import { ObjetoValorPredeterminado } from './objeto-valor-predeterminado.entity';

@Entity('VINCULOS_SUJETO_OBJETO')
export class VinculoSujetoObjeto {
  @PrimaryGeneratedColumn({ name: 'VSO_ID' })
  id: number;

  @Column({ name: 'VSO_SPO_ID', type: 'bigint' })
  sujetoPasivoId: number;

  @Column({ name: 'VSO_OVP_ID' })
  objetoValorPredeterminadoId: number;

  @Column({ name: 'VSO_PTV_ID', length: 5 })
  ptvId: string;

  @Column({ name: 'VSO_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'VSO_PCJ_ID', length: 5, nullable: true })
  pcjId: string;

  @Column({ name: 'VSO_PCJ_PTB_ID', length: 5, nullable: true })
  pcjPtbId: string;

  @Column({ name: 'VSO_FECHA_FIN', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'VSO_PORCENTAJE', type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ name: 'VSO_RESPONSABLE', length: 1 })
  responsable: string;

  @Column({ name: 'VSO_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'VSO_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'VSO_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'VSO_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'VSO_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'VSO_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'VSO_REG_ACTIVOS', type: 'int', nullable: true })
  regActivos: number;

  @ManyToOne(() => SujetoPasivo, (sujetoPasivo) => sujetoPasivo.vinculos)
  @JoinColumn({ name: 'VSO_SPO_ID' })
  sujetoPasivo: SujetoPasivo;

  @ManyToOne(() => ObjetoValorPredeterminado, (ovp) => ovp.vinculos)
  @JoinColumn({ name: 'VSO_OVP_ID' })
  objetoValorPredeterminado: ObjetoValorPredeterminado;
}
