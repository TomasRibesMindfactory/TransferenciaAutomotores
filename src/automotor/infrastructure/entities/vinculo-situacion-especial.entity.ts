import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SujetoPasivo } from './sujeto-pasivo.entity';

@Entity('VINCULOS_SITUACION_ESPECIAL')
export class VinculoSituacionEspecial {
  @PrimaryGeneratedColumn({ name: 'VSE_ID' })
  id: number;

  @Column({ name: 'VSE_SEL_ID', type: 'int' })
  selId: number;

  @Column({ name: 'VSE_SPO_ID', type: 'bigint', nullable: true })
  spoId: number;

  @Column({ name: 'VSE_TIPO_OBJETO_ID', length: 1, nullable: true })
  tipoObjetoId: string;

  @Column({ name: 'VSE_OBJETO_ID', type: 'int', nullable: true })
  objetoId: number;

  @Column({ name: 'VSE_EXPEDIENTE_ALTA', length: 40, nullable: true })
  expedienteAlta: string;

  @Column({ name: 'VSE_EXPEDIENTE_BAJA', length: 30, nullable: true })
  expedienteBaja: string;

  @Column({ name: 'VSE_FECHA_EXP_ALTA', type: 'date', nullable: true })
  fechaExpAlta: Date;

  @Column({ name: 'VSE_FECHA_EXP_BAJA', type: 'date', nullable: true })
  fechaExpBaja: Date;

  @Column({ name: 'VSE_FECHA_INICIO', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'VSE_FECHA_FIN', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'VSE_FECHA_ALTA', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'VSE_FECHA_ULT_MOD', type: 'date', nullable: true })
  fechaUltMod: Date;

  @Column({ name: 'VSE_FECHA_BAJA', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'VSE_USUARIO_ALTA', length: 10 })
  usuarioAlta: string;

  @Column({ name: 'VSE_USUARIO_ULT_MOD', length: 10, nullable: true })
  usuarioUltMod: string;

  @Column({ name: 'VSE_USUARIO_BAJA', length: 10, nullable: true })
  usuarioBaja: string;

  @Column({ name: 'VSE_VALOR', length: 20, nullable: true })
  valor: string;

  @Column({ name: 'VSE_CONDICION', length: 2, nullable: true })
  condicion: string;

  @Column({ name: 'VSE_DIAS_PRORROGA', type: 'int', nullable: true })
  diasProrroga: number;

  @Column({ name: 'VSE_FECHA_PRORROGA', type: 'date', nullable: true })
  fechaProrroga: Date;

  @Column({
    name: 'VSE_MONTO',
    type: 'decimal',
    precision: 24,
    scale: 3,
    nullable: true,
  })
  monto: number;

  @Column({
    name: 'VSE_MONTO_IMPONIBLE',
    type: 'decimal',
    precision: 24,
    scale: 3,
    nullable: true,
  })
  montoImponible: number;

  @Column({
    name: 'VSE_PORCENTAJE',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  porcentaje: number;

  @Column({ name: 'VSE_TIPO_PERIODO', length: 1, nullable: true })
  tipoPeriodo: string;

  @Column({ name: 'VSE_OS', length: 1 })
  os: string;

  @Column({ name: 'VSE_PCJ_ID', length: 5, nullable: true })
  pcjId: string;

  @Column({ name: 'VSE_PCJ_PTB_ID', length: 5, nullable: true })
  pcjPtbId: string;

  @Column({ name: 'VSE_PERIODO', length: 6, nullable: true })
  periodo: string;

  @Column({ name: 'VSE_FORMAL_MATERIAL', length: 2, nullable: true })
  formalMaterial: string;

  @ManyToOne(() => SujetoPasivo)
  @JoinColumn({ name: 'VSE_SPO_ID' })
  sujetoPasivo: SujetoPasivo;
}
